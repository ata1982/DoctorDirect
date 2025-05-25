import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import ChatInterface from '@/components/consultations/ChatInterface'
import type { Metadata } from 'next'

interface ConsultationChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ConsultationChatPageProps): Promise<Metadata> {
  return {
    title: 'オンライン相談 - Doctor Direct',
    description: 'リアルタイム医師相談チャット',
  }
}

export default async function ConsultationChatPage({ params }: ConsultationChatPageProps) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // 相談データを取得
  const consultation = await getConsultationData(params.id, session.user.id!, session.user.role!)

  if (!consultation) {
    notFound()
  }

  return (
    <main className="h-screen bg-gray-50 flex flex-col">
      <ChatInterface 
        consultation={consultation}
        currentUser={session.user}
      />
    </main>
  )
}

// 相談データ取得（リアルタイム対応）
async function getConsultationData(consultationId: string, userId: string, userRole: string) {
  const where: any = { id: consultationId }

  // ユーザーの役割に応じて権限チェック
  if (userRole === 'DOCTOR') {
    const doctor = await prisma.doctor.findFirst({
      where: { userId }
    })
    if (doctor) {
      where.doctorId = doctor.id
    } else {
      return null
    }
  } else {
    where.patientId = userId
  }

  const consultation = await prisma.consultation.findFirst({
    where,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          age: true,
          gender: true
        }
      },
      doctor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          hospital: {
            select: {
              name: true,
              address: true
            }
          }
        }
      },
      chatMessages: {
        orderBy: {
          timestamp: 'asc'
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true
            }
          }
        }
      }
    }
  })

  if (!consultation) {
    return null
  }

  // AI事前分析をパース
  let preAnalysis = null
  if (consultation.preAnalysis) {
    try {
      preAnalysis = JSON.parse(consultation.preAnalysis)
    } catch (error) {
      console.error('AI事前分析パースエラー:', error)
    }
  }

  return {
    ...consultation,
    preAnalysis,
    duration: consultation.endedAt 
      ? Math.round((consultation.endedAt.getTime() - (consultation.startedAt?.getTime() || consultation.createdAt.getTime())) / 60000)
      : null
  }
}