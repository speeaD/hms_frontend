import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getSettingsData } from "@/lib/settings-data"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@hotelier.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const usersData = await getSettingsData()
        const user = usersData.users.find(
          user => user.email === credentials?.email
        )

        if (user) {
          // In a real app, you would compare hashed passwords
          // For now, we'll use a simple password check for demo
          // In production, use proper password hashing like bcrypt
          if (credentials?.password === "password123") { // Simple demo password
            return {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role,
              status: user.status,
              image: null // You could add user images later
            }
          }
        }

        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the role and other info to the token
      if (user) {
        token.role = user.role
        token.status = user.status
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like role and status
      if (session.user) {
        session.user.role = token.role
        session.user.status = token.status
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET, // Add this to your .env file
  session: {
    strategy: "jwt"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }