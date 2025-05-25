import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // クエリパラメータの取得と変換
    const query = searchParams.get('query') || undefined
    const specialty = searchParams.get('specialty') || undefined
    const location = searchParams.get('location') || undefined
    const priceMin = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined
    const priceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined
    const language = searchParams.get('language') || undefined
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10

    // バリデーション
    const validatedParams = searchSchema.parse({
      query,
      specialty,
      location,
      priceMin,
      priceMax,
      rating,
      language,
      page,
      limit
    })

    // 検索条件の構築
    const whereConditions: any = {
      isVerified: true,
      user: {
        isActive: true
      }
    }

    // テキスト検索
    if (query) {
      whereConditions.OR = [
        { user: { name: { contains: query, mode: 'insensitive' } } },
        { specialization: { hasSome: [query] } },
        { bio: { contains: query, mode: 'insensitive' } },
        { education: { contains: query, mode: 'insensitive' } }
      ]
    }

    // 専門分野フィルター
    if (specialty) {
      whereConditions.specialization = { hasSome: [specialty] }
    }

    // 料金フィルター
    if (priceMin !== undefined || priceMax !== undefined) {
      whereConditions.consultationFee = {}
      if (priceMin !== undefined) {
        whereConditions.consultationFee.gte = priceMin
      }
      if (priceMax !== undefined) {
        whereConditions.consultationFee.lte = priceMax
      }
    }

    // 評価フィルター
    if (rating) {
      whereConditions.rating = { gte: rating }
    }

    // 言語フィルター
    if (language) {
      whereConditions.languages = { hasSome: [language] }
    }

    // 場所フィルター（病院の住所から検索）
    if (location) {
      whereConditions.hospital = {
        address: { contains: location, mode: 'insensitive' }
      }
    }

    // ページネーション計算
    const skip = (page - 1) * limit

    // 医師検索実行
    const [doctors, totalCount] = await Promise.all([
      prisma.doctor.findMany({
        where: whereConditions,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true
            }
          },
          hospital: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true
            }
          },
          _count: {
            select: {
              appointments: true,
              reviews: true
            }
          }
        },
        orderBy: [
          { rating: 'desc' },
          { totalReviews: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.doctor.count({ where: whereConditions })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages
      }
    })

  } catch (error) {
    console.error('Doctor search error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: '検索パラメータが無効です', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '医師検索中にエラーが発生しました' },
      { status: 500 }
    )
  }
}