"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Helper function to delete cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear auth token cookie
    deleteCookie("auth-token")

    // Clear user data from localStorage
    localStorage.removeItem("user")

    // Optional: call backend logout endpoint to invalidate token on server
    // Uncomment if your backend has a logout endpoint that needs to be called
    /*
    fetch(`${process.env.BACKEND_URL || "http://localhost:3000"}/api/auth/logout`, {
      method: "POST",
    }).catch(console.error)
    */

    // Redirect to login page
    router.push('/auth/login');
  }, []);

  return null; // This page doesn't render anything, it just handles the redirect
}