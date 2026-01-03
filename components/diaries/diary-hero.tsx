"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Clock, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fadeInUp } from "@/lib/animation-variants"

interface DiaryHeroProps {
  diary: {
    title: string
    author_name: string
    author_avatar?: string
    destination?: string
    travel_date?: string
    published_at?: string
    tags?: string[]
    readTime?: number
  }
  images: string[]
}

export function DiaryHero({ diary, images }: DiaryHeroProps) {
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"]
  const [currentIndex, setCurrentIndex] = useState(0)

  const formattedDate = new Date(diary.travel_date || diary.published_at || new Date().toISOString()).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  )

  // Auto-advance every 1.5s when multiple images exist
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
    <section className="relative min-h-[70vh] flex items-end overflow-hidden pt-16 md:pt-24 lg:pt-28">
      {/* Background Image */}
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
              alt={`${diary.title} image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-4xl">
          {/* Tags */}
          {diary.tags && diary.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {diary.tags.map((tag) => (
                <Badge key={tag} className="bg-saffron/90 text-white capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#fc9700] mb-4 text-balance">
            {diary.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-white/70">
            <div className="flex items-center gap-2">
              <Image
                src={diary.author_avatar || "/placeholder.svg"}
                alt={diary.author_name}
                width={40}
                height={40}
                className="rounded-full border-2 border-white/30"
              />
              <span className="font-medium text-white">{diary.author_name}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            {diary.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {diary.readTime} min read
              </span>
            )}
            {diary.destination && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {diary.destination}
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
