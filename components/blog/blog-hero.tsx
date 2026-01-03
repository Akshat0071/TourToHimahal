"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Clock, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fadeInUp } from "@/lib/animation-variants"

interface BlogPost {
  id?: string
  title: string
  excerpt?: string
  content?: string
  cover_image?: string
  featuredImage?: string
  gallery?: string[]
  author?: string
  category?: string
  tags?: string[]
  published_at?: string
  created_at?: string
  date?: string
  readTime?: number
}

interface BlogHeroProps {
  post: BlogPost
}

export function BlogHero({ post }: BlogHeroProps) {
  // Handle date formatting - support both database format (published_at) and static data format (date)
  const dateString = post.published_at || post.date || new Date().toISOString()
  const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Prefer gallery images; fall back to cover_image/featuredImage
  const galleryImages = post.gallery?.filter(Boolean) || []
  const displayImages =
    galleryImages.length > 0
      ? galleryImages
      : [post.cover_image || post.featuredImage || "/placeholder.svg"]

  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance every 1.5 seconds when multiple images are present
  useEffect(() => {
    if (displayImages.length <= 1) return

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    }, 1500)

    return () => clearInterval(id)
  }, [displayImages.length])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)

  return (
    <section className="relative min-h-[60vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={displayImages[currentIndex] || "/placeholder.svg"}
              alt={`${post.title} image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-4xl">
          <Badge className="bg-saffron text-white mb-4">{post.category || "Travel"}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#fc9700] mb-4 text-balance">
            {post.title}
          </h1>
          <p className="text-lg text-white/80 mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {displayImages.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-between px-6 md:px-10">
          <button
            onClick={prevSlide}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {displayImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-6 rounded-full transition-all ${idx === currentIndex ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  )
}
