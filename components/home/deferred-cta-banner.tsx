"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const CTABanner = dynamic(() => import("@/components/home/cta-banner").then((m) => m.CTABanner), {
  ssr: false,
})

function runWhenIdle(cb: () => void) {
  if (typeof window === "undefined") return

  const w = window as unknown as { requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number }
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(cb, { timeout: 1500 })
    return
  }

  setTimeout(cb, 1)
}

export function DeferredCTABanner() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    runWhenIdle(() => setEnabled(true))
  }, [])

  if (!enabled) return null
  return <CTABanner />
}
