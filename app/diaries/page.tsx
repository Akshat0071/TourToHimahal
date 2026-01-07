import type { Metadata } from "next"
import { createPublicClient } from "@/lib/supabase/public"
import { DiariesPageClient } from "@/components/diaries/diaries-page-client"

export const metadata: Metadata = {
  title: "Travel Diaries | TourToHimachal — Real Trips & Experiences",
  description:
    "Browse real travel diaries from Himachal: itineraries, photos, and tips from recent journeys.",
  openGraph: {
    title: "Travel Diaries | TourToHimachal",
    description:
      "Authentic travel experiences to help you plan better.",
    type: "website",
  },
}

export const revalidate = 0 // Always fetch fresh data

export default async function DiariesPage() {
  const supabase = createPublicClient()

  const { data: diaries, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching diaries:", error)
  }

  return <DiariesPageClient diaries={diaries || []} />
}
