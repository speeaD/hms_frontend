"use client"

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut().then(() => {
      // Redirect to login page after sign out
      router.push('/auth/login');
    });
  }, []);

  return null; // This page doesn't render anything, it just handles the redirect
}