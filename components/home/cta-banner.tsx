"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/lib/settings-context"
import { MessageCircle, Phone, ArrowRight, Sparkles } from "lucide-react"

export function CTABanner() {
  const { settings } = useSettings()
  function getImageUrl(url: string): string {
    if (!url) return "/placeholder.svg"
    const trimmed = url.trim()
    const normalized = trimmed.startsWith("/http") ? trimmed.slice(1) : trimmed
    return normalized
  }

  const ctaImage = ""
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      {/* Background image layer */}
      <img
        src={getImageUrl(
          "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795901/y1plr2wekvbv7g7yjyk0.webp",
        )}
        alt="panoramic landcape view"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Background overlay gradient (semi-transparent so image shows) */}
      <div className="from-mountain-blue/70 via-forest-green/50 to-mountain-blue/70 absolute inset-0 bg-linear-to-br" />

      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-40 w-40 rounded-full border-4 border-white" />
        <div className="absolute top-20 right-20 h-60 w-60 rounded-full border-4 border-white" />
        <div className="absolute bottom-10 left-1/3 h-32 w-32 rounded-full border-4 border-white" />
      </div>

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4 }}
        className="bg-golden-yellow/30 absolute top-20 right-1/4 h-16 w-16 rotate-12 rounded-2xl"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5 }}
        className="bg-saffron/30 absolute bottom-20 left-1/4 h-20 w-20 rounded-full"
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-sm"
          >
            <Sparkles className="text-golden-yellow h-4 w-4" />
            <span className="font-medium text-white">Start Your Journey Today</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-6 font-serif text-3xl font-bold text-balance text-white md:text-5xl lg:text-6xl"
          >
            Plan Your Dream <span className="text-golden-yellow">Himachal Trip</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-white/90"
          >
            Get personalized travel packages and instant taxi booking. Connect with us on WhatsApp for quick
            assistance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button size="xl" variant="gradient" className="group px-10 text-lg shadow-2xl" asChild>
              <a
                href={`https://wa.me/${(settings?.whatsapp_number || "").replace(/[^0-9]/g, "")}?text=Hi, I want to plan my Himachal trip`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Chat on WhatsApp
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>

            <Button
              size="xl"
              variant="outline"
              className="hover:text-mountain-blue border-2 border-white bg-transparent px-10 text-lg text-white hover:bg-white"
              asChild
            >
              <a href={`tel:${settings?.contact_phone || ""}`}>
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
