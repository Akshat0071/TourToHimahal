"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, User, Phone, Mail, MessageSquare, Send, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { fadeInUp } from "@/lib/animation-variants"
import { generateWhatsAppLink } from "@/lib/whatsapp"
import { useSettings } from "@/lib/settings-context"

interface PackageBookingFormProps {
  packageName: string
  packagePrice: number
  onSuccess?: () => void
}

export function PackageBookingForm({ packageName, packagePrice, onSuccess }: PackageBookingFormProps) {
  const { settings } = useSettings()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    travelers: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name || formData.name.length < 2) newErrors.name = "Name is required"
    if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Valid 10-digit phone is required"
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required"
    }
    if (!formData.date) newErrors.date = "Preferred date is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || "noemail@himachalyatra.com",
          subject: `Package Booking: ${packageName}`,
          message: `Package: ${packageName}\nPrice: ₹${packagePrice.toLocaleString()}\nPreferred Date: ${formData.date}\nTravelers: ${formData.travelers || "Not specified"}\n\nAdditional Notes: ${formData.message || "None"}`,
          serviceType: "package",
          honeypot: "",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        setReferenceNumber(result.referenceNumber)
        onSuccess?.()

        // Generate WhatsApp link and redirect
        const whatsappLink = generateWhatsAppLink(
          {
            packageName: packageName,
            packagePrice: packagePrice,
            date: formData.date,
            travelers: Number.parseInt(formData.travelers) || undefined,
            name: formData.name,
            phone: formData.phone,
            message: formData.message,
          },
          settings.whatsapp_number,
        )

        setTimeout(() => {
          window.open(whatsappLink, "_blank")
        }, 1500)
      } else {
        setErrors({ submit: result.message || "Failed to submit. Please try again." })
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-8 text-center"
      >
        <div className="bg-forest-green/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle2 className="text-forest-green h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-2 text-xl font-semibold">Booking Request Sent!</h3>
        {referenceNumber && (
          <p className="text-foreground bg-muted mb-4 inline-block rounded-lg px-4 py-2 text-sm font-medium">
            Reference: <span className="text-primary">{referenceNumber}</span>
          </p>
        )}
        <p className="text-muted-foreground mb-4">Redirecting you to WhatsApp to complete your booking...</p>
        <Button
          onClick={() => {
            setIsSuccess(false)
            setReferenceNumber(null)
            setFormData({
              name: "",
              phone: "",
              email: "",
              date: "",
              travelers: "",
              message: "",
            })
          }}
          variant="outline"
        >
          Submit Another Request
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.form
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <div className="relative">
            <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10"
              aria-invalid={!!errors.name}
            />
          </div>
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <div className="relative">
            <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="phone"
              type="tel"
              placeholder="10-digit number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10"
              aria-invalid={!!errors.phone}
            />
          </div>
          {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10"
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Preferred Date *</Label>
          <div className="relative">
            <Calendar className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="pl-10"
              aria-invalid={!!errors.date}
            />
          </div>
          {errors.date && <p className="text-destructive text-sm">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Number of Travelers</Label>
          <div className="relative">
            <Users className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="travelers"
              type="number"
              min="1"
              max="50"
              placeholder="e.g., 4"
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Special Requirements</Label>
        <div className="relative">
          <MessageSquare className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Textarea
            id="message"
            placeholder="Any special requirements or questions..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="min-h-[80px] pl-10"
          />
        </div>
      </div>

      {errors.submit && <p className="text-destructive text-center text-sm">{errors.submit}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-forest-green hover:bg-forest-green/90 w-full gap-2 text-white"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Send Booking Request
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </motion.form>
  )
}
