import { Resend } from "resend"

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendLeadNotificationParams {
  to: string
  leadData: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
    serviceType: string
    referenceNumber: string
  }
}

export async function sendLeadNotification({ to, leadData }: SendLeadNotificationParams) {
  if (!resend) {
    console.warn("⚠️ Resend API key not configured. Email notification skipped.")
    return { success: false, message: "Email service not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "TourToHimachal <noreply@tourtohimachal.com>", // Must be verified domain in Resend
      to: [to],
      subject: `🔔 New ${leadData.serviceType} Inquiry from ${leadData.name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Lead Inquiry</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 14px;">Reference: ${leadData.referenceNumber}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; color: #667eea; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Service Type</p>
                <p style="margin: 8px 0 0 0; color: #333; font-size: 18px; font-weight: 600; text-transform: capitalize;">${leadData.serviceType}</p>
              </div>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Customer Name</p>
                    <p style="margin: 5px 0 0 0; color: #333; font-size: 16px; font-weight: 500;">${leadData.name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</p>
                    <p style="margin: 5px 0 0 0; color: #333; font-size: 16px;"><a href="mailto:${leadData.email}" style="color: #667eea; text-decoration: none;">${leadData.email}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</p>
                    <p style="margin: 5px 0 0 0; color: #333; font-size: 16px;"><a href="tel:${leadData.phone}" style="color: #667eea; text-decoration: none;">${leadData.phone}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                    <p style="margin: 5px 0 0 0; color: #333; font-size: 16px;">${leadData.subject}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0;">
                    <p style="margin: 0; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                    <p style="margin: 10px 0 0 0; color: #333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${leadData.message}</p>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/leads" style="display: inline-block; padding: 12px 30px; background-color: #ffffff; color: #667eea; text-decoration: none; font-weight: 600; border-radius: 6px; font-size: 14px;">View in Admin Panel</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 13px;">
                This is an automated notification from TourToHimachal.<br>
                Please respond to the customer within 12 hours.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error("❌ Failed to send email:", error)
      return { success: false, message: error.message }
    }

    console.log("✅ Email notification sent successfully:", data?.id)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Email sending error:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}
