import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const publicRoutes = ['/auth/login', '/auth/logout']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value
  const isAuth = !!token

  // Optional: validate token expiration and payload here
  // For now, we just check if token exists

  // Redirect to login if not authenticated and trying to access a protected page
  if (!isAuth && !isPublicRoute) {
     return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Optional: redirect to home if authenticated and trying to access login page
  if (isAuth && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled by route handlers themselves)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}