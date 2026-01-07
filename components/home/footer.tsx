"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Heart, ArrowRight } from "lucide-react"
import { useSettings } from "@/lib/settings-context"

const quickLinks = [
  { href: "/packages", label: "Tour Packages" },
  { href: "/taxi", label: "Taxi Service" },
  { href: "/about", label: "About Us" },
  { href: "/diaries", label: "Travel Diaries" },
  { href: "/contact", label: "Contact" },
]

// Updated destinations for footer with corresponding package slugs
const destinations = [
  { name: "Mata Chintpurni - VIP", slug: "mata-chintpurni-mandir-vip-express" },
  { name: "Divya Mandir Yatra", slug: "divya-mandir-yatra-jwala-ji-baglamukhi-chintpurni" },
  { name: "4 Mahadev, 1 Shaktipeeth", slug: "4-mahadev-darshan-1-shakti-peeth-chintpurni-spiritual-circuit" },
  { name: "4 Shaktipeeth, 1 Mahadev", slug: "4-shakti-peeth-1-siddh-peeth-darshan-chintpurni-circuit" },
]

export function Footer() {
  const { settings } = useSettings()

  const socialLinks = [
    {
      icon: Facebook,
      href: settings?.facebook_url || "https://facebook.com",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      icon: Instagram,
      href: settings?.instagram_url || "https://instagram.com",
      label: "Instagram",
      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500",
    },
    {
      icon: Twitter,
      href: settings?.twitter_url || "https://twitter.com",
      label: "Twitter",
      color: "hover:bg-sky-500",
    },
    {
      icon: Youtube,
      href: settings?.youtube_url || "https://youtube.com",
      label: "YouTube",
      color: "hover:bg-red-600",
    },
  ]

  const contactPhone = settings?.contact_phone || ""
  const contactEmail = settings?.contact_email || "info@tourtohimachal.com"
  const address = settings?.address || "123 Mall Road, Shimla, Himachal Pradesh 171001"

  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient border */}
      <div className="from-saffron via-golden-yellow to-forest-green h-1 bg-gradient-to-r" />

      {/* Main footer content */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="group mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
                <div className="relative h-16 w-56 rounded-xl p-0 transition-transform group-hover:scale-105 sm:h-20 sm:w-72">
                  <Image
                    src="/Images/logow.webp"
                    alt="TourToHimachal Logo"
                    fill
                    className="object-contain object-left translate-x-16 lg:translate-x-24 scale-x-[1.5] scale-y-[1.2]"
                  />
                </div>
               
              </Link>
              <p className="mb-4 text-xs leading-relaxed text-slate-400 sm:mb-6 sm:text-sm md:text-base">
                {settings?.about_text ||
                  "Your trusted partner for exploring the majestic Himachal Pradesh. From spiritual journeys to adventure trips, we make your travel dreams come true."}
              </p>

              {/* Social links with colors */}
              <div className="flex gap-2 sm:gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-all duration-300 sm:h-10 sm:w-10 ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-base font-bold sm:mb-6 sm:text-lg">
                <span className="from-saffron to-golden-yellow h-1 w-6 rounded-full bg-gradient-to-r sm:w-8" />
                Quick Links
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-saffron group flex items-center gap-2 text-xs text-slate-400 transition-colors sm:text-sm md:text-base"
                    >
                      <ArrowRight className="-ml-5 h-3 w-3 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-base font-bold sm:mb-6 sm:text-lg">
                <span className="from-forest-green to-mountain-blue h-1 w-6 rounded-full bg-gradient-to-r sm:w-8" />
                Top Destinations
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {destinations.map((destination) => (
                  <li key={destination.slug}>
                    <Link
                      href={`/packages/${destination.slug}`}
                      className="hover:text-forest-green group flex items-center gap-2 text-xs text-slate-400 transition-colors sm:text-sm md:text-base"
                    >
                      <MapPin className="text-forest-green h-3 w-3" />
                      {destination.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-base font-bold sm:mb-6 sm:text-lg">
                <span className="from-sunset-orange to-temple-red h-1 w-6 rounded-full bg-gradient-to-r sm:w-8" />
                Contact Us
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="group flex items-start gap-2 sm:gap-3">
                  <div className="bg-saffron/10 group-hover:bg-saffron/20 shrink-0 rounded-lg p-1.5 transition-colors sm:p-2">
                    <MapPin className="text-saffron h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-xs text-slate-400 sm:text-sm md:text-base">{address}</span>
                </li>
                {contactPhone && (
                  <li className="group flex items-center gap-2 sm:gap-3">
                    <div className="bg-forest-green/10 group-hover:bg-forest-green/20 shrink-0 rounded-lg p-1.5 transition-colors sm:p-2">
                      <Phone className="text-forest-green h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, "")}`}
                      className="hover:text-forest-green text-xs text-slate-400 transition-colors sm:text-sm md:text-base"
                    >
                      {contactPhone}
                    </a>
                  </li>
                )}
                <li className="group flex items-center gap-2 sm:gap-3">
                  <div className="bg-mountain-blue/10 group-hover:bg-mountain-blue/20 shrink-0 rounded-lg p-1.5 transition-colors sm:p-2">
                    <Mail className="text-mountain-blue h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-mountain-blue text-xs break-all text-slate-400 transition-colors sm:text-sm md:text-base"
                  >
                    {contactEmail}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
              <p className="flex items-center gap-1 text-xs text-slate-500 sm:text-sm">
                © 2025 TourToHimachal. Made with{" "}
                <Heart className="text-temple-red fill-temple-red h-3 w-3 sm:h-4 sm:w-4" /> in Himachal
              </p>
              <div className="flex gap-4 sm:gap-6">
                <Link
                  href="/privacy"
                  className="hover:text-saffron text-xs text-slate-500 transition-colors sm:text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-saffron text-xs text-slate-500 transition-colors sm:text-sm"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
