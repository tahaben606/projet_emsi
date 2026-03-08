'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Schedule {
  id: string
  classId: string
  subjectId?: string
  subject?: { id: string; name: string; code: string }
  dayOfWeek: number // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string
  endTime: string
  room?: string
  type: string
  teacherName?: string
  createdAt: string
  updatedAt: string
}

interface WeekScheduleViewProps {
  classId?: string
  studentName?: string
}

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const DAY_ABBREVIATIONS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    course: 'bg-blue-500',
    td: 'bg-purple-500',
    tp: 'bg-green-500',
    exam: 'bg-red-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getTypeLabelFr = (type: string) => {
  const labels: Record<string, string> = {
    course: 'Cours',
    td: 'TD',
    tp: 'TP',
    exam: 'Examen'
  }
  return labels[type] || type
}

export default function WeekScheduleView({ classId, studentName }: WeekScheduleViewProps = {}) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date())

  useEffect(() => {
    fetchSchedules()
    // Update selected day to today
    setSelectedDay(new Date().getDay())
  }, [classId])

  const fetchSchedules = async () => {
    try {
      setIsLoading(true)
      const url = classId ? `/api/schedules?classId=${classId}` : '/api/students/me'
      const response = await fetch(url)
      const data = await response.json()

      if (classId) {
        setSchedules(Array.isArray(data) ? data : [])
      } else if (data.class?.schedules) {
        setSchedules(data.class.schedules)
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

  const getSchedulesForDay = (dayOfWeek: number) => {
    return schedules
      .filter(s => s.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getTodayClasses = () => {
    return getSchedulesForDay(selectedDay)
  }

  const getWeekDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(date.getDate() - date.getDay() + i)
      days.push(date)
    }
    return days
  }

  const isToday = (dayOfWeek: number) => {
    return dayOfWeek === new Date().getDay()
  }

  if (isLoading) {
    return <div className="text-center py-8">Chargement de l&apos;emploi du temps...</div>
  }

  if (error) {
    return <div className="text-red-500 py-8">{error}</div>
  }

  const todayClasses = getTodayClasses()

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Vue Hebdomadaire</CardTitle>
          <CardDescription>Survolez un jour pour voir les détails</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {DAYS.map((day, index) => {
              const daySchedules = getSchedulesForDay(index)
              const isCurrentDay = isToday(index)
              const isSelectedDay = selectedDay === index

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isCurrentDay
                      ? 'border-yellow-400 bg-yellow-50 shadow-md'
                      : isSelectedDay
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-sm md:text-base text-gray-700">{DAY_ABBREVIATIONS[index]}</div>
                    <div className="text-xs text-gray-500 mt-1">{daySchedules.length} cours</div>
                    {isCurrentDay && <div className="text-xs text-yellow-600 font-semibold mt-1">Aujourd&apos;hui</div>}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Schedule */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            {isToday(selectedDay) ? "Emploi du temps d'aujourd'hui" : `Emploi du temps - ${DAYS[selectedDay]}`}
            {studentName && <span className="text-gray-600 font-normal text-base ml-2">({studentName})</span>}
          </CardTitle>
          <CardDescription>
            {todayClasses.length > 0 ? `${todayClasses.length} cours prévus` : 'Aucun cours ce jour'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayClasses.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todayClasses.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border-l-4 ${getTypeColor(session.type)} border-l-opacity-50 bg-white shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-base md:text-lg text-gray-800">
                          {session.subject?.name || 'Non spécifié'}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600">{session.subject?.code}</p>
                      </div>
                      <Badge className={`${getTypeColor(session.type)} text-white text-xs`}>
                        {getTypeLabelFr(session.type)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:flex md:gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold">{session.startTime}</span>
                        <span className="text-gray-500">-</span>
                        <span className="font-semibold">{session.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold">{session.room || 'TBD'}</span>
                      </div>
                    </div>

                    {session.teacherName && (
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">👨‍🏫 {session.teacherName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg">📭</div>
              <p className="mt-2">Aucun cours programmé ce jour</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { WeekScheduleView }
