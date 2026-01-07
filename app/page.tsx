import { Suspense } from "react"
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
