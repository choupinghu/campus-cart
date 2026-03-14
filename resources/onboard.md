# Developer Onboarding Guide

Welcome to the team! This document contains all the detailed steps you need to get your local development environment running, understand our project structure, and follow our team workflow.

## 1. Prerequisites
Before you start, ensure you have the following installed on your machine:
- **Node.js**: v22 or higher
- **pnpm**: We use `pnpm` instead of `npm` or `yarn`. Install it via Corepack:
  ```bash
  corepack enable && corepack prepare pnpm@latest --activate
  ```
- **Docker & Docker Compose**: Used to run our PostgreSQL database locally.
- **Git**: For version control.

## 2. Local Setup Instructions

### Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   cp .env.example app/.env
   ```

### Option A: Full Docker Setup (Recommended)
This spins up both the Database and the Frontend via Docker Compose.
```bash
docker compose up --build
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Database:** `localhost:5432`

### Option B: Local Frontend + Docker Database
If you prefer running Vite natively for faster local feedback:
1. Start just the database:
   ```bash
   docker compose up db -d
   ```
2. Setup and run the app:
   ```bash
   # First, install root dependencies to enable Git hooks (branch protection)
   pnpm install
   
   # Then setup the app
   cd app
   pnpm install
   pnpm dev
   ```

## 3. Database & Prisma Workflow
We use Prisma (v6) for our ORM. The schema is located at `app/prisma/schema.prisma`.

### Automatic Generation
We have configured `prisma generate` as a `postinstall` script in the `app` directory. 
Whenever you pull new code and run `pnpm install`, your local Prisma client will *automatically* regenerate to match any new schema changes. You never have to worry about out-of-sync types!

### Applying Schema Changes
If a teammate adds a new table/column to the schema, apply those changes to your local database by running:
```bash
cd app
pnpm db:push
```
*Note: This is a shorthand for `pnpm prisma db push`. It strictly alters your local Docker PostgreSQL container and will not create global migration files.*

## 4. GraphQL API Architecture
The backend uses a **modular, domain-driven** GraphQL structure. Each feature domain has its own schema and resolvers:

```
app/server/graphql/
├── index.js                          # Merges all domain modules
└── listings/
    ├── listings.schema.js            # Type definitions
    └── listings.resolvers.js         # Query & Mutation resolvers
```

**To add a new domain** (e.g. `offers/`):
1. Create `offers/offers.schema.js` with your type definitions
2. Create `offers/offers.resolvers.js` with your resolvers
3. Import and register both in `graphql/index.js`

All resolvers share a single Prisma client instance from `server/prisma.js`.

## 5. Code Quality
We enforce ESLint and Prettier to keep our code clean. Our CI pipeline checks this automatically on Pull Requests.
To check your code before pushing:
```bash
cd app
pnpm lint        # Highlights code issues
pnpm format      # Auto-formats all your code
```

## 6. Branching & PR Workflow
**Main is protected!** You cannot push directly to `main`. 

1. **Pull the latest code:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a branch:**
   Use our required prefixes (`feat/`, `fix/`, `chore/`, `docs/`).
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Commit your work:**
   Commit messages must follow the standard (`feat:`, `fix:`, `chore:`).
   ```bash
   git commit -m "feat: added new UI component"
   ```
4. **Push and create a PR:**
   ```bash
   git push -u origin feat/your-feature-name
   ```
   Open a PR on GitHub. The PR template will guide you to answer "What changed?" and "Why?". 
   
*For complete git rules, always refer to [git-rules.md](./git-rules.md).*
