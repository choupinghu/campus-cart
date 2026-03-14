import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/requireAuth.js';

// Use absolute path for uploads directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
fs.mkdirSync(uploadsDir, { recursive: true });

const router = express.Router();

// Define exactly 5MB limit
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate a secure, unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Create the multer instance with size limit and file type filtering
const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
        // Only accept image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

// POST /api/upload (authenticated - only signed-in users can upload)
router.post('/', requireAuth, (req, res) => {
    upload.single('image')(req, res, (err) => {
        // Handle specific Multer errors (like size limit exceeded)
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ error: 'File size exceeds the 5MB limit.' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // Handle generic errors (like our custom file type error)
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Success - Construct and return the URL
        const baseUrl = process.env.VITE_API_URL || 'http://localhost:8000';
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        res.json({ url: imageUrl });
    });
});

export default router;
