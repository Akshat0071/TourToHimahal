"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Phone, MessageCircle, Car, Calendar, Shield, Zap, Users, Gauge } from "lucide-react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { InfiniteScrollHero } from "@/components/ui/infinite-scroll-hero"
import { Button } from "@/components/ui/button"
import { VehicleCard } from "@/components/taxi/vehicle-card"
import { RouteCard } from "@/components/taxi/route-card"
import { TaxiBookingForm } from "@/components/taxi/taxi-booking-form"
import { SafetyFeatures } from "@/components/taxi/safety-features"
import { TaxiTestimonials } from "@/components/taxi/taxi-testimonials"
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
    answer: "Yes, all our drivers are verified with proper documentation, driving licenses, and background checks.",
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
    <main className="min-h-screen bg-background">
      <Header />

      <InfiniteScrollHero
        images={[
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765972341/vwswidswmvrzozxoyhng.avif", alt: "Mountain Roads" },
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765971157/dlkmhqcitksbbznvzo8t.jpg", alt: "Taxi Service" },
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765972287/uc6q1azohh0a4k4xv72i.jpg", alt: "Time To Travel" },
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765968189/ouf49gwwxagurjq2aqbi.png", alt: "River" },
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765972296/j8gtceykrrky45uorsfo.jpg", alt: "Car on Road" },
        ]}
        badge="Trusted by 10,000+ Happy Travelers"
        title="Your Mountain Journey, Our Priority"
        subtitle="Navigate the winding Himalayan roads with confidence! From Chandigarh airport pickups to remote hill station drop-offs, our experienced local drivers ensure safe, comfortable, and memorable journeys. No hidden charges, no surprises — just pure travel bliss."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="bg-saffron hover:bg-saffron/90 text-white gap-2">
            <a href={`https://wa.me/${(settings?.whatsapp_number || "919876543210").replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <a href={`tel:${settings?.contact_phone || ""}`}>
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          </Button>
        </div>
      </InfiniteScrollHero>

      {/* Stats Section - Enhanced Design */}
      <section className="py-8 md:py-12 bg-linear-to-br from-forest-green/5 via-mountain-blue/5 to-saffron/5 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-forest-green/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-mountain-blue/10 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-12"
          >
            {[
              { 
                value: "12+", 
                label: "Years of Service", 
                icon: Calendar,
                gradient: "from-forest-green to-emerald-600",
                bgGradient: "from-forest-green/10 to-emerald-600/10"
              },
              { 
                value: "50+", 
                label: "Expert Drivers", 
                icon: Users,
                gradient: "from-mountain-blue to-blue-600",
                bgGradient: "from-mountain-blue/10 to-blue-600/10"
              },
              { 
                value: "10K+", 
                label: "Trips Completed", 
                icon: Gauge,
                gradient: "from-saffron to-sunset-orange",
                bgGradient: "from-saffron/10 to-sunset-orange/10"
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${stat.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className={`relative bg-linear-to-br ${stat.bgGradient} backdrop-blur-xl border border-white/20 rounded-2xl p-2 sm:p-3 md:p-4 text-center hover:shadow-2xl transition-all duration-300 group-hover:scale-105 max-w-xs mx-auto`}>
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 sm:w-12 sm:h-0.5 md:w-16 md:h-1 bg-linear-to-r ${stat.gradient} rounded-full`} />

                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-linear-to-br ${stat.gradient} rounded-2xl mb-2 sm:mb-3 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300`}>
                      <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                    </div>

                    {/* Value */}
                    <p className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                      {stat.value}
                    </p>

                    {/* Label */}
                    <p className="text-foreground font-semibold text-[10px] sm:text-xs md:text-sm mb-1">{stat.label}</p>
                    
                    {/* Decorative dots */}
                    <div className="flex justify-center gap-0.5 mt-2">
                      {[0, 1, 2].map((dot) => (
                        <div
                          key={dot}
                          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-linear-to-r ${stat.gradient} opacity-60`}
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
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-10"
            >
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Choose Your Vehicle</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select from our fleet of well-maintained vehicles suited for every group size and budget
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Popular Routes & Fares</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Check out our most booked routes with transparent pricing
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section className="py-16 bg-muted/30" id="book">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-6 lg:gap-8"
            >
              <div className="relative w-full h-56 sm:h-64 md:h-72 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://res.cloudinary.com/dabqqymqe/image/upload/v1767092549/tbccjb5pnizayzkabfak.webp"
                  alt="Mountain taxi ride"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-tr from-forest-green/25 via-transparent to-saffron/20" />
              </div>

              <div className="lg:mt-auto">
                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3 lg:mb-4 bg-gradient-to-r from-mountain-blue via-forest-green to-saffron bg-clip-text text-transparent">Get Your Quote</h2>
                <p className="text-muted-foreground mb-5 lg:mb-6">
                  Fill in your travel details and we will get back to you with the best options. No advance payment
                  required - pay after your trip!
                </p>
                <div className="space-y-3 lg:space-y-4">
                  {[
                    { icon: <Car className="h-5 w-5" />, text: "Wide range of vehicles for every need" },
                    { icon: <Calendar className="h-5 w-5" />, text: "Flexible booking and cancellation" },
                    { icon: <Shield className="h-5 w-5" />, text: "Verified drivers and sanitized cars" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Safety & Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your safety is our priority. Here is what we offer with every ride.
            </p>
          </motion.div>
          <SafetyFeatures />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <TaxiTestimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <PackageFAQ faqs={taxiFaqs} />
          </motion.div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-50">
        <div className="flex gap-3">
          <Button asChild className="flex-1 bg-forest-green hover:bg-forest-green/90 text-white gap-2">
            <a href="#book">
              <Car className="h-5 w-5" />
              Book a Ride
            </a>
          </Button>
          <Button asChild variant="outline" size="icon">
            <a href={`https://wa.me/${(settings?.whatsapp_number || "919876543210").replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
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
