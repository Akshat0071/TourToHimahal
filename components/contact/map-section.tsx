"use client"

import { motion } from "framer-motion"
import { MapPin, Navigation, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/lib/settings-context"
import { fadeInUp } from "@/lib/animation-variants"

export function MapSection() {
  const { settings } = useSettings()
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-3 sm:mb-4">
            Visit Our Office
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
            Located near the sacred Chintpurni Temple, we&apos;re easily accessible for travelers seeking spiritual and
            adventure tours
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-border"
        >
          {/* Map */}
          <div className="aspect-[16/10] sm:aspect-[21/9] bg-muted relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27032.68486831538!2d76.04!3d31.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391abd05e5d31eaf%3A0x4f7d0c6a4c0c7e8c!2sChintpurni%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TourToHimachal Office - Chintpurni Location"
              className="absolute inset-0"
            />
          </div>

          <div className="relative sm:absolute sm:bottom-6 sm:left-6 sm:right-6 md:right-auto md:max-w-sm">
            <div className="bg-background/95 backdrop-blur-sm rounded-none sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-xl border-t sm:border border-border">
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-saffron/10 rounded-lg shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-saffron" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">TourToHimachal Office</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Near Temple Complex, Chintpurni, HP 177106</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-forest-green shrink-0" />
                  <span className="truncate">9 AM - 7 PM</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mountain-blue shrink-0" />
                  <a href={`tel:${(settings?.contact_phone || "").replace(/\s/g, "")}`} className="hover:text-primary truncate">
                    {(settings?.contact_phone || "").replace(/\D/g, "").slice(-10)}
                  </a>
                </div>
              </div>

              <Button
                asChild
                size="sm"
                className="w-full bg-gradient-to-r from-saffron to-sunset-orange hover:from-saffron/90 hover:to-sunset-orange/90 text-white rounded-full h-9 sm:h-10 text-xs sm:text-sm"
              >
                <a
                  href="https://maps.google.com/?q=Chintpurni+Himachal+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
