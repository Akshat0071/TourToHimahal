"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Users, Briefcase, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cardHover, fadeInUp } from "@/lib/animation-variants"

interface Vehicle {
  id: string
  name: string
  type: string
  capacity: number
  luggage_capacity?: number
  per_km_rate: number
  features?: string[]
  image_url?: string
  is_available: boolean
}

interface VehicleCardProps {
  vehicle: Vehicle
  isSelected: boolean
  onSelect: () => void
}

export function VehicleCard({ vehicle, isSelected, onSelect }: VehicleCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="rest"
      whileHover="hover"
      className={`bg-card overflow-hidden rounded-xl border-2 transition-colors ${
        isSelected ? "border-primary shadow-lg" : "border-border"
      }`}
    >
      <motion.div variants={cardHover}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={vehicle.image_url || `/placeholder.svg?height=200&width=320&query=${vehicle.name} car`}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
          {isSelected && (
            <div className="bg-primary absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full">
              <Check className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-foreground mb-1 text-xl font-semibold">{vehicle.name}</h3>
          <p className="text-muted-foreground mb-4 text-sm">{vehicle.type}</p>

          <div className="mb-4 flex items-center gap-4">
            <div className="text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">{vehicle.capacity} pax</span>
            </div>
            {vehicle.luggage_capacity && (
              <div className="text-muted-foreground flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">{vehicle.luggage_capacity} bags</span>
              </div>
            )}
          </div>

          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {vehicle.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Rate and Select Button removed */}
        </div>
      </motion.div>
    </motion.div>
  )
}
