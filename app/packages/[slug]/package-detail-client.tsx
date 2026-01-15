"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, Users, Check, X, Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PackageHeroSlider } from "@/components/packages/package-hero-slider"
import { RelatedPackagesCarousel } from "@/components/packages/related-packages-carousel"
import { ItineraryAccordion } from "@/components/packages/itinerary-accordion"
import { PackageBookingForm } from "@/components/packages/package-booking-form"
import { useSettings } from "@/lib/settings-context"
import { generateWhatsAppLink } from "@/lib/whatsapp"
import { fadeInUp, slideInLeft, slideInRight } from "@/lib/animation-variants"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Package {
  id: string
  slug: string
  title: string
  description: string
  short_description?: string
  price: number
  original_price?: number
  duration: string
  region?: string
  min_persons?: number
  highlights?: string[]
  inclusions?: string[]
  exclusions?: string[]
  category?: string
  images?: string[]
  itinerary?: any
  itinerary_pdf_url?: string
  is_active: boolean
  is_featured: boolean
  seo_title?: string
  seo_description?: string
}

interface PackageDetailClientProps {
  pkg: Package
  allPackages: Package[]
}

export function PackageDetailClient({ pkg, allPackages }: PackageDetailClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { settings } = useSettings()
  const whatsappLink = generateWhatsAppLink({ packageName: pkg.title }, settings?.whatsapp_number)

  useEffect(() => {
    // Next.js can restore scroll position after navigation; run this after paint to reliably land at top.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const scrollingElement = document.scrollingElement || document.documentElement
        scrollingElement.scrollTop = 0
        document.body.scrollTop = 0
        window.scrollTo({ top: 0, left: 0, behavior: "auto" })
      })
    })
  }, [pkg.slug])

  return (
    <main className="bg-background min-h-screen">
      <Header />

      {/* Main Content */}
      <section className="to-background bg-linear-to-b from-transparent via-[oklch(0.99_0.015_85)] py-4 pt-20 sm:py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Content */}
            {/* Left Content */}
            <div className="space-y-8 lg:col-span-2 lg:mt-20">
              {/* Package Summary */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="py-2"
              >
                <div className="mb-3 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-2">
                  {pkg.is_featured && (
                    <Badge className="from-saffron to-sunset-orange border-0 bg-linear-to-r px-2 py-0.5 text-xs text-white shadow-md sm:px-3 sm:py-1 sm:text-sm">
                      ⭐ Featured
                    </Badge>
                  )}
                  {pkg.category && (
                    <Badge
                      variant="outline"
                      className="border-mountain-blue/30 text-mountain-blue border-2 px-2 py-0.5 text-xs font-semibold capitalize sm:px-3 sm:py-1 sm:text-sm"
                    >
                      {pkg.category}
                    </Badge>
                  )}
                  {pkg.region && (
                    <Badge
                      variant="outline"
                      className="border-forest-green/30 text-forest-green flex items-center gap-1 border-2 px-3 py-1 font-semibold"
                    >
                      <MapPin className="h-3 w-3" />
                      {pkg.region}
                    </Badge>
                  )}
                </div>
                <h1 className="mb-4 font-serif text-xl font-bold text-[#fc9700] sm:mb-6 sm:text-2xl md:text-4xl">
                  {pkg.title}
                </h1>

                {/* Hero Slider placed between Title and Description */}
                <div className="border-saffron/20 mb-8 overflow-hidden rounded-lg border shadow-lg">
                  <PackageHeroSlider
                    images={pkg.images || []}
                    title={pkg.title}
                    pdfUrl={pkg.itinerary_pdf_url}
                  />
                </div>

                <div>
                  <h3 className="text-foreground mb-3 font-serif text-lg font-bold sm:mb-4 sm:text-xl md:text-2xl">
                    Overview
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base md:text-lg">
                    {pkg.description}
                  </p>
                </div>
              </motion.div>

              {/* Highlights */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <motion.div
                  variants={slideInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="py-2"
                >
                  <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
                    <div className="from-forest-green to-mountain-blue flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br sm:h-10 sm:w-10">
                      <Check className="h-4 w-4 text-white sm:h-6 sm:w-6" />
                    </div>
                    <h2 className="text-foreground font-serif text-lg font-bold sm:text-2xl md:text-3xl">
                      Tour Highlights
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {pkg.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="border-forest-green/20 hover:border-forest-green/40 flex items-start gap-2 rounded-lg border bg-white/80 p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-md sm:gap-3 sm:rounded-xl sm:p-4"
                      >
                        <div className="from-forest-green to-mountain-blue mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br sm:h-6 sm:w-6">
                          <Check className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                        </div>
                        <span className="text-foreground text-xs font-medium sm:text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Itinerary */}
              {pkg.itinerary && Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 && (
                <motion.div
                  variants={slideInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="py-2"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="from-saffron to-sunset-orange flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-foreground font-serif text-2xl font-bold md:text-3xl">
                      Day-by-Day Itinerary
                    </h2>
                  </div>
                  <ItineraryAccordion itinerary={pkg.itinerary} />
                </motion.div>
              )}

              {/* Inclusions & Exclusions */}
              {((pkg.inclusions && pkg.inclusions.length > 0) ||
                (pkg.exclusions && pkg.exclusions.length > 0)) && (
                <motion.div
                  variants={slideInRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
                >
                  {pkg.inclusions && pkg.inclusions.length > 0 && (
                    <div className="from-forest-green/5 to-forest-green/10 border-forest-green/20 rounded-2xl border-2 bg-linear-to-br p-4 shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:p-6">
                      <div className="mb-3 flex items-center gap-2 sm:mb-5 sm:gap-3">
                        <div className="bg-forest-green flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10">
                          <Check className="h-4 w-4 text-white sm:h-6 sm:w-6" />
                        </div>
                        <h3 className="text-foreground font-serif text-base font-bold sm:text-xl">
                          What's Included
                        </h3>
                      </div>
                      <ul className="space-y-2 sm:space-y-3">
                        {pkg.inclusions.map((item, index) => (
                          <li key={index} className="text-foreground flex items-start gap-2 sm:gap-3">
                            <Check className="text-forest-green mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                            <span className="text-xs font-medium sm:text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pkg.exclusions && pkg.exclusions.length > 0 && (
                    <div className="from-destructive/5 to-destructive/10 border-destructive/20 rounded-2xl border-2 bg-linear-to-br p-4 shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:p-6">
                      <div className="mb-3 flex items-center gap-2 sm:mb-5 sm:gap-3">
                        <div className="bg-destructive flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10">
                          <X className="h-4 w-4 text-white sm:h-6 sm:w-6" />
                        </div>
                        <h3 className="text-foreground font-serif text-base font-bold sm:text-xl">
                          What's Not Included
                        </h3>
                      </div>
                      <ul className="space-y-2 sm:space-y-3">
                        {pkg.exclusions.map((item, index) => (
                          <li key={index} className="text-foreground flex items-start gap-2 sm:gap-3">
                            <X className="text-destructive mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                            <span className="text-xs font-medium sm:text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar - Booking Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <motion.div
                  variants={slideInRight}
                  initial="hidden"
                  animate="visible"
                  className="via-saffron/5 to-sunset-orange/10 border-saffron/20 rounded-3xl border-2 bg-linear-to-br from-white p-5 shadow-xl"
                >
                  <div className="border-saffron/20 mb-4 border-b pb-4">
                    <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
                      Tour Price
                    </p>
                    <div className="mb-1 flex items-baseline gap-2">
                      <span className="from-saffron to-sunset-orange bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent">
                        ₹{pkg.price?.toLocaleString()}
                      </span>
                      {pkg.original_price && pkg.original_price > pkg.price && (
                        <span className="text-muted-foreground text-sm line-through">
                          ₹{pkg.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">per person</p>
                    {pkg.original_price && pkg.original_price > pkg.price && (
                      <Badge className="from-forest-green to-mountain-blue mt-2 border-0 bg-linear-to-r px-2 py-0.5 text-xs text-white shadow-md">
                        🎉 Save ₹{(pkg.original_price - pkg.price).toLocaleString()}
                      </Badge>
                    )}
                  </div>

                  <div className="border-saffron/20 mb-4 space-y-2 border-b pb-4">
                    <div className="flex items-center gap-2 rounded-lg bg-white/60 p-2">
                      <div className="bg-mountain-blue/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                        <Clock className="text-mountain-blue h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-xs">Duration</p>
                        <p className="text-foreground truncate text-sm font-semibold">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/60 p-2">
                      <div className="bg-forest-green/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                        <MapPin className="text-forest-green h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-xs">Destination</p>
                        <p className="text-foreground truncate text-sm font-semibold">
                          {pkg.region || "Himachal Pradesh"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/60 p-2">
                      <div className="bg-saffron/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                        <Users className="text-saffron h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-xs">Group Size</p>
                        <p className="text-foreground text-sm font-semibold">
                          Min {pkg.min_persons ?? 2} persons
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                      <DialogTrigger asChild>
                        <Button className="from-saffron to-sunset-orange hover:from-saffron/90 hover:to-sunset-orange/90 h-10 w-full gap-2 bg-linear-to-r text-sm text-white shadow-lg transition-all hover:shadow-xl">
                          📅 Book This Tour
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Book {pkg.title}</DialogTitle>
                          <DialogDescription>
                            Fill in your details and we'll get back to you within 12 hours.
                          </DialogDescription>
                        </DialogHeader>
                        <PackageBookingForm
                          packageName={pkg.title}
                          packagePrice={pkg.price}
                          onSuccess={() => {}}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      asChild
                      className="from-forest-green to-mountain-blue hover:from-forest-green/90 hover:to-mountain-blue/90 h-10 w-full gap-2 bg-linear-to-r text-sm text-white shadow-md transition-all hover:shadow-lg"
                    >
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="h-4 w-4" />
                        WhatsApp Booking
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-saffron/20 hover:bg-saffron/10 hover:border-saffron/40 h-10 w-full gap-2 border-2 bg-white/60 text-sm"
                    >
                      <a href={`tel:${(settings?.contact_phone || "").replace(/\s/g, "")}`}>
                        <Phone className="h-4 w-4" />
                        Call Now
                      </a>
                    </Button>
                  </div>

                  <p className="text-muted-foreground mt-3 text-center text-xs">
                    No payment required to book. Pay later at your convenience.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      {allPackages.length > 1 && (
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <RelatedPackagesCarousel packages={allPackages} currentSlug={pkg.slug} />
          </div>
        </section>
      )}

      {/* Sticky Mobile Booking Bar */}
      <div className="to-saffron/10 border-saffron/30 fixed right-0 bottom-0 left-0 z-50 border-t-2 bg-linear-to-r from-white p-4 shadow-2xl backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="from-saffron to-sunset-orange bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent">
              ₹{pkg.price?.toLocaleString()}
            </span>
            <p className="text-muted-foreground text-xs font-medium">per person</p>
          </div>
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="from-saffron to-sunset-orange hover:from-saffron/90 hover:to-sunset-orange/90 max-w-50 flex-1 gap-2 bg-linear-to-r text-white shadow-lg"
          >
            📅 Book Now
          </Button>
        </div>
      </div>

      <div className="pb-20 lg:pb-0">
        <Footer />
      </div>
    </main>
  )
}
