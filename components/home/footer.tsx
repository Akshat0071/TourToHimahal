"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Heart, ArrowRight } from "lucide-react"
import { useSettings } from "@/lib/settings-context"

const quickLinks = [
  { href: "/packages", label: "Tour Packages" },
  { href: "/taxi", label: "Taxi Service" },
  { href: "/diaries", label: "Travel Diaries" },
  { href: "/about", label: "About Us" },
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

  const contactPhone = settings?.contact_phone || "+91 98765 43210"
  const contactEmail = settings?.contact_email || "info@tourtohimachal.com"
  const address = settings?.address || "123 Mall Road, Shimla, Himachal Pradesh 171001"

  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient border */}
      <div className="h-1 bg-gradient-to-r from-saffron via-golden-yellow to-forest-green" />

      {/* Main footer content */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 group">
                <div className="relative w-56 h-16 sm:w-72 sm:h-20 p-0 rounded-xl group-hover:scale-105 transition-transform">
                  <Image
                    src="/Images/logowhite.webp"
                    alt="TourToHimachal Logo"
                    fill
                    className="object-contain object-left"
                  />
                  {/* SVG Logo - Commented out
                  <svg ... /> */}
                </div>
                {/* Text Hidden - Replaced by Logo Image
                <div>
                  <span className="text-lg sm:text-xl font-serif font-bold">
                    <span className="text-saffron">Tour</span>
                    <span className="text-white">To</span>
                    <span className="text-forest-green">Himachal</span>
                  </span>
                  <span className="block text-[10px] sm:text-xs text-golden-yellow tracking-wider">
                    YOUR HIMALAYAN JOURNEY
                  </span>
                </div>
                */}
              </Link>
              <p className="text-slate-400 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm md:text-base">
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
                    className={`w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center transition-all duration-300 ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-6 sm:w-8 h-1 bg-gradient-to-r from-saffron to-golden-yellow rounded-full" />
                Quick Links
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-saffron transition-colors flex items-center gap-2 group text-xs sm:text-sm md:text-base"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-6 sm:w-8 h-1 bg-gradient-to-r from-forest-green to-mountain-blue rounded-full" />
                Top Destinations
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {destinations.map((destination) => (
                  <li key={destination.slug}>
                    <Link
                      href={`/packages/${destination.slug}`}
                      className="text-slate-400 hover:text-forest-green transition-colors flex items-center gap-2 group text-xs sm:text-sm md:text-base"
                    >
                      <MapPin className="h-3 w-3 text-forest-green" />
                      {destination.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-6 sm:w-8 h-1 bg-gradient-to-r from-sunset-orange to-temple-red rounded-full" />
                Contact Us
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2 sm:gap-3 group">
                  <div className="p-1.5 sm:p-2 bg-saffron/10 rounded-lg group-hover:bg-saffron/20 transition-colors shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-saffron" />
                  </div>
                  <span className="text-slate-400 text-xs sm:text-sm md:text-base">{address}</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 group">
                  <div className="p-1.5 sm:p-2 bg-forest-green/10 rounded-lg group-hover:bg-forest-green/20 transition-colors shrink-0">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-forest-green" />
                  </div>
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, "")}`}
                    className="text-slate-400 hover:text-forest-green transition-colors text-xs sm:text-sm md:text-base"
                  >
                    {contactPhone}
                  </a>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 group">
                  <div className="p-1.5 sm:p-2 bg-mountain-blue/10 rounded-lg group-hover:bg-mountain-blue/20 transition-colors shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-mountain-blue" />
                  </div>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-slate-400 hover:text-mountain-blue transition-colors text-xs sm:text-sm md:text-base break-all"
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
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
              <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1">
                © 2025 TourToHimachal. Made with{" "}
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-temple-red fill-temple-red" /> in Himachal
              </p>
              <div className="flex gap-4 sm:gap-6">
                <Link
                  href="/privacy"
                  className="text-slate-500 text-xs sm:text-sm hover:text-saffron transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-slate-500 text-xs sm:text-sm hover:text-saffron transition-colors">
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
