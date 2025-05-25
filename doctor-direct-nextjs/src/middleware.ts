import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // パブリックページ（認証不要）
  const publicPages = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/api/auth',
    '/doctors/search',
    '/hospitals/search',
    '/about',
    '/contact'
  ]

  // 管理者専用ページ
  const adminPages = [
    '/admin',
    '/admin/users',
    '/admin/doctors',
    '/admin/hospitals',
    '/admin/analytics'
  ]

  // 医師専用ページ
  const doctorPages = [
    '/doctor/dashboard',
    '/doctor/appointments',
    '/doctor/consultations',
    '/doctor/profile',
    '/doctor/schedule'
  ]

  // 患者専用ページ
  const patientPages = [
    '/patient/dashboard',
    '/patient/appointments',
    '/patient/medical-history'
  ]

  // APIルートの保護
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 管理者API保護
    if (pathname.startsWith('/api/admin') && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // 医師API保護
    if (pathname.startsWith('/api/doctor') && session.user.role !== 'DOCTOR') {
      return NextResponse.json(
        { error: 'Forbidden - Doctor access required' },
        { status: 403 }
      )
    }
  }

  // ページルートの保護
  const isPublicPage = publicPages.some(page => 
    pathname === page || pathname.startsWith(`${page}/`)
  )

  // 認証が必要なページで未認証の場合
  if (!isPublicPage && !session) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // 認証済みユーザーが認証ページにアクセスした場合
  if (session && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ロールベースアクセス制御
  if (session) {
    const userRole = session.user.role

    // 管理者ページアクセス制御
    if (adminPages.some(page => pathname.startsWith(page))) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // 医師ページアクセス制御
    if (doctorPages.some(page => pathname.startsWith(page))) {
      if (userRole !== 'DOCTOR') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // 患者ページアクセス制御
    if (patientPages.some(page => pathname.startsWith(page))) {
      if (userRole !== 'PATIENT') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  // レート制限の実装
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // API呼び出しに対するレート制限
  if (pathname.startsWith('/api/')) {
    const rateLimitKey = `rate_limit:${ip}:${pathname}`
    // 実際の実装ではRedisなどを使用してレート制限を実装
    // この例では基本的な構造のみ示します
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}