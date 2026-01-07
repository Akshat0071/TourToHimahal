import type { Metadata } from "next"
import { createPublicClient } from "@/lib/supabase/public"
import { BlogPageClient } from "@/components/blog/blog-page-client"

export const metadata: Metadata = {
  title: "Himachal Travel Blog | TourToHimachal — Tips, Guides & Stories",
  description:
    "Read travel tips, temple guides, road trip advice, and real stories from across Himachal Pradesh.",
  openGraph: {
    title: "Himachal Travel Blog | TourToHimachal",
    description:
      "Practical advice and inspiration for your next Himachal journey.",
    type: "website",
  },
}

export const revalidate = 0 // Always fetch fresh data

export default async function BlogPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    console.error(
      "Supabase environment variables missing: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
    return <BlogPageClient blogs={[]} categories={[]} />
  }

  const supabase = createPublicClient()

  let blogs: any[] = []
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching blogs:", error?.message ?? JSON.stringify(error))
    } else {
      blogs = data ?? []
    }
  } catch (err: any) {
    console.error("Unexpected blogs fetch error:", err?.message ?? err)
  }

  // Extract unique categories from blogs
  const categories = [...new Set(blogs.map((blog) => blog.category).filter(Boolean))]

  return <BlogPageClient blogs={blogs} categories={categories} />
}
