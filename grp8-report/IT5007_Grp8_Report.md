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

### 2.2 Marketplace Architecture (Items for Sale)
- **Core Listing Lifecycle:** Sellers can create, view, edit, and delete listings. Each listing includes a title, description, price, condition, category, and location.
- **Image Management:** Listings support photo uploads (5MB limit), which are persisted on the server filesystem and served via Express static middleware.
- **Smart Filtering:** Users can browse active listings and filter them by category and seller.

### 2.3 Requests Feature (Want to Buy)
In addition to selling items, the platform now supports a buyer-driven workflow where students can post items they are looking to purchase.
- **Request Lifecycle:** Students can post buying requests with a title, description, budget, and desired condition.
- **Categorization & Location:** Requests are linked to the same category and location systems as listings, ensuring a unified search experience.
- **Unified Navigation:** Buying requests are easily accessible via the "+" quick-action menu and the "Want to Buy" dashboard.

### 2.4 User Profile Enhancements
To build a more personalized and trustworthy community, user profiles have been significantly expanded.
- **Extended Profile Data:** Users can now manage their bio, contact phone number, and preferred campus location.
- **Profile Customization:** Support for profile picture uploads allows users to personalize their presence on the platform.
- **Activity Tracking:** Profiles show a summary of the user's activity, including the number of active listings and requests.

### 2.5 API Security and Authorisation
Mutating API Endpoints enforce server-side authentication and ownership verification.
- **Centralized Auth Helper:** A shared `requireAuth` utility is used across all GraphQL resolvers to ensure consistent session verification and error handling.
- **GraphQL Auth Context:** Session cookies are verified on every GraphQL request via `auth.api.getSession()`, injecting the authenticated user into the resolver context.
- **Status Validation:** Both listings and requests implement strict status enums (`active`, `sold`, `fulfilled`, `removed`) to prevent invalid data transitions.
- **Cookie Support:** All frontend fetch calls use `credentials: 'include'` to transmit session cookies securely.

### 2.6 Data Seeding & External Product Integration
To simulate an active marketplace ecosystem and streamline developer onboarding, the platform features two complementary data-population strategies.
- **Prisma Seed Script:** A comprehensive seed script (`prisma/seed.js`) populates the database with demo users, categories, listings, and buying requests. Users are created through the Better Auth `signUpEmail` API, ensuring passwords are properly hashed and linked `Account` records are generated — allowing seeded users to log in immediately. The script is fully idempotent and can be re-run safely via `pnpm run db:seed`.
- **External Shopify Store Integration:** The marketplace augments its internal listings with real product data fetched from external Shopify storefronts (IUIGA, Bookshop.sg, NUS Press) via their public `/products.json` endpoints. Products are normalized into the platform's listing format with mock attributes (condition, location, verification status) assigned at runtime.

### 2.7 Client-Side Performance Caching
To avoid redundant network calls and improve page-load performance, fetched Shopify products are cached in `sessionStorage` with a 5-minute TTL. Subsequent page visits within the cache window are served instantly from the local cache, eliminating unnecessary API calls to external storefronts.

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
- **API Server:** Node.js Express serving a GraphQL API using a lightweight setup (`graphql` + `@graphql-tools/schema`).
- **Modular GraphQL Architecture:** The backend follows a domain-driven structure. Each domain (`listings`, `requests`, `profile`) contains co-located schema definitions and resolvers, aggregated by a central merge layer.
- **Schema & Input Validation:** Inputs are strictly validated (e.g., phone number formatting, budget scales, and status enums) to maintain data integrity.
- **Shared Authentication Utility:** A centralized `requireAuth` helper provides a single point of entry for security checks across all mutations.
- **Shared Prisma Singleton:** All resolver modules share a single `PrismaClient` instance, ensuring high-performance database access and preventing connection pool exhaustion.
- **Shared Constants:** Categories and campus locations are centralized into shared constants, ensuring total synchronization between the frontend and backend.
- **Database:** PostgreSQL 16 provisioned via Docker, with pgvector support for future expansions.
- **ORM:** Prisma v6 providing highly type-safe database queries natively linked to the application layer.
- **File Upload Pipeline:** Multer handles multi-part form data for image uploads via dedicated REST endpoints, decoupling binary storage from the GraphQL layer.

---

## 5. Future Implementation Roadmap
As the marketplace scales, we are planning the following architectural and functional expansions to enhance user discovery and platform utility:

- **AI-Powered Item Auto-Fill:** Implementing an external Vision API to identify and auto-categorize item listings based solely on user photo uploads. The image upload infrastructure and listing API are already in place to support this workflow.
- **Omni-Channel & Mobile Integration:** Enhancing the frontend as a mobile-first experience to leverage native device mechanisms, such as immediate camera access for photo uploads.
- **Authentication Expansions:** Supplementing our current email validation framework with scalable OAuth 2.0 pipelines (e.g. Sign in with Google / GitHub).