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
        <div
          key={item.day}
          className="border-saffron/20 to-saffron/5 hover:border-saffron/40 overflow-hidden rounded-2xl border-2 bg-linear-to-br from-white shadow-sm transition-all duration-300 hover:shadow-lg"
        >
          <button
            onClick={() => toggleDay(item.day)}
            className="hover:bg-saffron/5 flex w-full items-center justify-between p-4 text-left transition-colors sm:p-5 md:p-6"
            aria-expanded={openDay === item.day}
          >
            <div className="flex items-center gap-4">
              <div className="from-saffron to-sunset-orange flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-md sm:h-14 sm:w-14">
                <span className="text-base font-bold text-white">D{item.day}</span>
              </div>
              <div>
                <p className="text-foreground text-sm font-bold md:text-base">{item.title}</p>
                <p className="text-muted-foreground text-xs font-medium">Day {item.day} of your journey</p>
              </div>
            </div>
            <ChevronDown
              className={`text-saffron h-5 w-5 transition-transform duration-300 sm:h-6 sm:w-6 ${
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
                <div className="px-3 pt-1 pb-5 sm:px-5 md:px-6">
                  {/* Subtitles Section */}
                  {item.subtitles && item.subtitles.length > 0 ? (
                    <div className="space-y-3 pl-0 md:pl-16">
                      {item.subtitles.map((subtitle, subtitleIndex) => (
                        <div
                          key={subtitleIndex}
                          className="to-mountain-blue/5 border-mountain-blue/20 rounded-xl border bg-linear-to-br from-white p-3 transition-all duration-300 hover:shadow-md sm:p-4 md:p-5"
                        >
                          <h5 className="text-foreground mb-2.5 flex items-center gap-2 text-xs font-bold sm:text-sm">
                            <div className="from-mountain-blue to-forest-green h-2 w-2 rounded-full bg-linear-to-br" />
                            {subtitle.title}
                          </h5>
                          {subtitle.highlight && (
                            <div className="mb-3 inline-flex max-w-full items-start rounded-xl border-2 border-yellow-400/50 bg-linear-to-r from-yellow-50 to-yellow-100 px-3 py-2 shadow-lg shadow-yellow-200/60">
                              <span className="inline-flex items-start gap-2 text-xs font-semibold text-yellow-900 whitespace-normal">
                                <span className="text-base leading-none">⚠️</span>
                                <span>{subtitle.highlight}</span>
                              </span>
                            </div>
                          )}
                          <div className="text-muted-foreground mb-3 text-xs leading-relaxed whitespace-pre-line sm:text-xs">
                            {subtitle.description}
                          </div>
                          {subtitle.activities && subtitle.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {subtitle.activities.map((activity, actIndex) => (
                                <span
                                  key={actIndex}
                                  className="border-forest-green/30 text-forest-green hover:bg-forest-green/5 hover:border-forest-green/50 inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-1 text-[10px] font-medium transition-all sm:text-[11px]"
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
                    <div className="text-muted-foreground py-3 pl-0 text-xs italic md:pl-16">
                      No sub-sections added.
                    </div>
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
