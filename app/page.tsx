import { Suspense } from "react"
import Script from "next/script"
import dynamic from "next/dynamic"
import { Hero } from "@/components/home/hero"

// Dynamic imports for non-critical components
const Header = dynamic(
  () => import("@/components/home/header").then((mod) => ({ default: mod.Header })),
  { loading: () => null }
)

const PopularDestinations = dynamic(
  () => import("@/components/home/popular-destinations").then((mod) => ({ default: mod.PopularDestinations })),
  { loading: () => null }
)

const TaxiService = dynamic(
  () => import("@/components/home/taxi-service").then((mod) => ({ default: mod.TaxiService })),
  { loading: () => null }
)

const DeferredHomeSections = dynamic(
  () => import("@/components/home/deferred-home-sections").then((mod) => ({ default: mod.DeferredHomeSections })),
  { loading: () => null }
)

const TravelDiaries = dynamic(
  () => import("@/components/home/travel-diaries").then((mod) => ({ default: mod.TravelDiaries })),
  { loading: () => null }
)

const DeferredCTABanner = dynamic(
  () => import("@/components/home/deferred-cta-banner").then((mod) => ({ default: mod.DeferredCTABanner })),
  { loading: () => null }
)

const Footer = dynamic(
  () => import("@/components/home/footer").then((mod) => ({ default: mod.Footer })),
  { loading: () => null }
)
export default function HomePage() {
  return (
    <main className="bg-background min-h-screen">
      <Script
        id="org-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TourToHimachal",
            url: "https://www.tourtohimachal.com/",
            logo: "https://www.tourtohimachal.com/icon.png",
          }),
        }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "TourToHimachal",
            url: "https://www.tourtohimachal.com/",
          }),
        }}
      />
      <Header />
      <Hero />
      <TaxiService />
      <Suspense fallback={null}>
        <PopularDestinations />
      </Suspense>

      <DeferredHomeSections />

      <Suspense fallback={null}>
        <TravelDiaries />
      </Suspense>

      <DeferredCTABanner />
      <Footer />
    </main>
  )
}
