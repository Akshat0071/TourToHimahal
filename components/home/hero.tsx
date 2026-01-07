"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useAnimationFrame } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Car, MapPin } from "lucide-react"
import { optimizeCloudinaryDeliveryUrl } from "@/lib/cloudinary"

interface HeroImage {
  url: string
  alt: string
}

interface HeroProps {
  images?: HeroImage[]
}

const defaultHeroImages: HeroImage[] = [
  {
    url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795277/v7svtjhbjhj6cyadgfhz.webp",
    alt: "Majestic Himalayan Mountains",
  },
  {
    url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767794969/himachal-yatra/packages/jbngdslx5ivqucojuvx3.webp",
    alt: "Chintpurni Temple",
  },
  {
    url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795334/cp0egvkhziyen6h57ffg.webp",
    alt: "Himalayan Rivers and Waterfalls",
  },
  {
    url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795291/bacq5glu6429fkmwvv6b.webp",
    alt: "Trekking in Himalayas",
  },
]

// Helper function to ensure Cloudinary images work directly
function getImageUrl(url: string): string {
  if (url.includes("cloudinary.com") || url.includes("res.cloudinary.com")) {
    // Each tile is ~300-400px wide; serve a sharper but still lightweight image.
    return optimizeCloudinaryDeliveryUrl(url, { width: 800, quality: "auto", format: "auto", crop: "limit" })
  }
  return url || "/placeholder.svg"
}

export function Hero({ images }: HeroProps) {
  const heroImages = images && images.length > 0 ? images : defaultHeroImages
  const allImages = [...heroImages, ...heroImages]

  const containerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)

  useAnimationFrame((time, delta) => {
    if (!containerRef.current) return
    const speed = 0.06
    xRef.current -= delta * speed
    const totalWidth = heroImages.length * 400
    if (Math.abs(xRef.current) >= totalWidth) {
      xRef.current = 0
    }
    containerRef.current.style.transform = `translateX(${xRef.current}px)`
  })

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Infinite Scrolling Background */}
      <div className="absolute inset-0">
        <div ref={containerRef} className="flex h-full" style={{ width: `${allImages.length * 400}px` }}>
          {allImages.map((image, index) => (
            <div key={index} className="relative h-full w-75 shrink-0 md:w-100">
              <img
                src={getImageUrl(image.url) || "/placeholder.svg"}
                alt={image.alt}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "low"}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/80" />
      <div className="from-mountain-blue/30 to-saffron/20 absolute inset-0 bg-linear-to-r via-transparent" />

      <div className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-8 sm:pt-28 md:pt-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="from-saffron/30 to-sunset-orange/30 mb-4 inline-flex max-w-[90vw] items-center gap-1 rounded-full border border-white/20 bg-linear-to-r px-2 py-1.5 text-[10px] font-medium text-white backdrop-blur-md sm:gap-2 sm:px-3 sm:py-2 sm:text-xs md:mb-8 md:px-5 md:text-sm"
            >
              <span className="text-center whitespace-nowrap sm:whitespace-normal">
                Discover the Magic of Himachal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="xs:text-4xl mb-5 px-2 font-serif text-3xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl md:mb-9 md:text-6xl lg:text-7xl"
            >
              <span className="block whitespace-nowrap">Your Gateway to</span>
              <span className="block whitespace-nowrap text-[#fc9700]">Himalayan Adventures</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mx-auto mb-6 max-w-3xl px-4 text-xs leading-relaxed text-white/90 sm:mb-8 sm:text-sm md:mb-12 md:text-base lg:text-lg xl:text-xl"
            >
              Experience breathtaking mountains, sacred temples, thrilling adventures, and seamless travel
              with our curated tour packages and reliable taxi services.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col justify-center gap-3 px-4 sm:flex-row md:gap-4"
            >
              <Button
                asChild
                variant="gradient"
                size="lg"
                className="h-10 w-full px-4 text-xs sm:h-11 sm:w-auto sm:px-6 sm:text-sm md:h-12 md:px-10 md:text-lg"
              >
                <Link href="/packages">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  Explore Packages
                  <ChevronRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="text-mountain-blue h-10 w-full bg-white/95 px-4 text-xs shadow-xl hover:bg-white sm:h-11 sm:w-auto sm:px-6 sm:text-sm md:h-12 md:px-10 md:text-lg"
              >
                <Link href="/taxi">
                  <Car className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  Taxi Booking
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-8 grid grid-cols-2 justify-center gap-3 px-2 sm:mt-10 sm:gap-4 sm:px-4 md:mt-16 md:flex md:flex-wrap md:gap-8 lg:gap-16"
            >
              {[
                { value: "500+", label: "Happy Travelers" },
                { value: "50+", label: "Tour Packages" },
                { value: "100+", label: "Destinations" },
                { value: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white/5 p-2 text-center backdrop-blur-sm sm:p-3 md:bg-transparent md:p-0 md:backdrop-blur-none"
                >
                  <div className="xs:text-xl text-golden-yellow text-lg font-bold sm:text-2xl md:text-3xl lg:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[10px] text-white/70 sm:mt-1 sm:text-xs md:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/** Scroll indicator removed for cleaner hero UI */}
    </section>
  )
}
