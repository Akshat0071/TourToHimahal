import { Suspense } from "react"
import Script from "next/script"
import { Header } from "@/components/home/header"
import { Hero } from "@/components/home/hero"
import { PopularDestinations } from "@/components/home/popular-destinations"
import { TaxiService } from "@/components/home/taxi-service"
import { DeferredHomeSections } from "@/components/home/deferred-home-sections"
import { TravelDiaries } from "@/components/home/travel-diaries"
import { DeferredCTABanner } from "@/components/home/deferred-cta-banner"
import { Footer } from "@/components/home/footer"

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
