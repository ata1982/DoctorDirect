import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// ファイルアップロード処理
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const consultationId = formData.get('consultationId') as string

    if (!file || !consultationId) {
      return NextResponse.json({ error: 'ファイルと相談IDが必要です' }, { status: 400 })
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

    // ファイルサイズ制限（10MB）
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'ファイルサイズが大きすぎます（最大10MB）' }, { status: 400 })
    }

    // 許可されるファイル形式
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '許可されていないファイル形式です' }, { status: 400 })
    }

    // ファイル名を生成
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'chat')
    const filePath = join(uploadDir, fileName)

    // アップロードディレクトリを作成
    await mkdir(uploadDir, { recursive: true })

    // ファイルを保存
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // ファイル情報を作成
    const fileInfo = {
      originalName: file.name,
      fileName,
      filePath: `/uploads/chat/${fileName}`,
      fileSize: file.size,
      mimeType: file.type,
      uploadedBy: session.user.id,
      uploadedAt: new Date().toISOString()
    }

    // チャットメッセージとして保存
    const message = await prisma.chatMessage.create({
      data: {
        consultationId,
        senderId: session.user.id!,
        content: `ファイルをアップロードしました: ${file.name}`,
        type: 'file',
        attachments: JSON.stringify([fileInfo]),
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
      data: {
        ...message,
        attachments: [fileInfo]
      }
    })

  } catch (error) {
    console.error('ファイルアップロードエラー:', error)
    return NextResponse.json(
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    )
  }
}