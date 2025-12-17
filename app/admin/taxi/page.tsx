import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { VehiclesSection } from "@/components/admin/vehicles-section"
import { RoutesSection } from "@/components/admin/routes-section"

export default async function TaxiPage() {
  const supabase = await createClient()

  const [vehiclesResult, routesResult] = await Promise.all([
    supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
    supabase.from("taxi_routes").select("*").order("created_at", { ascending: false }),
  ])

  return (
    <div>
      <AdminHeader title="Taxi Management" description="Manage vehicles and routes" />

      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
        <VehiclesSection vehicles={vehiclesResult.data || []} />
        <RoutesSection routes={routesResult.data || []} />
      </div>
    </div>
  )
}
