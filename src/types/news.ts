// EMSI Flow - Updated Types for News
export interface NewsItem {
  id: string
  title: string
  content: string
  type: 'exam' | 'deadline' | 'announcement' | 'event' | 'alert' | 'general'
  priority: 'urgent' | 'high' | 'normal' | 'low'
  targetAudience: 'all' | 'class' | 'students'
  targetClassIds?: string[]
  targetStudentIds?: string[]
  eventDate?: string
  expiresAt?: string
  isPublished: boolean
  authorName?: string
  createdAt: string
  updatedAt: string
}

export interface StudentNews {
  studentName: string
  className: string
  news: Array<{
    id: string
    title: string
    content: string
    type: string
    priority: string
    eventDate?: string
    authorName?: string
    createdAt: string
    isUrgent: boolean
    isEvent: boolean
  }>
  totalCount: number
}

export interface Class {
  id: string
  name: string
  code: string
}
