"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/lib/settings-context"
import { Car, MapPin, Shield, Clock, CheckCircle2, ArrowRight } from "lucide-react"
import { slideInLeft, slideInRight } from "@/lib/animation-variants"

// Ensure pasted URLs (including Cloudinary) work reliably like in the Hero
function getImageUrl(url: string): string {
  if (!url) return "/placeholder.svg"
  const trimmed = url.trim()
  const normalized = trimmed.startsWith("/http") ? trimmed.slice(1) : trimmed
  return normalized
}

export function TaxiService() {
  const { settings } = useSettings()

  const routes = [
    "Chandigarh to Manali",
    "Delhi to Shimla",
    "Airport Pickups",
    "Local Sightseeing",
    "Dharamshala Tours",
    "Inter-state Transfers",
  ]

  const features = [
    { icon: Car, text: "AC & Non-AC Vehicles", color: "from-mountain-blue to-forest-green" },
    { icon: MapPin, text: "Flexible Routes", color: "from-saffron to-sunset-orange" },
    { icon: Shield, text: "Verified Drivers", color: "from-forest-green to-golden-yellow" },
    { icon: Clock, text: "24/7 Availability", color: "from-sunset-orange to-temple-red" },
  ]

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-linear-to-br from-[oklch(0.97_0.03_145)] via-[oklch(0.98_0.02_160)] to-[oklch(0.96_0.025_180)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 md:w-1/2 h-full bg-linear-to-l from-forest-green/10 to-transparent" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-10 xl:gap-12 items-center max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInLeft}
            className="relative order-1 lg:order-1"
          >
            <div className="relative h-[240px] sm:h-[300px] md:h-[380px] lg:h-[480px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={getImageUrl("https://res.cloudinary.com/dabqqymqe/image/upload/v1765974268/zla7y765gubxllghbnc8.jpg")}
                alt="Premium Taxi Service"
                fill
                className="object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-tr from-forest-green/40 via-transparent to-saffron/20" />

              {/* Decorative frame */}
              <div className="absolute inset-2 md:inset-4 border-2 border-white/30 rounded-xl md:rounded-2xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:-bottom-8 md:-right-8 bg-linear-to-br from-card to-[oklch(0.98_0.02_145)] p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border-2 border-forest-green/20"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-linear-to-br from-forest-green to-mountain-blue rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">20+</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Verified Drivers</p>
                </div>
              </div>
            </motion.div>

            {/* Second floating element */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 bg-linear-to-r from-saffron to-sunset-orange p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl text-white"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="font-semibold text-xs sm:text-sm md:text-base">Trusted Service</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInRight}
            className="lg:pl-8 order-2 lg:order-2"
          >
            {/* Section label */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-saffron/15 rounded-full mb-1 sm:mb-2 md:mb-3">
              <Car className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-saffron" />
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-saffron uppercase tracking-wider">
                Reliable Transportation
              </span>
            </div>

            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-1 sm:mt-2 md:mt-3 mb-1.5 sm:mb-2 md:mb-3 leading-tight">
              Premium{" "}
              <span className="text-saffron">
                Taxi Services
              </span>
            </h2>
            <p className="text-muted-foreground mb-3 sm:mb-4 md:mb-5 text-xs sm:text-sm md:text-base lg:text-lg leading-snug">
              Travel comfortably across Himachal Pradesh with our fleet of well-maintained vehicles and experienced
              local drivers who know every route like the back of their hand.
            </p>

            <div className="grid grid-cols-2 gap-2 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-5">
              {features.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/60 hover:bg-white transition-colors group border border-forest-green/10"
                >
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 bg-linear-to-br ${item.color} rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0`}
                  >
                    <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-foreground leading-tight">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mb-3 sm:mb-4 md:mb-5">
              <h4 className="font-bold text-foreground mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-forest-green" />
                Popular Routes
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {routes.map((route) => (
                  <span
                    key={route}
                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-white/80 rounded-full text-[10px] sm:text-xs md:text-sm font-medium text-foreground border border-border hover:border-forest-green/50 hover:bg-forest-green/5 transition-all cursor-pointer"
                  >
                    {route}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 md:gap-3 mt-3 sm:mt-4 md:mt-5">
              <Button
                size="lg"
                variant="green"
                className="gap-1.5 sm:gap-2 w-full sm:w-auto text-xs sm:text-sm md:text-base h-9 sm:h-10 md:h-11"
                asChild
              >
                <a
                  href={`https://wa.me/${(settings?.whatsapp_number || "").replace(/[^0-9]/g, "")}?text=Hi, I want to book a taxi`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Taxi on WhatsApp
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 bg-white/50 w-full sm:w-auto text-xs sm:text-sm md:text-base h-9 sm:h-10 md:h-11"
                asChild
              >
                <Link href="/taxi">View All Routes</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
