import type { Metadata } from "next"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { FAQSection } from "@/components/contact/faq-section"
import { MapSection } from "@/components/contact/map-section"
import { MobileContactBar } from "@/components/contact/mobile-contact-bar"

export const metadata: Metadata = {
  title: "Contact Us | TourToHimachal - Tours, Packages & Taxi Services",
  description:
    "Get in touch with TourToHimachal for tour packages, taxi bookings, and custom itineraries. Located in Chintpurni, Himachal Pradesh. We respond within 12 hours.",
  keywords: "contact tourtohimachal, chintpurni travel agency, himachal tour booking, taxi service contact",
  openGraph: {
    title: "Contact Us | TourToHimachal",
    description: "Plan your perfect Himachal trip with us. Contact our travel experts for personalized assistance.",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 md:pb-0">
        {/* Hero Section with Infinite Scroll */}
        <ContactHero />

        {/* Contact Form & Info Section */}
        <section className="py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
              {/* Contact Info Sidebar - Shows FIRST on mobile */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-4 sm:mb-6">Get in Touch</h2>
                <ContactInfo />
              </div>

              {/* Contact Form - Shows SECOND on mobile */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                {/* Heading moved outside the form card */}
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                  Fill out the form below and we&apos;ll get back to you within 12 hours.
                </p>
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* Map Section */}
        <MapSection />
      </main>
      <Footer />

      {/* Mobile Sticky Contact Bar */}
      <MobileContactBar />
    </>
  )
}
