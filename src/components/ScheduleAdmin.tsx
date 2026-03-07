'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin } from 'lucide-react'

interface ClassItem {
  id: string
  name: string
}

interface Session {
  id: string
  subject?: { name: string }
  type: string
  date: string
  startTime: string
  endTime: string
  room: string
  teacher?: { name: string }
}

interface ScheduleAdminProps {
  classes?: ClassItem[]
  onScheduleSaved?: (schedule: unknown) => void
}

export default function ScheduleAdmin({ classes: classesProp }: ScheduleAdminProps = {}) {
  const [schedules, setSchedules] = useState<Session[]>([])
  const [classes, setClasses] = useState<ClassItem[]>(classesProp || [])
  const [selectedClass, setSelectedClass] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!classesProp) {
      fetchClasses()
    } else if (classesProp.length > 0) {
      setSelectedClass(classesProp[0].id)
    }
  }, [classesProp])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data)
      if (data.length > 0) {
        setSelectedClass(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchSchedules = async (classId: string) => {
    if (!classId) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/schedules?classId=${classId}`)
      const data = await response.json()
      setSchedules(data)
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId)
    fetchSchedules(classId)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Emplois du Temps</CardTitle>
          <CardDescription>Voir et gérer les emplois du temps des classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <Button onClick={() => fetchSchedules(selectedClass)}>Rafraîchir</Button>
          </div>

          {isLoading ? (
            <div>Chargement...</div>
          ) : schedules.length === 0 ? (
            <div className="text-gray-500">Aucun emploi du temps disponible</div>
          ) : (
            <div className="grid gap-4">
              {schedules.map((session) => (
                <Card key={session.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{session.subject?.name}</h3>
                        <Badge>{session.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        Salle {session.room}
                      </div>
                      {session.teacher && (
                        <div className="text-sm text-gray-600">
                          Professeur: {session.teacher.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { ScheduleAdmin }
