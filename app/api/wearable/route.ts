import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { log, LogLevel } from '@/lib/utils'

// 型定義を簡素化
interface WearableDataInput {
  deviceType: string
  deviceId?: string
  dataType: string
  value: number
  unit: string
  metadata?: Record<string, unknown>
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const deviceType = searchParams.get('deviceType')
    const dataType = searchParams.get('dataType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const where: Record<string, unknown> = { userId: user.id }
    
    if (deviceType) {
      where.deviceType = deviceType
    }
    
    if (dataType) {
      where.dataType = dataType
    }
    
    if (startDate && endDate) {
      where.recordedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const wearableData = await prisma.wearableData.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 1000
    })

    return NextResponse.json({
      success: true,
      data: wearableData
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

    const body: WearableDataInput = await request.json()
    const { deviceType, deviceId, dataType, value, unit, metadata } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const wearableRecord = await prisma.wearableData.create({
      data: {
        userId: user.id,
        deviceType,
        deviceId: deviceId || null,
        dataType,
        value,
        unit,
        metadata: JSON.parse(JSON.stringify(metadata || {}))
      }
    })

    return NextResponse.json({
      success: true,
      record: wearableRecord
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to store wearable data', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}