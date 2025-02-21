"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Check if user is logged in and has an allowed email
      const isAuthorized = user && ["hmehmood121@gmail.com", "ernell_sextius@hotmail.com"].includes(user.email)

      setIsLoggedIn(isAuthorized)
      setIsLoading(false)

      // Redirect if not authorized
      if (!isAuthorized && pathname !== "/admin") {
        router.push("/admin")
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  // Show loading state
  if (isLoading) {
    return null
  }

  // If this is the login page, render it without the dashboard layout
  if (pathname === "/admin") {
    return children
  }

  // For all other admin routes, check authentication
  if (!isLoggedIn) {
    return null
  }

  // Render the authenticated layout
  return children
}

