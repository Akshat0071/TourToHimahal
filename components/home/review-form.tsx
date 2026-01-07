"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star, Loader2, Upload, ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  city: z.string().min(2, "City name is required"),
  rating: z.number().min(1, "Please select a rating").max(5),
  review_text: z.string().min(10, "Review must be at least 10 characters"),
})

interface ReviewFormProps {
  onSuccess?: () => void
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      rating: 5,
      review_text: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  async function uploadImage(): Promise<string | null> {
    if (!file) return null

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      formDataToSend.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formDataToSend,
        },
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      // Save metadata to media table
      const supabase = createClient()
      const { error: mediaError } = await supabase.from("media").insert({
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: data.secure_url,
        type: "image",
        folder: "reviews",
        alt_text: "Review image by customer",
      })

      if (mediaError) {
        console.error("Failed to save media metadata:", mediaError)
        // We continue anyway since we have the URL
      }

      return data.secure_url
    } catch (error) {
      console.error("Image upload error:", error)
      toast.error("Failed to upload image")
      return null
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      let imageUrl = null
      if (file) {
        imageUrl = await uploadImage()
        if (!imageUrl) {
          throw new Error("Image upload failed")
        }
      }

      const { error } = await supabase.from("reviews").insert([
        {
          name: values.name,
          phone: values.phone,
          city: values.city,
          rating: values.rating,
          review_text: values.review_text,
          image_url: imageUrl,
          is_approved: true, // Auto-approve as per user request
        },
      ])

      if (error) throw error

      toast.success("Review submitted successfully!", {
        description: "Your review is pending approval locally.",
      })

      form.reset()
      setFile(null)
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review", {
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <DialogHeader>
        <DialogTitle>Share Your Experience</DialogTitle>
        <DialogDescription>
          We&apos;d love to hear about your trip! Your review helps others plan their perfect getaway.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} className="text-base sm:text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact number" {...field} className="text-base sm:text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="Where are you from?" {...field} className="text-base sm:text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Photo (Optional)</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 w-full sm:h-10"
                >
                  {file ? (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      <span className="max-w-[200px] truncate">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </FormControl>
            {file && (
              <p className="text-muted-foreground mt-1 text-xs">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </FormItem>

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating *</FormLabel>
                <FormControl>
                  <div className="flex justify-center gap-2 py-2 sm:justify-start sm:gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => field.onChange(star)}
                      >
                        <Star
                          className={`h-8 w-8 sm:h-8 sm:w-8 ${
                            star <= (hoverRating || field.value)
                              ? "fill-golden-yellow text-golden-yellow"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your trip..."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-mountain-blue hover:bg-mountain-blue/90 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
