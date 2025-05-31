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
      prescriptions: prescriptions.map(prescription => ({
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
    const { medications, dosage, frequency, duration, instructions, doctorId, pharmacyId } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const prescription = await prisma.prescription.create({
      data: {
        userId: user.id,
        doctorId: doctorId || null,
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
      await Promise.all(medicationData.map((med: any) => 
        prisma.medication.create({
          data: {
            prescriptionId: prescription.id,
            name: med.name,
            dosage: dosage || med.dosage,
            frequency: frequency || med.frequency,
            duration: duration || med.duration,
            instructions: instructions || med.instructions,
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