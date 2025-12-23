"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, MapPin } from "lucide-react"
import { accordionContent } from "@/lib/animation-variants"

interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  subtitles?: Array<{ title: string; highlight?: string; description: string; activities: string[] }>
}

interface ItineraryAccordionProps {
  itinerary: ItineraryDay[]
}

export function ItineraryAccordion({ itinerary }: ItineraryAccordionProps) {
  const [openDay, setOpenDay] = useState<number | null>(1)

  const toggleDay = (day: number) => {
    setOpenDay(openDay === day ? null : day)
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {itinerary.map((item) => (
        <div key={item.day} className="border-2 border-saffron/20 rounded-2xl overflow-hidden bg-linear-to-br from-white to-saffron/5 shadow-sm hover:shadow-lg hover:border-saffron/40 transition-all duration-300">
          <button
            onClick={() => toggleDay(item.day)}
            className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left hover:bg-saffron/5 transition-colors"
            aria-expanded={openDay === item.day}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-saffron to-sunset-orange flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white font-bold text-base">D{item.day}</span>
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm md:text-base">{item.title}</h4>
                <p className="text-xs text-muted-foreground font-medium">Day {item.day} of your journey</p>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 sm:h-6 sm:w-6 text-saffron transition-transform duration-300 ${
                openDay === item.day ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openDay === item.day && (
              <motion.div
                variants={accordionContent}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <div className="px-3 sm:px-5 md:px-6 pb-5 pt-1">
                  {/* Subtitles Section */}
                  {item.subtitles && item.subtitles.length > 0 ? (
                    <div className="space-y-3 pl-0 md:pl-16">
                      {item.subtitles.map((subtitle, subtitleIndex) => (
                        <div key={subtitleIndex} className="bg-linear-to-br from-white to-mountain-blue/5 rounded-xl p-3 sm:p-4 md:p-5 border border-mountain-blue/20 hover:shadow-md transition-all duration-300">
                          <h5 className="font-bold text-foreground text-xs sm:text-sm mb-2.5 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-linear-to-br from-mountain-blue to-forest-green" />
                            {subtitle.title}
                          </h5>
                          {subtitle.highlight && (
                            <div className="mb-3 p-3 rounded-xl bg-linear-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400/50 shadow-lg shadow-yellow-200/60">
                              <p className="text-xs font-semibold text-yellow-900 flex items-center gap-2">
                                <span className="text-base">⚠️</span>
                                {subtitle.highlight}
                              </p>
                            </div>
                          )}
                          <div className="text-xs sm:text-xs text-muted-foreground mb-3 leading-relaxed whitespace-pre-line">
                            {subtitle.description}
                          </div>
                          {subtitle.activities && subtitle.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {subtitle.activities.map((activity, actIndex) => (
                                <span
                                  key={actIndex}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-forest-green/30 rounded-full text-[10px] sm:text-[11px] font-medium text-forest-green hover:bg-forest-green/5 hover:border-forest-green/50 transition-all"
                                >
                                  <MapPin className="h-3 w-3" />
                                  {activity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-0 md:pl-16 text-muted-foreground text-xs italic py-3">No sub-sections added.</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
