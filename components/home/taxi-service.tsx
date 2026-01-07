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
    <section className="relative overflow-hidden bg-linear-to-br from-[oklch(0.97_0.03_145)] via-[oklch(0.98_0.02_160)] to-[oklch(0.96_0.025_180)] py-8 md:py-12 lg:py-16">
      {/* Background decorations */}
      <div className="from-forest-green/10 absolute top-0 right-0 h-full w-1/3 bg-linear-to-l to-transparent md:w-1/2" />

      <div className="relative container mx-auto px-4">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInLeft}
            className="relative order-1 lg:order-1"
          >
            <div className="relative h-[240px] overflow-hidden rounded-2xl shadow-2xl sm:h-[300px] md:h-[380px] md:rounded-3xl lg:h-[480px]">
              <Image
                src={getImageUrl(
                  "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795626/ltbokgx2veuwypbwmgta.webp",
                )}
                alt="Premium Taxi Service"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              {/* Gradient overlay */}
              <div className="from-forest-green/40 to-saffron/20 absolute inset-0 bg-linear-to-tr via-transparent" />

              {/* Decorative frame */}
              <div className="absolute inset-2 rounded-xl border-2 border-white/30 md:inset-4 md:rounded-2xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="from-card border-forest-green/20 absolute -right-4 -bottom-4 rounded-xl border-2 bg-linear-to-br to-[oklch(0.98_0.02_145)] p-3 shadow-2xl sm:-right-6 sm:-bottom-6 sm:rounded-2xl sm:p-4 md:-right-8 md:-bottom-8 md:rounded-3xl md:p-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="from-forest-green to-mountain-blue flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br shadow-lg sm:h-12 sm:w-12 sm:rounded-xl md:h-16 md:w-16 md:rounded-2xl">
                  <Shield className="h-5 w-5 text-white sm:h-6 sm:w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <p className="text-foreground text-xl font-bold sm:text-2xl md:text-3xl">20+</p>
                  <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">Verified Drivers</p>
                </div>
              </div>
            </motion.div>

            {/* Second floating element */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="from-saffron to-sunset-orange absolute top-4 left-4 rounded-lg bg-linear-to-r p-2 text-white shadow-xl sm:top-6 sm:left-6 sm:rounded-xl sm:p-3 md:top-8 md:left-8 md:rounded-2xl md:p-4"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="text-xs font-semibold sm:text-sm md:text-base">Trusted Service</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInRight}
            className="order-2 lg:order-2 lg:pl-8"
          >
            {/* Section label */}
            <div className="bg-saffron/15 mb-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 sm:mb-2 sm:gap-2 sm:px-3 sm:py-1.5 md:mb-3 md:px-4 md:py-2">
              <Car className="text-saffron h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              <span className="text-saffron text-[10px] font-semibold tracking-wider uppercase sm:text-xs md:text-sm">
                Reliable Transportation
              </span>
            </div>

            <h2 className="xs:text-2xl text-foreground mt-1 mb-1.5 font-serif text-xl leading-tight font-bold sm:mt-2 sm:mb-2 sm:text-3xl md:mt-3 md:mb-3 md:text-3xl lg:text-4xl">
              Premium <span className="text-saffron">Taxi Services</span>
            </h2>
            <p className="text-muted-foreground mb-3 text-xs leading-snug sm:mb-4 sm:text-sm md:mb-5 md:text-base lg:text-lg">
              Travel comfortably across Himachal Pradesh with our fleet of well-maintained vehicles and
              experienced local drivers who know every route like the back of their hand.
            </p>

            <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:gap-2 md:mb-5 md:gap-3">
              {features.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group border-forest-green/10 flex items-center gap-1.5 rounded-lg border bg-white/60 p-1.5 transition-colors hover:bg-white sm:gap-2 sm:rounded-xl sm:p-2 md:gap-3 md:rounded-2xl md:p-2.5"
                >
                  <div
                    className={`h-7 w-7 bg-linear-to-br sm:h-9 sm:w-9 md:h-12 md:w-12 ${item.color} flex shrink-0 items-center justify-center rounded-md shadow-md transition-transform group-hover:scale-110 sm:rounded-lg md:rounded-xl`}
                  >
                    <item.icon className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4 md:h-6 md:w-6" />
                  </div>
                  <span className="text-foreground text-[10px] leading-tight font-semibold sm:text-xs md:text-sm">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mb-3 sm:mb-4 md:mb-5">
              <h4 className="text-foreground mb-1.5 flex items-center gap-1.5 text-xs font-bold sm:mb-2 sm:gap-2 sm:text-sm md:mb-3 md:text-base">
                <MapPin className="text-forest-green h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                Popular Routes
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {routes.map((route) => (
                  <span
                    key={route}
                    className="text-foreground border-border hover:border-forest-green/50 hover:bg-forest-green/5 cursor-pointer rounded-full border bg-white/80 px-2 py-1 text-[10px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm"
                  >
                    {route}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:gap-2.5 md:mt-5 md:gap-3">
              <Button
                size="lg"
                variant="green"
                className="h-9 w-full gap-1.5 text-xs sm:h-10 sm:w-auto sm:gap-2 sm:text-sm md:h-11 md:text-base"
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
                className="h-9 w-full border-2 bg-white/50 text-xs sm:h-10 sm:w-auto sm:text-sm md:h-11 md:text-base"
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
