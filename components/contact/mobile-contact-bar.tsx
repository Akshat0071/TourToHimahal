"use client"

import { motion } from "framer-motion"
import { Phone, MessageCircle } from "lucide-react"
import { useSettings } from "@/lib/settings-context"

export function MobileContactBar() {
  const { settings } = useSettings()
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-lg border-t border-border p-3"
    >
      <div className="flex gap-3">
        <a
          href={`tel:${(settings?.contact_phone || "").replace(/\s/g, "")}`}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium"
        >
          <Phone className="w-5 h-5" />
          Call Now
        </a>
        <a
          href={`https://wa.me/${(settings?.whatsapp_number || "").replace(/[^0-9]/g, "")}?text=Hi!%20I%20need%20help%20planning%20my%20Himachal%20trip.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </div>
    </motion.div>
  )
}
