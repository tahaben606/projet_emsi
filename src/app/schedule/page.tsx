'use client'

import { useState } from 'react'
import { WeekScheduleView } from '@/components/WeekScheduleView'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SchedulePage() {
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined)

  const classOptions = [
    { code: '1GI', name: '1ère année GI' },
    { code: '2GI', name: '2ème année GI' },
    { code: '1IA', name: '1ère année IA' },
    { code: '2IA', name: '2ème année IA' },
    { code: '1CYB', name: '1ère année Cyber' },
    { code: '2CYB', name: '2ème année Cyber' },
    { code: '1BTS', name: '1ère année BTS' },
    { code: '2BTS', name: '2ème année BTS' },
  ]

  const getClassIdFromCode = (code: string) => {
    // This would normally fetch the actual class ID from the database
    // For now, we'll let the component fetch by classId or use the default student endpoint
    return code
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">📅 Emploi du Temps</h1>
          <p className="text-gray-600 text-lg">Vue hebdomadaire compacte et intuitive</p>
        </div>

        {/* Class Selector */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sélectionner une classe</CardTitle>
            <CardDescription>Choisissez la classe pour afficher son emploi du temps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant={selectedClass === undefined ? 'default' : 'outline'}
                onClick={() => setSelectedClass(undefined)}
                className="w-full"
              >
                Mon Emploi du Temps
              </Button>
              {classOptions.map((cls) => (
                <Button
                  key={cls.code}
                  variant={selectedClass === cls.code ? 'default' : 'outline'}
                  onClick={() => setSelectedClass(cls.code)}
                  className="w-full"
                >
                  {cls.code}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule View */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <WeekScheduleView 
            classId={selectedClass} 
            studentName={selectedClass ? `Classe ${selectedClass}` : undefined}
          />
        </div>

        {/* Legend */}
        <Card className="shadow-lg bg-gradient-to-r from-slate-50 to-slate-100">
          <CardHeader>
            <CardTitle className="text-base">Légende</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-sm">Cours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500"></div>
                <span className="text-sm">TD</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm">TP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm">Examen</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg">✨ Caractéristiques</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm md:text-base text-gray-700">
              <li>✅ <strong>Vue compacte :</strong> Tous les cours visibles sans scroll</li>
              <li>✅ <strong>Jour actuel en évidence :</strong> Identification facile du jour actuel (bordure jaune)</li>
              <li>✅ <strong>Sélection du jour :</strong> Cliquez sur un jour pour voir les détails</li>
              <li>✅ <strong>Statistiques :</strong> Nombre total de cours, TP, TD et examens</li>
              <li>✅ <strong>Responsive :</strong> Optimisé pour mobile, tablette et desktop</li>
              <li>✅ <strong>Couleurs visuelles :</strong> Type de cours codés par couleur</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
