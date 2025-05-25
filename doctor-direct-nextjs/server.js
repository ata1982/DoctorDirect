import { Server } from 'socket.io'
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Socket.IOサーバーの設定
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  // Socket.IO接続管理
  const activeUsers = new Map()
  const consultationRooms = new Map()

  io.on('connection', (socket) => {
    console.log('新しいクライアントが接続されました:', socket.id)

    // ユーザー認証とセッション管理
    socket.on('authenticate', (data) => {
      const { userId, userName, role } = data
      activeUsers.set(socket.id, { userId, userName, role, socketId: socket.id })
      socket.userId = userId
      socket.userName = userName
      socket.userRole = role
      
      console.log(`ユーザー認証完了: ${userName} (${role})`)
    })

    // 相談ルームへの参加
    socket.on('join-consultation', (data) => {
      const { consultationId } = data
      socket.join(consultationId)
      
      if (!consultationRooms.has(consultationId)) {
        consultationRooms.set(consultationId, new Set())
      }
      consultationRooms.get(consultationId).add(socket.id)

      // 他の参加者に通知
      socket.to(consultationId).emit('user-joined', {
        userId: socket.userId,
        userName: socket.userName,
        role: socket.userRole
      })

      console.log(`${socket.userName}が相談${consultationId}に参加しました`)
    })

    // 相談ルームからの退出
    socket.on('leave-consultation', (data) => {
      const { consultationId } = data
      socket.leave(consultationId)
      
      if (consultationRooms.has(consultationId)) {
        consultationRooms.get(consultationId).delete(socket.id)
        if (consultationRooms.get(consultationId).size === 0) {
          consultationRooms.delete(consultationId)
        }
      }

      // 他の参加者に通知
      socket.to(consultationId).emit('user-left', {
        userId: socket.userId,
        userName: socket.userName
      })

      console.log(`${socket.userName}が相談${consultationId}から退出しました`)
    })

    // メッセージの送信
    socket.on('send-message', async (data) => {
      const { consultationId, message, messageType = 'text', attachments } = data
      
      const messageData = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        consultationId,
        senderId: socket.userId,
        content: message,
        type: messageType,
        attachments: attachments || [],
        timestamp: new Date(),
        isRead: false,
        sender: {
          id: socket.userId,
          name: socket.userName,
          role: socket.userRole
        }
      }

      // 相談ルームの全参加者にメッセージを送信
      io.to(consultationId).emit('message-received', messageData)
      
      console.log(`メッセージ送信: ${socket.userName} -> 相談${consultationId}`)
    })

    // タイピング状態の管理
    socket.on('typing-start', (data) => {
      const { consultationId } = data
      socket.to(consultationId).emit('user-typing', {
        userId: socket.userId,
        userName: socket.userName
      })
    })

    socket.on('typing-stop', (data) => {
      const { consultationId } = data
      socket.to(consultationId).emit('user-stopped-typing', {
        userId: socket.userId,
        userName: socket.userName
      })
    })

    // 相談ステータスの更新
    socket.on('consultation-status-update', (data) => {
      const { consultationId, status } = data
      io.to(consultationId).emit('consultation-updated', {
        consultationId,
        status,
        updatedBy: socket.userId
      })
    })

    // 接続切断時の処理
    socket.on('disconnect', () => {
      console.log('クライアントが切断されました:', socket.id)
      
      // アクティブユーザーから削除
      activeUsers.delete(socket.id)
      
      // 相談ルームから削除
      for (const [consultationId, participants] of consultationRooms) {
        if (participants.has(socket.id)) {
          participants.delete(socket.id)
          socket.to(consultationId).emit('user-left', {
            userId: socket.userId,
            userName: socket.userName
          })
          
          if (participants.size === 0) {
            consultationRooms.delete(consultationId)
          }
        }
      }
    })

    // エラーハンドリング
    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })

  // アクティブな相談とユーザーの状態を取得するAPI
  server.on('request', (req, res) => {
    if (req.url === '/api/socket/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        activeUsers: activeUsers.size,
        activeConsultations: consultationRooms.size,
        consultationDetails: Array.from(consultationRooms.entries()).map(([id, participants]) => ({
          consultationId: id,
          participantCount: participants.size
        }))
      }))
      return
    }
  })

  server.listen(port, (err?: any) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log('> Socket.IOサーバーが起動しました')
  })
})