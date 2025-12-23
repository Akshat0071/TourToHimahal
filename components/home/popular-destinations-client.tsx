"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, IndianRupee, MapPin, ArrowRight } from "lucide-react"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"

interface Package {
  id: string
  title: string
  slug: string
  short_description?: string
  price: number
  duration: string
  images?: string[]
  is_featured: boolean
}

interface PopularDestinationsClientProps {
  packages: Package[]
}

// Fallback data if no packages from database
const fallbackDestinations = [
  {
    name: "Manali",
    image: "/manali-snow-mountains.jpg",
    duration: "3 Days / 2 Nights",
    price: "8,999",
    slug: "manali",
  },
  {
    name: "Shimla",
    image: "/shimla-hills-colonial.jpg",
    duration: "2 Days / 1 Night",
    price: "5,499",
    slug: "shimla",
  },
  {
    name: "Dharamshala",
    image: "/dharamshala-monastery.jpg",
    duration: "3 Days / 2 Nights",
    price: "7,999",
    slug: "dharamshala",
  },
]

export function PopularDestinationsClient({ packages }: PopularDestinationsClientProps) {
  // Use packages from database or fallback
  const destinations =
    packages.length > 0
      ? packages.map((pkg) => ({
          name: pkg.title,
          image: pkg.images?.[0] || `/placeholder.svg?height=400&width=600&query=${pkg.title} himachal`,
          duration: pkg.duration,
          price: pkg.price.toLocaleString("en-IN"),
          slug: pkg.slug,
        }))
      : fallbackDestinations

  return (
    <section className="py-8 md:py-8 lg:py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-saffron/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-forest-green/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-8 md:mb-10"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-mountain-blue/10 rounded-full mb-2 md:mb-3"
          >
            <MapPin className="h-4 w-4 text-mountain-blue" />
            <span className="text-sm font-semibold text-mountain-blue uppercase tracking-wider">Explore Himachal</span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-serif font-bold text-foreground mt-2 md:mt-3 mb-2 md:mb-3"
          >
            Popular{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mountain-blue to-forest-green">
              Destinations
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg mb-2">
            Discover the most sought-after destinations in Himachal Pradesh, from snow-capped mountains to serene
            valleys.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
        >
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              variants={fadeInUp}
              whileHover={{ y: -12 }}
              className="group relative bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-saffron/30"
            >
              <Link href={`/packages/${destination.slug}`}>
                {/* Image with overlay */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Featured badge */}
                  {index === 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-saffron to-sunset-orange text-white text-xs font-bold rounded-full">
                      POPULAR
                    </div>
                  )}

                  {/* Price tag */}
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                    <div className="flex items-center text-forest-green font-bold">
                      <IndianRupee className="h-4 w-4" />
                      {destination.price}
                    </div>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">{destination.name}</h3>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-5 flex items-center justify-between bg-gradient-to-r from-background to-muted/30">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    {destination.duration}
                  </div>
                  <Button size="sm" variant="saffron" className="group-hover:translate-x-1 transition-transform">
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-10"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-mountain-blue text-mountain-blue hover:bg-mountain-blue hover:text-white bg-transparent"
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
