"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PackageHeroSliderProps {
  images: string[]
  title: string
  pdfUrl?: string | null // Made pdfUrl optional to handle null values from database
}

export function PackageHeroSlider({ images, title, pdfUrl }: PackageHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const displayImages =
    images.length > 0 ? images : [`/placeholder.svg?height=600&width=1200&query=${encodeURIComponent(title)}`]

  // Auto-advance the slider every 1.5s when multiple images are available
  useEffect(() => {
    if (displayImages.length <= 1) return

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    }, 3000)

    return () => clearInterval(id)
  }, [displayImages.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl md:aspect-[21/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={displayImages[currentIndex] || "/placeholder.svg"}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Download Button - only show if pdfUrl exists */}
        {pdfUrl && (
          <Button asChild variant="secondary" className="absolute right-4 bottom-4 gap-2">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download>
              <Download className="h-4 w-4" />
              Download Itinerary
            </a>
          </Button>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === currentIndex
                  ? "border-primary ring-primary/30 ring-2"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
