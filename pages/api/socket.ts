import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth-options'
import { prisma } from '../../lib/prisma'
import { log, LogLevel } from '../../lib/utils'

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if ((res.socket as any)?.server?.io) {
    log(LogLevel.INFO, 'Socket server already running', {})
  } else {
    log(LogLevel.INFO, 'Socket server initializing', {})
    const httpServer: NetServer = (res.socket as any)?.server
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    })

    io.use(async (socket, next) => {
      try {
        const session = await getServerSession(authOptions)
        if (session && session.user) {
          (socket as any).userId = session.user.id || '';
          (socket as any).userRole = session.user.role || 'PATIENT';
          next()
        } else {
          next(new Error('Authentication error'))
        }
      } catch (error) {
        next(new Error('Authentication error'))
      }
    })

    io.on('connection', (socket) => {
      log(LogLevel.INFO, 'User connected to socket', { userId: (socket as any).userId })

      // Join user-specific room
      socket.join(`user:${(socket as any).userId}`)

      // Handle consultation room joining
      socket.on('join-consultation', (consultationId: string) => {
        socket.join(`consultation:${consultationId}`)
        log(LogLevel.INFO, 'User joined consultation room', { userId: (socket as any).userId, consultationId })
      })

      // Handle leaving consultation room
      socket.on('leave-consultation', (consultationId: string) => {
        socket.leave(`consultation:${consultationId}`)
        log(LogLevel.INFO, 'User left consultation room', { userId: (socket as any).userId, consultationId })
      })

      // Handle chat messages
      socket.on('send-message', async (data: {
        consultationId: string
        content: string
        attachments?: string[]
      }) => {
        try {
          // Save message to database
          const message = await prisma.message.create({
            data: {
              consultationId: data.consultationId,
              senderId: (socket as any).userId,
              senderType: (socket as any).userRole === 'DOCTOR' ? 'DOCTOR' : 'PATIENT',
              content: data.content,
              attachments: data.attachments || [],
            },
            include: {
              consultation: {
                include: {
                  patient: true,
                  doctor: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          })

          // Emit to consultation room
          io.to(`consultation:${data.consultationId}`).emit('new-message', {
            id: message.id,
            senderId: message.senderId,
            senderType: message.senderType,
            content: message.content,
            attachments: message.attachments,
            createdAt: message.createdAt,
          })

          // Send notification to the other party
          const targetUserId = (socket as any).userRole === 'DOCTOR' 
            ? message.consultation.patientId 
            : message.consultation.doctor.userId

          io.to(`user:${targetUserId}`).emit('notification', {
            type: 'MESSAGE_RECEIVED',
            title: 'New Message',
            message: `New message in consultation`,
            data: { consultationId: data.consultationId },
          })
        } catch (error) {
          log(LogLevel.ERROR, 'Failed to send message', { error: error instanceof Error ? error.message : String(error) })
          socket.emit('error', { message: 'Failed to send message' })
        }
      })

      // Handle typing indicators
      socket.on('typing', (data: { consultationId: string; isTyping: boolean }) => {
        socket.to(`consultation:${data.consultationId}`).emit('user-typing', {
          userId: (socket as any).userId,
          isTyping: data.isTyping,
        })
      })

      // Handle consultation status updates
      socket.on('consultation-status', (data: {
        consultationId: string
        status: string
      }) => {
        io.to(`consultation:${data.consultationId}`).emit('consultation-status-update', {
          consultationId: data.consultationId,
          status: data.status,
          updatedBy: (socket as any).userId,
        })
      })

      // Handle emergency alerts
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

      // Handle wearable data streaming
      socket.on('wearable-data', async (data: {
        deviceType: string
        deviceId?: string
        readings: Array<{
          dataType: string
          value: number
          unit: string
          recordedAt: string
        }>
      }) => {
        try {
          // Save wearable data
          const wearableData = await prisma.wearableData.createMany({
            data: data.readings.map(reading => ({
              userId: (socket as any).userId,
              deviceType: data.deviceType,
              deviceId: data.deviceId,
              dataType: reading.dataType,
              value: reading.value,
              unit: reading.unit,
              recordedAt: new Date(reading.recordedAt),
            })),
          })

          // Check for health alerts
          for (const reading of data.readings) {
            const shouldAlert = checkHealthThresholds(reading)
            if (shouldAlert) {
              // Send health alert
              io.to(`user:${(socket as any).userId}`).emit('health-alert', {
                type: 'THRESHOLD_EXCEEDED',
                dataType: reading.dataType,
                value: reading.value,
                unit: reading.unit,
                message: getHealthAlertMessage(reading),
              })

              // Save notification
              await prisma.notification.create({
                data: {
                  userId: (socket as any).userId,
                  type: 'HEALTH_ALERT',
                  title: 'Health Alert',
                  message: getHealthAlertMessage(reading),
                  data: reading,
                },
              })
            }
          }

          socket.emit('wearable-data-received', { count: data.readings.length })
        } catch (error) {
          log(LogLevel.ERROR, 'Failed to process wearable data', { error: error instanceof Error ? error.message : String(error) })
          socket.emit('error', { message: 'Failed to process wearable data' })
        }
      })

      // Handle video call signaling
      socket.on('call-offer', (data: {
        consultationId: string
        offer: RTCSessionDescriptionInit
      }) => {
        socket.to(`consultation:${data.consultationId}`).emit('call-offer', {
          offer: data.offer,
          callerId: (socket as any).userId,
        })
      })

      socket.on('call-answer', (data: {
        consultationId: string
        answer: RTCSessionDescriptionInit
      }) => {
        socket.to(`consultation:${data.consultationId}`).emit('call-answer', {
          answer: data.answer,
          answererId: (socket as any).userId,
        })
      })

      socket.on('ice-candidate', (data: {
        consultationId: string
        candidate: RTCIceCandidateInit
      }) => {
        socket.to(`consultation:${data.consultationId}`).emit('ice-candidate', {
          candidate: data.candidate,
          senderId: (socket as any).userId,
        })
      })

      socket.on('end-call', (data: { consultationId: string }) => {
        socket.to(`consultation:${data.consultationId}`).emit('call-ended', {
          endedBy: (socket as any).userId,
        })
      })

      socket.on('disconnect', () => {
        log(LogLevel.INFO, 'User disconnected from socket', { userId: (socket as any).userId })
      })
    })

    if ((res.socket as any)?.server) {
      (res.socket as any).server.io = io
    }
  }
  res.end()
}

// Helper functions
function checkHealthThresholds(reading: {
  dataType: string
  value: number
  unit: string
}): boolean {
  const thresholds = {
    heart_rate: { min: 60, max: 100 },
    blood_pressure_systolic: { min: 90, max: 140 },
    blood_pressure_diastolic: { min: 60, max: 90 },
    blood_sugar: { min: 70, max: 140 },
    temperature: { min: 36.1, max: 37.2 },
    oxygen_saturation: { min: 95, max: 100 },
  }

  const threshold = thresholds[reading.dataType as keyof typeof thresholds]
  if (!threshold) return false

  return reading.value < threshold.min || reading.value > threshold.max
}

function getHealthAlertMessage(reading: {
  dataType: string
  value: number
  unit: string
}): string {
  const messages = {
    heart_rate: `Heart rate ${reading.value} ${reading.unit} is outside normal range`,
    blood_pressure_systolic: `Systolic blood pressure ${reading.value} ${reading.unit} is concerning`,
    blood_pressure_diastolic: `Diastolic blood pressure ${reading.value} ${reading.unit} is concerning`,
    blood_sugar: `Blood sugar ${reading.value} ${reading.unit} is outside normal range`,
    temperature: `Body temperature ${reading.value} ${reading.unit} is abnormal`,
    oxygen_saturation: `Oxygen saturation ${reading.value} ${reading.unit} is low`,
  }

  return messages[reading.dataType as keyof typeof messages] || 
    `${reading.dataType} reading ${reading.value} ${reading.unit} requires attention`
}

export default SocketHandler