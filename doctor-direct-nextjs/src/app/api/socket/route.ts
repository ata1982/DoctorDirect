import { NextRequest, NextResponse } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Socket.IOサーバーのグローバル管理
declare global {
  var io: SocketIOServer | undefined
}

export async function GET(request: NextRequest) {
  if (!global.io) {
    // HTTPサーバーの作成とSocket.IOの初期化
    const httpServer = createServer()
    global.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      path: '/api/socket'
    })

    // 認証ミドルウェア
    global.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        if (!token) {
          return next(new Error('認証が必要です'))
        }

        // セッション検証は別途実装
        next()
      } catch (error) {
        next(new Error('認証エラー'))
      }
    })

    // 接続処理
    global.io.on('connection', (socket) => {
      console.log('クライアントが接続しました:', socket.id)

      // チャットルームに参加
      socket.on('join-consultation', async (consultationId: string) => {
        try {
          const consultation = await prisma.consultation.findUnique({
            where: { id: consultationId },
            include: { patient: true, doctor: true }
          })

          if (consultation) {
            socket.join(consultationId)
            socket.emit('joined-consultation', { consultationId })
            console.log(`Socket ${socket.id} joined consultation ${consultationId}`)
          }
        } catch (error) {
          console.error('相談ルーム参加エラー:', error)
          socket.emit('error', { message: '相談ルームに参加できませんでした' })
        }
      })

      // チャットメッセージの処理
      socket.on('send-message', async (data: {
        consultationId: string
        message: string
        senderId: string
        senderType: 'patient' | 'doctor'
      }) => {
        try {
          // メッセージをデータベースに保存
          const newMessage = await prisma.chatMessage.create({
            data: {
              consultationId: data.consultationId,
              message: data.message,
              senderId: data.senderId,
              senderType: data.senderType,
              timestamp: new Date()
            },
            include: {
              sender: true
            }
          })

          // ルームの全メンバーにメッセージを送信
          global.io?.to(data.consultationId).emit('new-message', newMessage)
          
          console.log('メッセージ送信完了:', newMessage.id)
        } catch (error) {
          console.error('メッセージ送信エラー:', error)
          socket.emit('error', { message: 'メッセージの送信に失敗しました' })
        }
      })

      // 通知の送信
      socket.on('send-notification', async (data: {
        userId: string
        title: string
        content: string
        type: string
      }) => {
        try {
          const notification = await prisma.notification.create({
            data: {
              userId: data.userId,
              title: data.title,
              content: data.content,
              type: data.type,
              isRead: false
            }
          })

          // ユーザー専用ルームに通知を送信
          global.io?.to(`user-${data.userId}`).emit('new-notification', notification)
        } catch (error) {
          console.error('通知送信エラー:', error)
        }
      })

      // ユーザールームに参加
      socket.on('join-user-room', (userId: string) => {
        socket.join(`user-${userId}`)
        console.log(`Socket ${socket.id} joined user room ${userId}`)
      })

      // 切断処理
      socket.on('disconnect', () => {
        console.log('クライアントが切断しました:', socket.id)
      })
    })

    // HTTPサーバーを起動
    const port = process.env.SOCKET_PORT || 3001
    httpServer.listen(port, () => {
      console.log(`Socket.IOサーバーがポート${port}で起動しました`)
    })
  }

  return NextResponse.json({ status: 'Socket.IO server running' })
}

export async function POST(request: NextRequest) {
  // WebSocketの健全性チェック
  if (global.io) {
    const connectedClients = global.io.sockets.sockets.size
    return NextResponse.json({ 
      status: 'active',
      connectedClients,
      message: 'Socket.IOサーバーは正常に動作しています'
    })
  }

  return NextResponse.json({ 
    status: 'inactive',
    message: 'Socket.IOサーバーが初期化されていません'
  }, { status: 503 })
}