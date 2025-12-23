import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { contactFormSchema } from "@/lib/contact"
import { sendLeadNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the form data
    const validationResult = contactFormSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { name, phone, email, subject, message, serviceType, honeypot } = validationResult.data

    // Honeypot spam check
    if (honeypot && honeypot.length > 0) {
      // Silently reject bot submissions
      return NextResponse.json({
        success: true,
        message: "Thank you for your submission!",
        referenceNumber: "HY-BLOCKED",
      })
    }

    const supabase = createAdminClient()

    // Insert the lead into the database
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        phone,
        email: email || "noemail@himachalyatra.com",
        subject: subject || `${serviceType} inquiry`,
        message,
        service_type: serviceType,
        status: "new",
      })
      .select("reference_number")
      .single()

    if (error) {
      console.error("Supabase error:", JSON.stringify(error, null, 2))
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save your inquiry. Please try again.",
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    // Send email notification
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "info@himachalyatra.com"
    await sendLeadNotification({
      to: adminEmail,
      leadData: {
        name,
        email: email || "noemail@himachalyatra.com",
        phone,
        subject: subject || `${serviceType} inquiry`,
        message,
        serviceType,
        referenceNumber: data.reference_number,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Thank you! Your inquiry has been submitted. We will respond within 12 hours.",
      referenceNumber: data.reference_number,
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
