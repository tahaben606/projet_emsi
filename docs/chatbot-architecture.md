# 🤖 EMSI Flow - Chatbot Architecture (RAG Agent)

## Overview

The AI chatbot in EMSI Flow uses **RAG (Retrieval-Augmented Generation)** to answer student questions. Instead of relying on general AI knowledge, it retrieves specific data from the school's knowledge base and the student's personal profile before generating a response.

---

## How It Works

```
┌──────────────┐
│  User Query  │  (French or English)
└──────┬───────┘
       ▼
┌──────────────────────────────────────────────┐
│           RETRIEVAL PHASE                     │
│                                               │
│  1. Static Knowledge (KNOWLEDGE_CONTENT)      │
│     → School policies, calendars, contacts    │
│                                               │
│  2. Database Documents (KnowledgeDocument)     │
│     → Dynamic docs added by admins            │
│                                               │
│  3. News & Announcements (News table)         │
│     → Exams, deadlines, events                │
│                                               │
│  4. Student Profile (if studentId provided)   │
│     → Grades, attendance, class info          │
│                                               │
│  All scored using synonym-expanded keywords   │
└──────────────┬───────────────────────────────┘
               ▼
┌──────────────────────────────────────────────┐
│           AUGMENTATION PHASE                  │
│                                               │
│  Top-scoring context + student profile        │
│  → Injected into the system prompt            │
│  → Bilingual instructions (FR/EN)             │
└──────────────┬───────────────────────────────┘
               ▼
┌──────────────────────────────────────────────┐
│           GENERATION PHASE                    │
│                                               │
│  Z.ai SDK → Gemini LLM                       │
│  → Generates grounded, cited response         │
│  → Temperature: 0.4 (factual, not creative)   │
└──────────────┬───────────────────────────────┘
               ▼
┌──────────────┐
│   Response   │  + Citations
└──────────────┘
```

---

## Key Files

| File | Role |
|------|------|
| `src/services/rag-agent.js` | Core RAG logic: retrieval, augmentation, generation |
| `src/services/planner.js` | AI recommendations & daily summaries |
| `src/app/api/ai/chat/route.js` | API endpoint for the chatbot |
| `src/app/page.jsx` | Frontend chat UI (StudentPanel component) |
| `prisma/schema.prisma` | Database schema (KnowledgeDocument, News, Student) |
| `.env` | API key configuration (`GEMINI_API_KEY`) |

---

## Retrieval Strategy

### Synonym Expansion
Queries are expanded using a French ↔ English synonym map. For example:
- "notes" → also matches: `grade, scores, moyenne, average, marks, résultat`
- "absence" → also matches: `attendance, présence, assiduité, retard, late`

### Text Normalization
All text is normalized before matching:
1. Lowercased
2. Accents removed (`é` → `e`, `ô` → `o`)
3. Special characters removed
4. Multiple spaces collapsed

### Scoring
Each knowledge section is scored based on:
- **+5** per keyword match occurrence
- **+15** for title/heading matches
- **+12** for matching database document tags
- **+8** for database document content matches

Top 5 scoring sections are included in the context.

---

## Student-Aware Responses

When a student is selected, the chatbot automatically includes:
- **Student name and class**
- **Grade average** (calculated from all grades)
- **Attendance rate** (present + excused / total)
- **Recent grades by subject** (up to 15 most recent)

This allows questions like:
- *"Comment sont mes notes ?"* → Lists actual grades
- *"Est-ce que j'ai assez de présence ?"* → Checks real attendance rate

---

## Configuration

### Environment Variables (`.env`)
```env
GEMINI_API_KEY="your-key-here"  # Required for AI responses
DATABASE_URL="file:./dev.db"     # SQLite database path
```

### Adding New Knowledge

**Option 1: Database (recommended)**
Add entries to the `KnowledgeDocument` table via Prisma:
```javascript
await prisma.knowledgeDocument.create({
  data: {
    title: 'New Policy Title',
    content: 'Detailed content...',
    category: 'policy',  // policy, academic, resources, deadlines, general
    tags: JSON.stringify(['keyword1', 'keyword2'])
  }
});
```

**Option 2: Static Knowledge**
Edit the `KNOWLEDGE_CONTENT` constant in `src/services/rag-agent.js`.

---

## Fallback System

If the AI API fails (network error, rate limit), the system uses rule-based fallback responses that match query keywords to predefined answers. These cover:
- Grades & notation
- Attendance policies
- Exam schedules
- Registration
- Scholarships
- General greetings
