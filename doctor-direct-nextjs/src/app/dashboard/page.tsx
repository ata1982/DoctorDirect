import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/dashboard/DashboardContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ダッシュボード - Doctor Direct',
  description: 'あなたの健康管理ダッシュボード',
}

// 動的サーバーサイドレンダリング（SSR）
export default async function DashboardPage() {
  // 認証チェック
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // ユーザーの役割に応じて動的データを取得
  const dashboardData = await getDashboardData(session.user.id!, session.user.role!)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ダッシュボード
          </h1>
          <p className="text-gray-600 mt-2">
            {session.user.role === 'DOCTOR' ? '医師用' : '患者用'}ダッシュボード
          </p>
        </header>

        <DashboardContent 
          user={session.user}
          data={dashboardData}
        />
      </div>
    </main>
  )
}

// 動的データ取得関数
async function getDashboardData(userId: string, role: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  if (role === 'DOCTOR') {
    // 医師用ダッシュボードデータ
    const doctor = await prisma.doctor.findFirst({
      where: { userId },
      include: {
        user: true,
        hospital: true
      }
    })

    if (!doctor) {
      throw new Error('医師プロフィールが見つかりません')
    }

    // 並行でデータを取得（パフォーマンス最適化）
    const [
      todayAppointments,
      thisWeekStats,
      activeConsultations,
      recentReviews,
      upcomingAppointments,
      monthlyEarnings
    ] = await Promise.all([
      // 今日の予約
      prisma.appointment.findMany({
        where: {
          doctorId: doctor.id,
          appointmentDate: {
            gte: new Date(now.setHours(0, 0, 0, 0)),
            lt: new Date(now.setHours(23, 59, 59, 999))
          }
        },
        include: {
          patient: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { appointmentDate: 'asc' }
      }),

      // 今週の統計
      prisma.appointment.aggregate({
        where: {
          doctorId: doctor.id,
          appointmentDate: { gte: startOfWeek },
          status: 'COMPLETED'
        },
        _count: { id: true }
      }),

      // アクティブな相談
      prisma.consultation.findMany({
        where: {
          doctorId: doctor.id,
          status: 'ACTIVE'
        },
        include: {
          patient: {
            select: { id: true, name: true }
          }
        }
      }),

      // 最近のレビュー
      prisma.review.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // 今後の予約
      prisma.appointment.findMany({
        where: {
          doctorId: doctor.id,
          appointmentDate: { gte: now },
          status: 'CONFIRMED'
        },
        include: {
          patient: {
            select: { id: true, name: true }
          }
        },
        orderBy: { appointmentDate: 'asc' },
        take: 10
      }),

      // 月間収益
      prisma.appointment.aggregate({
        where: {
          doctorId: doctor.id,
          appointmentDate: { gte: startOfMonth },
          status: 'COMPLETED'
        },
        _sum: { consultationFee: true },
        _count: { id: true }
      })
    ])

    return {
      type: 'doctor',
      profile: doctor,
      stats: {
        todayAppointments: todayAppointments.length,
        thisWeekCompleted: thisWeekStats._count.id,
        activeConsultations: activeConsultations.length,
        monthlyEarnings: monthlyEarnings._sum.consultationFee || 0,
        totalAppointments: monthlyEarnings._count.id,
        averageRating: recentReviews.length > 0 
          ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length 
          : 0
      },
      todayAppointments,
      activeConsultations,
      upcomingAppointments,
      recentReviews,
      lastUpdated: now.toISOString()
    }
  } else {
    // 患者用ダッシュボードデータ
    const [
      userProfile,
      upcomingAppointments,
      recentConsultations,
      healthInsights,
      recentAnalyses,
      notifications
    ] = await Promise.all([
      // ユーザープロフィール
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRewards: {
            orderBy: { earnedAt: 'desc' },
            take: 3
          }
        }
      }),

      // 今後の予約
      prisma.appointment.findMany({
        where: {
          patientId: userId,
          appointmentDate: { gte: now }
        },
        include: {
          doctor: {
            include: {
              user: { select: { name: true } },
              hospital: { select: { name: true } }
            }
          }
        },
        orderBy: { appointmentDate: 'asc' },
        take: 5
      }),

      // 最近の相談
      prisma.consultation.findMany({
        where: { patientId: userId },
        include: {
          doctor: {
            include: {
              user: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // 健康インサイト
      prisma.healthInsight.findFirst({
        where: {
          userId,
          validUntil: { gte: now },
          success: true
        },
        orderBy: { createdAt: 'desc' }
      }),

      // 最近のAI分析
      prisma.aiAnalysis.findMany({
        where: {
          userId,
          success: true
        },
        orderBy: { timestamp: 'desc' },
        take: 3
      }),

      // 未読通知
      prisma.notification.findMany({
        where: {
          userId,
          isRead: false
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    return {
      type: 'patient',
      profile: userProfile,
      stats: {
        upcomingAppointments: upcomingAppointments.length,
        recentConsultations: recentConsultations.length,
        unreadNotifications: notifications.length,
        healthInsightsAvailable: healthInsights ? 1 : 0,
        totalAnalyses: recentAnalyses.length
      },
      upcomingAppointments,
      recentConsultations,
      healthInsights,
      recentAnalyses,
      notifications,
      lastUpdated: now.toISOString()
    }
  }
}