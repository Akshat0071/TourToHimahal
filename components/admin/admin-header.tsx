"use client"

import { useEffect, useId, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, Search, User } from "lucide-react"
import { safeGetUser, safeSignOut } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminHeaderProps {
  title: string
  description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const menuTriggerId = useId()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const getUser = async () => {
      const { user } = await safeGetUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUser()
  }, [isClient])

  const handleLogout = async () => {
    await safeSignOut()
    window.location.href = "/admin/login"
  }

  return (
    <header className="bg-background border-border border-b px-6 py-4" suppressHydrationWarning>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-serif text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>

        <div className="flex items-center gap-4" suppressHydrationWarning>
          {/* Search */}
          <div className="relative hidden md:flex">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search..." className="w-64 pl-9" />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full" />
          </Button>

          {/* User Menu */}
          {isClient && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button id={menuTriggerId} variant="ghost" size="icon" className="rounded-full">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <User className="text-primary h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-muted-foreground text-xs font-normal">Signed in as</p>
                  <p className="truncate">{userEmail || "Admin"}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">Site Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
