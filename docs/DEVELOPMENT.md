# 🛠️ EMSI Flow - Development Guide

This guide covers development utilities and scripts for the EMSI Flow project.

## Project Structure

```
projet_emsi/
├── src/                    # Source code
│   ├── app/               # Next.js application
│   ├── components/        # React components
│   ├── lib/              # Utilities & helpers
│   ├── services/         # Business logic
│   └── types/            # TypeScript types
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── scripts/              # Development utility scripts ⚠️ NOT FOR PRODUCTION
├── docs/                 # Documentation
└── package.json          # Dependencies & scripts
```

## Development Scripts

All development utility scripts are located in the `scripts/` directory and should **NEVER** be exposed as web routes in production.

### Available Scripts

Run scripts with: `node scripts/<script-name>`

| Script                  | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `generate_schedules.js` | Generate course schedules for all 8 classes (112 entries) |
| `verify_schedules.js`   | Count and verify schedules in database                    |
| `fetch_taha.js`         | Fetch Taha Benissaouia student profile data               |
| `check_models.js`       | List all available Prisma data models                     |
| `check_schedules.js`    | Check schedule data integrity                             |
| `check-db.mjs`          | Verify database connectivity                              |
| `seed_schedules.js`     | Seed initial schedule data                                |
| `test_auth.js`          | Test authentication with sample credentials               |

### Quick Commands

```bash
# Verify schedules exist
node scripts/verify_schedules.js

# Generate schedules for all classes
node scripts/generate_schedules.js

# Test authentication
node scripts/test_auth.js

# Check database connection
node scripts/check-db.mjs
```

## Environment Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- SQLite (dev database)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Push database schema
npx prisma db push

# (Optional) Seed initial data
npx prisma db seed
```

## Database

### Schema

Database schema is defined in `prisma/schema.prisma`

### Common Operations

```bash
# View database GUI
npx prisma studio

# Push schema changes
npx prisma db push

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

## Running the Application

### Development Server

```bash
npm run dev
```

Access at: [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Key Features

- 📚 **Student Management** - Track students, grades, attendance
- 📅 **Schedule Management** - View and manage class schedules
- ⚠️ **Risk Assessment** - Academic risk prediction engine
- 💬 **AI Assistant** - RAG-based academic advisor
- 📊 **Analytics** - Attendance, grades, and performance metrics
- 🔐 **Authentication** - Role-based access control (Admin, Teacher, Coordinator, Student)

## Testing Credentials

Default test users are configured in the database. See `docs/login.md` for credentials.

### Test Account

```
Email: taha.ben@emsi.ma
Password: Student@2026
Role: Student
Class: 1ère année GI
```

## Project Standards

### No External Script Routes

⚠️ **IMPORTANT**: Development scripts should NEVER be:

- Exposed as HTTP endpoints
- Committed to production builds
- Accessible via the web interface

All scripts are **CLI-only utilities** for development and testing.

### Professional Code Structure

✅ **DO**:

- Keep development utilities in `scripts/` directory
- Use proper TypeScript/JSDoc comments
- Follow existing code patterns
- Test changes locally before committing

❌ **DON'T**:

- Add executable scripts to `src/app/api/`
- Expose CLI utilities as web routes
- Leave debugging code in components
- Commit local configuration files

## Contributing

1. Create a feature branch
2. Make changes following project conventions
3. Test with appropriate test users
4. Commit with clear messages
5. Push to remote

## Troubleshooting

### Database Issues

```bash
# Reset and re-seed
npx prisma migrate reset

# Check database state
npx prisma studio

# Verify connection
node scripts/check-db.mjs
```

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

## Documentation

- [Login & Credentials](docs/login.md)
- [Schedule System](docs/SCHEDULE_SYSTEM_SETUP.md)
- [AI Instructions](docs/ai-instructions.md)
- [Completion Report](COMPLETION_REPORT_FINAL.md)

---

**Last Updated**: March 8, 2026
