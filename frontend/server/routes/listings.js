import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/listings - Fetch all active listings (optionally filter by sellerId)
router.get('/', async (req, res) => {
    try {
        const where = { status: 'active' };

        if (req.query.sellerId) {
            where.sellerId = req.query.sellerId;
        }

        const listings = await prisma.listing.findMany({
            where,
            include: {
                seller: {
                    select: { id: true, name: true, email: true }
                },
                category: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// GET /api/listings/:id - Fetch a single listing by ID
router.get('/:id', async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id: req.params.id },
            include: {
                seller: { select: { id: true, name: true, email: true } },
                category: { select: { id: true, name: true } },
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

// POST /api/listings - Create a new listing
router.post('/', async (req, res) => {
    const { title, description, price, condition, category, location, imageUrl, sellerId } = req.body;

    if (!title || price == null || !category || !sellerId) {
        return res.status(400).json({ error: 'Missing required fields: title, price, category, sellerId' });
    }

    try {
        let categoryRecord = await prisma.category.findUnique({
            where: { name: category }
        });

        if (!categoryRecord) {
            categoryRecord = await prisma.category.create({
                data: { name: category }
            });
        }

        const listing = await prisma.listing.create({
            data: {
                title,
                description: description || null,
                price: parseFloat(price),
                condition: condition || null,
                location: location || null,
                imageUrl: imageUrl || null,
                sellerId,
                categoryId: categoryRecord.id,
            },
            include: {
                seller: { select: { id: true, name: true, email: true } },
                category: { select: { id: true, name: true } },
            }
        });

        res.status(201).json(listing);
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

// PUT /api/listings/:id - Update a listing
router.put('/:id', async (req, res) => {
    const { title, description, price, condition, category, location, imageUrl } = req.body;

    try {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (condition !== undefined) updateData.condition = condition;
        if (location !== undefined) updateData.location = location;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        if (category !== undefined) {
            let categoryRecord = await prisma.category.findUnique({
                where: { name: category }
            });
            if (!categoryRecord) {
                categoryRecord = await prisma.category.create({
                    data: { name: category }
                });
            }
            updateData.categoryId = categoryRecord.id;
        }

        const listing = await prisma.listing.update({
            where: { id: req.params.id },
            data: updateData,
            include: {
                seller: { select: { id: true, name: true, email: true } },
                category: { select: { id: true, name: true } },
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

// DELETE /api/listings/:id - Soft-delete a listing (set status to "removed")
router.delete('/:id', async (req, res) => {
    try {
        const listing = await prisma.listing.update({
            where: { id: req.params.id },
            data: { status: 'removed' },
        });

        res.json({ message: 'Listing removed', id: listing.id });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Listing not found' });
        }
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
});

export default router;
