# 🚀 EMSI School Website - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```
NEXTAUTH_SECRET=generate-a-random-secret-key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your-database-url
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Setup Database

```bash
# Push Prisma schema to database
npx prisma db push

# Or migrate (if using migrations)
npx prisma migrate dev

# Seed test data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📝 Test Credentials

### Admin Account

- **Email:** admin@emsi.ma
- **Password:** Admin@2026

### Student Account

- **Email:** student1@emsi.ma
- **Password:** Student@2026

### Teacher Account

- **Email:** teacher1@emsi.ma
- **Password:** Teacher@2026

See `docs/CREDENTIALS.txt` for more accounts.

---

## 🌍 Website Structure

### Public Pages

- `/` - Landing page (EMSI school information)
- `/login` - Login portal

### Protected Pages (Admin/Teachers)

- `/dashboard` - Admin and teacher dashboard

---

## 🔑 Authentication Setup

The app uses **NextAuth.js** with credentials provider:

**File:** `src/app/api/auth/[...nextauth]/route.js`

Features:

- Email/Password authentication
- JWT sessions (24-hour expiry)
- Role-based access control (ADMIN, TEACHER, STUDENT)
- Password hashing with bcryptjs

---

## 📊 Database Models

Key tables in Prisma:

- `User` - Users with roles and passwords
- `Class` - School classes/sections
- `Student` - Student enrollment
- `Subject` - Course subjects
- `Grade` - Student grades
- `Attendance` - Attendance records
- `News` - School announcements

---

## 🎨 Design Changes

- **Theme:** White and Green
- **Landing Page:** Professional school website
- **Login:** Functional authentication
- **Dashboard:** Admin/Teacher access only

---

## 🐛 Troubleshooting

### Login not working?

1. Verify `.env.local` has `NEXTAUTH_SECRET` and `DATABASE_URL`
2. Check database connection
3. Run seed: `npx prisma db seed`
4. Check browser console for errors

### Database connection failed?

1. Verify `DATABASE_URL` in `.env.local`
2. Ensure database server is running
3. Check credentials in connection string

### Session not persisting?

1. Verify `NEXTAUTH_SECRET` is set
2. Check cookies in browser DevTools
3. Clear browser cache and try again

---

## 📚 Useful Commands

```bash
# View database
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Check schema
npx prisma validate

# Generate client
npx prisma generate
```

---

## 🔒 Security Notes

⚠️ **For Production:**

- Change all test credentials
- Use strong `NEXTAUTH_SECRET`
- Enable HTTPS
- Set `NEXTAUTH_URL` to production domain
- Implement rate limiting
- Add email verification
- Enable 2FA for admins

See `docs/CREDENTIALS.txt` for security best practices.

---

## 📞 Support

For issues, check:

- NextAuth.js docs: https://next-auth.js.org
- Prisma docs: https://www.prisma.io/docs
- Next.js docs: https://nextjs.org/docs

---

**Created:** March 6, 2026
**Version:** 1.0
