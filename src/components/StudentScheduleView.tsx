'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin } from 'lucide-react'

interface Session {
  id?: string
  subject?: { name: string }
  type: string
  date: string
  startTime: string
  endTime: string
  room: string
  teacher?: { name: string }
}

interface StudentScheduleViewProps {
  classId?: string
  studentName?: string
}

export default function StudentScheduleView({ classId, studentName }: StudentScheduleViewProps = {}) {
  const [schedules, setSchedules] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSchedules()
  }, [classId])

  const fetchSchedules = async () => {
    try {
      setIsLoading(true)
      const url = classId
        ? `/api/schedules?classId=${classId}`
        : '/api/students/me'
      const response = await fetch(url)
      const data = await response.json()

      if (classId) {
        setSchedules(Array.isArray(data) ? data : [])
      } else if (data.class?.schedule) {
        setSchedules(data.class.schedule)
      } else {
        setSchedules([])
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'emploi du temps")
      console.error('Error fetching schedule:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const groupScheduleByDay = (schedules: Session[]) => {
    const grouped: Record<string, Session[]> = {}
    schedules.forEach((session) => {
      const date = new Date(session.date).toLocaleDateString('fr-FR')
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(session)
    })
    return grouped
  }

  if (isLoading) {
    return <div className="text-center py-8">Chargement de l&apos;emploi du temps...</div>
  }

  if (error) {
    return <div className="text-red-500 py-8">{error}</div>
  }

  if (schedules.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-500">Aucun emploi du temps disponible</p>
        </CardContent>
      </Card>
    )
  }

  const groupedSchedules = groupScheduleByDay(schedules)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mon Emploi du Temps{studentName ? ` - ${studentName}` : ''}</CardTitle>
          <CardDescription>Visualisez votre calendrier scolaire</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedSchedules).map(([date, sessions]) => (
              <div key={date}>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">{date}</h3>
                <div className="grid gap-3">
                  {sessions.map((session, idx) => (
                    <Card key={idx} className="border-l-4 border-l-indigo-500">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">{session.subject?.name}</h4>
                            <Badge variant="outline">{session.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{session.startTime} - {session.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Salle {session.room}</span>
                          </div>
                          {session.teacher && (
                            <div className="text-sm text-gray-700 font-medium">
                              👨‍🏫 {session.teacher.name}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { StudentScheduleView }
