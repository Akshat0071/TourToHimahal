"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PackageCard } from "./package-card"

interface Package {
  id: string
  title: string
  slug: string
  description: string
  short_description?: string
  price: number
  original_price?: number
  duration: string
  highlights?: string[]
  inclusions?: string[]
  exclusions?: string[]
  category?: string
  images?: string[]
  is_active: boolean
  is_featured: boolean
}

interface RelatedPackagesCarouselProps {
  packages: Package[]
  currentSlug: string
}

export function RelatedPackagesCarousel({ packages, currentSlug }: RelatedPackagesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const relatedPackages = packages.filter((pkg) => pkg.slug !== currentSlug).slice(0, 4)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (relatedPackages.length === 0) return null

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-foreground font-serif text-2xl font-bold">Similar Packages</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-hide -mx-4 flex gap-6 overflow-x-auto px-4 pb-4">
        {relatedPackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            className="w-[320px] flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <PackageCard pkg={pkg} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
