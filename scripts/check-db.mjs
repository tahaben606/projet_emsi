import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const classes = await prisma.class.findMany();
    const students = await prisma.student.findMany({
        where: {
            email: {
                contains: 'taha',
                mode: 'insensitive'
            }
        }
    });

    console.log('CLASSES:', JSON.stringify(classes, null, 2));
    console.log('STUDENTS:', JSON.stringify(students, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
