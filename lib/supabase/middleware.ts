import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // Check if accessing admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      // Allow access to login page without auth
      if (request.nextUrl.pathname === "/admin/login") {
        // If user is already logged in and is admin, redirect to dashboard
        if (user && !userError) {
          try {
            const { data: adminProfile } = await supabase
              .from("admin_profiles")
              .select("id")
              .eq("id", user.id)
              .single()

            if (adminProfile) {
              const url = request.nextUrl.clone()
              url.pathname = "/admin/dashboard"
              return NextResponse.redirect(url)
            }
          } catch {
            // Ignore errors checking admin profile on login page
          }
        }
        return supabaseResponse
      }

      // For all other admin routes, require authentication
      if (!user || userError) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin/login"
        return NextResponse.redirect(url)
      }

      // Check if user is an admin
      try {
        const { data: adminProfile } = await supabase
          .from("admin_profiles")
          .select("id, role")
          .eq("id", user.id)
          .single()

        if (!adminProfile) {
          // User is logged in but not an admin
          const url = request.nextUrl.clone()
          url.pathname = "/admin/login"
          url.searchParams.set("error", "unauthorized")
          return NextResponse.redirect(url)
        }
      } catch {
        // If admin profile check fails, allow access (page will handle auth state)
        // This prevents blocking on transient network errors
      }
    }
  } catch (error) {
    // Handle fetch errors gracefully - don't block navigation on network issues
    console.error("Middleware auth error:", error)

    if (request.nextUrl.pathname === "/admin/login") {
      return supabaseResponse
    }
  }

  return supabaseResponse
}
