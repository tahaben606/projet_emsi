'use client'

import { useState, useEffect, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  Send,
  Users,
  AlertCircle,
  Bot,
  ChevronRight,
  Target,
  Award,
  Activity,
  Shield,
  Bell,
  X,
  Lightbulb,
  Plus,
  Trash2,
  Edit,
  Newspaper,
  Megaphone,
  FileText,
  ClipboardCheck,
  UserCheck,
  UserX,
  Save
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Helper functions
const getRiskColor = (level) => {
  switch (level) {
    case 'HIGH': return 'text-red-600 bg-red-50 border-red-200'
    case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'LOW': return 'text-green-600 bg-green-50 border-green-200'
  }
}

const getRiskBgColor = (level) => {
  switch (level) {
    case 'HIGH': return 'bg-red-500'
    case 'MEDIUM': return 'bg-amber-500'
    case 'LOW': return 'bg-green-500'
  }
}

const formatGrade = (value, maxValue) => ((value / maxValue) * 20).toFixed(1)

const getNewsTypeIcon = (type) => {
  switch (type) {
    case 'exam': return <FileText className="h-4 w-4" />
    case 'deadline': return <Clock className="h-4 w-4" />
    case 'event': return <Calendar className="h-4 w-4" />
    case 'alert': return <AlertTriangle className="h-4 w-4" />
    default: return <Newspaper className="h-4 w-4" />
  }
}

const getNewsTypeColor = (type) => {
  switch (type) {
    case 'exam': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'deadline': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'event': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'alert': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'normal': return 'bg-blue-500'
    default: return 'bg-gray-400'
  }
}

// Student Panel Component
function StudentPanel() {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [studentDetail, setStudentDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [summary, setSummary] = useState(null)
  const [studentNews, setStudentNews] = useState(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    fetch('/api/students').then(res => res.json()).then(data => setStudents(data)).catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedStudentId) {
      setLoading(true)
      Promise.all([
        fetch(`/api/students/${selectedStudentId}`).then(res => res.json()),
        fetch(`/api/ai/recommendations?studentId=${selectedStudentId}&summary=true`).then(res => res.json()),
        fetch(`/api/news/student/${selectedStudentId}`).then(res => res.json())
      ])
        .then(([detail, aiData, newsData]) => {
          setStudentDetail(detail)
          setRecommendations(aiData.recommendations || [])
          setSummary(aiData.summary || null)
          setStudentNews(newsData)
          setChatMessages([])
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [selectedStudentId])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMessage = { role: 'user', content: chatInput, timestamp: new Date() }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput, messages: [...chatMessages, userMessage].map(m => ({ role: m.role, content: m.content })) })
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response, citations: data.citations, timestamp: new Date() }])
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue.', timestamp: new Date() }])
    } finally { setChatLoading(false) }
  }

  const suggestedQuestions = ["Quelle est la politique d'assiduité?", "Quand sont les examens?", "Y a-t-il des annonces récentes?", "Où trouver de l'aide?"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5" />Sélectionner un Étudiant</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
            <SelectTrigger><SelectValue placeholder="Choisir un étudiant..." /></SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>{student.name} - {student.class.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading && <div className="flex items-center justify-center py-12"><Activity className="h-8 w-8 animate-spin text-blue-500" /></div>}

      {studentDetail && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Student News Feed */}
            {studentNews && studentNews.news.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-500" />
                    Mes Annonces ({studentNews.totalCount})
                  </CardTitle>
                  <CardDescription>Annonces et événements vous concernant</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-3">
                      {studentNews.news.map((item) => (
                        <div key={item.id} className={cn("p-3 rounded-lg border", item.isUrgent ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50")}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Badge className={cn("text-xs", getNewsTypeColor(item.type))}>
                                {getNewsTypeIcon(item.type)}
                                <span className="ml-1 capitalize">{item.type}</span>
                              </Badge>
                              {item.isUrgent && <Badge className="bg-red-500 text-xs">Urgent</Badge>}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <h4 className="font-medium mt-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                          {item.eventDate && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(item.eventDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {summary && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><Lightbulb className="h-5 w-5 text-blue-600" /></div>
                    <div>
                      <p className="font-medium text-blue-900">{summary.greeting}</p>
                      <p className="text-sm text-blue-700 mt-1">{summary.summary}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {summary.focus.map((item, i) => (<Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700">{item}</Badge>))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className={cn('border-2', getRiskColor(studentDetail.risk.level))}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Niveau de Risque Académique</CardTitle>
                    <CardDescription>Score calculé: {studentDetail.risk.score}/100</CardDescription>
                  </div>
                  <Badge className={cn('text-lg px-4 py-1', getRiskBgColor(studentDetail.risk.level))}>
                    {studentDetail.risk.level === 'HIGH' ? 'ÉLEVÉ' : studentDetail.risk.level === 'MEDIUM' ? 'MOYEN' : 'FAIBLE'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Score de Risque</span><span className="font-medium">{studentDetail.risk.score}/100</span></div>
                  <Progress value={studentDetail.risk.score} className="h-3" />
                </div>
                <div className="space-y-3 mt-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Facteurs de Risque</h4>
                  {studentDetail.risk.factors.map((factor, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div><p className="font-medium text-sm">{factor.name}</p><p className="text-xs text-muted-foreground">{factor.description}</p></div>
                      <div className="text-right"><p className="font-medium">{factor.contribution.toFixed(1)}</p><p className="text-xs text-muted-foreground">contribution</p></div>
                    </div>
                  ))}
                </div>
                {recommendations.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4" />Recommandations</h4>
                    {recommendations.slice(0, 3).map((rec, i) => (
                      <Alert key={i} className={cn(rec.priority === 'high' ? 'border-red-200 bg-red-50' : rec.priority === 'medium' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50')}>
                        <AlertCircle className={cn(rec.priority === 'high' ? 'text-red-500' : rec.priority === 'medium' ? 'text-amber-500' : 'text-blue-500')} />
                        <AlertTitle className="text-sm font-medium">{rec.action}</AlertTitle>
                        <AlertDescription className="text-xs mt-1">{rec.reason}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-500" /><div><p className="text-2xl font-bold">{studentDetail.stats.gradeAverage?.toFixed(1) || 'N/A'}</p><p className="text-xs text-muted-foreground">Moyenne /20</p></div></div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-green-500" /><div><p className="text-2xl font-bold">{studentDetail.stats.attendanceRate?.toFixed(0) || 'N/A'}%</p><p className="text-xs text-muted-foreground">Assiduité</p></div></div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-500" /><div><p className="text-2xl font-bold">{studentDetail.stats.presentCount}</p><p className="text-xs text-muted-foreground">Présences</p></div></div></CardContent></Card>
              <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /><div><p className="text-2xl font-bold">{studentDetail.stats.absentCount}</p><p className="text-xs text-muted-foreground">Absences</p></div></div></CardContent></Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Award className="h-5 w-5" />Notes Récentes</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Matière</TableHead><TableHead>Note</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {studentDetail.grades.slice(0, 8).map(grade => {
                      const gradeValue = parseFloat(formatGrade(grade.value, grade.maxValue))
                      return (
                        <TableRow key={grade.id}>
                          <TableCell className="font-medium">{grade.subject.name}</TableCell>
                          <TableCell><span className={cn('font-bold', gradeValue < 10 ? 'text-red-600' : 'text-green-600')}>{gradeValue.toFixed(1)}/20</span></TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{grade.type}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{new Date(grade.date).toLocaleDateString('fr-FR')}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Bot className="h-5 w-5 text-blue-500" />Assistant Académique</CardTitle>
                <CardDescription>Posez vos questions</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 h-[400px] pr-4">
                  {chatMessages.length === 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center py-4">Bonjour! Je suis votre assistant académique EMSI.</p>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Suggestions:</p>
                        {suggestedQuestions.map((q, i) => (
                          <Button key={i} variant="outline" size="sm" className="w-full justify-start text-left h-auto py-2" onClick={() => { setChatInput(q); setTimeout(() => handleSendMessage(), 100) }}>
                            <ChevronRight className="h-4 w-4 mr-2 shrink-0" />{q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                          {msg.role === 'assistant' && <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-blue-100 text-blue-600"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>}
                          <div className={cn('max-w-[85%] rounded-lg p-3', msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100')}>
                            <p className="text-sm">{msg.content}</p>
                            {msg.citations && msg.citations.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-xs text-muted-foreground">Sources:</p>
                                {msg.citations.map((c, ci) => (<p key={ci} className="text-xs text-blue-600">📚 {c.source}</p>))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {chatLoading && <div className="flex gap-2"><Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-blue-100 text-blue-600"><Bot className="h-4 w-4" /></AvatarFallback></Avatar><div className="bg-gray-100 rounded-lg p-3"><Activity className="h-4 w-4 animate-spin" /></div></div>}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </ScrollArea>
                <div className="mt-4 flex gap-2">
                  <Input placeholder="Posez votre question..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} disabled={chatLoading} />
                  <Button onClick={handleSendMessage} disabled={chatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!selectedStudentId && !loading && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Sélectionnez un étudiant pour voir son profil</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Admin Dashboard with News & Attendance Management
function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [news, setNews] = useState([])
  const [classes, setClasses] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)

  // News form state
  const [showNewsForm, setShowNewsForm] = useState(false)
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    type: 'announcement',
    priority: 'normal',
    targetAudience: 'all',
    targetClassIds: [],
    eventDate: ''
  })

  // Attendance state
  const [attendanceClassId, setAttendanceClassId] = useState('')
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceSubjectId, setAttendanceSubjectId] = useState('')
  const [attendanceStudents, setAttendanceStudents] = useState([])
  const [attendanceSubjects, setAttendanceSubjects] = useState([])
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [attendanceSaving, setAttendanceSaving] = useState(false)

  useEffect(() => {
    fetch('/api/analytics/dashboard').then(res => res.json()).then(data => { setStats(data); setLoading(false) }).catch(console.error)
    fetch('/api/classes').then(res => res.json()).then(data => setClasses(data)).catch(console.error)
    fetch('/api/news').then(res => res.json()).then(data => { setNews(data); setNewsLoading(false) }).catch(console.error)
  }, [])

  const loadNews = () => {
    setNewsLoading(true)
    fetch('/api/news').then(res => res.json()).then(data => setNews(data)).catch(console.error).finally(() => setNewsLoading(false))
  }

  const handleCreateNews = async () => {
    if (!newsForm.title || !newsForm.content) return
    try {
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newsForm,
          eventDate: newsForm.eventDate || null,
          authorName: 'Admin'
        })
      })
      setNewsForm({ title: '', content: '', type: 'announcement', priority: 'normal', targetAudience: 'all', targetClassIds: [], eventDate: '' })
      setShowNewsForm(false)
      loadNews()
    } catch (error) {
      console.error('Error creating news:', error)
    }
  }

  const handleDeleteNews = async (id) => {
    if (!confirm('Supprimer cette annonce?')) return
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' })
      loadNews()
    } catch (error) {
      console.error('Error deleting news:', error)
    }
  }

  // Load subjects when class changes
  useEffect(() => {
    if (attendanceClassId) {
      fetch(`/api/subjects?classId=${attendanceClassId}`).then(res => res.json()).then(data => {
        setAttendanceSubjects(data || [])
        if (data && data.length > 0) {
          setAttendanceSubjectId(data[0].id)
        }
      }).catch(console.error)
    }
  }, [attendanceClassId])

  // Load attendance when subject/date changes
  useEffect(() => {
    if (attendanceClassId && attendanceSubjectId && attendanceDate) {
      setAttendanceLoading(true)
      fetch(`/api/attendance?classId=${attendanceClassId}&date=${attendanceDate}&subjectId=${attendanceSubjectId}`)
        .then(res => res.json())
        .then(data => {
          setAttendanceStudents(data.students || [])
        })
        .catch(console.error)
        .finally(() => setAttendanceLoading(false))
    }
  }, [attendanceClassId, attendanceSubjectId, attendanceDate])

  // Update student attendance status
  const updateStudentStatus = (studentId, status) => {
    setAttendanceStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendanceStatus: status } : s))
  }

  // Save attendance
  const saveAttendance = async () => {
    if (!attendanceSubjectId || attendanceStudents.length === 0) return
    setAttendanceSaving(true)
    try {
      const attendanceData = attendanceStudents.map(s => ({
        studentId: s.id,
        status: s.attendanceStatus || 'present'
      }))
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: attendanceClassId,
          date: attendanceDate,
          subjectId: attendanceSubjectId,
          attendanceData
        })
      })
      alert('Présences enregistrées avec succès!')
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Erreur lors de l\'enregistrement')
    } finally {
      setAttendanceSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Activity className="h-8 w-8 animate-spin text-blue-500" /></div>
  if (!stats) return null

  const pieData = [
    { name: 'Faible Risque', value: stats.riskDistribution.low, color: '#22c55e' },
    { name: 'Risque Moyen', value: stats.riskDistribution.medium, color: '#f59e0b' },
    { name: 'Risque Élevé', value: stats.riskDistribution.high, color: '#ef4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button variant={activeSection === 'dashboard' ? 'default' : 'outline'} onClick={() => setActiveSection('dashboard')}>
          <Shield className="h-4 w-4 mr-2" />Tableau de Bord
        </Button>
        <Button variant={activeSection === 'news' ? 'default' : 'outline'} onClick={() => setActiveSection('news')}>
          <Megaphone className="h-4 w-4 mr-2" />Annonces
        </Button>
        <Button variant={activeSection === 'attendance' ? 'default' : 'outline'} onClick={() => setActiveSection('attendance')}>
          <ClipboardCheck className="h-4 w-4 mr-2" />Absences
        </Button>
      </div>

      {activeSection === 'attendance' ? (
        <div className="space-y-6">
          {/* Attendance Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5" />Gestion des Absences</CardTitle>
              <CardDescription>Marquez les présences et absences par classe et par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Classe</Label>
                  <Select value={attendanceClassId} onValueChange={setAttendanceClassId}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Matière</Label>
                  <Select value={attendanceSubjectId} onValueChange={setAttendanceSubjectId} disabled={!attendanceClassId}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      {attendanceSubjects.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={saveAttendance} disabled={attendanceSaving || attendanceStudents.length === 0} className="w-full">
                    {attendanceSaving ? <Activity className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Enregistrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {attendanceClassId && attendanceSubjectId && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAttendanceStudents(prev => prev.map(s => ({ ...s, attendanceStatus: 'present' })))}>
                <UserCheck className="h-4 w-4 mr-2 text-green-500" />Tous Présents
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAttendanceStudents(prev => prev.map(s => ({ ...s, attendanceStatus: 'absent' })))}>
                <UserX className="h-4 w-4 mr-2 text-red-500" />Tous Absents
              </Button>
            </div>
          )}

          {/* Student List */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Étudiants</CardTitle>
              <CardDescription>
                {attendanceStudents.length > 0 ? `${attendanceStudents.length} étudiants` : 'Sélectionnez une classe et une matière'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceLoading ? (
                <div className="flex justify-center py-8"><Activity className="h-8 w-8 animate-spin text-blue-500" /></div>
              ) : attendanceStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une classe et une matière pour voir la liste</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attendanceStudents.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={student.attendanceStatus === 'present' ? 'default' : 'outline'}
                          className={student.attendanceStatus === 'present' ? 'bg-green-500 hover:bg-green-600' : ''}
                          onClick={() => updateStudentStatus(student.id, 'present')}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={student.attendanceStatus === 'absent' ? 'default' : 'outline'}
                          className={student.attendanceStatus === 'absent' ? 'bg-red-500 hover:bg-red-600' : ''}
                          onClick={() => updateStudentStatus(student.id, 'absent')}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={student.attendanceStatus === 'late' ? 'default' : 'outline'}
                          className={student.attendanceStatus === 'late' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                          onClick={() => updateStudentStatus(student.id, 'late')}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={student.attendanceStatus === 'excused' ? 'default' : 'outline'}
                          className={student.attendanceStatus === 'excused' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                          onClick={() => updateStudentStatus(student.id, 'excused')}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : activeSection === 'news' ? (
        <div className="space-y-6">
          {/* News Management Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5" />Gestion des Annonces</CardTitle>
                  <CardDescription>Créez et gérez les annonces pour les étudiants</CardDescription>
                </div>
                <Button onClick={() => setShowNewsForm(!showNewsForm)}>
                  <Plus className="h-4 w-4 mr-2" />Nouvelle Annonce
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* News Form */}
          {showNewsForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nouvelle Annonce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Titre de l'annonce" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={newsForm.type} onValueChange={(v) => setNewsForm({ ...newsForm, type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exam">Examen</SelectItem>
                          <SelectItem value="deadline">Date Limite</SelectItem>
                          <SelectItem value="event">Événement</SelectItem>
                          <SelectItem value="alert">Alerte</SelectItem>
                          <SelectItem value="announcement">Annonce</SelectItem>
                          <SelectItem value="general">Général</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priorité</Label>
                      <Select value={newsForm.priority} onValueChange={(v) => setNewsForm({ ...newsForm, priority: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="normal">Normale</SelectItem>
                          <SelectItem value="low">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Contenu</Label>
                  <Textarea value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} placeholder="Contenu de l'annonce..." rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Audience Cible</Label>
                    <Select value={newsForm.targetAudience} onValueChange={(v) => setNewsForm({ ...newsForm, targetAudience: v, targetClassIds: [] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les étudiants</SelectItem>
                        <SelectItem value="class">Classes spécifiques</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date de l'événement (optionnel)</Label>
                    <Input type="datetime-local" value={newsForm.eventDate} onChange={(e) => setNewsForm({ ...newsForm, eventDate: e.target.value })} />
                  </div>
                </div>
                {newsForm.targetAudience === 'class' && (
                  <div className="space-y-2">
                    <Label>Classes Cibles</Label>
                    <div className="flex flex-wrap gap-2">
                      {classes.map(cls => (
                        <Badge
                          key={cls.id}
                          variant={newsForm.targetClassIds.includes(cls.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            setNewsForm({
                              ...newsForm,
                              targetClassIds: newsForm.targetClassIds.includes(cls.id)
                                ? newsForm.targetClassIds.filter(id => id !== cls.id)
                                : [...newsForm.targetClassIds, cls.id]
                            })
                          }}
                        >
                          {cls.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewsForm(false)}>Annuler</Button>
                  <Button onClick={handleCreateNews}>Publier</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* News List */}
          <Card>
            <CardHeader>
              <CardTitle>Annonces Publiées ({news.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {newsLoading ? (
                <div className="flex justify-center py-8"><Activity className="h-6 w-6 animate-spin" /></div>
              ) : news.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Aucune annonce publiée</div>
              ) : (
                <div className="space-y-3">
                  {news.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-4 rounded-lg border hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={cn("text-xs", getNewsTypeColor(item.type))}>
                            {getNewsTypeIcon(item.type)}
                            <span className="ml-1 capitalize">{item.type}</span>
                          </Badge>
                          <Badge className={cn("text-xs text-white", getPriorityColor(item.priority))}>{item.priority}</Badge>
                          {item.targetAudience === 'class' && item.targetClassIds && (
                            <Badge variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {item.targetClassIds.length} classe(s)
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                        {item.eventDate && (
                          <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.eventDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Publié le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteNews(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-500" /><div><p className="text-2xl font-bold">{stats.totalStudents}</p><p className="text-xs text-muted-foreground">Étudiants</p></div></div></CardContent></Card>
            <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-purple-500" /><div><p className="text-2xl font-bold">{stats.totalClasses}</p><p className="text-xs text-muted-foreground">Classes</p></div></div></CardContent></Card>
            <Card className="border-red-200 bg-red-50"><CardContent className="pt-4"><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /><div><p className="text-2xl font-bold text-red-600">{stats.highRiskCount}</p><p className="text-xs text-red-600">Risque Élevé</p></div></div></CardContent></Card>
            <Card className="border-amber-200 bg-amber-50"><CardContent className="pt-4"><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-500" /><div><p className="text-2xl font-bold text-amber-600">{stats.mediumRiskCount}</p><p className="text-xs text-amber-600">Risque Moyen</p></div></div></CardContent></Card>
            <Card className="border-green-200 bg-green-50"><CardContent className="pt-4"><div className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-500" /><div><p className="text-2xl font-bold text-green-600">{stats.averageStability.toFixed(0)}%</p><p className="text-xs text-green-600">Stabilité</p></div></div></CardContent></Card>
            <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><Bell className="h-5 w-5 text-blue-500" /><div><p className="text-2xl font-bold">{stats.alertsToday}</p><p className="text-xs text-muted-foreground">Alertes</p></div></div></CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Distribution des Risques</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Risque par Classe</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.classAnalytics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="classCode" type="category" width={50} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Risque Moyen']} />
                    <Bar dataKey="averageRiskScore" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5" />Aperçu des Classes</CardTitle>
              <CardDescription>Cliquez sur une classe pour voir les détails</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Étudiants</TableHead>
                    <TableHead>Stabilité</TableHead>
                    <TableHead>Score Risque</TableHead>
                    <TableHead>Élevé</TableHead>
                    <TableHead>Moyen</TableHead>
                    <TableHead>Faible</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.classAnalytics.map(cls => (
                    <TableRow key={cls.classId} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedClassId(cls.classId)}>
                      <TableCell className="font-medium">{cls.className}</TableCell>
                      <TableCell>{cls.totalStudents}</TableCell>
                      <TableCell className={cls.stabilityPercentage >= 70 ? 'text-green-600' : cls.stabilityPercentage >= 50 ? 'text-amber-600' : 'text-red-600'}>{cls.stabilityPercentage.toFixed(0)}%</TableCell>
                      <TableCell><Badge variant="outline">{cls.averageRiskScore.toFixed(1)}</Badge></TableCell>
                      <TableCell>{cls.highRiskCount > 0 ? <Badge className="bg-red-100 text-red-700">{cls.highRiskCount}</Badge> : <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell>{cls.mediumRiskCount > 0 ? <Badge className="bg-amber-100 text-amber-700">{cls.mediumRiskCount}</Badge> : <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-700">{cls.lowRiskCount}</Badge></TableCell>
                      <TableCell>
                        {cls.highRiskCount > cls.totalStudents * 0.3 ? <Badge className="bg-red-500">Critique</Badge> : cls.stabilityPercentage >= 70 ? <Badge className="bg-green-500">Stable</Badge> : <Badge className="bg-amber-500">À Surveiller</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {selectedClassId && <ClassDetailModal classId={selectedClassId} onClose={() => setSelectedClassId(null)} />}
    </div>
  )
}

// Class Detail Modal
function ClassDetailModal({ classId, onClose }) {
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/classes/${classId}`).then(res => res.json()).then(data => { setClassData(data); setLoading(false) }).catch(console.error)
  }, [classId])

  if (loading) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><Activity className="h-8 w-8 animate-spin text-white" /></div>

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>{classData.name}</CardTitle><CardDescription>{classData.code} - {classData.department}</CardDescription></div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{classData.analytics.totalStudents}</p><p className="text-xs text-muted-foreground">Étudiants</p></CardContent></Card>
            <Card className="border-green-200 bg-green-50"><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-green-600">{classData.analytics.lowRiskCount}</p><p className="text-xs text-green-600">Faible Risque</p></CardContent></Card>
            <Card className="border-amber-200 bg-amber-50"><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-amber-600">{classData.analytics.mediumRiskCount}</p><p className="text-xs text-amber-600">Risque Moyen</p></CardContent></Card>
            <Card className="border-red-200 bg-red-50"><CardContent className="pt-4 text-center"><p className="text-2xl font-bold text-red-600">{classData.analytics.highRiskCount}</p><p className="text-xs text-red-600">Risque Élevé</p></CardContent></Card>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Étudiant</TableHead><TableHead>Moyenne</TableHead><TableHead>Assiduité</TableHead><TableHead>Score Risque</TableHead><TableHead>Niveau</TableHead></TableRow></TableHeader>
            <TableBody>
              {classData.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.gradeAverage ? <span className={student.gradeAverage >= 10 ? 'text-green-600' : 'text-red-600'}>{student.gradeAverage.toFixed(1)}/20</span> : 'N/A'}</TableCell>
                  <TableCell>{student.attendanceRate ? <span className={student.attendanceRate >= 75 ? 'text-green-600' : 'text-red-600'}>{student.attendanceRate.toFixed(0)}%</span> : 'N/A'}</TableCell>
                  <TableCell><Badge variant="outline">{student.riskScore.toFixed(1)}</Badge></TableCell>
                  <TableCell><Badge className={getRiskBgColor(student.riskLevel)}>{student.riskLevel === 'HIGH' ? 'Élevé' : student.riskLevel === 'MEDIUM' ? 'Moyen' : 'Faible'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Page
export default function Home() {
  const [activeTab, setActiveTab] = useState('student')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <img src="/navlogo.png" alt="EMSI Logo" className="h-10 w-auto object-contain" />
              </div>
              <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Academic Flow</h1>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Risk Detection System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex"><Activity className="h-3 w-3 mr-1" />Temps Réel</Badge>
              <Badge className="bg-green-500 hidden sm:flex">IA Active</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="student" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />Vue Étudiant</TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2"><Shield className="h-4 w-4" />Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="student"><StudentPanel /></TabsContent>
          <TabsContent value="admin"><AdminDashboard /></TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">EMSI © 2024 - Système Intelligent de Gestion Académique</p>
        </div>
      </footer>
    </div>
  )
}
