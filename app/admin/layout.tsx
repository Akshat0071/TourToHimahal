"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30">
      <AdminSidebar />

      <main className="min-h-[100dvh] pt-14 lg:pt-0 lg:pl-64">
        {children}
      </main>

      <Toaster position="top-right" />
    </div>
  )
}
