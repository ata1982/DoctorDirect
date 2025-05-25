import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// チャットメッセージ送信
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { consultationId, content, type = 'text', attachments } = await request.json()

    // 相談の権限チェック
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        OR: [
          { patientId: session.user.id },
          { 
            doctor: {
              userId: session.user.id
            }
          }
        ]
      }
    })

    if (!consultation) {
      return NextResponse.json({ error: '相談が見つかりません' }, { status: 404 })
    }

    // メッセージを作成
    const message = await prisma.chatMessage.create({
      data: {
        consultationId,
        senderId: session.user.id!,
        content,
        type,
        attachments: attachments ? JSON.stringify(attachments) : null,
        timestamp: new Date(),
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true
          }
        }
      }
    })

    // 相談の最終更新時刻を更新
    await prisma.consultation.update({
      where: { id: consultationId },
      data: { 
        updatedAt: new Date(),
        lastMessageAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: message
    })

  } catch (error) {
    console.error('メッセージ送信エラー:', error)
    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました' },
      { status: 500 }
    )
  }
}

// チャットメッセージ取得
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const consultationId = searchParams.get('consultationId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!consultationId) {
      return NextResponse.json({ error: '相談IDが必要です' }, { status: 400 })
    }

    // 相談の権限チェック
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        OR: [
          { patientId: session.user.id },
          { 
            doctor: {
              userId: session.user.id
            }
          }
        ]
      }
    })

    if (!consultation) {
      return NextResponse.json({ error: '相談が見つかりません' }, { status: 404 })
    }

    // メッセージを取得
    const messages = await prisma.chatMessage.findMany({
      where: { consultationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // 未読メッセージを既読にマーク
    await prisma.chatMessage.updateMany({
      where: {
        consultationId,
        senderId: { not: session.user.id },
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({
      success: true,
      data: messages.reverse(), // 時系列順に並び替え
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit
      }
    })

  } catch (error) {
    console.error('メッセージ取得エラー:', error)
    return NextResponse.json(
      { error: 'メッセージの取得に失敗しました' },
      { status: 500 }
    )
  }
}