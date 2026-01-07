"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Shield, Sparkles, MapPin, Headphones, Clock, Receipt } from "lucide-react"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"
import { safetyFeatures } from "@/data/taxis"

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="h-6 w-6" />,
  sparkles: <Sparkles className="h-6 w-6" />,
  mapPin: <MapPin className="h-6 w-6" />,
  headphones: <Headphones className="h-6 w-6" />,
  clock: <Clock className="h-6 w-6" />,
  receipt: <Receipt className="h-6 w-6" />,
}

export function SafetyFeatures() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
    >
      {safetyFeatures.map((feature, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="bg-card border-border rounded-xl border p-4 text-center transition-shadow hover:shadow-md"
        >
          <div className="bg-primary/10 text-primary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            {iconMap[feature.icon]}
          </div>
          <h3 className="text-foreground mb-1 text-sm font-medium">{feature.title}</h3>
          <p className="text-muted-foreground text-xs">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
