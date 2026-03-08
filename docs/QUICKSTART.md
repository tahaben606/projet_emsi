# 🚀 Quick Start - EMSI School

## Setup en 3 étapes

### 1️⃣ Installation

```bash
npm install
```

### 2️⃣ Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Éditer .env.local et ajouter:
# - NEXTAUTH_SECRET (générer une clé aléatoire)
# - DATABASE_URL (URL de votre base de données)
```

Générer une clé secrète:

```bash
openssl rand -base64 32
```

### 3️⃣ Base de Données

```bash
# Créer la base de données et ajouter les tables
npx prisma db push

# Ajouter les données de test
npx prisma db seed
```

## ▶️ Lancer le serveur

```bash
npm run dev
```

Ouvrir: http://localhost:3000

---

## 📝 Identifiants de Test

| Rôle       | Email              | Mot de passe   |
| ---------- | ------------------ | -------------- |
| Admin      | `admin@emsi.ma`    | `Admin@2026`   |
| Étudiant   | `student1@emsi.ma` | `Student@2026` |
| Professeur | `teacher1@emsi.ma` | `Teacher@2026` |

Voir `docs/CREDENTIALS.txt` pour plus de comptes.

---

## 🛠️ Scripts Automatisés

**Linux/Mac:**

```bash
bash setup.sh
```

**Windows:**

```bash
setup.bat
```

---

## 🐛 Erreurs courantes

**"Unexpected token '<', "<!DOCTYPE"... is not valid JSON"**

- ✓ Solution: NextAuth n'est pas correctement configuré
- Vérifier que `.env.local` a `NEXTAUTH_SECRET`
- Vérifier que la base de données est accessible

**"Invalid credentials"**

- ✓ Vérifier que `npx prisma db seed` a été exécuté
- Vérifier l'email et mot de passe exactement comme indiqué

**"DATABASE_URL not defined"**

- ✓ Ajouter `DATABASE_URL` à `.env.local`

---

## 📚 Structure du Projet

```
projet_emsi/
├── src/
│   ├── app/
│   │   ├── page.jsx          # Landing page
│   │   ├── login/            # Login page
│   │   ├── dashboard/        # Dashboard (protégé)
│   │   └── api/auth/         # NextAuth configuration
│   └── components/           # UI components
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Test data
├── .env.example              # Environment template
├── setup.sh / setup.bat      # Auto setup scripts
└── SETUP_GUIDE.md            # Detailed guide
```

---

## 🔗 Liens Utiles

- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://www.prisma.io)
- [Next.js](https://nextjs.org)

---

**Besoin d'aide?** Vérifier le `SETUP_GUIDE.md` pour plus de détails!
