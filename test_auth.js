const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testAuth(email, password) {
    console.log(`Testing auth for ${email}...`);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('User not found');
        return false;
    }
    const match = await bcrypt.compare(password, user.password);
    console.log(`Match: ${match}`);
    return match;
}

async function main() {
    const success = await testAuth('taha.benissaouia@emsi.ma', 'Student@2026');
    if (success) {
        console.log('Auth verification: SUCCESS');
    } else {
        console.log('Auth verification: FAILED');
        process.exit(1);
    }
}

main().finally(() => prisma.$disconnect());
