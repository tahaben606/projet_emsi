import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { calculateStudentRisk } from '@/services/risk-engine'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const email = session.user.email?.toLowerCase()

    if (!email) {
      return NextResponse.json(
        { error: 'Email de session manquant' },
        { status: 400 }
      )
    }

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        class: {
          include: { subjects: true }
        },
        grades: {
          include: { subject: true },
          orderBy: { date: 'desc' }
        },
        attendance: {
          include: { subject: true },
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    })

    if (!student) {
      // If user is ADMIN or TEACHER, they might not have a STUDENT record
      return NextResponse.json(
        { error: 'Profil étudiant non trouvé', role: session.user.role },
        { status: 404 }
      )
    }

    // Calculate risk
    const riskCalculation = await calculateStudentRisk(student.id)

    // Calculate grade statistics
    const grades = student.grades
    const gradeAverage = grades.length > 0
      ? grades.reduce((acc, g) => acc + (g.value / g.maxValue) * 20, 0) / grades.length
      : null

    // Calculate attendance statistics
    const attendance = student.attendance
    const presentCount = attendance.filter(a => a.status === 'present').length
    const absentCount = attendance.filter(a => a.status === 'absent').length
    const lateCount = attendance.filter(a => a.status === 'late').length
    const attendanceRate = attendance.length > 0
      ? (presentCount / attendance.length) * 100
      : null
    
    // Attach a sample schedule for Taha Benissaouia so that
    // the timetable component has data to display.
    let classSchedule = []

    if (
      student.email.toLowerCase() === 'taha.benissaouia@emsi.ma' &&
      student.class?.code === '1GI'
    ) {
      const today = new Date()
      const day = today.getDay() // 0 (Sun) - 6 (Sat)
      const diffToMonday = (1 - day + 7) % 7
      const monday = new Date(today)
      monday.setDate(today.getDate() + diffToMonday)

      const dayDate = (offset) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + offset)
        return d.toISOString()
      }

      // Short, stacked weekly schedule (one main slot per day)
      classSchedule = [
        {
          date: dayDate(0),
          startTime: '09:00',
          endTime: '12:00',
          subject: { name: 'Math + Algorithmique + Programmation C' },
          room: 'A101 / A102 / Lab 1',
          type: 'Cours + TP',
          teacher: { name: 'Équipe Pédagogique 1GI' },
        },
        {
          date: dayDate(1),
          startTime: '09:00',
          endTime: '12:00',
          subject: { name: 'Physique + Anglais + Programmation C' },
          room: 'A201 / A303 / Lab 2',
          type: 'Cours + TP',
          teacher: { name: 'Équipe Pédagogique 1GI' },
        },
        {
          date: dayDate(2),
          startTime: '09:00',
          endTime: '12:00',
          subject: { name: 'Algorithmique + Math + Projet Tuteuré' },
          room: 'A102 / A101 / Lab 3',
          type: 'Cours + Projet',
          teacher: { name: 'Équipe Pédagogique 1GI' },
        },
        {
          date: dayDate(3),
          startTime: '09:00',
          endTime: '12:00',
          subject: { name: 'Programmation C + Anglais + Physique' },
          room: 'Lab 1 / A303 / A201',
          type: 'Cours + TP',
          teacher: { name: 'Équipe Pédagogique 1GI' },
        },
        {
          date: dayDate(4),
          startTime: '09:00',
          endTime: '12:00',
          subject: { name: 'Atelier Pratique + Séminaire' },
          room: 'Lab 1 / Amphithéâtre',
          type: 'Workshop + Séminaire',
          teacher: { name: 'Intervenants EMSI' },
        },
      ]
    }

    const responseStudent = {
      ...student,
      class: {
        ...student.class,
        schedule: classSchedule,
      },
    }

    return NextResponse.json({
      ...responseStudent,
      risk: riskCalculation,
      stats: {
        gradeAverage,
        attendanceRate,
        presentCount,
        absentCount,
        lateCount,
        totalGrades: grades.length
      }
    })
  } catch (error) {
    console.error('Error fetching student me:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération du profil',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
