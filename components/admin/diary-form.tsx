"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { CloudinaryUploadWidget, UploadedImagePreview, type CloudinaryUploadResult } from "./cloudinary-upload-widget"
import { registerMedia } from "@/lib/admin/media-client"

interface DiaryFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt?: string
    cover_image?: string
    gallery?: string[]
    author_name: string
    author_avatar?: string
    destination?: string
    is_published: boolean
    seo_title?: string
    seo_description?: string
  }
}

export function DiaryForm({ initialData }: DiaryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    cover_image: initialData?.cover_image || "",
    author_name: initialData?.author_name || "",
    author_avatar: initialData?.author_avatar || "",
    destination: initialData?.destination || "",
    is_published: initialData?.is_published ?? false,
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
  })
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isClient) {
      toast.error("Please wait for the page to load")
      return
    }

    setIsSubmitting(true)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const diaryData = {
        ...formData,
        gallery,
        published_at: formData.is_published && !initialData?.is_published ? new Date().toISOString() : undefined,
      }

      let error

      if (initialData?.id) {
        const result = await supabase.from("diaries").update(diaryData).eq("id", initialData.id)
        error = result.error
      } else {
        const result = await supabase.from("diaries").insert(diaryData)
        error = result.error
      }

      if (error) {
        toast.error(`Failed to ${initialData ? "update" : "create"} diary: ${error.message}`)
      } else {
        toast.success(`Diary ${initialData ? "updated" : "created"} successfully`)
        router.push("/admin/diaries")
        router.refresh()
      }
    } catch (err) {
      console.error("Error submitting diary:", err)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Diary Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter diary title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="diary-url-slug"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author_name">Author Name *</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, author_name: e.target.value }))}
                placeholder="Traveler's name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                placeholder="e.g., Manali, Shimla"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Story Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write the travel story here..."
              rows={12}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="space-y-4">
                {formData.cover_image ? (
                  <div className="space-y-2">
                    <UploadedImagePreview
                      imageUrl={formData.cover_image}
                      onRemove={() => setFormData((prev) => ({ ...prev, cover_image: "" }))}
                      alt={formData.title}
                    />
                    <p className="text-xs text-muted-foreground break-all">
                      URL: {formData.cover_image}
                    </p>
                  </div>
                ) : (
                  <CloudinaryUploadWidget
                    onUploadSuccess={async (result: CloudinaryUploadResult) => {
                      setFormData((prev) => ({ ...prev, cover_image: result.secure_url }))

                      const registered = await registerMedia({
                        url: result.secure_url,
                        public_id: result.public_id,
                        folder: "diaries",
                        name: result.original_filename,
                        alt_text: result.original_filename,
                        size: result.bytes,
                        format: result.format,
                        resource_type: result.resource_type,
                      })

                      if (!registered.ok) {
                        toast.error(registered.error)
                        return
                      }

                      toast.success("Image uploaded successfully!")
                    }}
                    onUploadError={(error) => {
                      console.error("Upload failed:", error)
                      toast.error("Failed to upload image")
                    }}
                    folder="himachal-yatra/diaries/covers"
                    maxFiles={1}
                    acceptedFormats={["jpg", "jpeg", "png", "webp"]}
                    buttonText="Upload Cover Image"
                    buttonVariant="outline"
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Author Avatar</Label>
              <div className="space-y-4">
                {formData.author_avatar ? (
                  <div className="space-y-2">
                    <UploadedImagePreview
                      imageUrl={formData.author_avatar}
                      onRemove={() => setFormData((prev) => ({ ...prev, author_avatar: "" }))}
                      alt={formData.author_name}
                    />
                    <p className="text-xs text-muted-foreground break-all">
                      URL: {formData.author_avatar}
                    </p>
                  </div>
                ) : (
                  <CloudinaryUploadWidget
                    onUploadSuccess={async (result: CloudinaryUploadResult) => {
                      setFormData((prev) => ({ ...prev, author_avatar: result.secure_url }))

                      const registered = await registerMedia({
                        url: result.secure_url,
                        public_id: result.public_id,
                        folder: "diaries",
                        name: result.original_filename,
                        alt_text: result.original_filename,
                        size: result.bytes,
                        format: result.format,
                        resource_type: result.resource_type,
                      })

                      if (!registered.ok) {
                        toast.error(registered.error)
                        return
                      }

                      toast.success("Image uploaded successfully!")
                    }}
                    onUploadError={(error) => {
                      console.error("Upload failed:", error)
                      toast.error("Failed to upload image")
                    }}
                    folder="himachal-yatra/diaries"
                    maxFiles={1}
                    acceptedFormats={["jpg", "jpeg", "png", "webp"]}
                    buttonText="Upload Avatar"
                    buttonVariant="outline"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Gallery Images (up to 5)</Label>
              <span className="text-xs text-muted-foreground">First image is used in cards</span>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                {gallery.map((image, index) => (
                  <UploadedImagePreview
                    key={image}
                    imageUrl={image}
                    alt={`${formData.title} image ${index + 1}`}
                    onRemove={() => setGallery((prev) => prev.filter((_, i) => i !== index))}
                  />
                ))}
              </div>

              {gallery.length < 5 && (
                <CloudinaryUploadWidget
                  onUploadSuccess={async (result: CloudinaryUploadResult) => {
                    const registered = await registerMedia({
                      url: result.secure_url,
                      public_id: result.public_id,
                      folder: "diaries",
                      name: result.original_filename,
                      alt_text: result.original_filename,
                      size: result.bytes,
                      format: result.format,
                      resource_type: result.resource_type,
                    })

                    if (!registered.ok) {
                      toast.error(registered.error)
                      return
                    }

                    setGallery((prev) => {
                      const next = [...prev, result.secure_url].slice(0, 5)
                      if (!formData.cover_image && next.length > 0) {
                        setFormData((prevData) => ({ ...prevData, cover_image: next[0] }))
                      }
                      return next
                    })
                    toast.success("Image added to gallery")
                  }}
                  onUploadError={(error) => {
                    console.error("Upload failed:", error)
                    toast.error("Failed to upload image")
                  }}
                  folder="himachal-yatra/diaries/gallery"
                  maxFiles={5 - gallery.length}
                  multiple
                  acceptedFormats={["jpg", "jpeg", "png", "webp"]}
                  buttonText={gallery.length === 0 ? "Add Gallery Images" : "Add More Images"}
                  buttonVariant="outline"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData((prev) => ({ ...prev, seo_title: e.target.value }))}
                placeholder="Custom title for search engines"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Input
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => setFormData((prev) => ({ ...prev, seo_description: e.target.value }))}
                placeholder="Custom description for search engines"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
            />
            <Label htmlFor="is_published">Publish immediately</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {initialData ? "Update Diary" : "Create Diary"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
