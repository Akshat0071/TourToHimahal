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
    description:
      "Plan your perfect Himachal trip with us. Contact our travel experts for personalized assistance.",
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
            <div className="mx-auto grid max-w-4xl gap-8 md:gap-12 lg:max-w-none lg:grid-cols-5 lg:items-start">
              {/* Contact Info Sidebar */}
              <div className="order-1 flex flex-col lg:order-1 lg:col-span-2">
                <div className="bg-card border-border flex flex-col rounded-2xl border p-4 sm:p-6 md:p-8">
                  <div className="mb-5 sm:mb-6">
                    <h2 className="text-foreground font-serif text-xl font-bold sm:text-2xl">Get in Touch</h2>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                      Call, WhatsApp, or email us — we typically respond within 12 hours.
                    </p>
                  </div>
                  <div>
                    <ContactInfo />
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="order-2 flex flex-col lg:order-2 lg:col-span-3">
                <div className="bg-card border-border flex flex-col rounded-2xl border p-4 sm:p-6 md:p-8">
                  <div className="mb-5 sm:mb-6">
                    <h2 className="text-foreground font-serif text-xl font-bold sm:text-2xl">
                      Send Us a Message
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                      Fill out the form below and we&apos;ll get back to you within 12 hours.
                    </p>
                  </div>
                  <div>
                    <ContactForm />
                  </div>
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
