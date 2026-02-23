// EMSI Flow - Type Definitions

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  classId: string;
  class?: Class;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  department: string;
  year: number;
  students?: Student[];
  subjects?: Subject[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  coefficient: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  subject?: Subject;
  value: number;
  maxValue: number;
  type: 'exam' | 'quiz' | 'assignment' | 'project';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: 'policy' | 'academic' | 'resources' | 'deadlines' | 'general';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskAlert {
  id: string;
  studentId: string;
  student?: Student;
  riskScore: number;
  riskLevel: RiskLevel;
  factors: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskCalculation {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  recommendations: string[];
}

export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  description: string;
}

export interface ClassAnalytics {
  classId: string;
  className: string;
  classCode: string;
  totalStudents: number;
  averageRiskScore: number;
  stabilityPercentage: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageGrade: number;
  averageAttendance: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageStability: number;
  alertsToday: number;
  recentAlerts: RiskAlert[];
  classAnalytics: ClassAnalytics[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

export interface Citation {
  source: string;
  excerpt: string;
}

export interface RAGResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
}

export interface PlannerRecommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  reason: string;
  deadline?: string;
  resources?: string[];
}
