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
    image: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795732/qyc7j6ckdxwsx2taf1d9.webp",
    description: "Visit sacred temples and find inner peace",
    icon: Compass,
    color: "from-saffron to-sunset-orange",
    href: "/packages?theme=spiritual",
  },
  {
    title: "Adventure & Trekking",
    image: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795291/bacq5glu6429fkmwvv6b.webp",
    description: "Thrilling experiences await",
    icon: Mountain,
    color: "from-forest-green to-mountain-blue",
    href: "/packages?theme=adventure",
  },
  {
    title: "Leisure & Relaxation",
    image: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795753/fyb0h48pexsudvki5cp6.webp",
    description: "Take a step back and relax",
    icon: Heart,
    color: "from-sunset-orange to-golden-yellow",
    href: "/packages?theme=family",
  },
]

export function TravelThemes() {
  return (
    <section className="from-muted/50 to-background relative overflow-hidden bg-linear-to-b pt-4 pb-8 md:pt-8 md:pb-12">
      {/* Decorative elements */}
      <div className="border-saffron/20 absolute top-20 left-10 h-20 w-20 rounded-full border-4" />
      <div className="border-forest-green/20 absolute right-10 bottom-20 h-32 w-32 rounded-full border-4" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-8 text-center md:mb-10"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-forest-green/10 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
          >
            <Compass className="text-forest-green h-4 w-4" />
            <span className="text-forest-green text-sm font-semibold tracking-wider uppercase">
              Choose Your Experience
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-foreground mt-3 mb-4 font-serif text-3xl font-bold md:text-5xl"
          >
            Travel <span className="text-forest-green">Themes</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Whether you seek spiritual enlightenment, romantic getaways, or adrenaline-pumping adventures, we
            have the perfect package for you.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        >
          {themes.map((theme, index) => (
            <motion.div
              key={theme.title}
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -8 }}
              className="group relative h-96 cursor-pointer overflow-hidden rounded-3xl shadow-lg"
            >
              <Link href={theme.href}>
                <Image
                  src={getImageUrl(theme.image || "/placeholder.svg")}
                  alt={theme.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-t ${theme.color} opacity-40 transition-opacity duration-300 group-hover:opacity-60`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Icon */}
                  <div
                    className={`mb-4 h-14 w-14 rounded-2xl bg-linear-to-br ${theme.color} flex transform items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <theme.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mb-2 font-serif text-2xl font-bold text-white">{theme.title}</h3>
                  <p className="mb-4 text-sm text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {theme.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex transform items-center gap-2 font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
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
