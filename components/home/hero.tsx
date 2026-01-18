import { Suspense } from "react"
import { HeroServer, HERO_CONTAINER_ID } from "./hero-server"

interface HeroImage {
  url: string
  alt: string
}

interface HeroProps {
  images?: HeroImage[]
}

export function Hero({ images }: HeroProps) {
  const heroImages = images && images.length > 0 ? images : undefined

  return (
    <>
      {/* Server component renders static content immediately */}
      <HeroServer images={heroImages} />
    </>
  )
}
