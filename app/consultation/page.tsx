'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageCircle,
  Send,
  FileText,
  Camera,
  Share
} from 'lucide-react'
import ModernHeader from '@/components/ModernHeader'
import ModernFooter from '@/components/ModernFooter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import io from 'socket.io-client'

export default function ConsultationPage() {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [consultationMode, setConsultationMode] = useState<'chat' | 'video' | 'phone'>('chat')
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [consultationId, setConsultationId] = useState<string>('')
  const [doctor, setDoctor] = useState<any>(null)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Socket.IO接続の初期化
    const newSocket = io('/api/socket')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Socket connected')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Socket disconnected')
    })

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('video-offer', async (data) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(data.offer)
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        newSocket.emit('video-answer', {
          consultationId: data.consultationId,
          answer,
          targetId: data.targetId
        })
      }
    })

    newSocket.on('video-answer', async (data) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(data.answer)
      }
    })

    newSocket.on('ice-candidate', async (data) => {
      if (peerConnection) {
        await peerConnection.addIceCandidate(data.candidate)
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [peerConnection])

  useEffect(() => {
    // 相談IDを生成または取得
    const id = new URLSearchParams(window.location.search).get('id') || generateConsultationId()
    setConsultationId(id)
    
    if (socket) {
      socket.emit('join-consultation', id)
    }
  }, [socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateConsultationId = () => {
    return Math.random().toString(36).substr(2, 9)
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !consultationId) return

    const messageData = {
      consultationId,
      message: newMessage,
      senderId: session?.user?.email || '',
      senderType: 'patient' as const,
      timestamp: new Date().toISOString()
    }

    socket.emit('send-message', messageData)
    setMessages(prev => [...prev, messageData])
    setNewMessage('')
  }

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      setIsVideoEnabled(true)
      setIsAudioEnabled(true)
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // WebRTC PeerConnection の設定
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice-candidate', {
            consultationId,
            candidate: event.candidate,
            targetId: doctor?.id
          })
        }
      }

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      if (socket) {
        socket.emit('video-offer', {
          consultationId,
          offer,
          targetId: doctor?.id
        })
      }

      setPeerConnection(pc)
      setConsultationMode('video')

    } catch (error) {
      console.error('Video call start error:', error)
    }
  }

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    
    if (peerConnection) {
      peerConnection.close()
      setPeerConnection(null)
    }

    setIsVideoEnabled(false)
    setIsAudioEnabled(false)
    setConsultationMode('chat')
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              オンライン相談
            </h1>
            <p className="text-gray-600">
              医師とリアルタイムで相談できます
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* メイン相談エリア */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                      {consultationMode === 'video' ? 'ビデオ通話' : 'チャット相談'}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="info">相談ID: {consultationId}</Badge>
                      {doctor && (
                        <Badge variant="verified">
                          {doctor.name} 先生
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {consultationMode === 'video' ? (
                    // ビデオ通話エリア
                    <div className="flex-1 relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg object-cover"
                      />
                      
                      {/* ビデオ通話コントロール */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                        <Button
                          onClick={toggleVideo}
                          variant={isVideoEnabled ? "secondary" : "destructive"}
                          size="sm"
                        >
                          {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={toggleAudio}
                          variant={isAudioEnabled ? "secondary" : "destructive"}
                          size="sm"
                        >
                          {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={endCall}
                          variant="destructive"
                          size="sm"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // チャットエリア
                    <>
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.senderType === 'patient' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.senderType === 'patient'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              <p>{message.message}</p>
                              <p className="text-xs opacity-75 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* メッセージ入力 */}
                      <div className="flex items-center space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="メッセージを入力..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              {/* 相談オプション */}
              <Card>
                <CardHeader>
                  <CardTitle>相談オプション</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setConsultationMode('chat')}
                    variant={consultationMode === 'chat' ? 'default' : 'outline'}
                    className="w-full justify-start"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    チャット相談
                  </Button>
                  <Button
                    onClick={startVideoCall}
                    variant={consultationMode === 'video' ? 'default' : 'outline'}
                    className="w-full justify-start"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    ビデオ通話
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    音声通話
                  </Button>
                </CardContent>
              </Card>

              {/* 追加機能 */}
              <Card>
                <CardHeader>
                  <CardTitle>追加機能</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    症状記録を共有
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="w-4 h-4 mr-2" />
                    画像を送信
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share className="w-4 h-4 mr-2" />
                    画面共有
                  </Button>
                </CardContent>
              </Card>

              {/* 緊急連絡 */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">緊急時</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 mb-3">
                    生命に関わる緊急事態の場合は、すぐに119番に電話してください。
                  </p>
                  <Button variant="emergency" className="w-full">
                    緊急通報 (119)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <ModernFooter />
    </div>
  )
}