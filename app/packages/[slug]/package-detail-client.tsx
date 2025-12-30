"use client"

import { useState, useLayoutEffect } from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, Users, Check, X, Phone, MessageCircle } from "lucide-react"
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

  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pkg.slug])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <section className="pt-20 py-4 sm:py-6 md:py-8 bg-linear-to-b from-transparent via-[oklch(0.99_0.015_85)] to-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8 lg:mt-20">
              {/* Package Summary */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-linear-to-br from-white to-saffron/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-saffron/10 shadow-sm">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {pkg.is_featured && (
                    <Badge className="bg-linear-to-r from-saffron to-sunset-orange text-white border-0 shadow-md px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm">
                      ⭐ Featured
                    </Badge>
                  )}
                  {pkg.category && (
                    <Badge variant="outline" className="capitalize border-2 border-mountain-blue/30 text-mountain-blue font-semibold px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm">
                      {pkg.category}
                    </Badge>
                  )}
                  {pkg.region && (
                    <Badge variant="outline" className="border-2 border-forest-green/30 text-forest-green font-semibold px-3 py-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {pkg.region}
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-serif font-bold bg-linear-to-r from-foreground to-saffron bg-clip-text text-transparent mb-4 sm:mb-6">{pkg.title}</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-mountain-blue/10 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-mountain-blue" />
                    <span className="font-semibold text-mountain-blue">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-forest-green/10 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-forest-green" />
                    <span className="font-semibold text-forest-green">Min {(pkg.min_persons ?? 2)} persons</span>
                  </div>
                </div>

                {/* Hero Slider placed between Title and Description */}
                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-saffron/20">
                  <PackageHeroSlider images={pkg.images || []} title={pkg.title} pdfUrl={pkg.itinerary_pdf_url} />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-foreground mb-3 sm:mb-4">Overview</h3>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">{pkg.description}</p>
                </div>
              </motion.div>

              {/* Highlights */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-linear-to-br from-forest-green/5 to-mountain-blue/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-forest-green/10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-linear-to-br from-forest-green to-mountain-blue flex items-center justify-center">
                      <Check className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground">Tour Highlights</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {pkg.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-forest-green/20 hover:shadow-md hover:border-forest-green/40 transition-all duration-300">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-linear-to-br from-forest-green to-mountain-blue flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <span className="text-foreground font-medium text-xs sm:text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Itinerary */}
              {pkg.itinerary && Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 && (
                <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-linear-to-br from-saffron/5 to-sunset-orange/5 rounded-2xl p-4 sm:p-5 md:p-8 border border-saffron/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-saffron to-sunset-orange flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Day-by-Day Itinerary</h2>
                  </div>
                  <ItineraryAccordion itinerary={pkg.itinerary} />
                </motion.div>
              )}

              {/* Inclusions & Exclusions */}
              {((pkg.inclusions && pkg.inclusions.length > 0) || (pkg.exclusions && pkg.exclusions.length > 0)) && (
                <motion.div
                  variants={slideInRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
                >
                  {pkg.inclusions && pkg.inclusions.length > 0 && (
                    <div className="bg-linear-to-br from-forest-green/5 to-forest-green/10 border-2 border-forest-green/20 rounded-2xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-forest-green flex items-center justify-center">
                          <Check className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                        </div>
                        <h3 className="text-base sm:text-xl font-serif font-bold text-foreground">
                          What's Included
                        </h3>
                      </div>
                      <ul className="space-y-2 sm:space-y-3">
                        {pkg.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 text-foreground">
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-forest-green shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pkg.exclusions && pkg.exclusions.length > 0 && (
                    <div className="bg-linear-to-br from-destructive/5 to-destructive/10 border-2 border-destructive/20 rounded-2xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-destructive flex items-center justify-center">
                          <X className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                        </div>
                        <h3 className="text-base sm:text-xl font-serif font-bold text-foreground">
                          What's Not Included
                        </h3>
                      </div>
                      <ul className="space-y-2 sm:space-y-3">
                        {pkg.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 text-foreground">
                            <X className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm font-medium">{item}</span>
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
                  className="bg-linear-to-br from-white via-saffron/5 to-sunset-orange/10 border-2 border-saffron/20 rounded-3xl p-5 shadow-xl"
                >
                  <div className="mb-4 pb-4 border-b border-saffron/20">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Tour Price</p>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold bg-linear-to-r from-saffron to-sunset-orange bg-clip-text text-transparent">₹{pkg.price?.toLocaleString()}</span>
                      {pkg.original_price && pkg.original_price > pkg.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{pkg.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">per person</p>
                    {pkg.original_price && pkg.original_price > pkg.price && (
                      <Badge className="mt-2 bg-linear-to-r from-forest-green to-mountain-blue text-white border-0 px-2 py-0.5 text-xs shadow-md">
                        🎉 Save ₹{(pkg.original_price - pkg.price).toLocaleString()}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-saffron/20">
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-mountain-blue/10 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-mountain-blue" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-semibold text-sm text-foreground truncate">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-forest-green/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-forest-green" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Destination</p>
                        <p className="font-semibold text-sm text-foreground truncate">{pkg.region || "Himachal Pradesh"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-saffron" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Group Size</p>
                        <p className="font-semibold text-sm text-foreground">Min {(pkg.min_persons ?? 2)} persons</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-linear-to-r from-saffron to-sunset-orange hover:from-saffron/90 hover:to-sunset-orange/90 text-white gap-2 shadow-lg hover:shadow-xl transition-all h-10 text-sm">
                          📅 Book This Tour
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Book {pkg.title}</DialogTitle>
                          <DialogDescription>
                            Fill in your details and we'll get back to you within 12 hours.
                          </DialogDescription>
                        </DialogHeader>
                        <PackageBookingForm packageName={pkg.title} packagePrice={pkg.price} onSuccess={() => { }} />
                      </DialogContent>
                    </Dialog>

                    <Button
                      asChild
                      className="w-full bg-linear-to-r from-forest-green to-mountain-blue hover:from-forest-green/90 hover:to-mountain-blue/90 text-white gap-2 shadow-md hover:shadow-lg transition-all h-10 text-sm"
                    >
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Booking
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full gap-2 bg-white/60 border-2 border-saffron/20 hover:bg-saffron/10 hover:border-saffron/40 h-10 text-sm">
                      <a href={`tel:${(settings?.contact_phone || "").replace(/\s/g, "")}`}>
                        <Phone className="h-4 w-4" />
                        Call Now
                      </a>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-3">
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
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <RelatedPackagesCarousel packages={allPackages} currentSlug={pkg.slug} />
          </div>
        </section>
      )}

      {/* Sticky Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-white to-saffron/10 backdrop-blur-md border-t-2 border-saffron/30 p-4 lg:hidden z-50 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-bold bg-linear-to-r from-saffron to-sunset-orange bg-clip-text text-transparent">₹{pkg.price?.toLocaleString()}</span>
            <p className="text-xs text-muted-foreground font-medium">per person</p>
          </div>
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="flex-1 max-w-50 bg-linear-to-r from-saffron to-sunset-orange hover:from-saffron/90 hover:to-sunset-orange/90 text-white gap-2 shadow-lg"
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
