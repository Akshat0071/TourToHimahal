"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, MapPin, User, Phone, MessageSquare, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateWhatsAppLink } from "@/lib/whatsapp"
import { useSettings } from "@/lib/settings-context"
import { vehicles } from "@/data/taxis"
import { fadeInUp } from "@/lib/animation-variants"

export function TaxiBookingForm() {
  const { settings } = useSettings()
  const [formData, setFormData] = useState({
    serviceType: "",
    vehicleType: "",
    pickup: "",
    drop: "",
    date: "",
    passengers: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.serviceType) newErrors.serviceType = "Please select service type"
    if (!formData.vehicleType) newErrors.vehicleType = "Please select vehicle"
    if (!formData.pickup) newErrors.pickup = "Pickup location is required"
    if (!formData.drop) newErrors.drop = "Drop location is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.name || formData.name.length < 2) newErrors.name = "Name must be at least 2 characters"
    if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Valid 10-digit phone is required"
    }
    // Subject validation
    const subject = `Taxi Booking: ${formData.pickup} to ${formData.drop}`
    if (!subject || subject.length < 5) newErrors.subject = "Subject must be at least 5 characters"
    // Message validation
    const message = `Service Type: ${formData.serviceType}\nVehicle: ${formData.vehicleType}\nPickup: ${formData.pickup}\nDrop: ${formData.drop}\nDate: ${formData.date}\nPassengers: ${formData.passengers || "Not specified"}\n\nAdditional Notes: ${formData.message || "None"}`
    if (!message || message.length < 10) newErrors.message = "Message must be at least 10 characters"
    // Email validation (optional, but backend expects a valid email string)
    if (formData.email && !/^.+@.+\..+$/.test(formData.email)) {
      newErrors.email = "Valid email is required"
    }
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
          subject: `Taxi Booking: ${formData.pickup} to ${formData.drop}`,
          message: `Service Type: ${formData.serviceType}\nVehicle: ${formData.vehicleType}\nPickup: ${formData.pickup}\nDrop: ${formData.drop}\nDate: ${formData.date}\nPassengers: ${formData.passengers || "Not specified"}\n\nAdditional Notes: ${formData.message || "None"}`,
          serviceType: "taxi",
          honeypot: "",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        setReferenceNumber(result.referenceNumber)

        // Generate WhatsApp link and redirect
        const whatsappLink = generateWhatsAppLink(
          {
            serviceType: formData.serviceType,
            vehicleType: formData.vehicleType,
            pickup: formData.pickup,
            drop: formData.drop,
            date: formData.date,
            passengers: Number.parseInt(formData.passengers) || undefined,
            name: formData.name,
            phone: formData.phone,
            message: formData.message,
          },
          settings?.whatsapp_number,
        )

        setTimeout(() => {
          window.open(whatsappLink, "_blank")
        }, 1500)
      } else {
        // Show backend validation errors if present
        if (result.errors) {
          const fieldErrors = Object.entries(result.errors).map(
            ([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`,
          )
          setErrors({ submit: fieldErrors.join(" | ") })
        } else {
          setErrors({ submit: result.message || "Failed to submit. Please try again." })
        }
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="bg-card border-border flex min-h-150 items-center justify-center rounded-xl border p-6 md:p-8">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border-border rounded-xl border p-8 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="bg-forest-green/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Send className="text-forest-green h-8 w-8" />
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
              serviceType: "",
              vehicleType: "",
              pickup: "",
              drop: "",
              date: "",
              passengers: "",
              name: "",
              phone: "",
              email: "",
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
      className="bg-card border-border rounded-xl border p-6 md:p-8"
    >
      <h3 className="text-foreground mb-6 text-xl font-semibold">Book Your Ride</h3>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
        {/* Service Type */}
        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type *</Label>
          <Select
            value={formData.serviceType}
            onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
          >
            <SelectTrigger id="serviceType" aria-invalid={!!errors.serviceType}>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-way">One Way</SelectItem>
              <SelectItem value="round-trip">Round Trip</SelectItem>
            </SelectContent>
          </Select>
          {errors.serviceType && <p className="text-destructive text-sm">{errors.serviceType}</p>}
        </div>

        {/* Vehicle Type */}
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Vehicle Type *</Label>
          <Select
            value={formData.vehicleType}
            onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
          >
            <SelectTrigger id="vehicleType" aria-invalid={!!errors.vehicleType}>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={v.name}>
                  {v.name} ({v.capacity} pax)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicleType && <p className="text-destructive text-sm">{errors.vehicleType}</p>}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
        {/* Pickup */}
        <div className="space-y-2">
          <Label htmlFor="pickup">Pickup Location *</Label>
          <div className="relative">
            <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="pickup"
              placeholder="e.g., Chandigarh Airport"
              value={formData.pickup}
              onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
              className="pl-10"
              aria-invalid={!!errors.pickup}
            />
          </div>
          {errors.pickup && <p className="text-destructive text-sm">{errors.pickup}</p>}
        </div>

        {/* Drop */}
        <div className="space-y-2">
          <Label htmlFor="drop">Drop Location *</Label>
          <div className="relative">
            <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="drop"
              placeholder="e.g., Shimla Mall Road"
              value={formData.drop}
              onChange={(e) => setFormData({ ...formData, drop: e.target.value })}
              className="pl-10"
              aria-invalid={!!errors.drop}
            />
          </div>
          {errors.drop && <p className="text-destructive text-sm">{errors.drop}</p>}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
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

        {/* Passengers */}
        <div className="space-y-2">
          <Label htmlFor="passengers">Passengers</Label>
          <div className="relative">
            <Users className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="passengers"
              type="number"
              min="1"
              max="20"
              placeholder="e.g., 4"
              value={formData.passengers}
              onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Your Name *</Label>
          <div className="relative">
            <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="name"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10"
              aria-invalid={!!errors.name}
            />
          </div>
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
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

      {/* Message */}
      <div className="mb-6 space-y-2">
        <Label htmlFor="message">Additional Message (Optional)</Label>
        <div className="relative">
          <MessageSquare className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Textarea
            id="message"
            placeholder="Any special requirements..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="min-h-20 pl-10"
          />
        </div>
      </div>

      {errors.submit && <p className="text-destructive mb-4 text-center text-sm">{errors.submit}</p>}

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
            Get Your Quote
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-muted-foreground mt-3 text-center text-xs">
        Your booking will be saved and we will redirect you to WhatsApp
      </p>
    </motion.form>
  )
}
