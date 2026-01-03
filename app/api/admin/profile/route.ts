import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user?.id || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const fullName = typeof body?.full_name === "string" ? body.full_name : null
    const password = typeof body?.password === "string" ? body.password : null

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      }

      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ ok: true })
    }

    if (fullName === null) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // IMPORTANT: RLS in this project allows UPDATE (auth.uid() = id) but does NOT allow INSERT.
    // So we must not use upsert here; it will attempt INSERT when row is missing and fail with RLS.
    const { data: updated, error } = await supabase
      .from("admin_profiles")
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("id")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!updated || updated.length === 0) {
      // If this happens, the user doesn't have an admin_profiles row.
      // We intentionally do not INSERT here (would be a security risk + blocked by RLS).
      return NextResponse.json(
        { error: "Admin profile not found. Contact support to provision admin access." },
        { status: 403 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
