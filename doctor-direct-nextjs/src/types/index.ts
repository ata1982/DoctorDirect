import { UserRole, AppointmentType, AppointmentStatus, ConsultationStatus, MessageType, NotificationType, RewardType } from '@prisma/client'

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Doctor {
  id: string
  userId: string
  licenseNumber: string
  specialization: string[]
  experience: number
  education: string
  certifications: string[]
  consultationFee: number
  bio?: string | null
  languages: string[]
  isVerified: boolean
  rating: number
  totalReviews: number
  availableSlots?: any
  user: User
  hospital?: Hospital | null
}

export interface Hospital {
  id: string
  name: string
  address: string
  phone: string
  email?: string | null
  website?: string | null
  description?: string | null
  facilities: string[]
  departments: string[]
  rating: number
  totalReviews: number
  coordinates?: any
  operatingHours?: any
  emergencyServices: boolean
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  hospitalId?: string | null
  scheduledAt: Date
  duration: number
  type: AppointmentType
  status: AppointmentStatus
  symptoms?: string | null
  notes?: string | null
  prescription?: string | null
  diagnosis?: string | null
  fee?: number | null
  patient: User
  doctor: Doctor
  hospital?: Hospital | null
}

export interface Consultation {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  status: ConsultationStatus
  startedAt?: Date | null
  endedAt?: Date | null
  roomId?: string | null
  recording?: string | null
  summary?: string | null
  followUpNeeded: boolean
  appointment: Appointment
  patient: User
  doctor: Doctor
  chatMessages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  consultationId: string
  senderId: string
  content: string
  type: 'text' | 'file' | 'image'
  attachments?: FileAttachment[]
  timestamp: Date
  isRead: boolean
  sender: {
    id: string
    name: string
    image?: string
    role: UserRole
  }
}

export interface FileAttachment {
  originalName: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  uploadedBy: string
  uploadedAt: string
}

export interface Review {
  id: string
  patientId: string
  doctorId?: string | null
  hospitalId?: string | null
  rating: number
  comment?: string | null
  isVerified: boolean
  createdAt: Date
  patient: User
  doctor?: Doctor | null
  hospital?: Hospital | null
}

export interface Notification {
  id: string
  userId: string
  type: 'new_consultation' | 'new_message' | 'consultation_completed' | 'system'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  relatedId?: string // 関連する相談IDなど
}

export interface SearchFilters {
  specialty?: string
  location?: string
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  availability?: Date
  language?: string
}

export interface AIResponse {
  success: boolean
  data?: any
  message?: string
  error?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Form types
export interface SignUpForm {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface SignInForm {
  email: string
  password: string
}

export interface AppointmentForm {
  doctorId: string
  scheduledAt: string
  type: AppointmentType
  symptoms?: string
  notes?: string
}

export interface ReviewForm {
  rating: number
  comment?: string
  doctorId?: string
  hospitalId?: string
}

// WebSocket events
export interface SocketEvents {
  'join-consultation': { consultationId: string }
  'leave-consultation': { consultationId: string }
  'send-message': { consultationId: string; message: string; messageType: MessageType }
  'message-received': ChatMessage
  'consultation-started': { consultationId: string }
  'consultation-ended': { consultationId: string }
  'user-joined': { userId: string; userName: string }
  'user-left': { userId: string; userName: string }
  'typing-start': { userId: string }
  'typing-stop': { userId: string }
}

// AI分析関連の型
export interface AIAnalysis {
  id: string
  consultationId: string
  analysisType: 'SYMPTOMS' | 'CONVERSATION' | 'IMAGE'
  input: string
  result: string
  summary: string
  confidence: number
  createdAt: Date
}

export interface AIAnalysisResult {
  summary: string
  recommendations: string[]
  urgencyLevel: 'low' | 'medium' | 'high'
  possibleDiagnoses: string[]
  nextSteps: string[]
  warnings: string[]
  confidence: number
}

// Socket.IO関連の型
export interface SocketMessage {
  type: 'new_message' | 'user_typing' | 'user_stopped_typing' | 'consultation_updated'
  data: any
  consultationId?: string
  userId?: string
}

// 医師ダッシュボード関連の型
export interface DoctorStats {
  totalConsultations: number
  pendingConsultations: number
  completedConsultations: number
  averageRating: number
  totalRevenue: number
  monthlyGrowth: number
}