import { createPublicClient } from "@/lib/supabase/public"
import { TravelDiariesClient } from "./travel-diaries-client"

export async function TravelDiaries() {
  const supabase = createPublicClient()

  // Fetch both blogs and diaries
  const [{ data: blogs, error: blogsError }, { data: diaries, error: diariesError }] = await Promise.all([
    supabase
      .from("blogs")
      .select("id, title, slug, excerpt, cover_image, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("diaries")
      .select("id, title, slug, excerpt, cover_image, date")
      .eq("is_published", true)
      .order("date", { ascending: false })
      .limit(3),
  ])

  if (blogsError) {
    console.error("Error fetching blogs:", blogsError)
  }

  if (diariesError) {
    console.error("Error fetching diaries:", diariesError)
  }

  return <TravelDiariesClient blogs={blogs || []} diaries={diaries || []} />
}
