"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Package,
  Car,
  FileText,
  BookOpen,
  ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { safeSignOut } from "@/lib/supabase/client"
import { Logo } from "@/components/ui/logo"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/taxi", label: "Taxi", icon: Car },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/diaries", label: "Travel Diaries", icon: BookOpen },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  const handleLogout = async () => {
    if (!mounted) return
    await safeSignOut()
    window.location.href = "/admin/login"
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="border-border border-b">
        <Link href="/admin/dashboard" className="flex flex-col items-center">
          <Logo size="lg" href={null} />
          <span className="text-muted-foreground text-xs">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-border border-t p-4">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-destructive w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="bg-background border-border fixed top-0 right-0 left-0 z-50 border-b px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard">
            <Logo size="sm" href={null} />
          </Link>

          <button onClick={() => setIsMobileOpen((v) => !v)} className="p-2" aria-label="Toggle Menu">
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ================= MOBILE SIDEBAR ================= */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="bg-background border-border fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r lg:hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="bg-background border-border fixed top-0 bottom-0 left-0 z-40 hidden w-64 flex-col border-r lg:flex">
        <SidebarContent />
      </aside>
    </>
  )
}
