import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DiariesTable } from "@/components/admin/diaries-table"

export default async function DiariesPage() {
  const supabase = await createClient()

  const { data: diaries, error } = await supabase
    .from("diaries")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching diaries:", error)
  }

  return (
    <div>
      <AdminHeader title="Travel Diaries" description="Manage traveler stories and experiences" />

      <div className="space-y-6 p-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/diaries/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Diary
            </Link>
          </Button>
        </div>

        <DiariesTable diaries={diaries || []} />
      </div>
    </div>
  )
}
