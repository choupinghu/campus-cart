import { GraphQLError } from 'graphql';
import { prisma } from '../../prisma.js';
import { requireAuth } from '../auth.js';
import {
    NUS_LOCATION_NAMES,
    normalizeNusLocation,
} from '../../../shared/constants/locations.js';

const publicRequesterSelect = { id: true, name: true, image: true };
const categorySelect = { id: true, name: true };
const ALLOWED_REQUEST_STATUSES = ['active', 'fulfilled', 'removed'];

const normalizeLocationForStorage = (location) => {
    if (typeof location !== 'string') return location || null;

    const trimmed = location.trim();
    if (!trimmed) return null;

    return normalizeNusLocation(trimmed) || trimmed;
};

const normalizeRequestLocation = (request) => ({
    ...request,
    location: normalizeLocationForStorage(request.location),
});

export const requestsResolvers = {
    Query: {
        requests: async (_parent, { userId }) => {
            const where = { status: 'active' };
            if (userId) where.userId = userId;

            const requests = await prisma.request.findMany({
                where,
                include: {
                    user: { select: publicRequesterSelect },
                    category: { select: categorySelect },
                },
                orderBy: { createdAt: 'desc' },
            });

            return requests.map(normalizeRequestLocation);
        },

        request: async (_parent, { id }) => {
            const request = await prisma.request.findUnique({
                where: { id },
                include: {
                    user: { select: publicRequesterSelect },
                    category: { select: categorySelect },
                },
            });

            return request ? normalizeRequestLocation(request) : null;
        },
        requestLocationCounts: async () => {
            const counts = await prisma.request.groupBy({
                by: ['location'],
                where: {
                    status: 'active',
                    location: { not: null },
                },
                _count: { id: true },
            });

            const countMap = counts.reduce((map, count) => {
                const normalizedLocation = normalizeNusLocation(count.location);
                if (!normalizedLocation) return map;

                map[normalizedLocation] = (map[normalizedLocation] || 0) + count._count.id;
                return map;
            }, {});

            return NUS_LOCATION_NAMES.map((loc) => ({
                location: loc,
                requestCount: countMap[loc] || 0,
            }));
        },
    },

    Mutation: {
        createRequest: async (_parent, { input }, context) => {
            const user = requireAuth(context);

            const { title, description, budget, condition, category, location } = input;

            if (!title || budget == null || !category) {
                throw new GraphQLError('Missing required fields: title, budget, category', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            const categoryRecord = await prisma.category.upsert({
                where: { name: category },
                update: {},
                create: { name: category },
            });

            return prisma.request.create({
                data: {
                    title,
                    description: description || null,
                    budget,
                    condition: condition || null,
                    location: normalizeLocationForStorage(location),
                    userId: user.id,
                    categoryId: categoryRecord.id,
                },
                include: {
                    user: { select: publicRequesterSelect },
                    category: { select: categorySelect },
                },
            });
        },

        updateRequest: async (_parent, { id, input }, context) => {
            const user = requireAuth(context);

            const existing = await prisma.request.findUnique({ where: { id } });
            if (!existing) {
                throw new GraphQLError('Request not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            if (existing.userId !== user.id) {
                throw new GraphQLError('You can only edit your own requests.', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }

            const { title, description, budget, condition, category, location, status } = input;
            const updateData = {};

            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (budget !== undefined) updateData.budget = budget;
            if (condition !== undefined) updateData.condition = condition;
            if (location !== undefined) updateData.location = normalizeLocationForStorage(location);
            if (status !== undefined) {
                if (!ALLOWED_REQUEST_STATUSES.includes(status)) {
                    throw new GraphQLError('Invalid status value', {
                        extensions: { code: 'BAD_USER_INPUT' },
                    });
                }
                updateData.status = status;
            }

            if (category !== undefined && category !== null) {
                const categoryRecord = await prisma.category.upsert({
                    where: { name: category },
                    update: {},
                    create: { name: category },
                });
                updateData.categoryId = categoryRecord.id;
            }

            const request = await prisma.request.update({
                where: { id },
                data: updateData,
                include: {
                    user: { select: publicRequesterSelect },
                    category: { select: categorySelect },
                },
            });

            return normalizeRequestLocation(request);
        },

        deleteRequest: async (_parent, { id }, context) => {
            const user = requireAuth(context);

            const existing = await prisma.request.findUnique({ where: { id } });
            if (!existing) {
                throw new GraphQLError('Request not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            if (existing.userId !== user.id) {
                throw new GraphQLError('You can only delete your own requests.', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }

            await prisma.request.update({
                where: { id },
                data: { status: 'removed' },
            });

            return { message: 'Request removed', id };
        },
    },
};
