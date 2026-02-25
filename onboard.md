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
   cp .env.example frontend/.env
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
2. Setup and run the frontend:
   ```bash
   # First, install root dependencies to enable Git hooks (branch protection)
   pnpm install
   
   # Then setup the frontend
   cd frontend
   pnpm install
   pnpm dev
   ```

## 3. Database & Prisma Workflow
We use Prisma (v6) for our ORM. The schema is located at `frontend/prisma/schema.prisma`.
- Whenever you pull code with new database schema changes, apply them to your local database:
  ```bash
  cd frontend
  pnpm prisma db push
  ```
- *Note:* Running `pnpm dev` or `pnpm build` automatically triggers `prisma generate` to keep your local client typed correctly!

## 4. Code Quality
We enforce ESLint and Prettier to keep our code clean. Our CI pipeline checks this automatically on Pull Requests.
To check your code before pushing:
```bash
cd frontend
pnpm lint        # Highlights code issues
pnpm format      # Auto-formats all your code
```

## 5. Branching & PR Workflow
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
