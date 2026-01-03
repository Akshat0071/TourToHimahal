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
    router.push("/admin/login")
    router.refresh()
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/admin/dashboard" className="flex flex-col items-center gap-1">
          <Logo size="md" href={null} forceColors />
          <span className="text-xs text-muted-foreground">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard">
            <Logo size="sm" href={null} forceColors />
          </Link>

          <button
            onClick={() => setIsMobileOpen((v) => !v)}
            className="p-2"
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ================= MOBILE SIDEBAR ================= */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-background border-r border-border flex flex-col"
      >
        <SidebarContent />
      </motion.aside>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-background border-r border-border flex-col z-40">
        <SidebarContent />
      </aside>
    </>
  )
}
