import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { log, LogLevel } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const whereClause: any = { userId: user.id }

    if (type) {
      whereClause.type = type
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const healthRecords = await prisma.healthRecord.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // 統計計算
    const stats = await calculateHealthStats(healthRecords)

    return NextResponse.json({
      success: true,
      records: healthRecords,
      stats,
      total: healthRecords.length
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to fetch health records', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, value, unit, notes } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const healthRecord = await prisma.healthRecord.create({
      data: {
        userId: user.id,
        type,
        title: `${type}記録`,
        description: notes,
        data: {
          value: parseFloat(value),
          unit: unit || '',
          notes: notes || ''
        },
        attachments: []
      }
    })

    // 健康アラートチェック
    const alerts = await checkHealthAlerts(user.id, type, parseFloat(value))

    return NextResponse.json({
      success: true,
      record: healthRecord,
      alerts
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to create health record', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function calculateHealthStats(records: any[]) {
  const stats: any = {}
  
  // 血圧統計
  const bloodPressureRecords = records.filter(r => r.type === 'BLOOD_PRESSURE')
  if (bloodPressureRecords.length > 0) {
    const values = bloodPressureRecords.map(r => r.value)
    stats.bloodPressure = {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      latest: values[0],
      trend: calculateTrend(values.slice(0, 7)) // 最新7日間のトレンド
    }
  }

  // 心拍数統計
  const heartRateRecords = records.filter(r => r.type === 'HEART_RATE')
  if (heartRateRecords.length > 0) {
    const values = heartRateRecords.map(r => r.value)
    stats.heartRate = {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      latest: values[0],
      trend: calculateTrend(values.slice(0, 7))
    }
  }

  // 体重統計
  const weightRecords = records.filter(r => r.type === 'WEIGHT')
  if (weightRecords.length > 0) {
    const values = weightRecords.map(r => r.value)
    stats.weight = {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      latest: values[0],
      trend: calculateTrend(values.slice(0, 30)) // 最新30日間のトレンド
    }
  }

  return stats
}

function calculateTrend(values: number[]) {
  if (values.length < 2) return 'stable'
  
  const recent = values.slice(0, Math.ceil(values.length / 2))
  const older = values.slice(Math.ceil(values.length / 2))
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100
  
  if (change > 5) return 'increasing'
  if (change < -5) return 'decreasing'
  return 'stable'
}

async function checkHealthAlerts(userId: string, type: string, value: number) {
  const alerts = []

  // 血圧アラート
  if (type === 'BLOOD_PRESSURE') {
    if (value > 140) {
      alerts.push({
        type: 'warning',
        message: '血圧が高めです。医師への相談をお勧めします。',
        urgency: 'medium'
      })
    }
    if (value > 180) {
      alerts.push({
        type: 'emergency',
        message: '血圧が非常に高いです。すぐに医療機関を受診してください。',
        urgency: 'high'
      })
    }
  }

  // 心拍数アラート
  if (type === 'HEART_RATE') {
    if (value > 100 || value < 60) {
      alerts.push({
        type: 'warning',
        message: '心拍数が正常範囲外です。体調に注意してください。',
        urgency: 'medium'
      })
    }
  }

  // 血糖値アラート
  if (type === 'BLOOD_SUGAR') {
    if (value > 200) {
      alerts.push({
        type: 'warning',
        message: '血糖値が高いです。食事や運動に注意してください。',
        urgency: 'medium'
      })
    }
  }

  return alerts
}