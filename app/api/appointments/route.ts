import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

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

    const appointments = await prisma.appointment.findMany({
      where: { patientId: user.id },
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
        assignedDoctor: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      appointments: appointments.map(appointment => ({
        id: appointment.id,
        type: appointment.type,
        status: appointment.status,
        scheduledAt: appointment.scheduledAt,
        duration: appointment.duration,
        notes: appointment.notes,
        symptoms: appointment.symptoms,
        doctor: appointment.doctor ? {
          name: appointment.doctor.user.name,
          image: appointment.doctor.user.image,
          specialties: appointment.doctor.specialties
        } : null,
        assignedDoctor: appointment.assignedDoctor ? {
          name: appointment.assignedDoctor.name,
          image: appointment.assignedDoctor.image
        } : null
      }))
    })

  } catch (error) {
    console.error('Appointments fetch error:', error)
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
    const { doctorId, hospitalId, type, scheduledAt, duration, reason } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: user.id,
        doctorId: doctorId || null,
        type,
        status: 'SCHEDULED',
        scheduledAt: new Date(scheduledAt),
        duration: duration || 30,
        symptoms: reason ? [reason] : [],
        notes: reason
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
        assignedDoctor: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        type: appointment.type,
        status: appointment.status,
        scheduledAt: appointment.scheduledAt,
        duration: appointment.duration,
        notes: appointment.notes,
        symptoms: appointment.symptoms,
        doctor: appointment.doctor ? {
          name: appointment.doctor.user.name,
          image: appointment.doctor.user.image,
          specialties: appointment.doctor.specialties
        } : null,
        assignedDoctor: appointment.assignedDoctor ? {
          name: appointment.assignedDoctor.name,
          image: appointment.assignedDoctor.image
        } : null
      }
    })

  } catch (error) {
    console.error('Appointment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}