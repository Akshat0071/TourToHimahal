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
          className="mb-8 text-center sm:mb-12"
        >
          <h2 className="text-foreground mb-3 font-serif text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
            Visit Our Office
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl px-4 text-sm sm:text-base">
            Located near the sacred Chintpurni Temple, we&apos;re easily accessible for travelers seeking
            spiritual and adventure tours
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-border relative overflow-hidden rounded-xl border sm:rounded-2xl"
        >
          {/* Map */}
          <div className="bg-muted relative aspect-[16/10] sm:aspect-[21/9]">
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

          <div className="relative sm:absolute sm:right-6 sm:bottom-6 sm:left-6 md:right-auto md:max-w-sm">
            <div className="bg-background/95 border-border rounded-none border-t p-4 shadow-xl backdrop-blur-sm sm:rounded-xl sm:border sm:p-5 md:p-6">
              <div className="mb-3 flex items-start gap-2 sm:mb-4 sm:gap-3">
                <div className="bg-saffron/10 shrink-0 rounded-lg p-1.5 sm:p-2">
                  <MapPin className="text-saffron h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-foreground text-sm font-semibold sm:text-base">
                    TourToHimachal Office
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Near Temple Complex, Chintpurni, HP 177106
                  </p>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:gap-3">
                <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-lg p-2 text-xs sm:text-sm">
                  <Clock className="text-forest-green h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                  <span className="truncate">9 AM - 7 PM</span>
                </div>
                <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-lg p-2 text-xs sm:text-sm">
                  <Phone className="text-mountain-blue h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                  <a
                    href={`tel:${(settings.contact_phone || "").replace(/\s/g, "")}`}
                    className="hover:text-primary truncate"
                  >
                    {(settings.contact_phone || "").replace(/\D/g, "").slice(-10)}
                  </a>
                </div>
              </div>

              <Button
                asChild
                size="sm"
                className="from-saffron to-sunset-orange hover:from-saffron/90 hover:to-sunset-orange/90 h-9 w-full rounded-full bg-gradient-to-r text-xs text-white sm:h-10 sm:text-sm"
              >
                <a
                  href="https://maps.google.com/?q=Chintpurni+Himachal+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
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
