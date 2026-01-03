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
    <section className="py-8 md:py-8 lg:py-12 bg-gradient-to-br from-[oklch(0.97_0.035_85)] via-[oklch(0.98_0.02_75)] to-[oklch(0.96_0.03_65)] relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 pattern-dots opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-saffron to-transparent" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-6 md:mb-8 lg:mb-10"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-saffron/20 to-sunset-orange/20 rounded-full mb-3 md:mb-4"
          >
            <Award className="h-3 w-3 md:h-4 md:w-4 text-saffron" />
            <span className="text-xs md:text-sm font-semibold text-saffron uppercase tracking-wider">
              Why Travelers Trust Us
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2 md:mt-3 mb-3 md:mb-4"
          >
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-sunset-orange to-temple-red">
              Us
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg px-4">
            We combine local expertise, quality service, and customer-first approach to make your Himachal journey
            memorable.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border-2 border-white/50 shadow-md hover:shadow-2xl transition-all duration-500"
            >
              {/* Icon with gradient background */}
              <div
                className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>

              <h3 className="text-base md:text-xl font-bold text-foreground mb-2 md:mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
