import type { MetadataRoute } from "next"

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (configured) return configured.replace(/\/$/, "")

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`

  return "http://localhost:3000"
}

function hasSupabaseEnv(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/packages`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/taxi`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/diaries`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ]

  if (!hasSupabaseEnv()) {
    return staticEntries
  }

  // Import lazily to avoid crashing when env vars are missing (createPublicClient uses non-null assertions).
  const { createPublicClient } = await import("@/lib/supabase/public")
  const supabase = createPublicClient()

  const entries: MetadataRoute.Sitemap = [...staticEntries]

  try {
    const { data: blogs } = await supabase
      .from("blogs")
      .select("slug,published_at,updated_at")
      .eq("is_published", true)

    for (const post of blogs ?? []) {
      if (!post?.slug) continue
      entries.push({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at || now),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }
  } catch {
    // ignore
  }

  try {
    const { data: diaries } = await supabase
      .from("diaries")
      .select("slug,published_at,updated_at")
      .eq("is_published", true)

    for (const diary of diaries ?? []) {
      if (!diary?.slug) continue
      entries.push({
        url: `${siteUrl}/diaries/${diary.slug}`,
        lastModified: new Date(diary.updated_at || diary.published_at || now),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }
  } catch {
    // ignore
  }

  try {
    const { data: packages } = await supabase
      .from("packages")
      .select("slug,created_at,updated_at")
      .eq("is_active", true)

    for (const pkg of packages ?? []) {
      if (!pkg?.slug) continue
      entries.push({
        url: `${siteUrl}/packages/${pkg.slug}`,
        lastModified: new Date(pkg.updated_at || pkg.created_at || now),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    }
  } catch {
    // ignore
  }

  return entries
}
