"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  // 🔒 Lock body scroll ONLY for admin
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-muted/30">
      <AdminSidebar />

      {/* SINGLE scroll container */}
      <main className="h-full overflow-y-auto pt-14 lg:pt-0 lg:pl-64">
        {children}
      </main>

      <Toaster position="top-right" />
    </div>
  )
}
