import { PrismaClient } from '@prisma/client';

// Shared Prisma singleton.
// Import this instance in all server modules instead of creating new PrismaClient() per file.

export const prisma = new PrismaClient();
