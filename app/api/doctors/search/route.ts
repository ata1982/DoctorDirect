import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { log, LogLevel } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const _location = searchParams.get('location')
    const _availability = searchParams.get('availability')

    // 検索条件を構築
    const where: Record<string, unknown> = {}
    
    if (specialty) {
      where.specialties = {
        has: specialty
      }
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      take: 20
    })

    // 平均評価を計算
    const doctorsWithRating = doctors.map((doctor) => {
      const ratings = doctor.reviews.map(review => review.rating)
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0

      return {
        id: doctor.id,
        name: doctor.user.name,
        email: doctor.user.email,
        image: doctor.user.image,
        specialties: doctor.specialties,
        experience: doctor.experience,
        education: doctor.education,
        certifications: doctor.certifications,
        consultationFee: doctor.consultationFee,
        availableHours: doctor.availableHours,
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: doctor.reviews.length,
        isVerified: doctor.isVerified,
        isAvailable: doctor.isAvailable,
        languages: doctor.languages,
        bio: doctor.bio
      }
    })

    return NextResponse.json({
      success: true,
      doctors: doctorsWithRating,
      total: doctorsWithRating.length
    })

  } catch (error) {
    log(LogLevel.ERROR, 'Failed to search doctors', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}