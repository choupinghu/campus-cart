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
- **AI-Powered Auto-Fill:** Upload a photo and let AI (Ollama + llava:7b) populate the title, description, and price for you.
- **Structured Listings:** Categorized items with condition tags and prices.
- **Smart Search:** Filter by category, price, and location.
- **Direct Offers:** A simplified "Make Offer" workflow.

## 🛠 Tech Stack Overview
- **Frontend:** React (Vite) + Tailwind CSS v4
- **Backend:** Node.js (Express) + GraphQL
- **AI Engine:** Ollama (running `llava:7b` locally)
- **Database:** PostgreSQL (with pgvector for smart search)
- **ORM:** Prisma
- **Infrastructure:** Docker Compose

## 🤝 For Developers
If you are a maintainer or team member looking to contribute, please refer to the following documentation:
- 🚀 **[Onboarding Guide](resources/onboard.md)**: Local setup instructions and dependency management
- 📄 **[Code Collaboration](resources/git-rules.md)**: Branching strategies, PR workflow, and Git hook validation
- ⚡️ **[Prisma DB Protocol](resources/prisma-workflow.md)**: Managing robust local PostgreSQL data prototyping

### 🤖 Running AI Features (Ollama)
The application uses **Ollama** as a local LLM service. To enable AI-powered field population:

1. **Start the containers:**
   ```bash
   docker compose up -d
   ```
2. **Pull the vision model:** (Only needed once)
   ```bash
   docker compose exec ollama ollama pull llava:7b
   ```
3. **Verify:** Navigate to `http://localhost:8000/api/ai/health` to ensure the service is reachable.

---
*Developed by IT5007 Finals — Group 14*

## AI Usage Disclosure

Parts of this project were developed with assistance from AI tools.

Specific areas where AI was used:
- Component scaffolding and boilerplate
- Auth library integration
- Dockerfile and Docker Compose configuration
- Headless PDF generation architectures
- **Ollama AI Service integration**

All AI-generated suggestions were reviewed, understood, and modified to fit the project requirements.
