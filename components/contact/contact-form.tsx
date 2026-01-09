"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader2, CheckCircle2, Upload, X, AlertCircle } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fadeInUp } from "@/lib/animation-variants"
import { useSettings } from "@/lib/settings-context"
import { submitContactForm, type ContactFormData } from "@/lib/contact"

const serviceTypes = [
  { value: "package", label: "Tour Package Inquiry" },
  { value: "taxi", label: "Taxi Booking" },
  { value: "enquiry", label: "General Enquiry" },
]

interface FormErrors {
  name?: string[]
  phone?: string[]
  email?: string[]
  subject?: string[]
  message?: string[]
  serviceType?: string[]
}

export function ContactForm() {
  const { settings } = useSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    serviceType: "",
    message: "",
    honeypot: "", // Spam protection field
  })

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "name":
        if (value.length < 2) {
          newErrors.name = ["Name must be at least 2 characters"]
        } else {
          delete newErrors.name
        }
        break
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = ["Please enter a valid email address"]
        } else {
          delete newErrors.email
        }
        break
      case "phone":
        if (value.length < 10) {
          newErrors.phone = ["Please enter a valid phone number"]
        } else {
          delete newErrors.phone
        }
        break
      case "message":
        if (value.length < 10) {
          newErrors.message = ["Message must be at least 10 characters"]
        } else {
          delete newErrors.message
        }
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time validation on blur
    if (errors[name as keyof FormErrors]) {
      validateField(name, value)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF and image files are allowed")
        return
      }
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    // Validate all fields
    const newErrors: FormErrors = {}
    if (formData.name.length < 2) newErrors.name = ["Name must be at least 2 characters"]
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = ["Please enter a valid email address"]
    if (formData.phone.length < 10) newErrors.phone = ["Please enter a valid phone number"]
    if (formData.message.length < 10) newErrors.message = ["Message must be at least 10 characters"]
    if (!formData.serviceType) newErrors.serviceType = ["Please select a service type"]

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    const submitData: ContactFormData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      subject: formData.subject || undefined,
      message: formData.message,
      serviceType: formData.serviceType as "package" | "taxi" | "enquiry",
      honeypot: formData.honeypot,
    }

    const result = await submitContactForm(submitData)

    setIsSubmitting(false)

    if (result.success) {
      setIsSubmitted(true)
      setReferenceNumber(result.referenceNumber || null)
    } else {
      setSubmitError(result.message)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-forest-green/10 border-forest-green/30 rounded-2xl border p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="bg-forest-green/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        >
          <CheckCircle2 className="text-forest-green h-10 w-10" />
        </motion.div>
        <h3 className="text-foreground mb-2 font-serif text-2xl font-bold">Thank You!</h3>
        <p className="text-muted-foreground mb-4">Your inquiry has been submitted successfully.</p>
        {referenceNumber && (
          <p className="text-foreground bg-muted mb-6 inline-block rounded-lg px-4 py-2 text-sm font-medium">
            Reference: <span className="text-primary">{referenceNumber}</span>
          </p>
        )}
        <p className="text-muted-foreground mb-6 text-sm">
          We typically respond within 12 hours. For urgent inquiries, chat with us directly.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
            <a
              href={`https://wa.me/${(settings?.whatsapp_number || "").replace(/[^0-9]/g, "")}?text=Hi!%20I%20just%20submitted%20an%20inquiry%20and%20would%20like%20to%20chat.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="mr-2 h-4 w-4" />
              Chat on WhatsApp
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false)
              setReferenceNumber(null)
              setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                serviceType: "",
                message: "",
                honeypot: "",
              })
              setSelectedFile(null)
            }}
          >
            Send Another Inquiry
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={(e) => setFormData((prev) => ({ ...prev, honeypot: e.target.value }))}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Your full name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`focus:ring-primary/20 transition-all duration-200 focus:shadow-lg focus:ring-2 ${
              errors.name ? "border-destructive" : ""
            }`}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="name-error"
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.name[0]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="your@email.com"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`focus:ring-primary/20 transition-all duration-200 focus:shadow-lg focus:ring-2 ${
              errors.email ? "border-destructive" : ""
            }`}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="email-error"
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.email[0]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone / WhatsApp *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="+91 98765 43210"
            required
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={`focus:ring-primary/20 transition-all duration-200 focus:shadow-lg focus:ring-2 ${
              errors.phone ? "border-destructive" : ""
            }`}
          />
          <AnimatePresence>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="phone-error"
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.phone[0]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type *</Label>
          <Select
            value={formData.serviceType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceType: value }))}
            required
          >
            <SelectTrigger
              id="serviceType"
              className={`focus:ring-primary/20 transition-all duration-200 focus:shadow-lg focus:ring-2 ${
                errors.serviceType ? "border-destructive" : ""
              }`}
              aria-invalid={!!errors.serviceType}
            >
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AnimatePresence>
            {errors.serviceType && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-destructive flex items-center gap-1 text-sm"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.serviceType[0]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="Brief subject of your inquiry"
          className="focus:ring-primary/20 transition-all duration-200 focus:shadow-lg focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Your Message *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Tell us about your travel plans, preferred destinations, special requirements..."
          rows={5}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`focus:ring-primary/20 resize-none transition-all duration-200 focus:shadow-lg focus:ring-2 ${
            errors.message ? "border-destructive" : ""
          }`}
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="message-error"
              className="text-destructive flex items-center gap-1 text-sm"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.message[0]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="file">Attach Document (Optional)</Label>
        <p className="text-muted-foreground mb-2 text-xs">
          Upload itinerary request or travel document (PDF, JPG, PNG - max 5MB)
        </p>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Choose File
          </Button>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-muted flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
            >
              <span className="max-w-37.5 truncate">{selectedFile.name}</span>
              <button
                type="button"
                onClick={removeFile}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Submit Error */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 border-destructive/30 text-destructive flex items-center gap-3 rounded-lg border p-4"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{submitError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        size="lg"
        className="bg-saffron hover:bg-saffron/90 w-full text-white transition-all duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Inquiry
          </>
        )}
      </Button>

      {/* Status message for screen readers */}
      <div aria-live="polite" className="sr-only">
        {isSubmitting && "Submitting your inquiry..."}
        {isSubmitted && `Success! Your reference number is ${referenceNumber}`}
      </div>
    </motion.form>
  )
}
