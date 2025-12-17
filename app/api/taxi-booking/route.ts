import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, subject, message, serviceType } = body

    // Validate required fields
    if (!name || name.toString().trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid name",
        },
        { status: 400 },
      )
    }

    if (!phone || phone.toString().trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid phone number",
        },
        { status: 400 },
      )
    }

    if (!message || message.toString().trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide booking details",
        },
        { status: 400 },
      )
    }

    const supabase = await createClient()

    // Prepare data for insertion
    const insertData = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email && String(email).trim().length > 0 ? String(email).trim() : null,
      subject: subject ? String(subject).trim() : `${serviceType || "taxi"} booking`,
      message: String(message).trim(),
      service_type: serviceType || "taxi",
      status: "new",
    }

    console.log("Taxi booking insert data:", insertData)

    // Insert the lead into the database
    const { data, error } = await supabase
      .from("leads")
      .insert(insertData)
      .select("reference_number")
      .single()

    if (error) {
      console.error("Supabase error in taxi booking:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save your booking. Please try again.",
          error: error.message,
        },
        { status: 500 },
      )
    }

    if (!data || !data.reference_number) {
      console.error("No reference number returned from database insert")
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate booking reference. Please try again.",
        },
        { status: 500 },
      )
    }

    console.log("Taxi booking success:", data.reference_number)
    return NextResponse.json({
      success: true,
      message: "Your booking has been saved!",
      referenceNumber: data.reference_number,
    })
  } catch (error) {
    console.error("Taxi booking API error:", error)
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
