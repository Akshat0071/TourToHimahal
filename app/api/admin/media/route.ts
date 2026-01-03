import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

function inferMediaType(input: { resource_type?: string; format?: string; mime_type?: string }): "image" | "pdf" | "video" {
  const format = (input.format || "").toLowerCase()
  const resourceType = (input.resource_type || "").toLowerCase()
  const mimeType = (input.mime_type || "").toLowerCase()

  if (format === "pdf" || mimeType === "application/pdf") return "pdf"
  if (resourceType === "video") return "video"
  return "image"
}

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Ensure the session belongs to an admin.
  const { data: adminProfile } = await supabase.from("admin_profiles").select("id").eq("id", user.id).maybeSingle()
  if (!adminProfile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const url: string | undefined = body?.url
  const publicId: string | undefined = body?.public_id
  const folder: string = body?.folder || "general"
  const name: string | undefined = body?.name
  const altText: string | undefined = body?.alt_text
  const size: number | undefined = body?.size
  const format: string | undefined = body?.format
  const resourceType: string | undefined = body?.resource_type
  const mimeType: string | undefined = body?.mime_type

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  // De-dupe by public_id (preferred) and then by url.
  // Note: some DBs may not have the `public_id` column yet.
  if (publicId && typeof publicId === "string") {
    const existingByPublicId = await supabase.from("media").select("id,url,public_id").eq("public_id", publicId).maybeSingle()
    if (existingByPublicId.data) {
      return NextResponse.json({ media: existingByPublicId.data }, { status: 200 })
    }
    if (existingByPublicId.error?.code === "42703" || /public_id/i.test(existingByPublicId.error?.message || "")) {
      // Column missing; ignore public_id de-dupe.
    }
  }

  const { data: existingByUrl } = await supabase.from("media").select("id,url,public_id").eq("url", url).maybeSingle()
  if (existingByUrl) {
    return NextResponse.json({ media: existingByUrl }, { status: 200 })
  }

  const inferredType = inferMediaType({ resource_type: resourceType, format, mime_type: mimeType })

  const safeName =
    typeof name === "string" && name.trim().length > 0
      ? name.trim()
      : (() => {
          try {
            const pathname = new URL(url).pathname
            const last = pathname.split("/").pop() || "media"
            return last.replace(/\.[^/.]+$/, "")
          } catch {
            return "media"
          }
        })()

  const insertWithPublicId = await supabase
    .from("media")
    .insert({
      name: safeName,
      url,
      type: inferredType,
      size: typeof size === "number" ? size : undefined,
      folder,
      alt_text: typeof altText === "string" ? altText : undefined,
      public_id: typeof publicId === "string" ? publicId : undefined,
    })
    .select("id,url,public_id")
    .single()

  if (!insertWithPublicId.error) {
    return NextResponse.json({ media: insertWithPublicId.data }, { status: 201 })
  }

  // Fallback if `public_id` column doesn't exist.
  if (insertWithPublicId.error?.code === "42703" || /public_id/i.test(insertWithPublicId.error?.message || "")) {
    const insertWithoutPublicId = await supabase
      .from("media")
      .insert({
        name: safeName,
        url,
        type: inferredType,
        size: typeof size === "number" ? size : undefined,
        folder,
        alt_text: typeof altText === "string" ? altText : undefined,
      })
      .select("id,url")
      .single()

    if (insertWithoutPublicId.error) {
      return NextResponse.json({ error: insertWithoutPublicId.error.message }, { status: 400 })
    }

    return NextResponse.json({ media: insertWithoutPublicId.data }, { status: 201 })
  }

  return NextResponse.json({ error: insertWithPublicId.error.message }, { status: 400 })
}
