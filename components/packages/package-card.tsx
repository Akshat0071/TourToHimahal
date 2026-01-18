"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cardHover, fadeInUp } from "@/lib/animation-variants"
import { useSettings } from "@/lib/settings-context"
import { generateWhatsAppLink } from "@/lib/whatsapp"

interface Package {
  id: string
  title: string
  slug: string
  description?: string
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
  region?: string
}

interface PackageCardProps {
  pkg: Package
}

export function PackageCard({ pkg }: PackageCardProps) {
  const { settings } = useSettings()
  const whatsappLink = generateWhatsAppLink({ packageName: pkg.title }, settings.whatsapp_number)

  // Calculate discount percentage
  const discountPercent =
    pkg.original_price && pkg.original_price > pkg.price
      ? Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)
      : 0

  return (
    <motion.div
      variants={fadeInUp}
      initial="rest"
      whileHover="hover"
      className="group border-saffron/10 hover:border-saffron/30 overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-[oklch(0.99_0.015_85)] to-[oklch(0.97_0.025_70)] shadow-md transition-all duration-300 hover:shadow-xl md:rounded-3xl"
    >
      <Link
        href={`/packages/${pkg.slug}`}
        className="focus-visible:ring-saffron focus-visible:ring-offset-background block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <motion.div variants={cardHover} className="flex h-full flex-col">
          {/* Image */}
          <div className="bg-muted/30 relative aspect-[4/3] overflow-hidden">
            <Image
              src={pkg.images?.[0] || `/placeholder.svg?height=400&width=600&query=${pkg.title}`}
              alt={pkg.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            

            {/* Featured Badge */}
            {pkg.is_featured && (
              <div className="absolute top-3 left-3">
                <Badge className="from-saffron to-sunset-orange border-0 bg-gradient-to-r text-xs text-white shadow-lg">
                  <Star className="mr-1 h-3 w-3 fill-white" />
                  Featured
                </Badge>
              </div>
            )}

            {/* Region Badge - Bottom Right */}
            {pkg.region && (
              <Badge className="text-forest-green absolute right-3 bottom-3 flex items-center gap-1 border-0 bg-white/90 text-xs shadow-md">
                <MapPin className="h-3 w-3" />
                {pkg.region}
              </Badge>
            )}

            {pkg.category && (
              <Badge className="text-mountain-blue absolute top-3 right-3 border-0 bg-white/90 text-xs shadow-md">
                {pkg.category}
              </Badge>
            )}

            {/* Price and Discount Section at bottom */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-2">
              {discountPercent > 0 && (
                <Badge className="from-forest-green to-mountain-blue w-fit border-0 bg-gradient-to-r text-xs text-white shadow-lg">
                  {discountPercent}% OFF
                </Badge>
              )}
              <div className="rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                <span className="text-saffron text-lg font-bold md:text-xl">
                  ₹{pkg.price?.toLocaleString()}
                </span>
                {pkg.original_price && pkg.original_price > pkg.price && (
                  <span className="text-muted-foreground ml-1.5 text-xs line-through">
                    ₹{pkg.original_price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <h3 className="text-foreground group-hover:text-saffron mb-2 line-clamp-1 font-serif text-base font-semibold transition-colors md:text-lg">
              {pkg.title}
            </h3>

            <p className="text-muted-foreground mb-4 line-clamp-2 text-xs md:text-sm">
              {pkg.short_description || pkg.description}
            </p>

            <div className="text-muted-foreground mt-auto flex items-center justify-between gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-3">
                <span className="bg-mountain-blue/10 flex items-center gap-1 rounded-full px-2 py-1">
                  <Clock className="text-mountain-blue h-3 w-3 md:h-4 md:w-4" />
                  {pkg.duration}
                </span>
              </div>
              <span className="from-forest-green to-mountain-blue inline-flex h-9 items-center gap-1 rounded-full border-0 bg-gradient-to-r px-3 text-xs text-white shadow-md md:h-10 md:px-4 md:text-sm">
                View Details
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
