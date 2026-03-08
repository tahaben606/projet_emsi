const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cls = await prisma.class.findFirst({ where: { code: '1GI' } });
    if (!cls) {
        console.log('Class 1GI not found');
        return;
    }

    const schedules = await prisma.schedule.findMany({
        where: { classId: cls.id },
        include: { subject: true }
    });

    console.log(JSON.stringify({ class: cls, schedules }, null, 2));
}

main().finally(() => prisma.$disconnect());
