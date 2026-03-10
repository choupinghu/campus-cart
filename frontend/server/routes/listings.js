import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Public seller fields (no email)
const publicSellerSelect = { id: true, name: true };
const categorySelect = { id: true, name: true };

// GET /api/listings - Fetch all active listings (public, optionally filter by sellerId)
router.get('/', async (req, res) => {
    try {
        const where = { status: 'active' };

        if (req.query.sellerId) {
            where.sellerId = req.query.sellerId;
        }

        const listings = await prisma.listing.findMany({
            where,
            include: {
                seller: { select: publicSellerSelect },
                category: { select: categorySelect },
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// GET /api/listings/:id - Fetch a single listing by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id: req.params.id },
            include: {
                seller: { select: publicSellerSelect },
                category: { select: categorySelect },
            }
        });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        res.json(listing);
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});

// POST /api/listings - Create a new listing (authenticated, sellerId derived from session)
router.post('/', requireAuth, async (req, res) => {
    const { title, description, price, condition, category, location, imageUrl } = req.body;

    if (!title || price == null || !category) {
        return res.status(400).json({ error: 'Missing required fields: title, price, category' });
    }

    try {
        // Use upsert to avoid race conditions on category creation
        const categoryRecord = await prisma.category.upsert({
            where: { name: category },
            update: {},
            create: { name: category },
        });

        const listing = await prisma.listing.create({
            data: {
                title,
                description: description || null,
                price: parseFloat(price),
                condition: condition || null,
                location: location || null,
                imageUrl: imageUrl || null,
                sellerId: req.user.id, // Derived from session, not client
                categoryId: categoryRecord.id,
            },
            include: {
                seller: { select: publicSellerSelect },
                category: { select: categorySelect },
            }
        });

        res.status(201).json(listing);
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

// PUT /api/listings/:id - Update a listing (authenticated + ownership check)
router.put('/:id', requireAuth, async (req, res) => {
    const { title, description, price, condition, category, location, imageUrl } = req.body;

    try {
        // Verify ownership
        const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        if (existing.sellerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only edit your own listings.' });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (condition !== undefined) updateData.condition = condition;
        if (location !== undefined) updateData.location = location;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        if (category !== undefined) {
            const categoryRecord = await prisma.category.upsert({
                where: { name: category },
                update: {},
                create: { name: category },
            });
            updateData.categoryId = categoryRecord.id;
        }

        const listing = await prisma.listing.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                seller: { select: publicSellerSelect },
                category: { select: categorySelect },
            }
        });

        res.json(listing);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Listing not found' });
        }
        console.error('Error updating listing:', error);
        res.status(500).json({ error: 'Failed to update listing' });
    }
});

// DELETE /api/listings/:id - Soft-delete a listing (authenticated + ownership check)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        // Verify ownership
        const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        if (existing.sellerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own listings.' });
        }

        await prisma.listing.update({
            where: { id: req.params.id },
            data: { status: 'removed' },
        });

        res.json({ message: 'Listing removed', id: existing.id });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Listing not found' });
        }
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
});

export default router;
