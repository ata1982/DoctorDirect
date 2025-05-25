'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { SocketEvents } from '@/types'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinConsultation: (consultationId: string) => void
  leaveConsultation: (consultationId: string) => void
  sendMessage: (consultationId: string, message: string, messageType?: string) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinConsultation: () => {},
  leaveConsultation: () => {},
  sendMessage: () => {},
})

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    // Socket.ioクライアント初期化
    const newSocket = io({
      path: '/api/socket',
      auth: {
        token: session.user.id // 実際の実装ではJWTトークンを使用
      }
    })

    newSocket.on('connect', () => {
      console.log('Socket connected')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [session])

  const joinConsultation = (consultationId: string) => {
    if (socket) {
      socket.emit('join-consultation', { consultationId })
    }
  }

  const leaveConsultation = (consultationId: string) => {
    if (socket) {
      socket.emit('leave-consultation', { consultationId })
    }
  }

  const sendMessage = (consultationId: string, message: string, messageType = 'TEXT') => {
    if (socket) {
      socket.emit('send-message', {
        consultationId,
        message,
        messageType
      })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConsultation,
        leaveConsultation,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}