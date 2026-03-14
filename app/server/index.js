import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import 'dotenv/config';

// Lightweight GraphQL imports (no Apollo)
import { graphql } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs, resolvers } from './graphql/index.js';
import { fromNodeHeaders } from 'better-auth/node';

import uploadRoutes from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

const app = express();
const port = process.env.PORT || 8000;

// CORS config
const corsOptions = {
  origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

process.env.BETTER_AUTH_URL = process.env.VITE_API_URL || 'http://localhost:8000';

// Build executable GraphQL schema from typeDefs + resolvers
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Mount better-auth routes (express v5 routing)
app.all("/api/auth/*route", toNodeHandler(auth));
app.use("/api/auth", toNodeHandler(auth));

// Static files & REST upload route
app.use('/uploads', express.static(uploadsDir));
app.use('/api/upload', uploadRoutes);

// GraphQL endpoint (lightweight — no Apollo overhead)
app.post('/graphql', async (req, res) => {
  const { query, variables } = req.body;

  // Read session from cookies for auth context
  let user = null;
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    user = session?.user || null;
  } catch {
    // Not authenticated — that's fine for public queries
  }

  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: { user },
  });

  res.json(result);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${port}`);
  console.log(`GraphQL endpoint: http://0.0.0.0:${port}/graphql`);
});
