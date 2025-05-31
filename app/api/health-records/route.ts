import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { log, LogLevel } from '@/lib/utils'

// 型定義を簡素化
interface HealthRecordData {
  type: string
  title: string
  description?: string
  data: Record<string, unknown>
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const where: Record<string, unknown> = { userId: user.id }
    
    if (type) {
      where.type = type
    }

    const healthRecords = await prisma.healthRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({
      success: true,
      records: healthRecords
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

    const body: HealthRecordData = await request.json()
    const { type, title, description, data } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // typeをRecordTypeに変換（デフォルトはOTHER）
    const recordType = type === 'MEDICAL_HISTORY' ? 'MEDICAL_HISTORY' :
                      type === 'LAB_RESULT' ? 'LAB_RESULT' :
                      type === 'IMAGING' ? 'IMAGING' :
                      type === 'PRESCRIPTION' ? 'PRESCRIPTION' :
                      type === 'VACCINATION' ? 'VACCINATION' :
                      type === 'ALLERGY' ? 'ALLERGY' :
                      type === 'CHRONIC_CONDITION' ? 'CHRONIC_CONDITION' :
                      type === 'SURGERY' ? 'SURGERY' : 'OTHER'

    const healthRecord = await prisma.healthRecord.create({
      data: {
        userId: user.id,
        type: recordType as any,
        title: title || 'Health Record',
        description: description || null,
        data: JSON.parse(JSON.stringify(data || {}))
      }
    })

    return NextResponse.json({
      success: true,
      record: healthRecord
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to create health record', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { recordId, data: updateData } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingRecord = await prisma.healthRecord.findFirst({
      where: {
        id: recordId,
        userId: user.id
      }
    })

    if (!existingRecord) {
      return NextResponse.json({ error: 'Health record not found' }, { status: 404 })
    }

    const updatedRecord = await prisma.healthRecord.update({
      where: { id: recordId },
      data: {
        data: { ...existingRecord.data as Record<string, unknown>, ...updateData },
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      record: updatedRecord
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to update health record', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}