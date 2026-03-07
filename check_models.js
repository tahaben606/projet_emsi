const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('Available models:', Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')));
prisma.$disconnect();
