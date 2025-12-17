"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Loader2, Plus, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { CloudinaryUploadWidget, UploadedImagePreview, type CloudinaryUploadResult } from "./cloudinary-upload-widget"

interface PackageFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    description: string
    short_description?: string
    price: number
    original_price?: number
    duration: string
    highlights?: string[]
    inclusions?: string[]
    exclusions?: string[]
    category?: string
    images?: string[]
    is_active: boolean
    is_featured: boolean
    seo_title?: string
    seo_description?: string
  }
}

const categories = [
  { value: "spiritual", label: "Spiritual Tours" },
  { value: "adventure", label: "Adventure" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family" },
  { value: "group", label: "Group Tours" },
  { value: "custom", label: "Custom" },
]

export function PackageForm({ initialData }: PackageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    short_description: initialData?.short_description || "",
    price: initialData?.price || 0,
    original_price: initialData?.original_price || 0,
    duration: initialData?.duration || "",
    category: initialData?.category || "",
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
  })

  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights || [])
  const [inclusions, setInclusions] = useState<string[]>(initialData?.inclusions || [])
  const [exclusions, setExclusions] = useState<string[]>(initialData?.exclusions || [])
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [itinerary, setItinerary] = useState<Array<{day: number, title: string, description: string, activities: string[]}>>([])
  const [newHighlight, setNewHighlight] = useState("")
  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")

  useEffect(() => {
    setIsClient(true)
    // Parse itinerary from initialData if it exists
    if (initialData && typeof initialData === 'object' && 'itinerary' in initialData && initialData.itinerary) {
      try {
        const parsedItinerary = typeof initialData.itinerary === 'string' 
          ? JSON.parse(initialData.itinerary) 
          : initialData.itinerary
        if (Array.isArray(parsedItinerary)) {
          setItinerary(parsedItinerary)
        }
      } catch (e) {
        console.error('Failed to parse itinerary:', e)
      }
    }
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

  const addItem = (type: "highlights" | "inclusions" | "exclusions", value: string, setValue: (v: string) => void) => {
    if (!value.trim()) return
    if (type === "highlights") setHighlights((prev) => [...prev, value.trim()])
    if (type === "inclusions") setInclusions((prev) => [...prev, value.trim()])
    if (type === "exclusions") setExclusions((prev) => [...prev, value.trim()])
    setValue("")
  }

  const removeItem = (type: "highlights" | "inclusions" | "exclusions", index: number) => {
    if (type === "highlights") setHighlights((prev) => prev.filter((_, i) => i !== index))
    if (type === "inclusions") setInclusions((prev) => prev.filter((_, i) => i !== index))
    if (type === "exclusions") setExclusions((prev) => prev.filter((_, i) => i !== index))
  }

  const addItineraryDay = () => {
    const newDay = {
      day: itinerary.length + 1,
      title: "",
      description: "",
      activities: []
    }
    setItinerary([...itinerary, newDay])
  }

  const updateItineraryDay = (index: number, field: keyof typeof itinerary[0], value: any) => {
    const updated = [...itinerary]
    updated[index] = { ...updated[index], [field]: value }
    setItinerary(updated)
  }

  const removeItineraryDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index)
    // Renumber days
    updated.forEach((day, i) => { day.day = i + 1 })
    setItinerary(updated)
  }

  const addActivity = (dayIndex: number, activity: string) => {
    if (!activity.trim()) return
    const updated = [...itinerary]
    updated[dayIndex].activities = [...updated[dayIndex].activities, activity.trim()]
    setItinerary(updated)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...itinerary]
    updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== activityIndex)
    setItinerary(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isClient) {
      toast.error("Please wait for the page to fully load")
      return
    }

    setIsSubmitting(true)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const packageData = {
        ...formData,
        highlights,
        inclusions,
        exclusions,
        images,
        itinerary: itinerary.length > 0 ? itinerary : null,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
      }

      let error

      if (initialData?.id) {
        const result = await supabase.from("packages").update(packageData).eq("id", initialData.id)
        error = result.error
      } else {
        const result = await supabase.from("packages").insert(packageData)
        error = result.error
      }

      if (error) {
        toast.error(`Failed to ${initialData ? "update" : "create"} package: ${error.message}`)
      } else {
        toast.success(`Package ${initialData ? "updated" : "created"} successfully`)
        router.push("/admin/packages")
        router.refresh()
      }
    } catch (err) {
      console.error("[v0] Submit error:", err)
      toast.error("An error occurred while saving the package")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs sm:text-sm">Package Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Shimla Manali Adventure"
                className="text-base sm:text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs sm:text-sm">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="shimla-manali-adventure"
                className="text-base sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description" className="text-xs sm:text-sm">Short Description</Label>
            <Textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
              placeholder="Brief description for cards and previews..."
              rows={2}
              className="text-base sm:text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm">Full Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed package description..."
              rows={5}
              className="text-base sm:text-sm"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Pricing & Duration</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs sm:text-sm">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="12999"
                className="text-base sm:text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="original_price" className="text-xs sm:text-sm">Original Price (₹)</Label>
              <Input
                id="original_price"
                type="number"
                min="0"
                value={formData.original_price || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, original_price: Number(e.target.value) || 0 }))}
                placeholder="15999"
                className="text-base sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-xs sm:text-sm">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 5 Days / 4 Nights"
                className="text-base sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs sm:text-sm">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger id="category" className="text-base sm:text-sm">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Package Details</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 space-y-6">
          {/* Highlights */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Highlights</Label>
            <div className="flex flex-col xs:flex-row gap-2">
              <Input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add a highlight"
                className="text-base sm:text-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("highlights", newHighlight, setNewHighlight)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem("highlights", newHighlight, setNewHighlight)}
                className="w-full xs:w-auto"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {highlights.map((item, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {item}
                  <button type="button" onClick={() => removeItem("highlights", index)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Inclusions</Label>
            <div className="flex flex-col xs:flex-row gap-2">
              <Input
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="Add an inclusion"
                className="text-base sm:text-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("inclusions", newInclusion, setNewInclusion)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem("inclusions", newInclusion, setNewInclusion)}
                className="w-full xs:w-auto"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {inclusions.map((item, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {item}
                  <button type="button" onClick={() => removeItem("inclusions", index)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Exclusions</Label>
            <div className="flex flex-col xs:flex-row gap-2">
              <Input
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                placeholder="Add an exclusion"
                className="text-base sm:text-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("exclusions", newExclusion, setNewExclusion)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem("exclusions", newExclusion, setNewExclusion)}
                className="w-full xs:w-auto"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {exclusions.map((item, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {item}
                  <button type="button" onClick={() => removeItem("exclusions", index)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Images */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Package Images</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Upload Images (up to 5)</Label>
            {images.length < 5 && (
              <CloudinaryUploadWidget
                onUploadSuccess={(result: CloudinaryUploadResult) => {
                  setImages([...images, result.secure_url])
                  toast.success("Image uploaded successfully!")
                }}
                onUploadError={(error) => {
                  console.error("Upload failed:", error)
                  toast.error("Failed to upload image")
                }}
                folder="himachal-yatra/packages"
                maxFiles={5 - images.length}
                multiple
                acceptedFormats={["jpg", "jpeg", "png", "webp"]}
                buttonText={images.length === 0 ? "Upload Package Images" : `Add More (${images.length}/5)`}
                buttonVariant="outline"
              />
            )}
          </div>
          {images.length > 0 && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                {images.length} / 5 images uploaded
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <UploadedImagePreview
                      imageUrl={imageUrl}
                      onRemove={() => setImages(images.filter((_, i) => i !== index))}
                      alt={`Package image ${index + 1}`}
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Itinerary Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Day-by-Day Itinerary</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
              <Plus className="w-4 h-4 mr-2" />
              Add Day
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {itinerary.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No itinerary added yet. Click "Add Day" to start building your package itinerary.</p>
            </div>
          ) : (
            itinerary.map((day, dayIndex) => (
              <Card key={dayIndex} className="bg-muted/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">Day {day.day}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItineraryDay(dayIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`day-${dayIndex}-title`}>Day Title *</Label>
                    <Input
                      id={`day-${dayIndex}-title`}
                      value={day.title}
                      onChange={(e) => updateItineraryDay(dayIndex, 'title', e.target.value)}
                      placeholder="e.g., Arrival in Manali"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`day-${dayIndex}-desc`}>Description *</Label>
                    <Textarea
                      id={`day-${dayIndex}-desc`}
                      value={day.description}
                      onChange={(e) => updateItineraryDay(dayIndex, 'description', e.target.value)}
                      placeholder="Describe the activities and highlights of this day..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Activities/Places</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add activity or place"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const target = e.target as HTMLInputElement
                            addActivity(dayIndex, target.value)
                            target.value = ""
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addActivity(dayIndex, input.value)
                          input.value = ""
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {day.activities.map((activity, actIndex) => (
                        <span
                          key={actIndex}
                          className="inline-flex items-center gap-1 bg-background text-foreground px-3 py-1 rounded-full text-sm border"
                        >
                          {activity}
                          <button
                            type="button"
                            onClick={() => removeActivity(dayIndex, actIndex)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Visibility</CardTitle>
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

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active (visible on website)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured">Featured (show on homepage)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !isClient}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {initialData ? "Update Package" : "Create Package"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
