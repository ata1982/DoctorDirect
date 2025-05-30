import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import AIChatBot from '@/components/AIChatBot'

export const metadata: Metadata = {
  title: 'Doctor Direct - 24時間医療相談プラットフォーム',
  description: 'AI診断、オンライン相談、医師検索を提供する総合医療プラットフォーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <AIChatBot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}