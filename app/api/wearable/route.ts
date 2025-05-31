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
    const deviceType = searchParams.get('deviceType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const whereClause: any = { userId: user.id }

    if (deviceType) {
      whereClause.deviceType = deviceType
    }

    if (startDate && endDate) {
      whereClause.recordedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const wearableData = await prisma.wearableData.findMany({
      where: whereClause,
      orderBy: { recordedAt: 'desc' },
      take: 1000
    })

    // データ統計の計算
    const stats = calculateWearableStats(wearableData)

    return NextResponse.json({
      success: true,
      data: wearableData,
      stats,
      total: wearableData.length
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to fetch wearable data', { error: error instanceof Error ? error.message : String(error) })
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
    const { 
      deviceType, 
      deviceId, 
      dataType, 
      value, 
      unit, 
      metadata 
    } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // バッチデータの場合は複数作成
    if (Array.isArray(body.data)) {
      const wearableData = await prisma.wearableData.createMany({
        data: body.data.map((item: any) => ({
          userId: user.id,
          deviceType: item.deviceType,
          deviceId: item.deviceId,
          dataType: item.dataType,
          value: parseFloat(item.value),
          unit: item.unit,
          metadata: item.metadata || {},
          recordedAt: new Date(item.recordedAt || new Date())
        }))
      })

      return NextResponse.json({
        success: true,
        message: `${wearableData.count}件のデータを同期しました`
      })
    }

    // 単一データの場合
    const wearableDataRecord = await prisma.wearableData.create({
      data: {
        userId: user.id,
        deviceType,
        deviceId,
        dataType,
        value: parseFloat(value),
        unit,
        metadata: metadata || {},
        recordedAt: new Date()
      }
    })

    // 健康アラートのチェック
    const alerts = await checkWearableAlerts(user.id, dataType, parseFloat(value))

    return NextResponse.json({
      success: true,
      data: wearableDataRecord,
      alerts
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to create wearable data', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateWearableStats(data: any[]) {
  const stats: any = {}

  // 心拍数統計
  const heartRateData = data.filter(d => d.dataType === 'heart_rate')
  if (heartRateData.length > 0) {
    const values = heartRateData.map(d => d.value)
    stats.heartRate = {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: values[0],
      count: values.length
    }
  }

  // 歩数統計
  const stepData = data.filter(d => d.dataType === 'steps')
  if (stepData.length > 0) {
    const values = stepData.map(d => d.value)
    stats.steps = {
      total: values.reduce((a, b) => a + b, 0),
      average: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      latest: values[0],
      count: values.length
    }
  }

  // 睡眠統計
  const sleepData = data.filter(d => d.dataType === 'sleep_duration')
  if (sleepData.length > 0) {
    const values = sleepData.map(d => d.value)
    stats.sleep = {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      total: values.reduce((a, b) => a + b, 0),
      latest: values[0],
      count: values.length
    }
  }

  // カロリー統計
  const calorieData = data.filter(d => d.dataType === 'calories_burned')
  if (calorieData.length > 0) {
    const values = calorieData.map(d => d.value)
    stats.calories = {
      total: values.reduce((a, b) => a + b, 0),
      average: values.reduce((a, b) => a + b, 0) / values.length,
      latest: values[0],
      count: values.length
    }
  }

  return stats
}

async function checkWearableAlerts(userId: string, dataType: string, value: number) {
  const alerts = []

  switch (dataType) {
    case 'heart_rate':
      if (value > 120) {
        alerts.push({
          type: 'warning',
          message: '心拍数が高めです。激しい運動後でない場合は、休息を取ってください。',
          urgency: 'medium',
          value,
          threshold: 120
        })
      }
      if (value > 150) {
        alerts.push({
          type: 'emergency',
          message: '心拍数が非常に高いです。体調に異常を感じる場合は医療機関に相談してください。',
          urgency: 'high',
          value,
          threshold: 150
        })
      }
      if (value < 50) {
        alerts.push({
          type: 'warning',
          message: '心拍数が低めです。体調に問題がないか確認してください。',
          urgency: 'medium',
          value,
          threshold: 50
        })
      }
      break

    case 'blood_pressure_systolic':
      if (value > 140) {
        alerts.push({
          type: 'warning',
          message: '収縮期血圧が高めです。医師に相談することをお勧めします。',
          urgency: 'medium',
          value,
          threshold: 140
        })
      }
      break

    case 'blood_sugar':
      if (value > 200) {
        alerts.push({
          type: 'warning',
          message: '血糖値が高めです。食事や運動に注意し、医師に相談してください。',
          urgency: 'medium',
          value,
          threshold: 200
        })
      }
      break

    case 'sleep_duration':
      if (value < 6) {
        alerts.push({
          type: 'info',
          message: '睡眠時間が短めです。十分な休息を心がけてください。',
          urgency: 'low',
          value,
          threshold: 6
        })
      }
      break
  }

  return alerts
}