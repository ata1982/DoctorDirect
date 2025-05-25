import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { MessageType, ConsultationStatus } from '@prisma/client'

export interface SocketData {
  userId: string
  userName: string
  role: string
}

declare global {
  var io: SocketIOServer | undefined
}

export function initializeSocket(server: HTTPServer) {
  if (global.io) {
    return global.io
  }

  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/api/socket'
  })

  // 認証ミドルウェア
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }

      // JWTトークンの検証（NextAuth.jsセッション）
      const session = await auth()
      if (!session?.user) {
        return next(new Error('Authentication error'))
      }

      socket.data = {
        userId: session.user.id,
        userName: session.user.name || 'Unknown User',
        role: session.user.role
      } as SocketData

      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.userId)

    // 相談ルームに参加
    socket.on('join-consultation', async (data: { consultationId: string }) => {
      try {
        const { consultationId } = data
        
        // 相談の存在確認とアクセス権限チェック
        const consultation = await prisma.consultation.findFirst({
          where: {
            id: consultationId,
            OR: [
              { patientId: socket.data.userId },
              { doctorId: socket.data.userId }
            ]
          }
        })

        if (!consultation) {
          socket.emit('error', { message: '相談にアクセスする権限がありません' })
          return
        }

        socket.join(`consultation-${consultationId}`)
        socket.to(`consultation-${consultationId}`).emit('user-joined', {
          userId: socket.data.userId,
          userName: socket.data.userName
        })

        console.log(`User ${socket.data.userId} joined consultation ${consultationId}`)
      } catch (error) {
        console.error('Error joining consultation:', error)
        socket.emit('error', { message: '相談への参加に失敗しました' })
      }
    })

    // 相談ルームから退出
    socket.on('leave-consultation', (data: { consultationId: string }) => {
      const { consultationId } = data
      socket.leave(`consultation-${consultationId}`)
      socket.to(`consultation-${consultationId}`).emit('user-left', {
        userId: socket.data.userId,
        userName: socket.data.userName
      })
    })

    // メッセージ送信
    socket.on('send-message', async (data: {
      consultationId: string
      message: string
      messageType: MessageType
      fileUrl?: string
    }) => {
      try {
        const { consultationId, message, messageType, fileUrl } = data

        // 相談の存在確認とアクセス権限チェック
        const consultation = await prisma.consultation.findFirst({
          where: {
            id: consultationId,
            OR: [
              { patientId: socket.data.userId },
              { doctorId: socket.data.userId }
            ]
          }
        })

        if (!consultation) {
          socket.emit('error', { message: 'メッセージを送信する権限がありません' })
          return
        }

        // メッセージをデータベースに保存
        const chatMessage = await prisma.chatMessage.create({
          data: {
            consultationId,
            senderId: socket.data.userId,
            message,
            messageType,
            fileUrl
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

        // 相談ルームの全参加者にメッセージを送信
        io.to(`consultation-${consultationId}`).emit('message-received', chatMessage)

        console.log(`Message sent in consultation ${consultationId}`)
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'メッセージの送信に失敗しました' })
      }
    })

    // 相談開始
    socket.on('start-consultation', async (data: { consultationId: string }) => {
      try {
        const { consultationId } = data

        // 医師のみが相談を開始できる
        const consultation = await prisma.consultation.findFirst({
          where: {
            id: consultationId,
            doctorId: socket.data.userId
          }
        })

        if (!consultation) {
          socket.emit('error', { message: '相談を開始する権限がありません' })
          return
        }

        // 相談ステータスを更新
        await prisma.consultation.update({
          where: { id: consultationId },
          data: {
            status: ConsultationStatus.IN_PROGRESS,
            startedAt: new Date()
          }
        })

        io.to(`consultation-${consultationId}`).emit('consultation-started', {
          consultationId,
          startedAt: new Date()
        })

        console.log(`Consultation ${consultationId} started`)
      } catch (error) {
        console.error('Error starting consultation:', error)
        socket.emit('error', { message: '相談の開始に失敗しました' })
      }
    })

    // 相談終了
    socket.on('end-consultation', async (data: { consultationId: string }) => {
      try {
        const { consultationId } = data

        // 医師のみが相談を終了できる
        const consultation = await prisma.consultation.findFirst({
          where: {
            id: consultationId,
            doctorId: socket.data.userId
          }
        })

        if (!consultation) {
          socket.emit('error', { message: '相談を終了する権限がありません' })
          return
        }

        // 相談ステータスを更新
        await prisma.consultation.update({
          where: { id: consultationId },
          data: {
            status: ConsultationStatus.COMPLETED,
            endedAt: new Date()
          }
        })

        io.to(`consultation-${consultationId}`).emit('consultation-ended', {
          consultationId,
          endedAt: new Date()
        })

        console.log(`Consultation ${consultationId} ended`)
      } catch (error) {
        console.error('Error ending consultation:', error)
        socket.emit('error', { message: '相談の終了に失敗しました' })
      }
    })

    // タイピング状態の通知
    socket.on('typing-start', (data: { consultationId: string }) => {
      socket.to(`consultation-${data.consultationId}`).emit('typing-start', {
        userId: socket.data.userId,
        userName: socket.data.userName
      })
    })

    socket.on('typing-stop', (data: { consultationId: string }) => {
      socket.to(`consultation-${data.consultationId}`).emit('typing-stop', {
        userId: socket.data.userId
      })
    })

    // 接続解除時の処理
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId)
    })
  })

  global.io = io
  return io
}

export { global.io as io }