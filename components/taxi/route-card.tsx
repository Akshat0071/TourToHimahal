"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/lib/settings-context"
import { fadeInUp } from "@/lib/animation-variants"
import { generateWhatsAppLink } from "@/lib/whatsapp"

interface Route {
  id: string
  from_location: string
  to_location: string
  distance_km: number
  estimated_time: string
  base_fare: number
  is_active: boolean
}

interface RouteCardProps {
  route: Route
}

export function RouteCard({ route }: RouteCardProps) {
  const { settings } = useSettings()
  const whatsappLink = generateWhatsAppLink(
    {
      route: `${route.from_location} to ${route.to_location}`,
    },
    settings.whatsapp_number,
  )

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-card border-border rounded-xl border p-5 transition-shadow hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-foreground flex items-center gap-2">
            <MapPin className="text-primary h-4 w-4" />
            <span className="font-medium">{route.from_location}</span>
          </div>
          <ArrowRight className="text-muted-foreground h-4 w-4" />
          <div className="text-foreground flex items-center gap-2">
            <MapPin className="text-saffron h-4 w-4" />
            <span className="font-medium">{route.to_location}</span>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mb-4 flex items-center gap-4 text-sm">
        <span>{route.distance_km} km</span>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{route.estimated_time}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-muted-foreground text-sm">Starting from</span>
          <p className="text-primary text-xl font-bold">₹{route.base_fare?.toLocaleString()}</p>
        </div>
        <Button asChild className="bg-forest-green hover:bg-forest-green/90 text-white">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            Book This Route
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
