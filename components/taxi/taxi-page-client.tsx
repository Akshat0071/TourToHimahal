"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Phone, Car, Calendar, Shield, Zap, Users, Gauge } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { InfiniteScrollHero } from "@/components/ui/infinite-scroll-hero"
import { Button } from "@/components/ui/button"
import { VehicleCard } from "@/components/taxi/vehicle-card"
import { RouteCard } from "@/components/taxi/route-card"
import { TaxiBookingForm } from "@/components/taxi/taxi-booking-form"
import { SafetyFeatures } from "@/components/taxi/safety-features"
import { Testimonials } from "@/components/home/testimonials"
import { PackageFAQ } from "@/components/packages/package-faq"
import { useSettings } from "@/lib/settings-context"
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/animation-variants"

interface Vehicle {
  id: string
  name: string
  type: string
  capacity: number
  luggage_capacity?: number
  base_fare: number
  per_km_rate: number
  features?: string[]
  image_url?: string
  is_available: boolean
}

interface Route {
  id: string
  from_location: string
  to_location: string
  distance_km: number
  estimated_time: string
  base_fare: number
  is_active: boolean
}

interface TaxiPageClientProps {
  vehicles: Vehicle[]
  routes: Route[]
}

const taxiFaqs = [
  {
    question: "How do I book a taxi?",
    answer:
      "You can book through WhatsApp, call us directly, or fill out the booking form on this page. We'll confirm your booking within 30 minutes.",
  },
  {
    question: "Is advance payment required?",
    answer: "No advance payment is required. You can pay after your trip is completed.",
  },
  {
    question: "Are your drivers verified?",
    answer:
      "Yes, all our drivers are verified with proper documentation, driving licenses, and background checks.",
  },
  {
    question: "Can I modify or cancel my booking?",
    answer:
      "Yes, you can modify or cancel your booking up to 24 hours before the scheduled pickup time without any charges.",
  },
]

