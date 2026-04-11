import { GraphQLError } from 'graphql';
import { prisma } from '../../prisma.js';
import { requireAuth } from '../auth.js';
import { normalizeNusLocation } from '../../../shared/constants/locations.js';

// Shared select objects (no email exposed)
const publicSellerSelect = { id: true, name: true, image: true };
const categorySelect = { id: true, name: true };
const ALLOWED_LISTING_STATUSES = ['active', 'sold', 'removed'];

const normalizeLocationForStorage = (location) => {
    if (typeof location !== 'string') return location || null;

    const trimmed = location.trim();
    if (!trimmed) return null;

    return normalizeNusLocation(trimmed) || trimmed;
};

const normalizeListingLocation = (listing) => ({
    ...listing,
    location: normalizeLocationForStorage(listing.location),
});

export const listingsResolvers = {
    Query: {
        // Fetch all active listings, optionally filtered by sellerId
        listings: async (_parent, { sellerId }) => {
            const where = { status: 'active' };
            if (sellerId) where.sellerId = sellerId;

            const listings = await prisma.listing.findMany({
                where,
                include: {
                    seller: { select: publicSellerSelect },
                    category: { select: categorySelect },
                },
                orderBy: { createdAt: 'desc' },
            });

            return listings.map(normalizeListingLocation);
        },

        // Fetch a single listing by ID
        listing: async (_parent, { id }) => {
            const listing = await prisma.listing.findUnique({
                where: { id },
                include: {
                    seller: { select: publicSellerSelect },
                    category: { select: categorySelect },
                },
            });

            return listing ? normalizeListingLocation(listing) : null;
        },
    },

    Mutation: {
        // Create a new listing (authenticated, sellerId from session)
        createListing: async (_parent, { input }, context) => {
            const user = requireAuth(context);

            const { title, description, price, condition, category, location, imageUrl } = input;

            if (!title || price == null || !category) {
                throw new GraphQLError('Missing required fields: title, price, category', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            // Upsert category to avoid race conditions
            const categoryRecord = await prisma.category.upsert({
                where: { name: category },
                update: {},
                create: { name: category },
            });

            return prisma.listing.create({
                data: {
                    title,
                    description: description || null,
                    price,
                    condition: condition || null,
                    location: normalizeLocationForStorage(location),
                    imageUrl: imageUrl || null,
                    sellerId: user.id,
                    categoryId: categoryRecord.id,
                },
                include: {
                    seller: { select: publicSellerSelect },
                    category: { select: categorySelect },
                },
            });
        },

        // Update a listing (authenticated + ownership check)
        updateListing: async (_parent, { id, input }, context) => {
            const user = requireAuth(context);

            // Verify ownership
            const existing = await prisma.listing.findUnique({ where: { id } });
            if (!existing) {
                throw new GraphQLError('Listing not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            if (existing.sellerId !== user.id) {
                throw new GraphQLError('You can only edit your own listings.', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }

            const { title, description, price, condition, category, location, imageUrl } = input;
            const updateData = {};

            if (title !== undefined && title !== null) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (price !== undefined && price !== null) updateData.price = price;
            if (condition !== undefined) updateData.condition = condition;
            if (location !== undefined) updateData.location = normalizeLocationForStorage(location);
            if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
            if (input.status !== undefined) {
                if (!ALLOWED_LISTING_STATUSES.includes(input.status)) {
                    throw new GraphQLError('Invalid status value', {
                        extensions: { code: 'BAD_USER_INPUT' },
                    });
                }
                updateData.status = input.status;
            }

            if (category !== undefined && category !== null) {
                const categoryRecord = await prisma.category.upsert({
                    where: { name: category },
                    update: {},
                    create: { name: category },
                });
                updateData.categoryId = categoryRecord.id;
            }

            const listing = await prisma.listing.update({
                where: { id },
                data: updateData,
                include: {
                    seller: { select: publicSellerSelect },
                    category: { select: categorySelect },
                },
            });

            return normalizeListingLocation(listing);
        },

        // Soft-delete a listing (authenticated + ownership check)
        deleteListing: async (_parent, { id }, context) => {
            const user = requireAuth(context);

            const existing = await prisma.listing.findUnique({ where: { id } });
            if (!existing) {
                throw new GraphQLError('Listing not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            if (existing.sellerId !== user.id) {
                throw new GraphQLError('You can only delete your own listings.', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }

            await prisma.listing.update({
                where: { id },
                data: { status: 'removed' },
            });

            return { message: 'Listing removed', id };
        },
    },
};
