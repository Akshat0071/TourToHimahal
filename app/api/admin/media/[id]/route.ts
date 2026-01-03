import { NextResponse } from "next/server"
import { createHash } from "crypto"
import { createClient } from "@/lib/supabase/server"
import { extractPublicId } from "@/lib/cloudinary"

export const runtime = "nodejs"

type CloudinaryResourceType = "image" | "raw" | "video"

function sha1(input: string) {
  return createHash("sha1").update(input).digest("hex")
}

async function cloudinaryDestroy(args: {
  publicId: string
  resourceType: CloudinaryResourceType
}): Promise<{ ok: boolean; result?: string; error?: string }>
{
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return {
      ok: false,
      error:
        "Cloudinary admin credentials are missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
    }
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const paramsToSign: Record<string, string> = {
    invalidate: "true",
    public_id: args.publicId,
    timestamp: String(timestamp),
  }

  const signatureBase = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&")

  const signature = sha1(signatureBase + apiSecret)

  const body = new URLSearchParams({
    ...paramsToSign,
    api_key: apiKey,
    signature,
  })

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${args.resourceType}/destroy`

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    return { ok: false, error: data?.error?.message || `Cloudinary destroy failed (${res.status})` }
  }

  return { ok: true, result: data?.result }
}

async function removeUrlFromArrayColumn(args: {
  supabase: Awaited<ReturnType<typeof createClient>>
  table: "blogs" | "diaries" | "packages"
  column: string
  url: string
}): Promise<number> {
  const { supabase, table, column, url } = args

  const { data: rows, error } = await supabase.from(table).select(`id,${column}`).contains(column, [url])

  if (error || !rows) return 0

  let updated = 0
  for (const row of rows as any[]) {
    const arr: string[] = Array.isArray(row[column]) ? row[column] : []
    const next = arr.filter((x) => x !== url)
    if (next.length === arr.length) continue

    const { error: updateError } = await supabase.from(table).update({ [column]: next }).eq("id", row.id)
    if (!updateError) updated += 1
  }

  return updated
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

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

  // `public_id` may not exist yet in some DBs. Try selecting it; fallback if column missing.
  let media:
    | {
        id: string
        url: string
        type: string
        public_id?: string | null
      }
    | null = null

  const withPublicId = await supabase.from("media").select("id,url,public_id,type").eq("id", id).single()
  if (withPublicId.data) {
    media = withPublicId.data as any
  } else if (withPublicId.error?.code === "42703" || /public_id/i.test(withPublicId.error?.message || "")) {
    const withoutPublicId = await supabase.from("media").select("id,url,type").eq("id", id).single()
    if (withoutPublicId.data) {
      media = { ...(withoutPublicId.data as any), public_id: null }
    } else {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }
  } else {
    return NextResponse.json({ error: "Media not found" }, { status: 404 })
  }

  const url = media.url
  const publicId = media.public_id || extractPublicId(url)

  // 1) Delete from Cloudinary first.
  if (publicId) {
    const preferredTypes: CloudinaryResourceType[] =
      media.type === "pdf" ? ["raw", "image"] : media.type === "video" ? ["video"] : ["image", "raw"]

    let lastResult: { ok: boolean; result?: string; error?: string } | null = null
    for (const resourceType of preferredTypes) {
      lastResult = await cloudinaryDestroy({ publicId, resourceType })

      if (!lastResult.ok) {
        return NextResponse.json({ error: lastResult.error || "Cloudinary delete failed" }, { status: 500 })
      }

      // Cloudinary returns: "ok" | "not found" | "already deleted" (varies)
      if (lastResult.result && lastResult.result !== "not found") {
        break
      }
    }
    // If it was "not found" for all attempts, treat as success.
  }

  // 2) Remove references across known DB columns.
  const [{ count: vehiclesCount }, { count: blogsCoverCount }, { count: diariesCoverCount }, { count: diariesAvatarCount }] =
    await Promise.all([
      supabase.from("vehicles").update({ image_url: null }).eq("image_url", url).select("id", { count: "exact", head: true }),
      supabase.from("blogs").update({ cover_image: null }).eq("cover_image", url).select("id", { count: "exact", head: true }),
      supabase.from("diaries").update({ cover_image: null }).eq("cover_image", url).select("id", { count: "exact", head: true }),
      supabase.from("diaries").update({ author_avatar: null }).eq("author_avatar", url).select("id", { count: "exact", head: true }),
    ])

  const [blogsGalleryUpdated, diariesGalleryUpdated, packagesImagesUpdated] = await Promise.all([
    removeUrlFromArrayColumn({ supabase, table: "blogs", column: "gallery", url }),
    removeUrlFromArrayColumn({ supabase, table: "diaries", column: "gallery", url }),
    removeUrlFromArrayColumn({ supabase, table: "packages", column: "images", url }),
  ])

  // 3) Delete media row.
  const { error: deleteError } = await supabase.from("media").delete().eq("id", id)
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    removed: {
      vehicles_image_url: vehiclesCount || 0,
      blogs_cover_image: blogsCoverCount || 0,
      blogs_gallery_rows: blogsGalleryUpdated,
      diaries_cover_image: diariesCoverCount || 0,
      diaries_author_avatar: diariesAvatarCount || 0,
      diaries_gallery_rows: diariesGalleryUpdated,
      packages_images_rows: packagesImagesUpdated,
    },
  })
}
