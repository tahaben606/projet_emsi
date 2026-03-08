# 📁 Project File Organization Guide

## Project Structure

```
projet_emsi/
├── 📚 Documentation & Guides
│   └── docs/
│       ├── AI_ENHANCED_FEATURES.md
│       ├── chatbot-architecture.md
│       ├── DEVELOPMENT.md
│       ├── SETUP_GUIDE.md
│       ├── QUICKSTART.md
│       ├── QUICK_REFERENCE.md
│       ├── And 17 more documentation files...
│       └── ORGANIZATION_INFO.js
│
├── 💾 Data & Samples
│   └── data/
│       ├── student_complete_data.json
│       ├── student_complete_data_utf8.json
│       └── student_data.json
│
├── ⚙️  Configuration Files
│   └── config/
│       ├── Caddyfile (Caddy reverse proxy config)
│       └── .env.example (Environment template)
│
├── 📝 Application Logs
│   └── logs/
│       └── seed_error.log
│
├── 🎯 Application Source Code
│   ├── src/
│   │   ├── app/ (Next.js pages & API routes)
│   │   ├── components/ (React components)
│   │   ├── hooks/ (Custom React hooks)
│   │   ├── lib/ (Utilities & helpers)
│   │   ├── services/ (Business logic)
│   │   └── types/ (TypeScript types)
│   │
│   ├── scripts/ (Development utility scripts)
│   │   ├── generate_schedules.js
│   │   ├── verify_schedules.js
│   │   ├── test_auth.js
│   │   ├── check_models.js
│   │   ├── verify_all_classes.js
│   │   ├── test_ai_enhancements.js
│   │   ├── reset_schedules.js
│   │   ├── validate_ai_comprehensive.js
│   │   ├── test_chat_context.js
│   │   ├── test_ai_chat_api.js
│   │   └── README.md
│   │
│   ├── prisma/ (Database schema & migrations)
│   │   └── schema.prisma
│   │
│   ├── public/ (Static assets)
│   │   └── logo.png, robots.txt, etc.
│   │
│   ├── db/ (Database-related files)
│   │
│   └── examples/ (Example implementations)
│       └── websocket/ (WebSocket examples)
│
├── 📦 Root Configuration Files
│   ├── package.json (Dependencies & scripts)
│   ├── tsconfig.json (TypeScript configuration)
│   ├── next.config.ts (Next.js configuration)
│   ├── tailwind.config.ts (Tailwind CSS configuration)
│   ├── postcss.config.mjs (PostCSS configuration)
│   ├── eslint.config.mjs (ESLint configuration)
│   ├── components.json (shadcn/ui configuration)
│   ├── .env (Environment variables - local only)
│   ├── .env.local (Local environment overrides)
│   ├── .gitignore (Git ignore rules)
│   ├── README.md (Project overview)
│   └── Caddyfile (Web server config - copy in config/)
│
└── 🔧 Build & Generated
    ├── .next/ (Next.js build output)
    ├── node_modules/ (Dependencies)
    └── .git/ (Git repository)
```

## File Organization by Type

### 📚 Documentation (`/docs`)

All project documentation, guides, and API references.

- Setup guides and quick starts
- Architecture documentation
- AI enhancement details
- Implementation logs
- Completion reports

### 💾 Data (`/data`)

Sample and development data files.

- Student data JSON files
- Development test data

### ⚙️ Configuration (`/config`)

Environment and deployment configuration files.

- `.env.example` - Environment template
- `Caddyfile` - Reverse proxy configuration

### 📝 Logs (`/logs`)

Application and system logs.

- Error logs
- Build logs
- Seed logs

### 🎯 Source Code (`/src`)

Main application code organized by feature.

- **app/** - Next.js App Router pages and API routes
- **components/** - React components (includes UI library)
- **services/** - Business logic and external services
- **hooks/** - Custom React hooks
- **lib/** - Utilities, database, helpers
- **types/** - TypeScript type definitions

### 📜 Scripts (`/scripts`)

Development and utility scripts for developers.

- Database operations
- Testing scripts
- Verification scripts
- NOT intended for production use

## Key Points

✅ **Professional Organization**

- Each file type has its designated directory
- Clear separation of concerns
- Easy to locate and maintain files

✅ **Development Workflow**

- Scripts easily accessible in `/scripts`
- Configuration centralized in `/config` and root
- Documentation comprehensive in `/docs`
- Source code isolated in `/src`

✅ **Production-Ready**

- Node modules and build artifacts ignored
- Environment files properly configured
- Logs in separate directory
- Data separate from code

## Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build             # Build for production
npm run lint              # Run ESLint

# Scripts
npm run scripts:help       # List available scripts
npm run scripts:verify     # Verify schedules
npm run scripts:generate   # Generate schedules
npm run scripts:test-auth  # Test authentication

# Database
npx prisma migrate dev    # Create migrations
npx prisma studio        # Open Prisma Studio
```

## Adding New Files

When adding new files:

- **Documentation** → `/docs`
- **Component code** → `/src/components`
- **API routes** → `/src/app/api`
- **Business logic** → `/src/services`
- **Data files** → `/data`
- **Configuration** → `/config` or root (for Next.js files)
- **Dev utilities** → `/scripts`
- **Types** → `/src/types`
- **Logs** → `/logs`

---

Last updated: March 8, 2026
Organization Status: ✅ Professional & Complete
