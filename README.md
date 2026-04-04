# CampusCart — NUS Campus Marketplace

A centralized, student-exclusive web application for NUS students to buy and sell textbooks, electronics, hall furniture, and more — with AI-powered listing creation.

**IT5007 Finals · Group 14**

---

## The Problem

Students currently rely on unstructured Telegram groups and generic platforms like Carousell to buy and sell items on campus. This leads to:
- **Lack of Trust** — No way to verify if a buyer or seller is a genuine NUS student
- **Poor Discovery** — Listings get buried in linear chat streams with no search or filtering
- **Inefficient Coordination** — Repetitive "PM me" negotiations waste time

## The Solution

CampusCart provides verified, structured, and efficient peer-to-peer commerce for the NUS community:
- **Verified Access** — Authentication restricted to `@u.nus.edu` email addresses
- **AI Auto-Fill** — Upload a photo and let the local LLM (`llava:7b`) populate title, description, and price
- **Structured Listings** — Categorized items with condition tags, pricing, and campus location
- **Want-to-Buy Requests** — Post items you're looking for, not just items you're selling
- **Smart Search** — Real-time search with AI-powered recommendations when no results are found

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS v4 |
| API | GraphQL (`graphql` + `@graphql-tools/schema`) |
| Backend | Node.js + Express |
| Auth | Better Auth (NUS email enforcement) |
| ORM | Prisma v6 |
| Database | PostgreSQL 16 (Docker) |
| AI | Ollama (`llava:7b`, runs locally) |
| Infrastructure | Docker Compose |
| Package Manager | pnpm |

---

## 🎓 For Evaluators / Professors / TAs

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running. Nothing else needed.

```bash
# 1. Copy environment file
cp .env.example app/.env

# 2. Start everything
docker compose up --build
```

This single command builds the app, starts the database, pulls the AI model (~4.7 GB, first run only), seeds 20 demo users and 46 listings, and starts the application.

**Open:** http://localhost:5173

**Login with any demo account** (password: `Password123`):

| Name | Email |
|---|---|
| Alice Tan | alice@u.nus.edu |
| Bob Lim | bob@u.nus.edu |
| Charlie Wong | charlie@u.nus.edu |
| Diana Chen | diana@u.nus.edu |

> First run takes 3–8 minutes (AI model download). Subsequent starts take ~20 seconds.

→ Full evaluator guide with troubleshooting: **[resources/DEMO.md](resources/DEMO.md)**

---

## 🛠 For Developers

Two separate concerns — infrastructure and application — run independently for maximum dev speed.

### Step 1 — Start infrastructure (DB + AI)
```bash
cp .env.example app/.env
docker compose -f docker-compose.dev.yml up -d
```

### Step 2 — Install and run the app (hot-reload)
```bash
cd app
pnpm install        # installs deps, generates Prisma client, wires Git hooks
pnpm dev            # Vite (port 5173) + Express/nodemon (port 8000)
```

### Step 3 — Set up the database (first time only)
```bash
# Still inside app/
pnpm db:setup       # pushes schema + seeds demo data
```

**Database commands:**
| Command | What it does |
|---|---|
| `pnpm db:setup` | Push schema + seed — run once on first setup |
| `pnpm db:push` | Sync schema after a teammate changes `schema.prisma` |
| `pnpm db:seed` | Wipe all data and reload fresh demo data |
| `npx prisma studio` | Open a visual DB browser at http://localhost:5555 |

---

## Git Workflow

`main` is protected — all changes go through PRs.

```bash
git checkout main && git pull origin main
git checkout -b feat/your-feature-name
# ... make changes ...
git push -u origin feat/your-feature-name
# open a PR on GitHub
```

**Branch prefixes:** `feat/` `fix/` `chore/` `docs/`
**Commit prefixes:** `feat:` `fix:` `chore:` `docs:` `best practice:`

**PR rules:** One thing per PR. Under 15 files / 500 LOC. Wait for CI ✅ before merging. Get one teammate approval.

> **GitHub Classroom note:** Branch protection settings are unavailable in Classroom repos — we operate on a social contract. Never push directly to `main`. Never merge a red CI.

---

## Frontend Features

- React Router with dynamic routes (`/listings/:id`, `/profile`, `/requests`)
- Protected routes — unauthenticated users redirected to login
- Real-time search with debouncing and AI-powered fallback recommendations
- AI auto-fill on listing and request creation (image → title, description, price, condition)
- Image upload with server-side storage and static serving
- Skeleton loading states for all async views
- Toast notifications for user actions
- Responsive layout (mobile and desktop)
- Consistent NUS design system (blue `#003d7c`, orange `#ef7c00`, shared component classes)

## Backend Features

- GraphQL API — domain-driven modular schema (`listings/`, `requests/`, `profile/`)
- Better Auth — email/password with `@u.nus.edu` domain enforcement, session-based auth
- Session cookies verified on every GraphQL request via auth context injection
- `requireAuth` centralized helper across all mutations
- Multer image upload via dedicated REST endpoint (decoupled from GraphQL)
- Ollama integration for vision-based AI features (`llava:7b`)
- External Shopify storefront integration (IUIGA, Bookshop.sg, NUS Press) for augmented listings
- Client-side `sessionStorage` caching for external product data (5-minute TTL)
- PostgreSQL 16 via Prisma v6 ORM with shared singleton client
- Docker Compose one-command setup for evaluators; split infra compose for developers

---

## AI Usage Disclosure

Parts of this project were developed with assistance from AI tools (Claude).

Specific areas where AI was used:
- Component scaffolding and boilerplate
- Auth library integration (Better Auth + Express)
- Dockerfile and Docker Compose configuration
- Ollama AI service integration and prompt engineering
- Debugging and code review

All AI-generated suggestions were reviewed, understood, and modified to fit the project requirements.

---

*Developed by IT5007 Finals — Group 14*
*Ang Lee Chuan · Chou Han Xian Aaron · Liaw Jian Wei*
