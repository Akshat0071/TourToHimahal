"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"
import { createClient } from "@/lib/supabase/client"
import { ReviewForm } from "./review-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// Static backup if needed, or initial state
// const testimonials = [...]

interface Review {
  id: string
  name: string
  city?: string
  image_url?: string
  rating: number
  review_text: string
  created_at: string
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchReviews = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching reviews:", error)
        return
      }

      if (data) {
        setReviews(data)
      }
    } catch (error) {
      console.error("Error in fetchReviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
      setTimeout(checkScroll, 300)
    }
  }

  return (
    <section className="relative overflow-hidden bg-white py-8 md:py-8 lg:py-12">
      {/* Decorative elements */}
      <div className="from-golden-yellow/30 to-saffron/30 absolute top-10 right-10 h-32 w-32 rounded-full bg-gradient-to-br blur-3xl md:h-40 md:w-40" />
      <div className="from-mountain-blue/20 to-forest-green/20 absolute bottom-10 left-10 h-48 w-48 rounded-full bg-gradient-to-tr blur-3xl md:h-60 md:w-60" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-8 flex flex-col md:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <motion.div
              variants={fadeInUp}
              className="bg-mountain-blue/10 mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:mb-4 md:px-4 md:py-2"
            >
              <MessageSquare className="text-mountain-blue h-3 w-3 md:h-4 md:w-4" />
              <span className="text-mountain-blue text-xs font-semibold tracking-wider uppercase md:text-sm">
                What Our Travelers Say
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-foreground mt-2 font-serif text-2xl font-bold sm:text-3xl md:mt-3 md:text-4xl lg:text-5xl"
            >
              Happy <span className="text-mountain-blue">Travelers</span>
            </motion.h2>
          </div>

          <motion.div variants={fadeInUp} className="mt-4 flex gap-2 md:mt-0 md:gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="hover:bg-mountain-blue hover:border-mountain-blue h-10 w-10 rounded-full border-2 hover:text-white disabled:opacity-30 md:h-12 md:w-12"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="hover:bg-mountain-blue hover:border-mountain-blue h-10 w-10 rounded-full border-2 hover:text-white disabled:opacity-30 md:h-12 md:w-12"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <div className="ml-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-mountain-blue hover:bg-mountain-blue/90 text-white">
                    Write a Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto rounded-2xl p-4 sm:p-6 md:max-w-md">
                  <ReviewForm onSuccess={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </motion.div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:gap-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.length === 0 && !isLoading ? (
            <div className="text-muted-foreground w-full rounded-xl bg-white/50 py-10 text-center">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-[280px] shrink-0 snap-start rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:w-[320px] md:w-[350px]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                      {testimonial.image_url ? (
                        <Image
                          src={testimonial.image_url}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-mountain-blue flex h-full w-full items-center justify-center text-lg font-bold text-white">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4>
                      <div className="flex gap-2 text-xs text-gray-500">
                        {testimonial.city && (
                          <>
                            <span>{testimonial.city}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>
                          {testimonial.created_at
                            ? new Date(testimonial.created_at).toLocaleDateString()
                            : "Recent"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Google Logo */}
                  <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>

                {/* Star rating */}
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "fill-[#F4B400] text-[#F4B400]" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="line-clamp-4 text-sm leading-relaxed text-gray-600">
                  {testimonial.review_text}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
