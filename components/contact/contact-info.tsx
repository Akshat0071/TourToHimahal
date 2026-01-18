"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Shield } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"
import { useSettings } from "@/lib/settings-context"

export function ContactInfo() {
  const { settings } = useSettings()

  const contactPhone = settings.contact_phone || ""
  const whatsappNumber = settings.whatsapp_number || ""
  const contactEmail = settings.contact_email || "info@tourtohimachal.com"
  const address = settings.address || "Near Temple Complex, Chintpurni, HP 177106"
  const businessHours = settings.business_hours || "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM"

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: contactPhone,
      href: `tel:${contactPhone.replace(/\s/g, "")}`,
      description: "Call us directly",
      color: "from-saffron to-sunset-orange",
      bgColor: "bg-saffron/10",
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: whatsappNumber.replace(/(\d{2})(\d{5})(\d{5})/, "$1 $2 $3"),
      href: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`,
      description: "Instant response",
      color: "from-forest-green to-mountain-blue",
      bgColor: "bg-forest-green/10",
    },
    {
      icon: Mail,
      label: "Email",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      description: "For detailed inquiries",
      color: "from-mountain-blue to-forest-green",
      bgColor: "bg-mountain-blue/10",
    },
    {
      icon: MapPin,
      label: "Office",
      value: address,
      href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      description: "Visit us in person",
      color: "from-sunset-orange to-temple-red",
      bgColor: "bg-sunset-orange/10",
    },
  ]

  // Parse business hours into structured format
  const officeHours = businessHours.split(",").map((item) => {
    const parts = item.trim().split(":")
    return {
      day: parts[0]?.trim() || "",
      time: parts.slice(1).join(":").trim() || "",
    }
  })

  const officeHoursText = officeHours
    .filter((s) => s.day && s.time)
    .map((s) => `${s.day}: ${s.time}`)
    .join(" • ")

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      {/* Contact Cards */}
      <div className="space-y-6">
        {contactInfo.map((item) => (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            variants={fadeInUp}
            className={`flex items-start gap-3 rounded-xl bg-linear-to-br p-3 sm:gap-4 sm:rounded-2xl sm:p-4 ${item.bgColor} border-border hover:border-saffron/30 group border transition-all hover:shadow-lg`}
          >
            <div
              className={`h-10 w-10 rounded-lg bg-linear-to-br sm:h-12 sm:w-12 sm:rounded-xl ${item.color} flex shrink-0 items-center justify-center shadow-md transition-transform group-hover:scale-110`}
            >
              <item.icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                <p className="text-muted-foreground text-xs font-medium sm:text-sm">{item.label}</p>
                <span className="text-muted-foreground hidden text-[10px] sm:block sm:text-xs">
                  {item.description}
                </span>
              </div>
              <p className="text-foreground group-hover:text-saffron truncate text-sm font-semibold transition-colors sm:text-base">
                {item.value}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Office Hours */}
      <motion.div
        variants={fadeInUp}
        className="from-mountain-blue/10 to-forest-green/5 border-mountain-blue/20 rounded-xl border bg-linear-to-br p-2.5 sm:rounded-2xl sm:p-3"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="bg-mountain-blue/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl">
            <Clock className="text-mountain-blue h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground text-sm leading-tight font-semibold sm:text-base">Office Hours</h3>
            <p className="text-muted-foreground mt-1.5 text-xs leading-snug wrap-break-word sm:text-sm">
              {officeHoursText || businessHours}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Response Time SLA */}
      <motion.div
        variants={fadeInUp}
        className="from-forest-green/10 to-golden-yellow/5 border-forest-green/20 rounded-xl border bg-linear-to-br p-2.5 sm:rounded-2xl sm:p-3"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="bg-forest-green/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl">
            <Shield className="text-forest-green h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground text-sm leading-tight font-semibold sm:text-base">
              Response Guarantee
            </h3>
            <p className="text-muted-foreground mt-1.5 text-xs leading-snug sm:text-sm">
              We respond within <span className="text-forest-green font-semibold">12 hours</span>. For urgent
              bookings, use WhatsApp.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick WhatsApp CTA */}
      <motion.div variants={fadeInUp}>
        <Button
          asChild
          size="lg"
          className="h-11 w-full rounded-full bg-[#25D366] text-sm text-white hover:bg-[#25D366]/90 sm:h-12 sm:text-base"
        >
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi!%20I%20want%20to%20plan%20a%20trip%20to%20Himachal.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Chat on WhatsApp
          </a>
        </Button>
      </motion.div>
    </motion.div>
  )
}
