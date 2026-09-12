import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  // Get the auth-token cookie
  const token = request.cookies.get('auth-token')?.value

  // Get the pathname of the request (e.g. /, /about, /dashboard)
  const { pathname } = request.nextUrl

  // Define paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/logout', '/api/test']

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // If token exists, user is authenticated
  const isAuthenticated = !!token

  // Redirect to login if:
  // 1. Path is NOT public AND
  // 2. User is NOT authenticated
  if (!isPublicPath && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if:
  // 1. Path is login page AND
  // 2. User IS authenticated
  if (pathname.startsWith('/auth/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Otherwise, allow the request to continue
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
}