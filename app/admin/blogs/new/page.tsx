"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { BlogForm } from "@/components/admin/blog-form"

export default function NewBlogPage() {
  return (
    <div suppressHydrationWarning>
      <AdminHeader title="Write Blog" description="Create a new blog post" />
      <div className="p-6">
        <BlogForm />
      </div>
    </div>
  )
}
