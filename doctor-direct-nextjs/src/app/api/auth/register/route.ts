import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations'
import { UserRole, RewardType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 入力バリデーション
    const validatedData = signUpSchema.parse(body)
    const { email, password, name, role } = validatedData

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12)

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        emailVerified: new Date(), // 本番環境では適切なメール認証を実装
      }
    })

    // 登録報酬の付与
    await prisma.userReward.create({
      data: {
        userId: user.id,
        type: RewardType.REGISTRATION,
        points: 100,
        description: '新規登録ボーナス'
      }
    })

    // パスワードを除外してレスポンス
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'ユーザー登録が完了しました',
      data: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    console.error('User registration error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: '入力データが無効です', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'ユーザー登録中にエラーが発生しました' },
      { status: 500 }
    )
  }
}