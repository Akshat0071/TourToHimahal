"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useAnimationFrame } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Car, MapPin, Star } from "lucide-react"

interface HeroImage {
  url: string
  alt: string
}

interface HeroProps {
  images?: HeroImage[]
}

const defaultHeroImages: HeroImage[] = [
  { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967133/hqjivfndozpkicr5eddz.png", alt: "Majestic Himalayan Mountains" },
  { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967996/nmnqkuvgik8wokp82kiv.jpg", alt: "Chintpurni Temple" },
  { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765968189/ouf49gwwxagurjq2aqbi.png", alt: "Himalayan Rivers and Waterfalls" },
  { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967283/yegxwa1cdjow0g8madso.png", alt: "Trekking in Himalayas" },
  { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967269/flj6ga0vacjary3hscgt.png", alt: "Paragliding in Bir Billing" },
  { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967986/grcidxlhudsgstymd0cu.webp", alt: "Jwala Ji Temple" },
  { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765968158/i7ebhijld1ooby1khlab.jpg", alt: "Naina Devi Temple" },
]

// Helper function to ensure Cloudinary images work directly
function getImageUrl(url: string): string {
  if (url.includes("cloudinary.com") || url.includes("res.cloudinary.com")) {
    return url
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
    const speed = 0.03
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
            <div key={index} className="relative h-full w-75 md:w-100 shrink-0">
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

      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-linear-to-r from-mountain-blue/30 via-transparent to-saffron/20" />

      <div className="relative z-10 flex min-h-screen items-center justify-center pt-24 sm:pt-28 md:pt-24 pb-8">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 mb-4 md:mb-8 text-[10px] sm:text-xs md:text-sm font-medium text-white bg-linear-to-r from-saffron/30 to-sunset-orange/30 backdrop-blur-md rounded-full border border-white/20 max-w-[90vw]"
            >
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-golden-yellow fill-golden-yellow shrink-0" />
              <span className="text-center whitespace-nowrap sm:whitespace-normal">Discover the Magic of Himachal</span>
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-golden-yellow fill-golden-yellow shrink-0" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-5 md:mb-9 leading-[1.05] tracking-tight px-2"
            >
              <span className="block whitespace-nowrap">Your Gateway to</span>
              <span className="block whitespace-nowrap text-transparent bg-clip-text bg-linear-to-r from-golden-yellow via-saffron to-sunset-orange">
                Himalayan Adventures
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 mb-6 sm:mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Experience breathtaking mountains, sacred temples, thrilling adventures, and seamless travel with our
              curated tour packages and reliable taxi services.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
            >
              <Button
                asChild
                variant="gradient"
                size="lg"
                className="text-xs sm:text-sm md:text-lg px-4 sm:px-6 md:px-10 w-full sm:w-auto h-10 sm:h-11 md:h-12"
              >
                <Link href="/packages">
                  <MapPin className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  Explore Packages
                  <ChevronRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white/95 text-mountain-blue hover:bg-white text-xs sm:text-sm md:text-lg px-4 sm:px-6 md:px-10 shadow-xl w-full sm:w-auto h-10 sm:h-11 md:h-12"
              >
                <Link href="/taxi">
                  <Car className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  Taxi Booking
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-8 sm:mt-10 md:mt-16 grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 lg:gap-16 px-2 sm:px-4"
            >
              {[
                { value: "500+", label: "Happy Travelers" },
                { value: "50+", label: "Tour Packages" },
                { value: "100+", label: "Destinations" },
                { value: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-2 sm:p-3 md:p-0 rounded-xl bg-white/5 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
                >
                  <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-golden-yellow">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-white/70 mt-0.5 sm:mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="w-6 h-10 md:w-7 md:h-12 rounded-full border-2 border-golden-yellow/50 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-2.5 md:w-2 md:h-3 bg-golden-yellow rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
