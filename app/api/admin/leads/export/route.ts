import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: adminProfile } = await supabase.from("admin_profiles").select("id").eq("id", user.id).single()

  if (!adminProfile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get query params
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")
  const type = searchParams.get("type")

  let query = supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (type && type !== "all") {
    query = query.eq("service_type", type)
  }

  const { data: leads, error } = await query

  if (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }

  // Create CSV
  const headers = [
    "Reference",
    "Name",
    "Email",
    "Phone",
    "Service Type",
    "Status",
    "Subject",
    "Message",
    "Date",
  ]
  const rows = (leads || []).map((lead) => [
    lead.reference_number,
    lead.name,
    lead.email,
    lead.phone,
    lead.service_type,
    lead.status,
    `"${(lead.subject || "").replace(/"/g, '""')}"`,
    `"${(lead.message || "").replace(/"/g, '""')}"`,
    new Date(lead.created_at).toISOString(),
  ])

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
