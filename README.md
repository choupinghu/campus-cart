# NUS Campus Marketplace

Welcome to the NUS Campus Marketplace! This project aims to provide a centralized, student-exclusive web application to buy and sell items (textbooks, electronics, hall furniture, etc.) within the National University of Singapore (NUS) community.

## 🌟 The Problem
Currently, students buy and sell items via scattered Telegram groups or generic Carousell listings. This leads to:
- **Lack of Trust:** Difficult to verify if a buyer/seller is actually a student.
- **Poor Discovery:** Telegram chats are unsearchable; listings get buried.
- **Inefficient Coordination:** Wasting time negotiating availability and location.

## 🚀 The Solution
A centralized marketplace featuring:
- **Verified Access:** Authentication via NUS email.
- **Structured Listings:** Categorized items with condition tags and prices.
- **Smart Search:** Filter by category, price, and location.
- **Direct Offers:** A simplified "Make Offer" workflow.

## 🛠 Tech Stack Overview
- **Frontend:** React (Vite) + Tailwind CSS v4
- **Backend:** Node.js (Express) + GraphQL
- **Database:** PostgreSQL (with pgvector for smart search)
- **ORM:** Prisma
- **Infrastructure:** Docker Compose

## 🤝 For Developers
If you are a maintainer or team member looking to contribute, please refer to the following documentation:
- 🚀 **[Onboarding Guide](resources/onboard.md)**: Local setup instructions and dependency management
- 📄 **[Code Collaboration](resources/git-rules.md)**: Branching strategies, PR workflow, and Git hook validation
- ⚡️ **[Prisma DB Protocol](resources/prisma-workflow.md)**: Managing robust local PostgreSQL data prototyping

---
*Developed by IT5007 Finals — Group 14*

## AI Usage Disclosure

Parts of this project were developed with assistance from AI tools.

Specific areas where AI was used:
- Component scaffolding and boilerplate
- Auth library integration
- Dockerfile and Docker Compose configuration
- Headless PDF generation architectures

All AI-generated suggestions were reviewed, understood, and modified to fit the project requirements.
