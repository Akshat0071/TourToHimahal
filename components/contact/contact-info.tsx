"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, MessageCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"
import { useSettings } from "@/lib/settings-context"

export function ContactInfo() {
  const { settings } = useSettings()

  const contactPhone = settings?.contact_phone || ""
  const whatsappNumber = settings?.whatsapp_number || ""
  const contactEmail = settings?.contact_email || "info@tourtohimachal.com"
  const address = settings?.address || "Near Temple Complex, Chintpurni, HP 177106"
  const businessHours = settings?.business_hours || "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM"

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
      icon: MessageCircle,
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

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4 sm:space-y-6">
      {/* Contact Cards */}
      <div className="space-y-2 sm:space-y-3">
        {contactInfo.map((item) => (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            variants={fadeInUp}
            className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-linear-to-br ${item.bgColor} border border-border hover:border-saffron/30 hover:shadow-lg transition-all group`}
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">{item.label}</p>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{item.description}</span>
              </div>
              <p className="font-semibold text-foreground group-hover:text-saffron transition-colors text-sm sm:text-base truncate">
                {item.value}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Office Hours */}
      <motion.div
        variants={fadeInUp}
        className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-linear-to-br from-mountain-blue/10 to-forest-green/5 border border-mountain-blue/20"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 bg-mountain-blue/20 rounded-lg">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-mountain-blue" />
          </div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Office Hours</h3>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          {officeHours.map((schedule, index) => (
            <div key={index} className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">{schedule.day}</span>
              <span className="font-medium text-foreground">{schedule.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Response Time SLA */}
      <motion.div
        variants={fadeInUp}
        className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-linear-to-br from-forest-green/10 to-golden-yellow/5 border border-forest-green/20"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 bg-forest-green/20 rounded-lg">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-forest-green" />
          </div>
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Response Guarantee</h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          We respond to all inquiries within <span className="font-semibold text-forest-green">12 hours</span>. For
          urgent bookings, use WhatsApp for instant assistance.
        </p>
      </motion.div>

      {/* Quick WhatsApp CTA */}
      <motion.div variants={fadeInUp}>
        <Button
          asChild
          size="lg"
          className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full h-11 sm:h-12 text-sm sm:text-base"
        >
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi!%20I%20want%20to%20plan%20a%20trip%20to%20Himachal.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Chat on WhatsApp
          </a>
        </Button>
      </motion.div>
    </motion.div>
  )
}
