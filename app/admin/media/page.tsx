import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { MediaLibrary } from "@/components/admin/media-library"

export default async function MediaPage() {
  const supabase = await createClient()

  const { data: media, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching media:", error)
  }

  return (
    <div>
      <AdminHeader title="Media Library" description="Upload and manage images and documents" />
      <div className="p-6">
        <MediaLibrary media={media || []} />
      </div>
    </div>
  )
}
