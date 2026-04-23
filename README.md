# CampusCart — NUS Campus Marketplace

> A modern, AI-powered web app for NUS students to buy and sell items securely on campus. See the PDF report for all technical and feature details.

**IT5007 Finals · Group 14**

---

# 📄 Final Project Report (PDF)

**All technical details, features, and rationale are documented in our formal report:**

➡️ **[IT5007_Grp8_Report.pdf](./grp8-report/IT5007_Grp8_Report.pdf)**

---

## 🎥 Demo Video

Watch our application in action:  
➡️ **[CampusCart Demo Video](https://youtu.be/1jPtYttyQcQ)**

---

## Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Frontend        | React (Vite) + Tailwind CSS v4                |
| API             | GraphQL (`graphql` + `@graphql-tools/schema`) |
| Backend         | Node.js + Express                             |
| Auth            | Better Auth (NUS email enforcement)           |
| ORM             | Prisma v6                                     |
| Database        | PostgreSQL 16 (Docker)                        |
| AI              | Ollama (`llava:7b`, runs locally)             |
| Infrastructure  | Docker Compose                                |
| Package Manager | pnpm                                          |

---

## 🎓 For Evaluators / Professors / TAs

**Prerequisite:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running. No other setup required.

```bash
# 1. Copy environment file
cp .env.example app/.env

# 2. Start everything
docker compose up --build
```

This single command builds the app, starts the database, pulls the AI model (~4.7 GB, first run only), seeds 20 demo users and 46 listings, and starts the application.

- **Open:** http://localhost:5173
- **Demo login:** Use any account below (password: `Password123`)

| Name         | Email             |
| ------------ | ----------------- |
| Alice Tan    | alice@u.nus.edu   |
| Bob Lim      | bob@u.nus.edu     |
| Charlie Wong | charlie@u.nus.edu |
| Diana Chen   | diana@u.nus.edu   |

> **First run:** Takes 3–8 minutes (AI model download). Subsequent starts take ~20 seconds.

→ Full evaluator guide with troubleshooting: [resources/DEMO.md](resources/DEMO.md)

---

## 🛠 For Developers

Infrastructure and application run independently for fast development.

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

_Developed by IT5007 Finals — Group 14_
_Ang Lee Chuan · Chou Han Xian Aaron · Liaw Jian Wei_
