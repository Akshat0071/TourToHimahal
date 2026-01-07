import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Car, HeartHandshake, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react"

import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About Us | TourToHimachal - Tours, Packages & Taxi Services",
  description:
    "Meet TourToHimachal — your local travel partner in Himachal Pradesh. We craft tour packages, spiritual journeys, honeymoon trips, and reliable taxi services with honest pricing and on-ground support.",
  keywords:
    "about tourtohimachal, himachal travel agency, himachal tour packages, chintpurni taxi service, spiritual tour himachal",
  openGraph: {
    title: "About Us | TourToHimachal",
    description:
      "Local expertise, transparent planning, and dependable service — discover how TourToHimachal helps you explore Himachal with comfort and confidence.",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-28">
          <div className="absolute inset-0">
            <Image
              src="/Images/diary.png"
              alt="Himachal mountains"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/45 to-black/75" />
          <div className="from-mountain-blue/20 to-saffron/20 absolute inset-0 bg-linear-to-r via-transparent" />

          <div className="relative z-10">
            <div className="container mx-auto px-4 py-12 sm:py-14 md:py-18 lg:py-20">
              <div className="mx-auto max-w-4xl text-center">
                <div className="from-saffron/35 to-mountain-blue/35 inline-flex items-center gap-2 rounded-full border border-white/20 bg-linear-to-r px-4 py-2 text-xs font-semibold text-white backdrop-blur-md sm:text-sm">
                  <Sparkles className="h-4 w-4" />
                  Local travel experts • On-ground support
                </div>

                <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl md:mt-5 md:text-5xl">
                  <span className="text-saffron">About</span> TourToHimachal
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
                  We help you explore Himachal Pradesh with thoughtfully planned tours, reliable taxi services, and a
                  friendly team that stays with you from the first call to the last drop.
                </p>

                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button asChild variant="saffron" size="lg">
                    <Link href="/packages">
                      Explore Tour Packages <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-white/10 text-white hover:bg-white/15">
                    <Link href="/contact">Talk to our team</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:gap-10">
              <div>
                <h2 className="text-foreground font-serif text-2xl font-bold sm:text-3xl">Who we are</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                  TourToHimachal is a Himachal-based travel brand focused on simple, reliable, and memorable journeys.
                  We plan spiritual tours, honeymoon trips, family vacations, and adventure getaways — and we back it
                  all with dependable taxis and real on-ground support.
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                  Our approach is straightforward: understand your preferences, suggest the best route and season, set
                  clear expectations, and execute smoothly. No confusion — just a well-managed trip.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-saffron/10 text-saffron rounded-xl p-2">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">Transparent planning</p>
                      <p className="text-muted-foreground text-sm">Clear route, inclusions, and timing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-forest-green/10 text-forest-green rounded-xl p-2">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">Trusted operations</p>
                      <p className="text-muted-foreground text-sm">Verified drivers and support team.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-mountain-blue/10 text-mountain-blue rounded-xl p-2">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">Reliable taxi service</p>
                      <p className="text-muted-foreground text-sm">Comfortable rides across Himachal.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-temple-red/10 text-temple-red rounded-xl p-2">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">Human support</p>
                      <p className="text-muted-foreground text-sm">Fast help when plans change.</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-serif">What we specialize in</CardTitle>
                  <CardDescription>
                    Packages and services built around comfort, safety, and the best of Himachal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-saffron/10 text-saffron rounded-xl p-2">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-semibold">Spiritual journeys</p>
                        <p className="text-muted-foreground text-sm">
                          Chintpurni, Jwala Ji, Baglamukhi, and other sacred circuits.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-mountain-blue/10 text-mountain-blue rounded-xl p-2">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-semibold">Family and group tours</p>
                        <p className="text-muted-foreground text-sm">
                          Smooth logistics, comfortable stays, and flexible pacing.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-forest-green/10 text-forest-green rounded-xl p-2">
                        <Car className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-semibold">Taxi and transfers</p>
                        <p className="text-muted-foreground text-sm">
                          Airport pickups, intercity routes, and custom cab itineraries.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button asChild variant="green" className="w-full sm:w-auto">
                      <Link href="/taxi">
                        View Taxi Service <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href="/contact">Get a custom itinerary</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-section-warm py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-foreground font-serif text-2xl font-bold sm:text-3xl">Our values</h2>
                <p className="text-muted-foreground mt-3 text-sm sm:text-base">
                  The standards we follow on every booking — whether it&apos;s a weekend getaway or a multi-day circuit.
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-saffron/10 text-saffron rounded-xl p-2">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      Safety first
                    </CardTitle>
                    <CardDescription>
                      Trip planning and operations designed around safe routes, sensible schedules, and verified taxis.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-forest-green/10 text-forest-green rounded-xl p-2">
                        <HeartHandshake className="h-5 w-5" />
                      </span>
                      Honest guidance
                    </CardTitle>
                    <CardDescription>
                      We recommend what&apos;s best for your time and season — and clearly communicate what to expect.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-mountain-blue/10 text-mountain-blue rounded-xl p-2">
                        <BadgeCheck className="h-5 w-5" />
                      </span>
                      Service quality
                    </CardTitle>
                    <CardDescription>
                      Clean vehicles, punctual pickups, quick responses, and a smooth end-to-end experience.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-foreground font-serif text-2xl font-bold sm:text-3xl">How planning works</h2>
                <p className="text-muted-foreground mt-3 text-sm sm:text-base">
                  A simple process that keeps things clear and stress-free.
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">1) Tell us your dates</CardTitle>
                    <CardDescription>
                      Share travel month, number of days, pickup location, and your must-visit places.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">2) Get the best plan</CardTitle>
                    <CardDescription>
                      We suggest a route with realistic driving time, stay options, and key experiences.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">3) Travel with support</CardTitle>
                    <CardDescription>
                      Our team stays available for coordination — from pickups to last-day drop.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="mt-8 flex justify-center">
                <Button asChild variant="gradient" size="lg">
                  <Link href="/contact">Plan your Himachal trip</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
