# CampusCart — Evaluator Quick Start

**IT5007 Finals · Group 14 · NUS Campus Marketplace**

> For full technical details and feature explanations, see the formal report: [grp8-report/IT5007_Grp8_Report.pdf](../grp8-report/IT5007_Grp8_Report.pdf)

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running (keep it open during the demo)
- That's it. No other dependencies required.

---

## Step 1 — Copy environment file

```bash
cp .env.example app/.env
```

---

## Step 2 — Start everything

```bash
docker compose up --build
```

This single command:
- Builds the application
- Starts the PostgreSQL database
- Starts the Ollama AI service and automatically pulls the `llava:7b` vision model (~4.7 GB, first run only)
- Pushes the database schema
- Seeds 20 demo users, 46 listings, and 20 want-to-buy requests
- Starts the frontend and backend with hot-reload

**First run takes 3–8 minutes** (model download is automatic). Subsequent runs start in ~20 seconds.

---

## Step 3 — Open the app

| Service | URL |
|---|---|
| **App** | http://localhost:5173 |
| **Backend health** | http://localhost:8000/health |
| **AI health** | http://localhost:8000/api/ai/health |

---

## Demo Credentials

All accounts use password: **`Password123`**

| Name | Email |
|---|---|
| Alice Tan | alice@u.nus.edu |
| Bob Lim | bob@u.nus.edu |
| Charlie Wong | charlie@u.nus.edu |
| Diana Chen | diana@u.nus.edu |
| Ethan Ng | ethan@u.nus.edu |

> Any `firstname@u.nus.edu` works — 20 accounts total, all seeded.

---

## Key Features to Evaluate

1. **Verified login** — NUS email (`@u.nus.edu`) enforced on signup
2. **Listings** — Browse, filter by category/price/location, view detail
3. **AI auto-fill** — Create a listing, upload a photo → AI populates title, description, price
4. **Want-to-Buy** — Browse student requests alongside listings
5. **Make Offer** — Offer workflow on any active listing
6. **Search** — Real-time search with debouncing across listings

---

## Stopping & Resetting

```bash
docker compose down          # stop containers (data preserved)
docker compose down -v       # stop and wipe all data (clean slate)
```

> Tip: Use `docker compose down -v` if you want to reset all demo data and start fresh.

---

## Troubleshooting

**App won't start / DB connection error**
- Wait ~30 seconds after `docker compose up` — the DB needs a moment on first boot.

**AI features not working**
- Check `http://localhost:8000/api/ai/health`. If the model is still downloading, wait and refresh.

**Port conflict**
- Ensure ports `5173`, `8000`, `5432`, `11434` are free before running.
