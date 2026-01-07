import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentLeads } from "@/components/admin/recent-leads"
import { QuickActions } from "@/components/admin/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalLeadsResult,
    newTodayResult,
    packageLeadsResult,
    taxiLeadsResult,
    activePackagesResult,
    activeVehiclesResult,
    activeRoutesResult,
    activeBlogsResult,
    activeDiariesResult,
    recentLeadsResult,
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("service_type", "package"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("service_type", "taxi"),
    supabase.from("packages").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("is_available", true),
    supabase.from("taxi_routes").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("blogs").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("diaries").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
  ])

  const stats = {
    totalLeads: totalLeadsResult.count || 0,
    newToday: newTodayResult.count || 0,
    packageEnquiries: packageLeadsResult.count || 0,
    taxiEnquiries: taxiLeadsResult.count || 0,
    activePackages: activePackagesResult.count || 0,
    activeVehicles: activeVehiclesResult.count || 0,
    activeRoutes: activeRoutesResult.count || 0,
    activeBlogs: activeBlogsResult.count || 0,
    activeDiaries: activeDiariesResult.count || 0,
  }

  const recentLeads = recentLeadsResult.data || []

  return (
    <div>
      <AdminHeader title="Dashboard" description="Welcome back! Here's an overview of your business." />

      <div className="space-y-4 p-3 sm:space-y-6 sm:p-4 md:p-6">
        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {/* Recent Leads */}
          <div className="md:col-span-2">
            <RecentLeads leads={recentLeads} />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
