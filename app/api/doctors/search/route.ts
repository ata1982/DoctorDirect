import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { log, LogLevel } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const location = searchParams.get('location')
    const availability = searchParams.get('availability')
    const rating = searchParams.get('rating')
    const language = searchParams.get('language')

    const whereClause: any = {
      isVerified: true,
      AND: []
    }

    if (specialty) {
      whereClause.AND.push({
        specialties: {
          has: specialty
        }
      })
    }

    if (rating) {
      whereClause.AND.push({
        rating: {
          gte: parseFloat(rating)
        }
      })
    }

    if (language) {
      whereClause.AND.push({
        languages: {
          has: language
        }
      })
    }

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        },
        consultations: {
          where: {
            status: 'COMPLETED'
          },
          select: {
            id: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { totalReviews: 'desc' }
      ],
      take: 20
    })

    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.user.name,
      image: doctor.user.image,
      specialties: doctor.specialties,
      experience: doctor.experience,
      rating: doctor.rating,
      reviewCount: doctor.totalReviews,
      consultationFee: doctor.consultationFee,
      languages: doctor.languages,
      bio: doctor.bio,
      totalConsultations: doctor.consultations.length,
      availableHours: doctor.availableHours,
      isVerified: doctor.isVerified
    }))

    return NextResponse.json({
      success: true,
      doctors: formattedDoctors,
      total: formattedDoctors.length
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to search doctors', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}