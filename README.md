# CampusCart — Open Source Campus Marketplace

> A modern, AI-powered web app for students to buy and sell items securely on campus. This project is designed for any university or campus environment, with NUS as the pioneer example. See the technical report for all features and implementation details.

---

# 📄 Documentation & Technical Report

**All technical details, features, and rationale are documented here:**

➡️ **[Campus_Cart.md](./report/campus_cart.md)**

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
| Auth            | Better Auth (university email enforcement)     |
| ORM             | Prisma v6                                     |
| Database        | PostgreSQL 16 (Docker)                        |
| AI              | Ollama (`llava:7b`, runs locally)             |
| Infrastructure  | Docker Compose                                |
| Package Manager | pnpm                                          |

---

## 🚀 Getting Started (Run Locally with Docker)

Anyone can run CampusCart locally—no NUS or university account or special setup required. Just follow the steps below to launch the app using Docker.

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

| Name         | Email                 |
| ------------ | --------------------- |
| Alice Tan    | alice@u.nus.edu       |
| Bob Lim      | bob@u.nus.edu         |
| Charlie Wong | charlie@u.nus.edu     |
| Diana Chen   | diana@u.nus.edu       |

> **Note:** The above demo users use NUS emails as an example. You can adapt the authentication logic for any campus or organization domain.

> **First run:** Takes 3–8 minutes (AI model download). Subsequent starts take ~20 seconds.

→ Full evaluator guide with troubleshooting: [resources/DEMO.md](resources/DEMO.md)

---

_Developed by_
_Ang Lee Chuan · Chou Han Xian Aaron · Liaw Jian Wei_
