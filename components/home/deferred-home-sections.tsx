"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const TravelThemes = dynamic(
  () => import("@/components/home/travel-themes").then((m) => m.TravelThemes),
  { ssr: false },
)
const WhyChooseUs = dynamic(() => import("@/components/home/why-choose-us").then((m) => m.WhyChooseUs), {
  ssr: false,
})
const Testimonials = dynamic(() => import("@/components/home/testimonials").then((m) => m.Testimonials), {
  ssr: false,
})

function runWhenIdle(cb: () => void) {
  if (typeof window === "undefined") return

  // requestIdleCallback is not supported in all browsers
  const w = window as unknown as { requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number }
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(cb, { timeout: 1500 })
    return
  }

  setTimeout(cb, 1)
}

export function DeferredHomeSections() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    runWhenIdle(() => setEnabled(true))
  }, [])

  if (!enabled) return null

  return (
    <>
      <TravelThemes />
      <WhyChooseUs />
      <Testimonials />
    </>
  )
}
