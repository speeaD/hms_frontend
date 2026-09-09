import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('Login API route: entered')

  try {
    // Get the request body (email and password)
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000'
    console.log('Login API route: Backend URL:', backendUrl)
    console.log('Login API route: Request payload:', { email, password: '[REDACTED]' })

    // Forward the request to the actual backend
    const backendResponse = await fetch(`${backendUrl}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add headers that might be needed for CORS or backend acceptance
        'Accept': 'application/json',
        'User-Agent': 'next-auth/1.0'
      },
      body: JSON.stringify({ email, password }),
    })

    console.log('Login API route: Backend response status:', backendResponse.status)

    // Get the response data from backend
    let data
    try {
      const responseText = await backendResponse.text()
      console.log('Login API route: Backend response text:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''))

      // Try to parse as JSON
      try {
        data = JSON.parse(responseText)
        console.log('Login API route: Parsed backend JSON data:', data)
      } catch (jsonError) {
        console.error('Login API route: Failed to parse JSON from backend:', jsonError)
        // If backend returns non-JSON (like HTML error page)
        return NextResponse.json(
          { error: `Backend returned invalid response (non-JSON): ${backendResponse.status}` },
          { status: 502 }
        )
      }
    } catch (textError) {
      console.error('Login API route: Failed to get response text from backend:', textError)
      return NextResponse.json(
        { error: `Failed to read response from backend` },
        { status: 502 }
      )
    }

    // If backend login failed, return the error
    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Login failed' },
        { status: backendResponse.status }
      )
    }

    // Create the response to send back to frontend
    const response = NextResponse.json({
      message: data.message || 'Login successful',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      staff: data.staff
    })

    // Set the auth-token cookie (httpOnly for security)
    if (data.accessToken) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
      }

      response.cookies.set('auth-token', data.accessToken, cookieOptions)
      console.log('Login API route: Set auth-token cookie')
    }

    return response
  } catch (error: any) {
    console.error('Login API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}