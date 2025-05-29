import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '../components/AuthProvider'

export const metadata: Metadata = {
  title: 'Doctor Direct - AI診断と専門医相談で安心の医療サポート',
  description: '最新のAI技術と経験豊富な医師の専門知識を組み合わせ、24時間いつでも信頼できる医療アドバイスを提供します。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}