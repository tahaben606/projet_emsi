const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const student = await prisma.student.findFirst({
            where: { name: 'Taha BENISSAOUIA' },
            include: {
                class: {
                    include: {
                        schedules: {
                            include: {
                                subject: true
                            }
                        }
                    }
                },
                grades: {
                    include: {
                        subject: true
                    }
                },
                attendance: {
                    include: {
                        subject: true
                    }
                }
            }
        });

        if (!student) {
            console.log(JSON.stringify({ error: 'Student not found' }));
            return;
        }

        console.log(JSON.stringify(student, null, 2));
    } catch (err) {
        console.error(JSON.stringify({ error: err.message }));
    }
}

main()
    .catch(e => {
        console.error(JSON.stringify({ error: e.message }));
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
