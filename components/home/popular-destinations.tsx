import { createPublicClient } from "@/lib/supabase/public"
import { PopularDestinationsClient } from "./popular-destinations-client"

export async function PopularDestinations() {
  const supabase = createPublicClient()

  const { data: packages, error } = await supabase
    .from("packages")
    .select(
      "id, title, slug, description, short_description, price, original_price, duration, category, region, images, is_active, is_featured",
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching packages:", error)
  }

  return <PopularDestinationsClient packages={packages || []} />
}
