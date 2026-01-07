import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminReviewForm } from "@/components/admin/review-form"

interface EditReviewPageProps {
  params: Promise<{ id: string }>
}

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: review, error } = await supabase.from("reviews").select("*").eq("id", id).single()

  if (error || !review) {
    notFound()
  }

  return (
    <div className="p-6">
      <AdminReviewForm initialData={review} isEditing />
    </div>
  )
}
