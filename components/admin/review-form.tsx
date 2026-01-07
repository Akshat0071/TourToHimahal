"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ArrowLeft, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  city: z.string().optional(),
  phone: z.string().optional(),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  rating: z.coerce.number().min(1).max(5),
  review_text: z.string().min(10, "Review must be at least 10 characters"),
  is_approved: z.boolean().default(true),
})

interface ReviewFormProps {
  initialData?: any
  isEditing?: boolean
}

export function AdminReviewForm({ initialData, isEditing = false }: ReviewFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      phone: initialData?.phone || "",
      image_url: initialData?.image_url || "",
      rating: initialData?.rating || 5,
      review_text: initialData?.review_text || "",
      is_approved: initialData?.is_approved !== undefined ? initialData.is_approved : true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const supabase = createClient()

    try {
      if (isEditing) {
        const { error } = await supabase.from("reviews").update(values).eq("id", initialData.id)

        if (error) throw error
        toast.success("Review updated successfully")
      } else {
        const { error } = await supabase.from("reviews").insert([values])
        if (error) throw error
        toast.success("Review created successfully")
      }

      router.push("/admin/reviews")
      router.refresh()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error(isEditing ? "Failed to update review" : "Failed to create review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 transition-all hover:pl-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reviews
        </Button>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Review" : "Add Review"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing ? "Update review details and status." : "Manually add a customer review."}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Delhi" {...field} />
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
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+91..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewer Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="transition-transform hover:scale-110 focus:outline-none"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => field.onChange(star)}
                          >
                            <Star
                              className={`h-8 w-8 ${
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
                    <FormLabel>Review Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Great experience..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_approved"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Approved Review</FormLabel>
                      <FormDescription>
                        This review will be visible on the public site immediately.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-mountain-blue hover:bg-mountain-blue/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Review"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
