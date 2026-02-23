# 🎓 EMSI Academic Flow: Bridging the Gap in Academic Success

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

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Database/ORM** | [Prisma](https://www.prisma.io/) + SQLite |
| **AI Capabilities** | [Z.ai SDK](https://chat.z.ai) (Generative AI & RAG) |
| **Data Viz** | [Recharts](https://recharts.org/) |
| **State/Query** | [Zustand](https://github.com/pmndrs/zustand) + [TanStack Query](https://tanstack.com/query/latest) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tahaben606/projet_emsi.git
   cd projet_emsi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-development-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure
```text
src/
├── app/          # Next.js Pages & API Routes
├── components/   # UI Library (shadcn) & Feature Components
├── services/     # AI & Analytics Business Logic
├── lib/          # Utilities (Prisma client, UI helpers)
└── prisma/       # Schema, Migrations & Growth-mode Seed Data
```

## 👥 Contributors
Built for the **EMSI Competition** with ❤️ by the development team.

---
*Empowering education through intelligent data and AI.* 🚀
