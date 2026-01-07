import type { Metadata } from "next"
import { createPublicClient } from "@/lib/supabase/public"
import { PackagesPageClient } from "@/components/packages/packages-page-client"

export const metadata: Metadata = {
  title: "Himachal Tour Packages | TourToHimachal — Spiritual, Family, Adventure",
  description:
    "Browse curated Himachal tour packages: Chintpurni yatra, temple circuits, family trips, honeymoon tours, and adventure getaways. Custom itineraries on request.",
  openGraph: {
    title: "Himachal Tour Packages | TourToHimachal",
    description:
      "Handpicked packages with local expertise and honest pricing.",
    type: "website",
  },
}

export const revalidate = 0 // Always fetch fresh data

export default async function PackagesPage() {
  const supabase = createPublicClient()

  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching packages:", error)
  }

  return <PackagesPageClient packages={packages || []} />
}
