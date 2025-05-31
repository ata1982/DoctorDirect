import { NextRequest, NextResponse } from 'next/server'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth-options'
import { prisma } from '../../lib/prisma'
import { log, LogLevel } from '../../lib/utils'

// 型定義を追加
interface SocketData {
  userId: string
  userType: 'patient' | 'doctor'
  sessionId?: string
}

interface VideoCallData {
  roomId: string
  offer?: RTCSessionDescriptionInit
  answer?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidateInit
}

interface ChatMessage {
  senderId: string
  receiverId: string
  message: string
  timestamp: string
  type: 'text' | 'image' | 'file'
}

interface WearableDataMessage {
  userId: string
  deviceId: string
  data: Record<string, unknown>
  timestamp: string
}

let io: Server

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextRequest, res: NextResponse) {
  if (!io) {
    const httpServer = createServer()
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    io.on('connection', (socket) => {
      log(LogLevel.INFO, 'User connected to socket', { userId: (socket as any).userId })

      // ユーザー登録
      socket.on('register', async (data: SocketData) => {
        try {
          const session = await getServerSession(authOptions)
          if (session && session.user) {
            (socket as any).userId = session.user.id || '';
            (socket as any).userRole = session.user.role || 'PATIENT';

            socket.data = data
            socket.join(`user:${data.userId}`)
            
            if (data.userType === 'doctor') {
              socket.join('doctors')
            }
            
            log(LogLevel.INFO, `ユーザー登録: ${data.userId} (${data.userType})`, {})
          } else {
            log(LogLevel.WARN, 'Authentication error', {})
            socket.emit('error', { message: 'Authentication error' })
          }
        } catch (error) {
          log(LogLevel.ERROR, 'Registration error', { error: error instanceof Error ? error.message : String(error) })
          socket.emit('error', { message: 'Registration error' })
        }
      })

      // エラーハンドリング
      socket.on('error', (_error: Error) => {
        log(LogLevel.ERROR, 'Socket error', { error: _error instanceof Error ? _error.message : String(_error) })
      })

      // ビデオ通話関連
      socket.on('join-video-call', (data: VideoCallData) => {
        const { roomId } = data
        socket.join(roomId)
        socket.to(roomId).emit('user-joined', socket.id)
      })

      socket.on('video-offer', (data: VideoCallData) => {
        socket.to(data.roomId).emit('video-offer', data)
      })

      socket.on('video-answer', (data: VideoCallData) => {
        socket.to(data.roomId).emit('video-answer', data)
      })

      socket.on('ice-candidate', (data: VideoCallData) => {
        socket.to(data.roomId).emit('ice-candidate', data)
      })

      socket.on('leave-video-call', (roomId: string) => {
        socket.leave(roomId)
        socket.to(roomId).emit('user-left', socket.id)
      })

      // チャット機能
      socket.on('send-message', (data: ChatMessage) => {
        const { receiverId, senderId, message, timestamp, type } = data
        
        // 受信者にメッセージを送信
        io.to(`user:${receiverId}`).emit('receive-message', {
          senderId,
          message,
          timestamp,
          type
        })
      })

      // 緊急通報機能
      socket.on('emergency-alert', async (data: {
        location?: { lat: number; lng: number }
        symptoms: string[]
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      }) => {
        try {
          // Broadcast to all online doctors
          socket.broadcast.emit('emergency-alert', {
            patientId: (socket as any).userId,
            location: data.location,
            symptoms: data.symptoms,
            severity: data.severity,
            timestamp: new Date(),
          })

          // Save emergency record
          await prisma.notification.create({
            data: {
              userId: (socket as any).userId,
              type: 'EMERGENCY_ALERT',
              title: 'Emergency Alert Sent',
              message: `Emergency alert sent with severity: ${data.severity}`,
              data: data,
            },
          })

          socket.emit('emergency-alert-sent', { success: true })
        } catch (error) {
          log(LogLevel.ERROR, 'Failed to handle emergency alert', { error: error instanceof Error ? error.message : String(error) })
          socket.emit('error', { message: 'Failed to send emergency alert' })
        }
      })

      // 予約通知
      socket.on('appointment-request', (data: { doctorId: string; patientId: string; appointmentData: Record<string, unknown> }) => {
        const { doctorId, patientId, appointmentData } = data
        
        io.to(`user:${doctorId}`).emit('appointment-request', {
          patientId,
          appointmentData,
          timestamp: new Date().toISOString()
        })
      })

      socket.on('appointment-response', (data: { patientId: string; doctorId: string; status: string; appointmentId: string }) => {
        const { patientId, doctorId, status, appointmentId } = data
        
        io.to(`user:${patientId}`).emit('appointment-response', {
          doctorId,
          status,
          appointmentId,
          timestamp: new Date().toISOString()
        })
      })

      // 健康データ共有
      socket.on('share-health-data', (data: { doctorId: string; patientId: string; healthData: Record<string, unknown> }) => {
        const { doctorId, patientId, healthData } = data
        
        io.to(`user:${doctorId}`).emit('health-data-shared', {
          patientId,
          healthData,
          timestamp: new Date().toISOString()
        })
      })

      // 医師の診断結果共有
      socket.on('diagnosis-update', (data: { patientId: string; doctorId: string; diagnosis: Record<string, unknown> }) => {
        const { patientId, doctorId, diagnosis } = data
        
        io.to(`user:${patientId}`).emit('diagnosis-update', {
          doctorId,
          diagnosis,
          timestamp: new Date().toISOString()
        })
      })

      // 処方箋通知
      socket.on('prescription-issued', (data: { patientId: string; doctorId: string; prescription: Record<string, unknown> }) => {
        const { patientId, doctorId, prescription } = data
        
        io.to(`user:${patientId}`).emit('prescription-issued', {
          doctorId,
          prescription,
          timestamp: new Date().toISOString()
        })
      })

      // ウェアラブルデバイスからのリアルタイムデータ
      socket.on('wearable-data', (data: WearableDataMessage) => {
        const { userId, deviceId, data: wearableData, timestamp } = data
        
        // 患者の担当医師に通知（緊急時のみ）
        const heartRate = wearableData.heartRate as number
        if (heartRate > 120 || heartRate < 50) {
          // 緊急時は医師に通知
          socket.to('doctors').emit('patient-alert', {
            patientId: userId,
            deviceId,
            alertType: 'abnormal_heart_rate',
            data: wearableData,
            timestamp
          })
        }
      })

      // 薬局への処方箋送信
      socket.on('send-to-pharmacy', (data: { pharmacyId: string; patientId: string; prescription: Record<string, unknown> }) => {
        const { pharmacyId, patientId, prescription } = data
        
        io.to(`pharmacy:${pharmacyId}`).emit('prescription-received', {
          patientId,
          prescription,
          timestamp: new Date().toISOString()
        })
      })

      // レビュー・評価通知
      socket.on('review-submitted', (data: { doctorId: string; patientId: string; review: Record<string, unknown> }) => {
        const { doctorId, patientId, review } = data
        
        io.to(`user:${doctorId}`).emit('review-received', {
          patientId,
          review,
          timestamp: new Date().toISOString()
        })
      })

      // 切断処理
      socket.on('disconnect', () => {
        log(LogLevel.INFO, 'User disconnected from socket', { userId: (socket as any).userId })
      })
    })
  }

  return new Response('Socket.IO server initialized', { status: 200 })
}