"use client"

import { useRef, useEffect } from "react"

interface HeroClientProps {
  containerId: string
  imageCount: number
}

export function HeroClient({ containerId, imageCount }: HeroClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    const speed = 0.06
    const totalWidth = imageCount * 400

    const animate = () => {
      xRef.current -= speed
      if (Math.abs(xRef.current) >= totalWidth) {
        xRef.current = 0
      }
      container.style.transform = `translateX(${xRef.current}px)`
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation after a short delay to ensure LCP is complete
    const timeoutId = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate)
    }, 1000) // 1 second delay to prioritize LCP

    return () => {
      clearTimeout(timeoutId)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [containerId, imageCount])

  return null
}
