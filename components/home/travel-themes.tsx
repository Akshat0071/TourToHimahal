"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"
import { Compass, Heart, Mountain, Users, ArrowRight } from "lucide-react"

// Ensure pasted URLs (including Cloudinary) work reliably like in the Hero
function getImageUrl(url: string): string {
  if (!url) return "/placeholder.svg"
  const trimmed = url.trim()
  const normalized = trimmed.startsWith("/http") ? trimmed.slice(1) : trimmed
  return normalized
}

const themes = [
  {
    title: "Spiritual Tours",
    image: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765974749/fbi4fyi69lft74u50by0.png",
    description: "Visit sacred temples and find inner peace",
    icon: Compass,
    color: "from-saffron to-sunset-orange",
    href: "/packages?theme=spiritual",
  },
  {
    title: "Adventure & Trekking",
    image: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967283/yegxwa1cdjow0g8madso.png",
    description: "Thrilling experiences await",
    icon: Mountain,
    color: "from-forest-green to-mountain-blue",
    href: "/packages?theme=adventure",
  },
  {
    title: "Leisure & Relaxation",
    image: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765975218/mduxsmb2vsymzqi0yyfz.jpg",
    description: "Take a step back and relax",
    icon: Heart,
    color: "from-sunset-orange to-golden-yellow",
    href: "/packages?theme=family",
  },
]

export function TravelThemes() {
  return (
    <section className="pt-4 pb-8 md:pt-8 md:pb-12 bg-linear-to-b from-muted/50 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border-4 border-saffron/20 rounded-full" />
      <div className="absolute bottom-20 right-10 w-32 h-32 border-4 border-forest-green/20 rounded-full" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-8 md:mb-10"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green/10 rounded-full mb-4"
          >
            <Compass className="h-4 w-4 text-forest-green" />
            <span className="text-sm font-semibold text-forest-green uppercase tracking-wider">
              Choose Your Experience
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-serif font-bold text-foreground mt-3 mb-4"
          >
            Travel{" "}
            <span className="text-forest-green">Themes</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Whether you seek spiritual enlightenment, romantic getaways, or adrenaline-pumping adventures, we have the
            perfect package for you.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
        >
          {themes.map((theme, index) => (
            <motion.div
              key={theme.title}
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -8 }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-lg"
            >
              <Link href={theme.href}>
                <Image
                  src={getImageUrl(theme.image || "/placeholder.svg")}
                  alt={theme.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-t ${theme.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 mb-4 rounded-2xl bg-linear-to-br ${theme.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <theme.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{theme.title}</h3>
                  <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {theme.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
