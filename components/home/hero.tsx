import { Suspense } from "react"
import dynamic from "next/dynamic"
import { HeroServer, HERO_CONTAINER_ID } from "./hero-server"

interface HeroImage {
  url: string
  alt: string
}

interface HeroProps {
  images?: HeroImage[]
}

// Dynamically import client-side animation component
// This ensures that server component renders first for LCP
const HeroClient = dynamic(
  () => import("./hero-client").then((mod) => ({ default: mod.HeroClient })),
  {
    loading: () => null,
  }
)

export function Hero({ images }: HeroProps) {
  const heroImages = images && images.length > 0 ? images : undefined
  const imageCount = heroImages?.length || 4

  return (
    <>
      {/* Server component renders static content immediately */}
      <HeroServer images={heroImages} />

      {/* Client-side animation loads after initial render */}
      <Suspense fallback={null}>
        <HeroClient containerId={HERO_CONTAINER_ID} imageCount={imageCount} />
      </Suspense>
    </>
  )
}
