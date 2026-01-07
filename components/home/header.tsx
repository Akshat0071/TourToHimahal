"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sparkles, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { useSettings } from "@/lib/settings-context"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/taxi", label: "Taxi Service" },
  { href: "/about", label: "About Us" },
  { href: "/packages", label: "Packages" },
  { href: "/diaries", label: "Travel Diaries" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { settings, loading } = useSettings()
  const scrollYRef = useRef(0)
  const pathname = usePathname()

  const whatsappNumber = settings?.whatsapp_number || ""
  const contactPhone = settings?.contact_phone || ""

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    // Set initial state to avoid transparent flicker on first render
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll, scroll to top, then lock body at top
      scrollYRef.current = window.scrollY
      try {
        window.scrollTo({ top: 0, behavior: "auto" })
      } catch {
        window.scrollTo(0, 0)
      }
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = "0"
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.width = "100%"
      document.body.classList.add("menu-open")
    } else {
      // Unlock and restore scroll to previous position
      const y = scrollYRef.current
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
      document.body.classList.remove("menu-open")
      window.scrollTo(0, y)
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
      document.body.classList.remove("menu-open")
    }
  }, [isMobileMenuOpen])

  return (
    <header className="bg-background/95 border-border fixed top-0 right-0 left-0 z-50 border-b shadow-sm backdrop-blur-md transition-all duration-500">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Logo size="lg" className="origin-left translate-y-1.5 scale-x-[1.5] scale-y-[1.3]" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive ? "bg-saffron text-white" : "text-foreground hover:bg-saffron hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            {/* Contact Phone */}
            {contactPhone && (
              <div className="text-right">
                <p className="text-muted-foreground text-xs">Need help?</p>
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="text-foreground hover:text-saffron flex items-center justify-end gap-1 text-sm font-semibold transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {contactPhone}
                </a>
              </div>
            )}

            {whatsappNumber && (
              <Button asChild variant="gradient" size="lg" className="gap-2">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Sparkles className="h-4 w-4" />
                  Book Now
                </a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="bg-muted hover:bg-saffron/10 rounded-full p-2.5 transition-all md:p-3 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="text-foreground h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Blurred backdrop - covers remaining 20% */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 1 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-101 flex h-dvh w-[80%] max-w-sm flex-col bg-white shadow-2xl lg:hidden"
            >
              {/* Decorative gradient top */}
              <div className="from-saffron via-golden-yellow to-forest-green absolute top-0 right-0 left-0 h-1 bg-linear-to-r" />

              {/* Header with logo and close button */}
              <div className="border-border flex shrink-0 items-center justify-between border-b bg-white p-4">
                <Logo
                  size="md"
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="origin-left translate-y-0.5 scale-x-[1.2] scale-y-[1.05]"
                />

                {/* Close button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-muted hover:bg-destructive/10 rounded-full p-2 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="text-foreground h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <div className="relative flex flex-1 flex-col overflow-y-auto bg-white p-4 sm:p-6">
                {/* Decorative element */}
                <div className="from-saffron/10 pointer-events-none absolute top-20 right-0 h-32 w-32 rounded-bl-full bg-linear-to-bl to-transparent" />

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    const isActive =
                      pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all sm:px-4 sm:py-3 sm:text-base ${
                            isActive
                              ? "bg-saffron text-white"
                              : "text-foreground hover:bg-saffron hover:text-white"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${isActive ? "bg-white" : "from-saffron to-golden-yellow bg-linear-to-r"}`}
                          />
                          {link.label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>

                <div className="mt-auto space-y-3 sm:space-y-4">
                  <Button asChild variant="gradient" size="lg" className="w-full text-sm sm:text-base">
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="xs:inline hidden">Book Now on WhatsApp</span>
                      <span className="xs:hidden">Book on WhatsApp</span>
                    </a>
                  </Button>

                  {/* Contact info */}
                  <div className="text-muted-foreground bg-muted/50 rounded-2xl p-3 text-center text-xs sm:p-4 sm:text-sm">
                    <p>Need help? Call us at</p>
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, "")}`}
                      className="text-saffron mt-1 flex items-center justify-center gap-2 text-sm font-semibold sm:text-base"
                    >
                      <Phone className="h-4 w-4" />
                      {contactPhone}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
