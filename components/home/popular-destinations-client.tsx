"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import { PackageCard } from "@/components/packages/package-card"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"

interface Package {
  id: string
  title: string
  slug: string
  description?: string
  short_description?: string
  price: number
  original_price?: number
  duration: string
  category?: string
  region?: string
  images?: string[]
  is_active: boolean
  is_featured: boolean
}

interface PopularDestinationsClientProps {
  packages: Package[]
}

// Fallback data if no packages from database
const fallbackDestinations: Package[] = [
  {
    id: "fallback-manali",
    title: "Manali",
    slug: "manali",
    short_description: "Explore snow-capped mountains and scenic valleys.",
    duration: "3 Days / 2 Nights",
    price: 8999,
    original_price: 9999,
    images: ["/manali-snow-mountains.jpg"],
    is_active: true,
    is_featured: true,
  },
  {
    id: "fallback-shimla",
    title: "Shimla",
    slug: "shimla",
    short_description: "Colonial charm, hills, and beautiful viewpoints.",
    duration: "2 Days / 1 Night",
    price: 5499,
    original_price: 5999,
    images: ["/shimla-hills-colonial.jpg"],
    is_active: true,
    is_featured: true,
  },
  {
    id: "fallback-dharamshala",
    title: "Dharamshala",
    slug: "dharamshala",
    short_description: "Peaceful monasteries and stunning mountain views.",
    duration: "3 Days / 2 Nights",
    price: 7999,
    original_price: 8999,
    images: ["/dharamshala-monastery.jpg"],
    is_active: true,
    is_featured: true,
  },
]

export function PopularDestinationsClient({ packages }: PopularDestinationsClientProps) {
  // Only show packages where is_featured is true
  const filteredPackages = (packages.length > 0 ? packages : fallbackDestinations).filter(pkg => pkg.is_featured)
  const displayedPackages = filteredPackages

  return (
    <section className="relative overflow-hidden py-8 md:py-8 lg:py-12">
      {/* Background decorations */}
      <div className="from-saffron/10 absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-bl to-transparent blur-3xl" />
      <div className="from-forest-green/10 absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr to-transparent blur-3xl" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-8 text-center md:mb-10"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-mountain-blue/10 mb-2 inline-flex items-center gap-2 rounded-full px-4 py-2 md:mb-3"
          >
            <MapPin className="text-mountain-blue h-4 w-4" />
            <span className="text-mountain-blue text-sm font-semibold tracking-wider uppercase">
              Explore Himachal
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-foreground mt-2 mb-2 font-serif text-3xl font-bold md:mt-3 md:mb-3 md:text-5xl"
          >
            Popular <span className="text-mountain-blue">Destinations</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground mx-auto mb-2 max-w-2xl text-lg">
            Discover the most sought-after destinations in Himachal Pradesh, from snow-capped mountains to
            serene valleys.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {displayedPackages.map((pkg) => (
            <motion.div key={pkg.id} variants={fadeInUp}>
              <PackageCard pkg={pkg} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center md:mt-10"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-mountain-blue text-mountain-blue hover:bg-mountain-blue border-2 bg-transparent hover:text-white"
          >
            <Link href="/packages">
              View All Packages
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
