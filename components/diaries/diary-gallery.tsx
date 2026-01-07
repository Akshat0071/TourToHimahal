"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { fadeInUp } from "@/lib/animation-variants"

interface DiaryGalleryProps {
  images: string[]
  title: string
}

export function DiaryGallery({ images, title }: DiaryGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)

  const goToPrevious = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
  }

  const goToNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
  }

  return (
    <>
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-12"
      >
        <h2 className="text-foreground mb-6 font-serif text-2xl font-bold md:text-3xl">Photo Gallery</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((image, index) => (
            <motion.button
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg"
              onClick={() => openLightbox(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white"
              onClick={closeLightbox}
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navigation */}
            <button
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 p-2 text-white/70 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <button
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 p-2 text-white/70 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              <ChevronRight className="h-10 w-10" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative m-8 h-full max-h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex] || "/placeholder.svg"}
                alt={`${title} - Image ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
