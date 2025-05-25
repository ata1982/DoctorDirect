import { z } from 'zod'
import { UserRole, AppointmentType, MessageType } from '@prisma/client'

// 認証スキーマ
export const signUpSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  name: z.string().min(2, '名前は2文字以上である必要があります'),
  role: z.nativeEnum(UserRole).default(UserRole.PATIENT)
})

export const signInSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください')
})

// 医師登録スキーマ
export const doctorRegistrationSchema = z.object({
  licenseNumber: z.string().min(5, '医師免許番号を入力してください'),
  specialization: z.array(z.string()).min(1, '専門分野を選択してください'),
  experience: z.number().min(0, '経験年数を入力してください'),
  education: z.string().min(10, '学歴を入力してください'),
  certifications: z.array(z.string()).optional(),
  consultationFee: z.number().min(1000, '診察料金を設定してください'),
  bio: z.string().optional(),
  languages: z.array(z.string()).min(1, '対応言語を選択してください'),
  hospitalId: z.string().optional()
})

// 予約スキーマ
export const appointmentSchema = z.object({
  doctorId: z.string().min(1, '医師を選択してください'),
  scheduledAt: z.string().datetime('有効な日時を選択してください'),
  type: z.nativeEnum(AppointmentType),
  symptoms: z.string().optional(),
  notes: z.string().optional()
})

// レビュースキーマ
export const reviewSchema = z.object({
  rating: z.number().min(1, '評価を選択してください').max(5, '評価は1-5の範囲で選択してください'),
  comment: z.string().max(500, 'コメントは500文字以内で入力してください').optional(),
  doctorId: z.string().optional(),
  hospitalId: z.string().optional()
}).refine(data => data.doctorId || data.hospitalId, {
  message: '医師または病院のいずれかを選択してください'
})

// チャットメッセージスキーマ
export const chatMessageSchema = z.object({
  consultationId: z.string().min(1, '相談IDが必要です'),
  message: z.string().min(1, 'メッセージを入力してください').max(1000, 'メッセージは1000文字以内で入力してください'),
  messageType: z.nativeEnum(MessageType).default(MessageType.TEXT),
  fileUrl: z.string().url().optional()
})

// 検索スキーマ
export const searchSchema = z.object({
  query: z.string().optional(),
  specialty: z.string().optional(),
  location: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  availability: z.string().datetime().optional(),
  language: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

// 病院登録スキーマ
export const hospitalSchema = z.object({
  name: z.string().min(2, '病院名を入力してください'),
  address: z.string().min(10, '住所を入力してください'),
  phone: z.string().regex(/^[\d\-\+\(\)\s]+$/, '有効な電話番号を入力してください'),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  departments: z.array(z.string()).min(1, '診療科を選択してください'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  operatingHours: z.object({
    monday: z.object({ open: z.string(), close: z.string() }).optional(),
    tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
    wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
    thursday: z.object({ open: z.string(), close: z.string() }).optional(),
    friday: z.object({ open: z.string(), close: z.string() }).optional(),
    saturday: z.object({ open: z.string(), close: z.string() }).optional(),
    sunday: z.object({ open: z.string(), close: z.string() }).optional()
  }).optional(),
  emergencyServices: z.boolean().default(false)
})

// エクスポート用の型推論
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type DoctorRegistrationInput = z.infer<typeof doctorRegistrationSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ChatMessageInput = z.infer<typeof chatMessageSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type HospitalInput = z.infer<typeof hospitalSchema>