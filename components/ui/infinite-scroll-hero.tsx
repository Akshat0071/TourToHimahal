"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useAnimationFrame } from "framer-motion"

interface HeroImage {
  url: string
  alt: string
}

interface InfiniteScrollHeroProps {
  images: HeroImage[]
  title: string
  subtitle: string
  badge?: string
  children?: React.ReactNode
}

// Helper function to ensure Cloudinary images work directly
function getImageUrl(url: string): string {
  // If it's already a Cloudinary URL, use it directly
  if (url.includes("cloudinary.com") || url.includes("res.cloudinary.com")) {
    return url
  }
  // Otherwise return as-is (for local images or placeholders)
  return url || "/placeholder.svg"
}

export function InfiniteScrollHero({ images, title, subtitle, badge, children }: InfiniteScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)

  // Duplicate images for seamless loop
  const allImages = [...images, ...images]

  useAnimationFrame((time, delta) => {
    if (!containerRef.current) return
      const speed = 0.06
    xRef.current -= delta * speed
    const totalWidth = images.length * 400
    if (Math.abs(xRef.current) >= totalWidth) {
      xRef.current = 0
    }
    containerRef.current.style.transform = `translateX(${xRef.current}px)`
  })

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Infinite Scrolling Background */}
      <div className="absolute inset-0">
        <div ref={containerRef} className="flex h-full" style={{ width: `${allImages.length * 400}px` }}>
          {allImages.map((image, index) => (
            <div key={index} className="relative h-full w-[300px] md:w-[400px] shrink-0">
              <img
                src={getImageUrl(image.url) || "/placeholder.svg"}
                alt={image.alt}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-mountain-blue/20 via-transparent to-saffron/20" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            {badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-white bg-gradient-to-r from-saffron/40 to-sunset-orange/40 backdrop-blur-md rounded-full border border-white/30"
              >
                <span className="text-white font-semibold">{badge}</span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 text-balance"
            >
              <span className="block text-[#fc9700]">{title}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-base md:text-xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {children && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/** Scroll indicator removed for cleaner hero UI across pages */}
    </section>
  )
}
