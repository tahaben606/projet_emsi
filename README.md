# 🎓 EMSI Academic Flow
### *Bridging the Gap in Academic Success through AI and Analytics*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Z.ai](https://img.shields.io/badge/AI-Z.ai_SDK-blue?style=flat-square)](https://chat.z.ai)

**EMSI Flow** is a sophisticated, AI-powered academic management and risk detection ecosystem. Designed for the modern educational landscape, it combines real-time data analytics with Generative AI to identify students at risk and provide personalized support through a RAG-based (Retrieval-Augmented Generation) Knowledge Assistant.

---

## 🚀 Vision
In large educational institutions, students often feel like just another number. **EMSI Flow** changes that by empowering administrators with predictive insights and providing students with an intelligent, 24/7 academic companion. We bridge the gap between administrative oversight and student success.

## ✨ Key Features

### 🔍 Academic Risk Detection
- **Predictive Scoring**: Automatically calculates a student’s "Academic Risk Score" (0-100) based on cross-referenced attendance and performance data.
- **Dynamic Factors**: Identifies specific contributing factors (e.g., "Declining Attendance in Math", "Recent Grade Drop in Algorithmique").
- **Proactive Recommendations**: Generates actionable advice for staff to intervene before a student falls behind.

### 🤖 AI Academic Assistant (RAG-Powered)
- **Instant Knowledge**: Students and faculty can ask complex questions about school policies, exam schedules, and academic resources.
- **Fact-Based Responses**: Uses Retrieval-Augmented Generation to ensure all AI answers are grounded in official institutional documents.
- **Contextual Awareness**: The AI understands the specific student's profile to give tailored advice.

### 📊 Administrative Intelligence
- **Global Dashboard**: Heatmaps of academic risk across different departments and years.
- **Digital Attendance & News**: Modern, paperless management of student attendance and official announcements.
- **Insightful Analytics**: Visualizes distribution of risk levels (Low, Medium, High) to help allocate resources effectively.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Turbopack, React 19 |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | shadcn/ui components, Framer Motion |
| **Database** | [Prisma](https://www.prisma.io/) | SQLite for development, high-performance ORM |
| **AI Hub** | [Z.ai SDK](https://chat.z.ai) | Generative AI & RAG capabilities |
| **Visuals** | [Recharts](https://recharts.org/) | Dynamic and interactive data visualization |
| **State** | [Zustand](https://github.com/pmndrs/zustand) | Lightweight and scalable state management |

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **Package Manager**: `npm` or `bun`

### Quick Start
```bash
# 1. Clone & Enter
git clone https://github.com/tahaben606/projet_emsi.git && cd projet_emsi

# 2. Install Dependencies
npm install

# 3. Environment Setup
# Create .env and add DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# 4. Initialize Database
npx prisma db push && npx prisma db seed

# 5. Launch
npm run dev
```

Visit the app at [localhost:3000](http://localhost:3000).

---

## 📂 Project Structure
```text
src/
├── app/          # Next.js Pages & API Routes
├── components/   # UI Library (shadcn) & Feature Components
├── services/     # AI (RAG, Planner) & Business Logic
├── lib/          # Utilities & Database Client
└── prisma/       # Schema, Migrations & Growth-mode Seed Data
```

## 👥 Contributors
Built for the **EMSI Competition** with ❤️ by the development team.

---
*Empowering education through intelligent data and AI.* 🚀
