import { Header } from "@/components/home/header"
import { Hero } from "@/components/home/hero"
import { PopularDestinations } from "@/components/home/popular-destinations"
import { TaxiService } from "@/components/home/taxi-service"
import { TravelThemes } from "@/components/home/travel-themes"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { Testimonials } from "@/components/home/testimonials"
import { TravelDiaries } from "@/components/home/travel-diaries"
import { CTABanner } from "@/components/home/cta-banner"
import { Footer } from "@/components/home/footer"

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <Hero />
      <TaxiService />
      <PopularDestinations />
      <TravelThemes />
      <WhyChooseUs />
      <Testimonials />
      <TravelDiaries />
      <CTABanner />
      <Footer />
    </main>
  )
}
