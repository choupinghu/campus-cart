# IT5007 Final Project Report

**Course:** IT5007 Software Engineering on Application Architecture  
**Project:** CampusCart (NUS Campus Marketplace)  
**Group:** 14  

Group number on Canvas: 14

Student ID (AxxxxxxxZ) | NUSNet ID (exxxxxxx) | Name (as it appears on Canvas)
-----------------------|----------------------|-------------------------------
A0183438X | e0310233 | Ang Lee Chuan
A0183378R | e0310173 | Chou Han Xian, Aaron
A0329448R | e1553775 | Liaw Jian Wei

---

## 1. Problem Statement & Project Overview
Currently, students buy and sell items such as textbooks, electronics, and hall furniture via unorganized Telegram groups or generic Carousell listings. This leads to significant pain points:
- **Lack of Trust:** It is difficult to verify if a buyer or seller is actually an NUS student, leading to safety and reliability concerns.
- **Poor Discovery:** Telegram chats are linear and unsearchable, causing listings to get buried quickly.
- **Inefficient Coordination:** The common "PM me" culture results in wasted time negotiating availability, pricing, and meetup locations.

**CampusCart** aims to resolve these issues by acting as a centralized, student-exclusive marketplace web application designed specifically for the NUS community.

---

## 2. Core Features & Capabilities

### 2.1 Verified Authentication (Implemented)
To ensure trust and exclusivity, the platform utilizes a secure authentication system.
- **NUS Email Exclusivity:** Registration is strictly restricted to `@u.nus.edu` email domains.
- **Robust Security:** Powered by an Express.js backend and a Better Auth integration. Passwords enforce strict security policies (minimum 8 characters, capital letters, numbers, and special characters) with real-time feedback UI during onboarding.
- **Protected Routing:** React router wrappers enforce session checks, preventing unauthenticated users from accessing core marketplace capabilities.

### 2.2 Marketplace Architecture (In Progress)
- **Structured Listings:** Sellers can categorize items with specific condition tags and clear pricing.
- **Smart Search:** Buyers can quickly filter items by category, price range, and location.
- **Direct Offers:** A simplified "Make Offer" workflow to standardize and accelerate negotiations.

---

## 3. Developer Experience & Collaboration Workflows
As a team of 3 developers, maintaining high code quality and continuous synchronization across different local environments is critical to the project's success.

### 3.1 Code Quality Assurance
- **Husky Git Hooks:** Client-side git hooks are enforced using Husky. Pre-commit hooks automatically check for staging errors, while branch protection rules prevent direct pushes to the main branch.
- **Linting and Formatting:** ESLint (flat config) and Prettier catch syntactic errors early and enforce a uniform, readable code style across all components.
- **CI/CD Pipeline:** GitHub Actions automatically run linting and formatting pipelines on every Pull Request.

### 3.2 Developer Synchronization & Repository Organization
- **Containerized Infrastructure:** The entire application stack (Frontend, API, and PostgreSQL database) is orchestrated using Docker Compose. This provides a completely device-agnostic development environment.
- **Automated Database Synchronization:** Using Prisma as our ORM, schema generation is automated via package manager postinstall scripts. DB states are synced seamlessly via `pnpm prisma db push`.
- **Structured Context Documentation:** To ensure developers remain synchronized on architectural requirements and project states, a comprehensive set of markdown documentation resides in the `resources/` directory. This includes detailed developer onboarding instructions and established Git collaboration protocols, serving as a strict "single source of truth" to minimize communication friction.

---

## 4. Technical Architecture

### 4.1 Frontend Layer
- **Framework:** React powered by Vite for rapid compilation and Hot Module Replacement.
- **Styling:** Tailwind CSS v4, utilizing the modern `@theme` directive for zero-configuration, robust modular styling.

### 4.2 Backend Layer
- **API Server:** Node.js Express providing the authentication layer, engineered to scale and serve our upcoming GraphQL endpoints (shifting away from the initially proposed Python FastAPI for stronger full-stack JavaScript integration).
- **Database:** PostgreSQL 16 provisioned seamlessly via Docker, with pgvector planned for advanced search capabilities.
- **ORM:** Prisma v6 providing highly type-safe database queries natively linked to the application layer.

---

## 5. Future Implementation Roadmap
As the marketplace scales, we are planning the following architectural and functional expansions to enhance user discovery and platform utility:

- **GraphQL API Integration:** Transitioning to a strict GraphQL API layer backed by Prisma to optimize complex, relational market queries.
- **AI-Powered Item Auto-Fill:** Implementing an external Vision API to identify and auto-categorize item listings based solely on user photo uploads, drastically reducing friction during the listing process.
- **Database Seeding and Mock Data:** Fetching products from external free APIs (e.g., mock Shopify data) to automatically seed the database and simulate an active marketplace ecosystem.
- **Omni-Channel & Mobile Integration:** Enhancing the frontend as a mobile-first experience to leverage native device mechanisms, such as immediate camera access for photo uploads.
- **Authentication Expansions:** Supplementing our current email validation framework with scalable OAuth 2.0 pipelines (e.g. Sign in with Google / GitHub).
