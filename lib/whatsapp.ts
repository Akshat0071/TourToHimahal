interface BookingDetails {
  serviceType?: string
  vehicleType?: string
  pickup?: string
  drop?: string
  date?: string
  passengers?: number
  name?: string
  phone?: string
  message?: string
  packageName?: string
  route?: string
}

export function generateWhatsAppLink(details: BookingDetails, whatsappPhone?: string): string {
  // Remove all non-numeric characters from phone number
  const phoneNumber = (whatsappPhone || "").replace(/[^0-9]/g, "")

  const messageLines: string[] = []

  if (details.packageName) {
    messageLines.push(`Hi! I'm interested in booking the *${details.packageName}* package.`)
  } else if (details.route) {
    messageLines.push(`Hi! I'd like to book a taxi for *${details.route}*.`)
  } else {
    messageLines.push("Hi! I'd like to book a taxi service.")
  }

  if (details.serviceType) {
    messageLines.push(`Service Type: ${details.serviceType}`)
  }
  if (details.vehicleType) {
    messageLines.push(`Vehicle: ${details.vehicleType}`)
  }
  if (details.pickup) {
    messageLines.push(`Pickup: ${details.pickup}`)
  }
  if (details.drop) {
    messageLines.push(`Drop: ${details.drop}`)
  }
  if (details.date) {
    messageLines.push(`Date: ${details.date}`)
  }
  if (details.passengers) {
    messageLines.push(`Passengers: ${details.passengers}`)
  }
  if (details.name) {
    messageLines.push(`Name: ${details.name}`)
  }
  if (details.phone) {
    messageLines.push(`Contact: ${details.phone}`)
  }
  if (details.message) {
    messageLines.push(`Message: ${details.message}`)
  }

  messageLines.push("\nPlease confirm availability and pricing.")

  const encodedMessage = encodeURIComponent(messageLines.join("\n"))

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}
