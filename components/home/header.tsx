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
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Logo isScrolled={true} forceColors={true} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white bg-saffron"
                      : "text-foreground hover:text-white hover:bg-saffron"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {/* Contact Phone */}
            {contactPhone && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Need help?</p>
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="text-sm font-semibold text-foreground hover:text-saffron transition-colors flex items-center justify-end gap-1"
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
            className="lg:hidden p-2.5 md:p-3 rounded-full transition-all bg-muted hover:bg-saffron/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 text-foreground" />
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-[100]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%", opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 1 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 bottom-0 right-0 w-[80%] max-w-sm bg-white lg:hidden z-[101] shadow-2xl flex flex-col h-[100dvh]"
            >
              {/* Decorative gradient top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-saffron via-golden-yellow to-forest-green" />

              {/* Header with logo and close button */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-white shrink-0">
                <Logo size="sm" href="/" onClick={() => setIsMobileMenuOpen(false)} forceColors={true} />

                {/* Close button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-muted hover:bg-destructive/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex flex-col flex-1 p-4 sm:p-6 bg-white overflow-y-auto relative">
                {/* Decorative element */}
                <div className="absolute top-20 right-0 w-32 h-32 bg-linear-to-bl from-saffron/10 to-transparent rounded-bl-full pointer-events-none" />

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base font-medium transition-all ${
                            isActive
                              ? "bg-saffron text-white"
                              : "text-foreground hover:bg-saffron hover:text-white"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : "bg-linear-to-r from-saffron to-golden-yellow"}`} />
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
                      <span className="hidden xs:inline">Book Now on WhatsApp</span>
                      <span className="xs:hidden">Book on WhatsApp</span>
                    </a>
                  </Button>

                  {/* Contact info */}
                  <div className="text-center text-xs sm:text-sm text-muted-foreground p-3 sm:p-4 rounded-2xl bg-muted/50">
                    <p>Need help? Call us at</p>
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, "")}`}
                      className="text-saffron font-semibold text-sm sm:text-base flex items-center justify-center gap-2 mt-1"
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