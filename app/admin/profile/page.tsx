import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileSettingsClient } from "@/components/admin/profile-settings-client"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id || !user.email) {
    redirect("/admin/login")
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle()

  return <ProfileSettingsClient userEmail={user.email} initialFullName={adminProfile?.full_name || ""} />
}
