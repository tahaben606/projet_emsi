const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cls = await prisma.class.findFirst({ where: { code: '1GI' } });
    if (!cls) return;

    const subjects = await prisma.subject.findMany({ where: { classId: cls.id } });

    const scheduleData = [
        { dayOfWeek: 1, startTime: '08:30', endTime: '10:15', subjectCode: 'MATH101', room: 'A101', teacher: 'Pr. Alami' },
        { dayOfWeek: 1, startTime: '10:30', endTime: '12:15', subjectCode: 'ALGO101', room: 'Lab 1', teacher: 'Pr. Benali' },
        { dayOfWeek: 2, startTime: '08:30', endTime: '10:15', subjectCode: 'PRG101', room: 'Lab 2', teacher: 'Pr. Cherkaoui' },
        { dayOfWeek: 2, startTime: '10:30', endTime: '12:15', subjectCode: 'PHY101', room: 'B205', teacher: 'Pr. El Idrissi' },
        { dayOfWeek: 3, startTime: '08:30', endTime: '12:15', subjectCode: 'ENG101', room: 'C104', teacher: 'Pr. Fassi' },
        { dayOfWeek: 4, startTime: '14:00', endTime: '15:45', subjectCode: 'MATH101', room: 'A101', teacher: 'Pr. Alami' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '12:00', subjectCode: 'ALGO101', room: 'Lab 1', teacher: 'Pr. Benali' },
    ];

    for (const item of scheduleData) {
        const subject = subjects.find(s => s.code === item.subjectCode);
        if (!subject) continue;

        await prisma.schedule.create({
            data: {
                classId: cls.id,
                subjectId: subject.id,
                dayOfWeek: item.dayOfWeek,
                startTime: item.startTime,
                endTime: item.endTime,
                room: item.room,
                teacherName: item.teacher
            }
        });
    }

    console.log('Sample schedules created for 1GI');
}

main().finally(() => prisma.$disconnect());
