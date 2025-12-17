"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface StaticHeroProps {
  image: string
  title: string
  subtitle: string
  badge?: string
  children?: React.ReactNode
}

// Helper function to ensure Cloudinary images work directly
function getImageUrl(url: string): string {
  if (url.includes("cloudinary.com") || url.includes("res.cloudinary.com")) {
    return url
  }
  return url || "/placeholder.svg"
}

export function StaticHero({ image, title, subtitle, badge, children }: StaticHeroProps) {
  return (
    <section className="relative min-h-[40vh] min-h-[40svh] overflow-hidden flex items-center">
      {/* Static Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(image) || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-mountain-blue/20 via-transparent to-saffron/20" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-10 sm:py-12 md:py-16">
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
                className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-white bg-gradient-to-r from-saffron/40 to-sunset-orange/40 backdrop-blur-md rounded-full border border-white/30 mt-6 sm:mt-0"
              >
                <Star className="h-3 w-3 md:h-4 md:w-4 text-golden-yellow fill-golden-yellow" />
                <span className="bg-gradient-to-r from-golden-yellow via-white to-golden-yellow bg-clip-text text-transparent font-semibold text-xs md:text-sm">
                  {badge}
                </span>
                <Star className="h-3 w-3 md:h-4 md:w-4 text-golden-yellow fill-golden-yellow" />
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white mb-3 md:mb-4 leading-tight tracking-tight [text-wrap:balance] break-words"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-golden-yellow to-white">
                {title}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-3xl mx-auto text-pretty leading-relaxed mt-2 sm:mt-0"
            >
              {subtitle}
            </motion.p>

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4 md:mt-6"
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
