import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import 'dotenv/config';
import uploadRoutes from './routes/upload.js';
import listingsRoutes from './routes/listings.js';

const app = express();
const port = process.env.PORT || 8000;

// Update trusted origins
const corsOptions = {
  origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

process.env.BETTER_AUTH_URL = process.env.VITE_API_URL || 'http://localhost:8000';

// Mount better-auth routes (express v5 routing)
app.all("/api/auth/*route", toNodeHandler(auth));
app.use("/api/auth", toNodeHandler(auth));

app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes);
app.use('/api/listings', listingsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${port}`);
});
