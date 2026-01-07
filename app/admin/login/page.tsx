"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setSigningIn } from "@/lib/supabase/client"
import { Logo } from "@/components/ui/logo"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const storageKey = `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0]}-auth-token`
        const stored = localStorage.getItem(storageKey)

        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed?.user?.id) {
            const { createClient } = await import("@/lib/supabase/client")
            setSigningIn(true)
            const supabase = createClient()
            if (supabase) {
              const { data: adminProfile } = await supabase
                .from("admin_profiles")
                .select("id")
                .eq("id", parsed.user.id)
                .single()

              setSigningIn(false)
              if (adminProfile) {
                router.replace("/admin/dashboard")
                return
              }
            }
            setSigningIn(false)
          }
        }
      } catch (err) {
        console.error("Session check error:", err)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkExistingSession()
  }, [router])

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam === "unauthorized") {
      setError("You do not have admin access. Please contact the administrator.")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      if (!supabase) {
        throw new Error("Could not initialize authentication. Please refresh and try again.")
      }

      setSigningIn(true)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setSigningIn(false)

      if (signInError) {
        throw signInError
      }

      if (!data.user || !data.session) {
        throw new Error("Login failed. Please try again.")
      }

      setSigningIn(true)
      const { data: adminProfile, error: profileError } = await supabase
        .from("admin_profiles")
        .select("id, role")
        .eq("id", data.user.id)
        .single()
      setSigningIn(false)

      if (profileError || !adminProfile) {
        await supabase.auth.signOut()
        throw new Error("You do not have admin access. Please contact the administrator.")
      }

      window.location.href = "/admin/dashboard"
    } catch (err) {
      setSigningIn(false)
      setError(err instanceof Error ? err.message : "An error occurred during login")
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-col items-center gap-3 pb-2 text-center">
            <Logo size="lg" href={null} />
            <CardTitle className="font-serif text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tourtohimachal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive bg-destructive/10 flex items-center gap-2 rounded-lg p-3 text-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="text-muted-foreground mt-6 text-center text-xs">
              Protected area. Unauthorized access is prohibited.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
