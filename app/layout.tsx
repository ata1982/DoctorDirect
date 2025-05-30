import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import AIChatBot from '@/components/AIChatBot'
import Analytics from '@/components/Analytics'
import PerformanceMonitor from '@/components/PerformanceMonitor'

export const metadata: Metadata = {
  title: {
    default: 'Doctor Direct - 24時間医療相談プラットフォーム',
    template: '%s | Doctor Direct'
  },
  description: 'AI診断、オンライン相談、医師検索を提供する総合医療プラットフォーム。24時間365日、認定医師による安心の医療サポートを受けられます。',
  keywords: ['医療相談', 'AI診断', 'オンライン診療', '医師検索', '健康管理', 'テレメディシン'],
  authors: [{ name: 'Doctor Direct' }],
  creator: 'Doctor Direct',
  publisher: 'Doctor Direct',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://doctor-direct-delta.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Doctor Direct - 24時間医療相談プラットフォーム',
    description: 'AI診断、オンライン相談、医師検索を提供する総合医療プラットフォーム',
    url: 'https://doctor-direct-delta.vercel.app',
    siteName: 'Doctor Direct',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Doctor Direct - 医療相談プラットフォーム',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doctor Direct - 24時間医療相談プラットフォーム',
    description: 'AI診断、オンライン相談、医師検索を提供する総合医療プラットフォーム',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <AIChatBot />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <PerformanceMonitor />
      </body>
    </html>
  )
}