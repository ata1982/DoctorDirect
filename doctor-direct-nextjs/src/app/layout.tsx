import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doctor Direct - オンライン医療相談プラットフォーム",
  description: "安全で信頼性の高いオンライン医療相談サービス。AI診断支援とリアルタイム相談機能を提供。",
  keywords: "医療相談, オンライン診療, AI診断, 病院検索, 医師予約",
  authors: [{ name: "Doctor Direct Team" }],
  openGraph: {
    title: "Doctor Direct - オンライン医療相談プラットフォーム",
    description: "安全で信頼性の高いオンライン医療相談サービス",
    type: "website",
    locale: "ja_JP",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <SessionProvider session={session}>
          <SocketProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster />
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
