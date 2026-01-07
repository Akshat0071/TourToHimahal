"use client"

import { motion } from "framer-motion"
import { MapPin, Wallet, Shield, MessageCircle, ClipboardList, BadgeCheck, Award } from "lucide-react"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"

const features = [
  {
    icon: MapPin,
    title: "Local Himachal Expertise",
    description: "Deep knowledge of hidden gems and best routes across the state.",
    gradient: "from-mountain-blue to-forest-green",
    bgColor: "from-mountain-blue/20 to-forest-green/10",
  },
  {
    icon: Wallet,
    title: "Affordable Packages",
    description: "Best value for money with no hidden costs or surprises.",
    gradient: "from-forest-green to-golden-yellow",
    bgColor: "from-forest-green/20 to-golden-yellow/10",
  },
  {
    icon: Shield,
    title: "Safe Taxi Service",
    description: "Well-maintained vehicles with experienced, verified drivers.",
    gradient: "from-saffron to-sunset-orange",
    bgColor: "from-saffron/20 to-sunset-orange/10",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Instant Booking",
    description: "Quick and easy bookings directly via WhatsApp chat.",
    gradient: "from-forest-green to-mountain-blue",
    bgColor: "from-forest-green/20 to-mountain-blue/10",
  },
  {
    icon: ClipboardList,
    title: "Custom Itineraries",
    description: "Personalized travel plans tailored to your preferences.",
    gradient: "from-mountain-blue to-saffron",
    bgColor: "from-mountain-blue/20 to-saffron/10",
  },
  {
    icon: BadgeCheck,
    title: "Verified Drivers",
    description: "Background-checked, courteous, and professional drivers.",
    gradient: "from-sunset-orange to-temple-red",
    bgColor: "from-sunset-orange/20 to-temple-red/10",
  },
]

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.97_0.035_85)] via-[oklch(0.98_0.02_75)] to-[oklch(0.96_0.03_65)] py-8 md:py-8 lg:py-12">
      {/* Decorative patterns */}
      <div className="pattern-dots absolute inset-0 opacity-20" />
      <div className="via-saffron absolute top-0 left-1/2 h-1 w-full -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-6 text-center md:mb-8 lg:mb-10"
        >
          <motion.div
            variants={fadeInUp}
            className="from-saffron/20 to-sunset-orange/20 mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1.5 md:mb-4 md:px-4 md:py-2"
          >
            <Award className="text-saffron h-3 w-3 md:h-4 md:w-4" />
            <span className="text-saffron text-xs font-semibold tracking-wider uppercase md:text-sm">
              Why Travelers Trust Us
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-foreground mt-2 mb-3 font-serif text-2xl font-bold sm:text-3xl md:mt-3 md:mb-4 md:text-4xl lg:text-5xl"
          >
            Why Choose{" "}
            <span className="from-saffron via-sunset-orange to-temple-red bg-gradient-to-r bg-clip-text text-transparent">
              Us
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto max-w-2xl px-4 text-sm md:text-lg"
          >
            We combine local expertise, quality service, and customer-first approach to make your Himachal
            journey memorable.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-2xl border-2 border-white/50 bg-white p-5 shadow-md transition-all duration-500 hover:shadow-2xl md:rounded-3xl md:p-8"
            >
              {/* Icon with gradient background */}
              <div
                className={`h-12 w-12 bg-gradient-to-br md:h-16 md:w-16 ${feature.gradient} mb-4 flex items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 md:mb-6 md:rounded-2xl`}
              >
                <feature.icon className="h-6 w-6 text-white md:h-8 md:w-8" />
              </div>

              <h3 className="text-foreground mb-2 text-base font-bold md:mb-3 md:text-xl">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
