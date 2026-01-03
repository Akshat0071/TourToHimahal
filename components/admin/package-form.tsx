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
import { registerMedia } from "@/lib/admin/media-client"

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
    region?: string
    min_persons?: number
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
    region: initialData?.region || "",
    min_persons: initialData?.min_persons || 2,
    category: initialData?.category || "",
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
  })

  // Use simple strings for the textarea inputs
  const [highlightsText, setHighlightsText] = useState(initialData?.highlights?.join("\n") || "")
  const [inclusionsText, setInclusionsText] = useState(initialData?.inclusions?.join("\n") || "")
  const [exclusionsText, setExclusionsText] = useState(initialData?.exclusions?.join("\n") || "")

  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [itinerary, setItinerary] = useState<Array<{
    day: number
    title: string
    description: string
    activities: string[]
    subtitles?: Array<{ title: string; highlight?: string; description: string; activities: string[] }>
  }>>([])

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

  const addItineraryDay = () => {
    const newDay = {
      day: itinerary.length + 1,
      title: "",
      description: "",
      activities: [],
      subtitles: []
    }
    setItinerary([...itinerary, newDay])
  }

  const updateItineraryDay = (index: number, field: keyof typeof itinerary[0], value: any) => {
    const updated = [...itinerary]
    updated[index] = { ...updated[index], [field]: value }
    setItinerary(updated)
  }

  const addSubtitle = (dayIndex: number) => {
    const updated = [...itinerary]
    if (!updated[dayIndex].subtitles) {
      updated[dayIndex].subtitles = []
    }
    updated[dayIndex].subtitles!.push({
      title: "",
      highlight: "",
      description: "",
      activities: []
    })
    setItinerary(updated)
  }

  const updateSubtitle = (dayIndex: number, subtitleIndex: number, field: 'title' | 'highlight' | 'description', value: string) => {
    const updated = [...itinerary]
    if (updated[dayIndex].subtitles) {
      updated[dayIndex].subtitles![subtitleIndex][field] = value
      setItinerary(updated)
    }
  }

  const removeSubtitle = (dayIndex: number, subtitleIndex: number) => {
    const updated = [...itinerary]
    if (updated[dayIndex].subtitles) {
      updated[dayIndex].subtitles = updated[dayIndex].subtitles!.filter((_, i) => i !== subtitleIndex)
      setItinerary(updated)
    }
  }

  const addSubtitleActivity = (dayIndex: number, subtitleIndex: number, activity: string) => {
    if (!activity.trim()) return
    const updated = [...itinerary]
    if (updated[dayIndex].subtitles) {
      updated[dayIndex].subtitles![subtitleIndex].activities.push(activity.trim())
      setItinerary(updated)
    }
  }

  const removeSubtitleActivity = (dayIndex: number, subtitleIndex: number, activityIndex: number) => {
    const updated = [...itinerary]
    if (updated[dayIndex].subtitles) {
      updated[dayIndex].subtitles![subtitleIndex].activities = updated[dayIndex].subtitles![subtitleIndex].activities.filter((_, i) => i !== activityIndex)
      setItinerary(updated)
    }
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

      // Convert textarea strings back to arrays
      const highlightsArray = highlightsText.split("\n").filter(line => line.trim())
      const inclusionsArray = inclusionsText.split("\n").filter(line => line.trim())
      const exclusionsArray = exclusionsText.split("\n").filter(line => line.trim())

      const packageData = {
        ...formData,
        highlights: highlightsArray,
        inclusions: inclusionsArray,
        exclusions: exclusionsArray,
        images,
        itinerary: itinerary.length > 0 ? itinerary : null,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        region: formData.region?.trim() ? formData.region.trim() : null,
        min_persons: formData.min_persons ? Number(formData.min_persons) : null,
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region" className="text-xs sm:text-sm">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))}
                placeholder="e.g., Himachal Pradesh"
                className="text-base sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_persons" className="text-xs sm:text-sm">Minimum Persons</Label>
              <Input
                id="min_persons"
                type="number"
                min="1"
                value={formData.min_persons}
                onChange={(e) => setFormData((prev) => ({ ...prev, min_persons: Number(e.target.value) || 1 }))}
                placeholder="2"
                className="text-base sm:text-sm"
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
            <p className="text-xs text-muted-foreground mb-1">Enter each highlight on a new line.</p>
            <Textarea
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              placeholder="e.g. Visit Hadimba Temple&#10;Solang Valley Adventure&#10;Rohtang Pass Trip"
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          {/* Inclusions */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Inclusions</Label>
            <p className="text-xs text-muted-foreground mb-1">Enter each inclusion on a new line.</p>
            <Textarea
              value={inclusionsText}
              onChange={(e) => setInclusionsText(e.target.value)}
              placeholder="e.g. 4 Nights Accommodation&#10;Breakfast and Dinner&#10;Private Cab for Sightseeing"
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          {/* Exclusions */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Exclusions</Label>
            <p className="text-xs text-muted-foreground mb-1">Enter each exclusion on a new line.</p>
            <Textarea
              value={exclusionsText}
              onChange={(e) => setExclusionsText(e.target.value)}
              placeholder="e.g. Airfare / Train fare&#10;Lunch&#10;Personal Expenses"
              rows={4}
              className="font-mono text-sm"
            />
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
                key={images.length}
                onUploadSuccess={async (result: CloudinaryUploadResult) => {
                  const registered = await registerMedia({
                    url: result.secure_url,
                    public_id: result.public_id,
                    folder: "packages",
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

                  {/* Subtitles Section */}
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Sub-sections</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSubtitle(dayIndex)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Sub-section
                      </Button>
                    </div>

                    {day.subtitles && day.subtitles.length > 0 ? (
                      <div className="space-y-3">
                        {day.subtitles.map((subtitle, subtitleIndex) => (
                          <Card key={subtitleIndex} className="bg-background border">
                            <CardContent className="pt-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Sub-section {subtitleIndex + 1}</p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSubtitle(dayIndex, subtitleIndex)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`sub-${dayIndex}-${subtitleIndex}-title`}>Sub-section Title *</Label>
                                <Input
                                  id={`sub-${dayIndex}-${subtitleIndex}-title`}
                                  value={subtitle.title}
                                  onChange={(e) => updateSubtitle(dayIndex, subtitleIndex, 'title', e.target.value)}
                                  placeholder="e.g., Morning Trek to Hadimba Temple"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`sub-${dayIndex}-${subtitleIndex}-highlight`}>Highlight / Caution (Optional)</Label>
                                <Input
                                  id={`sub-${dayIndex}-${subtitleIndex}-highlight`}
                                  value={subtitle.highlight || ""}
                                  onChange={(e) => updateSubtitle(dayIndex, subtitleIndex, 'highlight', e.target.value)}
                                  placeholder="e.g., Bring sun protection, altitude may affect some travelers"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`sub-${dayIndex}-${subtitleIndex}-desc`}>Description *</Label>
                                <Textarea
                                  id={`sub-${dayIndex}-${subtitleIndex}-desc`}
                                  value={subtitle.description}
                                  onChange={(e) => updateSubtitle(dayIndex, subtitleIndex, 'description', e.target.value)}
                                  placeholder="Enter each point on a new line..."
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
                                        addSubtitleActivity(dayIndex, subtitleIndex, target.value)
                                        target.value = ""
                                      }
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(e) => {
                                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                      addSubtitleActivity(dayIndex, subtitleIndex, input.value)
                                      input.value = ""
                                    }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {subtitle.activities.map((activity, actIndex) => (
                                    <span
                                      key={actIndex}
                                      className="inline-flex items-center gap-1 bg-background text-foreground px-3 py-1 rounded-full text-sm border"
                                    >
                                      {activity}
                                      <button
                                        type="button"
                                        onClick={() => removeSubtitleActivity(dayIndex, subtitleIndex, actIndex)}
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
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No sub-sections added yet. Click "Add Sub-section" to add one.</p>
                    )}
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
