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

interface PackageBookingFormProps {
  packageName: string
  packagePrice: number
  onSuccess?: () => void
}

export function PackageBookingForm({ packageName, packagePrice, onSuccess }: PackageBookingFormProps) {
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
          email: formData.email || "",
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
        const whatsappLink = generateWhatsAppLink({
          packageName: packageName,
          packagePrice: packagePrice,
          date: formData.date,
          travelers: Number.parseInt(formData.travelers) || undefined,
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
        })

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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-16 h-16 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-forest-green" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Booking Request Sent!</h3>
        {referenceNumber && (
          <p className="text-sm font-medium text-foreground bg-muted px-4 py-2 rounded-lg inline-block mb-4">
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
    <motion.form variants={fadeInUp} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10"
              aria-invalid={!!errors.name}
            />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Preferred Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="pl-10"
              aria-invalid={!!errors.date}
            />
          </div>
          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Number of Travelers</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="message"
            placeholder="Any special requirements or questions..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="pl-10 min-h-[80px]"
          />
        </div>
      </div>

      {errors.submit && <p className="text-sm text-destructive text-center">{errors.submit}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-forest-green hover:bg-forest-green/90 text-white gap-2"
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
