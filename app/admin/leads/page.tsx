import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { LeadsTable } from "@/components/admin/leads-table"
import { LeadsFilters } from "@/components/admin/leads-filters"

interface LeadsPageProps {
  searchParams: Promise<{
    status?: string
    type?: string
    page?: string
  }>
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status)
  }

  if (params.type && params.type !== "all") {
    query = query.eq("service_type", params.type)
  }

  const { data: leads, error } = await query

  if (error) {
    console.error("Error fetching leads:", error)
  }

  return (
    <div>
      <AdminHeader title="Leads Management" description="View and manage all customer inquiries" />

      <div className="space-y-6 p-6">
        <LeadsFilters currentStatus={params.status} currentType={params.type} />
        <LeadsTable leads={leads || []} />
      </div>
    </div>
  )
}
