import { z } from "zod"

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .default("noemail@himachalyatra.com"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  serviceType: z.enum(["package", "taxi", "enquiry"], {
    required_error: "Please select a service type",
  }),
  honeypot: z.string().max(0, "Bot detected").optional(), // Spam protection
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export interface ContactSubmissionResult {
  success: boolean
  message: string
  referenceNumber?: string
  error?: string
}

export async function submitContactForm(data: ContactFormData): Promise<ContactSubmissionResult> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to submit form",
        error: result.error,
      }
    }

    return {
      success: true,
      message: result.message,
      referenceNumber: result.referenceNumber,
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "")
  // Ensure it starts with country code (default to India)
  if (cleaned.length === 10) {
    return `91${cleaned}`
  }
  return cleaned
}
