import type { Metadata } from "next"
import { createPublicClient } from "@/lib/supabase/public"
import { TaxiPageClient } from "@/components/taxi/taxi-page-client"

export const metadata: Metadata = {
  title: "Taxi Service | TourToHimachal — Reliable Cabs & Transparent Fares",
  description:
    "Book safe, reliable taxi service across Himachal Pradesh. Airport pickups, inter-city rides, sightseeing tours, and verified drivers with transparent pricing.",
  openGraph: {
    title: "Taxi Service | TourToHimachal",
    description:
      "Comfortable cabs, professional drivers, and no hidden charges for your Himachal journeys.",
    type: "website",
  },
}

export const revalidate = 0 // Always fetch fresh data

export default async function TaxiPage() {
  const supabase = createPublicClient()

  const [vehiclesResult, routesResult] = await Promise.all([
    supabase.from("vehicles").select("*").eq("is_available", true).order("capacity", { ascending: true }),
    supabase.from("taxi_routes").select("*").eq("is_active", true).order("base_fare", { ascending: true }),
  ])

  if (vehiclesResult.error) {
    console.error("Error fetching vehicles:", vehiclesResult.error)
  }
  if (routesResult.error) {
    console.error("Error fetching routes:", routesResult.error)
  }

  return <TaxiPageClient vehicles={vehiclesResult.data || []} routes={routesResult.data || []} />
}
