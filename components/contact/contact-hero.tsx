"use client"

import { Phone, MessageCircle } from "lucide-react"
import { StaticHero } from "@/components/ui/static-hero"
import { useSettings } from "@/lib/settings-context"

export function ContactHero() {
  const { settings } = useSettings()

  const contactPhone = settings?.contact_phone || ""
  const whatsappNumber = settings?.whatsapp_number || ""

  return (
    <StaticHero
      image="Images/contact.png"
      badge="We're Here to Help 24/7"
      title="Let's Create Your Dream Journey"
      subtitle="Have questions? Need a custom itinerary? Want to explore off-the-beaten-path destinations? Our local travel experts are just a message away. We don't just plan trips — we craft unforgettable Himalayan experiences tailored just for you."
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`tel:${contactPhone.replace(/\s/g, "")}`}
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors"
        >
          <Phone className="w-5 h-5" />
          {contactPhone}
        </a>
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi!%20I%20want%20to%20plan%20a%20trip%20to%20Himachal.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#25D366]/90 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp Us
        </a>
      </div>
    </StaticHero>
  )
}
