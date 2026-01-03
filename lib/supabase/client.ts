import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Module-level singleton
let browserClient: SupabaseClient | null = null
let isSigningIn = false

export function setSigningIn(value: boolean) {
  isSigningIn = value
}

export function createClient(): SupabaseClient {
  // Return existing client if already created
  if (browserClient) {
    return browserClient
  }

  browserClient = createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: "implicit",
      },
      global: {
        fetch: (url: RequestInfo | URL, options?: RequestInit) => {
          const urlStr = url.toString()

          // Allow all requests during sign-in
          if (isSigningIn) {
            return fetch(url, options)
          }

          // Block auth token refresh and user validation requests when not signing in
          if (urlStr.includes("/auth/v1/token") || urlStr.includes("/auth/v1/user")) {
            return Promise.resolve(
              new Response(JSON.stringify({ user: null, session: null }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }),
            )
          }

          return fetch(url, options)
        },
      },
    },
  )

  return browserClient
}

export function getSessionFromStorage(): { user: { email: string; id: string } | null } {
  if (typeof window === "undefined") {
    return { user: null }
  }

  try {
    const storageKey = `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0]}-auth-token`
    const stored = localStorage.getItem(storageKey)

    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.user) {
        return { user: { email: parsed.user.email, id: parsed.user.id } }
      }
    }
    return { user: null }
  } catch {
    return { user: null }
  }
}

export async function safeGetUser() {
  return getSessionFromStorage()
}

export async function safeSignOut() {
  if (typeof window === "undefined") return { error: null }

  try {
    const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0]
    const storageKey = `sb-${projectRef}-auth-token`

    // Allow auth calls during sign-out
    setSigningIn(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut({ scope: "local" })
    } catch {
      // Ignore network/auth errors; we'll still clear client storage/cookies below.
    } finally {
      setSigningIn(false)
    }

    // Remove localStorage session (if used)
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }

    // Clear Supabase auth cookies (used by middleware SSR session)
    // Supabase may chunk cookies: sb-<ref>-auth-token, sb-<ref>-auth-token.0, .1, etc.
    const cookiePrefix = `sb-${projectRef}-auth-token`
    const cookies = document.cookie.split(";").map((c) => c.trim())
    for (const cookie of cookies) {
      const [name] = cookie.split("=")
      if (!name) continue
      if (name === cookiePrefix || name.startsWith(`${cookiePrefix}.`)) {
        document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
      }
    }

    // Reset singleton so next createClient() gets fresh instance
    browserClient = null

    return { error: null }
  } catch {
    return { error: null }
  }
}

// Alias for backwards compatibility
export { createClient as createBrowserClient }
