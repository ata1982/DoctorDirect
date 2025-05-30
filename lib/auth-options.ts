import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { NextAuthOptions } from 'next-auth'
import { getEnvVar, log, LogLevel, AppError } from '@/lib/utils'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id
          log(LogLevel.INFO, 'JWT token created', { userId: user.id })
        }
        return token
      } catch (error) {
        log(LogLevel.ERROR, 'JWT callback failed', { error: error instanceof Error ? error.message : String(error) })
        throw new AppError('Authentication failed', 500)
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string
          log(LogLevel.DEBUG, 'Session created', { userId: token.id })
        }
        return session
      } catch (error) {
        log(LogLevel.ERROR, 'Session callback failed', { error: error instanceof Error ? error.message : String(error) })
        throw new AppError('Session creation failed', 500)
      }
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  secret: getEnvVar('NEXTAUTH_SECRET'),
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn({ user }) {
      log(LogLevel.INFO, 'User signed in', { userId: user.id, email: user.email })
    },
    async signOut({ token }) {
      log(LogLevel.INFO, 'User signed out', { userId: token?.id })
    },
  },
}