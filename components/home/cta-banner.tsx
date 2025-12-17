"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, ArrowRight, Sparkles } from "lucide-react"

export function CTABanner() {
  function getImageUrl(url: string): string {
    if (!url) return "/placeholder.svg"
    const trimmed = url.trim()
    const normalized = trimmed.startsWith("/http") ? trimmed.slice(1) : trimmed
    return normalized
  }

  const ctaImage = ""
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background image layer */}
      <img
        src={getImageUrl("https://res.cloudinary.com/dabqqymqe/image/upload/v1765967181/vor6a288gor8vhrmnej1.png")}
        alt="panoramic landcape view"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Background overlay gradient (semi-transparent so image shows) */}
      <div className="absolute inset-0 bg-gradient-to-br from-mountain-blue/70 via-forest-green/50 to-mountain-blue/70" />

      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
        <div className="absolute top-20 right-20 w-60 h-60 border-4 border-white rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-32 h-32 border-4 border-white rounded-full" />
      </div>

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4 }}
        className="absolute top-20 right-1/4 w-16 h-16 bg-golden-yellow/30 rounded-2xl rotate-12"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5 }}
        className="absolute bottom-20 left-1/4 w-20 h-20 bg-saffron/30 rounded-full"
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
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8"
          >
            <Sparkles className="h-4 w-4 text-golden-yellow" />
            <span className="text-white font-medium">Start Your Journey Today</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 text-balance"
          >
            Plan Your Dream <span className="text-golden-yellow">Himachal Trip</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Get personalized travel packages and instant taxi booking. Connect with us on WhatsApp for quick assistance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="xl"
              variant="gradient"
              className="text-lg px-10 shadow-2xl group"
              asChild
            >
              <a
                href="https://wa.me/919876543210?text=Hi, I want to plan my Himachal trip"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Chat on WhatsApp
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button
              size="xl"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-mountain-blue text-lg px-10 bg-transparent"
              asChild
            >
              <a href="tel:+919876543210">
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
