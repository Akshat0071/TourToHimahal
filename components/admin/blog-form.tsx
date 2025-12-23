"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { CloudinaryUploadWidget, UploadedImagePreview, type CloudinaryUploadResult } from "./cloudinary-upload-widget"

interface BlogFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt?: string
    cover_image?: string
    gallery?: string[]
    category?: string
    tags?: string[]
    is_published: boolean
    seo_title?: string
    seo_description?: string
  }
}

const categories = [
  { value: "travel-tips", label: "Travel Tips" },
  { value: "destinations", label: "Destinations" },
  { value: "adventure", label: "Adventure" },
  { value: "culture", label: "Culture & Heritage" },
  { value: "food", label: "Food & Cuisine" },
  { value: "guides", label: "Guides" },
]

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    cover_image: initialData?.cover_image || "",
    category: initialData?.category || "",
    is_published: initialData?.is_published ?? false,
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
  })

  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState("")
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

  const addTag = () => {
    if (!newTag.trim()) return
    if (!tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()])
    }
    setNewTag("")
  }

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index))
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

      const blogData = {
        ...formData,
        tags,
        gallery,
        published_at: formData.is_published && !initialData?.is_published ? new Date().toISOString() : undefined,
      }

      let error

      if (initialData?.id) {
        const result = await supabase.from("blogs").update(blogData).eq("id", initialData.id)
        error = result.error
      } else {
        const result = await supabase.from("blogs").insert(blogData)
        error = result.error
      }

      if (error) {
        toast.error(`Failed to ${initialData ? "update" : "create"} blog: ${error.message}`)
      } else {
        toast.success(`Blog ${initialData ? "updated" : "created"} successfully`)
        router.push("/admin/blogs")
        router.refresh()
      }
    } catch (err) {
      console.error("Error submitting blog:", err)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl" suppressHydrationWarning>
      <Card>
        <CardHeader>
          <CardTitle>Blog Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter blog title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="blog-url-slug"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary for previews..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog content here... (Markdown supported)"
              rows={15}
              required
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image">Cover Image</Label>
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
                  onUploadSuccess={(result: CloudinaryUploadResult) => {
                    setFormData((prev) => ({ ...prev, cover_image: result.secure_url }))
                    toast.success("Image uploaded successfully!")
                  }}
                  onUploadError={(error) => {
                    console.error("Upload failed:", error)
                    toast.error("Failed to upload image")
                  }}
                  folder="himachal-yatra/blogs/covers"
                  maxFiles={1}
                  acceptedFormats={["jpg", "jpeg", "png", "webp"]}
                  buttonText="Upload Cover Image"
                  buttonVariant="outline"
                />
              )}
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
                    onRemove={() => {
                      setGallery((prev) => prev.filter((_, i) => i !== index))
                    }}
                  />
                ))}
              </div>

              {gallery.length < 5 && (
                <CloudinaryUploadWidget
                  onUploadSuccess={(result: CloudinaryUploadResult) => {
                    setGallery((prev) => {
                      const next = [...prev, result.secure_url].slice(0, 5)
                      // If no cover is set, default it to the first uploaded gallery image
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
                  folder="himachal-yatra/blogs/gallery"
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
          <CardTitle>Categorization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(index)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
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
              {initialData ? "Update Blog" : "Create Blog"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
