"use client"

import { motion } from "framer-motion"
import { Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { useSettings } from "@/lib/settings-context"

export function MobileContactBar() {
  const { settings } = useSettings()
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 100 }}
      className="bg-background/95 border-border fixed right-0 bottom-0 left-0 z-40 border-t p-3 backdrop-blur-lg md:hidden"
    >
      <div className="flex gap-3">
        <a
          href={`tel:${(settings?.contact_phone || "").replace(/\s/g, "")}`}
          className="bg-primary text-primary-foreground flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium"
        >
          <Phone className="h-5 w-5" />
          Call Now
        </a>
        <a
          href={`https://wa.me/${(settings?.whatsapp_number || "").replace(/[^0-9]/g, "")}?text=Hi!%20I%20need%20help%20planning%20my%20Himachal%20trip.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-medium text-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    </motion.div>
  )
}
