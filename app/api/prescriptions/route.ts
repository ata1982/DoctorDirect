import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { log, LogLevel } from '@/lib/utils'

// 型定義を追加
type PrescriptionWithRelations = {
  id: string
  diagnosis: string | null
  notes: string | null
  medications: Array<{
    id: string
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string | null
    sideEffects: string[]
  }>
  issueDate: Date
  expiryDate: Date | null
  status: string
  type: string
  doctor?: {
    user: {
      name: string | null
      image: string | null
    }
    specialties: string[]
  } | null
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { userId: user.id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        medications: true
      },
      orderBy: { issueDate: 'desc' }
    })

    return NextResponse.json({
      success: true,
      prescriptions: prescriptions.map((prescription: PrescriptionWithRelations) => ({
        id: prescription.id,
        diagnosis: prescription.diagnosis,
        notes: prescription.notes,
        medications: prescription.medications,
        issueDate: prescription.issueDate,
        expiryDate: prescription.expiryDate,
        status: prescription.status,
        type: prescription.type,
        doctor: prescription.doctor ? {
          name: prescription.doctor.user.name,
          image: prescription.doctor.user.image,
          specialties: prescription.doctor.specialties
        } : null
      }))
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to fetch prescriptions', { error: error instanceof Error ? error.message : String(error) })
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
      appointmentId, 
      medications, 
      instructions, 
      pharmacyId: _pharmacyId, 
      validUntil: _validUntil 
    } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const prescription = await prisma.prescription.create({
      data: {
        userId: user.id,
        doctorId: appointmentId || null,
        diagnosis: `処方箋 - ${new Date().toLocaleDateString()}`,
        notes: instructions,
        type: 'DIGITAL',
        status: 'ACTIVE',
        issueDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30日後
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        medications: true
      }
    })

    // 薬剤情報を別途作成
    if (medications) {
      const medicationData = JSON.parse(medications)
      await Promise.all(medicationData.map((med: { name: string; dosage: string; frequency: string; duration: string; instructions: string; sideEffects?: string[] }) => 
        prisma.medication.create({
          data: {
            prescriptionId: prescription.id,
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructions,
            sideEffects: med.sideEffects || []
          }
        })
      ))
    }

    return NextResponse.json({
      success: true,
      prescription: {
        id: prescription.id,
        diagnosis: prescription.diagnosis,
        notes: prescription.notes,
        medications: prescription.medications,
        issueDate: prescription.issueDate,
        expiryDate: prescription.expiryDate,
        status: prescription.status,
        type: prescription.type,
        doctor: prescription.doctor ? {
          name: prescription.doctor.user.name,
          image: prescription.doctor.user.image,
          specialties: prescription.doctor.specialties
        } : null
      }
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to create prescription', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}