export function TaxiPageClient({ vehicles, routes }: TaxiPageClientProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const { settings } = useSettings()

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Header />

      <InfiniteScrollHero
        images={[
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767794694/hiktlwjkvx7nfb57hnfz.webp",
            alt: "Mountain Roads",
          },
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767796024/kmxibndk78rbidxmtef2.webp",
            alt: "Taxi Service",
          },
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767796598/eytslyy1tjm58mjubjcg.webp",
            alt: "Car on Road",
          },
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795334/cp0egvkhziyen6h57ffg.webp",
            alt: "River",
          },
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795901/y1plr2wekvbv7g7yjyk0.webp",
            alt: "Landscape View",
          },
        ]}
        badge="Trusted by 10,000+ Happy Travelers"
        title="Your Mountain Journey, Our Priority"
        subtitle="Navigate the winding Himalayan roads with confidence! From Chandigarh airport pickups to remote hill station drop-offs, our experienced local drivers ensure safe, comfortable, and memorable journeys. No hidden charges, no surprises — just pure travel bliss."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-saffron hover:bg-saffron/90 gap-2 text-white">
            <a
              href={`https://wa.me/${(settings.whatsapp_number || "919876543210").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp Us
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <a href={`tel:${settings.contact_phone || ""}`}>
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          </Button>
        </div>
      </InfiniteScrollHero>

      {/* Stats Section - Enhanced Design */}
      <section className="from-forest-green/5 via-mountain-blue/5 to-saffron/5 relative overflow-hidden bg-linear-to-br py-8 md:py-12">
        {/* Decorative background elements */}
        <div className="from-forest-green/10 absolute top-0 right-0 h-96 w-96 rounded-full bg-linear-to-bl to-transparent blur-3xl" />
        <div className="from-mountain-blue/10 absolute bottom-0 left-0 h-96 w-96 rounded-full bg-linear-to-tr to-transparent blur-3xl" />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 md:gap-12"
          >
            {[
              {
                value: "12+",
                label: "Years of Service",
                icon: Calendar,
                gradient: "from-forest-green to-emerald-600",
                bgGradient: "from-forest-green/10 to-emerald-600/10",
              },
              {
                value: "50+",
                label: "Expert Drivers",
                icon: Users,
                gradient: "from-mountain-blue to-blue-600",
                bgGradient: "from-mountain-blue/10 to-blue-600/10",
              },
              {
                value: "10K+",
                label: "Trips Completed",
                icon: Gauge,
                gradient: "from-saffron to-sunset-orange",
                bgGradient: "from-saffron/10 to-sunset-orange/10",
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div key={index} variants={fadeInUp} className="group relative">
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${stat.bgGradient} rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div
                    className={`relative bg-linear-to-br ${stat.bgGradient} mx-auto max-w-xs rounded-2xl border border-white/20 p-2 text-center backdrop-blur-xl transition-all duration-300 group-hover:scale-105 hover:shadow-2xl sm:p-3 md:p-4`}
                  >
                    {/* Top accent line */}
                    <div
                      className={`absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-linear-to-r sm:h-0.5 sm:w-12 md:h-1 md:w-16 ${stat.gradient} rounded-full`}
                    />

                    {/* Icon */}
                    <div
                      className={`inline-flex h-8 w-8 items-center justify-center bg-linear-to-br sm:h-10 sm:w-10 md:h-12 md:w-12 ${stat.gradient} mb-2 transform rounded-2xl shadow-lg transition-transform duration-300 group-hover:-translate-y-2 sm:mb-3`}
                    >
                      <IconComponent className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </div>

                    {/* Value */}
                    <p
                      className={`bg-linear-to-r text-2xl font-bold sm:text-3xl md:text-4xl ${stat.gradient} mb-1 bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </p>

                    {/* Label */}
                    <p className="text-foreground mb-1 text-[10px] font-semibold sm:text-xs md:text-sm">
                      {stat.label}
                    </p>

                    {/* Decorative dots */}
                    <div className="mt-2 flex justify-center gap-0.5">
                      {[0, 1, 2].map((dot) => (
                        <div
                          key={dot}
                          className={`h-1 w-1 rounded-full bg-linear-to-r sm:h-1.5 sm:w-1.5 ${stat.gradient} opacity-60`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Vehicle Types */}
      {vehicles.length > 0 && (
        <section className="bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8 text-center md:mb-10"
            >
              <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">Choose Your Vehicle</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Select from our fleet of well-maintained vehicles suited for every group size and budget
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={selectedVehicle === vehicle.id}
                  onSelect={() => setSelectedVehicle(vehicle.id)}
                />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Popular Routes */}
      {routes.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">Popular Routes & Fares</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Check out our most booked routes with transparent pricing
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section className="bg-muted/30 py-16" id="book">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-6 lg:gap-8"
            >
              <div className="relative h-56 w-full overflow-hidden rounded-2xl shadow-xl sm:h-64 md:h-72">
                <Image
                  src="https://res.cloudinary.com/dabqqymqe/image/upload/v1768495300/sciyr6mjjjj2uwb7p5bw.jpg"
                  alt="Mountain taxi ride"
                  fill
                  className=" object-center"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
                <div className="from-forest-green/25 to-saffron/20 absolute inset-0 bg-linear-to-tr via-transparent" />
              </div>

              <div className="lg:mt-auto">
                <h2 className="mb-3 text-3xl font-bold tracking-tight text-black lg:mb-4">Get Your Quote</h2>
                <p className="text-muted-foreground mb-5 lg:mb-6">
                  Fill in your travel details and we will get back to you with the best options. No advance
                  payment required - pay after your trip!
                </p>
                <div className="space-y-3 lg:space-y-4">
                  {[
                    { icon: <Car className="h-5 w-5" />, text: "Wide range of vehicles for every need" },
                    { icon: <Calendar className="h-5 w-5" />, text: "Flexible booking and cancellation" },
                    { icon: <Shield className="h-5 w-5" />, text: "Verified drivers and sanitized cars" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                        {item.icon}
                      </div>
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <TaxiBookingForm />
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-black">Safety & Features</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Your safety is our priority. Here is what we offer with every ride.
            </p>
          </motion.div>
          <SafetyFeatures />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="text-foreground mb-8 text-center font-serif text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <PackageFAQ faqs={taxiFaqs} />
          </motion.div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="bg-background border-border fixed right-0 bottom-0 left-0 z-50 border-t p-4 lg:hidden">
        <div className="flex gap-3">
          <Button asChild className="bg-forest-green hover:bg-forest-green/90 flex-1 gap-2 text-white">
            <a href="#book">
              <Car className="h-5 w-5" />
              Book a Ride
            </a>
          </Button>
          <Button asChild variant="outline" size="icon">
            <a
              href={`https://wa.me/${(settings.whatsapp_number || "919876543210").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="sr-only">Chat on WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>

      <div className="pb-20 lg:pb-0">
        <Footer />
      </div>
    </main>
  )
}
