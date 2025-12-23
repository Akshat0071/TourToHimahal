import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BlogsTable } from "@/components/admin/blogs-table"

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blogs:", error)
  }

  return (
    <div suppressHydrationWarning>
      <AdminHeader title="Blogs Management" description="Create and manage blog posts" />

      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="w-4 h-4 mr-2" />
              Write Blog
            </Link>
          </Button>
        </div>

        <BlogsTable blogs={blogs || []} />
      </div>
    </div>
  )
}
