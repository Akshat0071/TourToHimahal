"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { InfiniteScrollHero } from "@/components/ui/infinite-scroll-hero"
import { PackageCard } from "@/components/packages/package-card"
import { PackageFilter } from "@/components/packages/package-filter"
import { Button } from "@/components/ui/button"
import { staggerContainer } from "@/lib/animation-variants"
import { MapPin } from "lucide-react"

interface Package {
  id: string
  title: string
  slug: string
  description: string
  short_description?: string
  price: number
  original_price?: number
  duration: string
  highlights?: string[]
  inclusions?: string[]
  exclusions?: string[]
  category?: string
  images?: string[]
  is_active: boolean
  is_featured: boolean
  region?: string
}

interface PackagesPageClientProps {
  packages: Package[]
}

const ITEMS_PER_PAGE = 6

function extractDurationDays(duration: string): number {
  const match = duration.match(/(\d+)\s*days?/i)
  return match ? Number.parseInt(match[1], 10) : 1
}

export function PackagesPageClient({ packages }: PackagesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedDuration, setSelectedDuration] = useState("All")
  const [selectedTheme, setSelectedTheme] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState("All")
  const [sortBy, setSortBy] = useState("all")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const filteredPackages = useMemo(() => {
    let result = [...packages]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(query) ||
          pkg.short_description?.toLowerCase().includes(query) ||
          pkg.description?.toLowerCase().includes(query),
      )
    }

    if (selectedRegion !== "All") {
      result = result.filter((pkg) => pkg.region?.toLowerCase() === selectedRegion.toLowerCase())
    }

    if (selectedTheme !== "All") {
      result = result.filter((pkg) => pkg.category?.toLowerCase() === selectedTheme.toLowerCase())
    }

    if (selectedDuration !== "All") {
      result = result.filter((pkg) => {
        const days = extractDurationDays(pkg.duration || "")
        if (selectedDuration === "1-2 Days") return days >= 1 && days <= 2
        if (selectedDuration === "3-5 Days") return days >= 3 && days <= 5
        if (selectedDuration === "5+ Days") return days >= 5
        return true
      })
    }

    if (selectedPrice !== "All") {
      result = result.filter((pkg) => {
        if (selectedPrice.startsWith("Up to")) {
          const maxPrice = Number(selectedPrice.replace(/[^0-9]/g, ""))
          return pkg.price <= maxPrice
        }
        // Fallback for any legacy buckets if needed, or just standard check
        if (selectedPrice === "Under ₹2,500") return pkg.price < 2500
        if (selectedPrice === "₹2,500 - ₹5,000") return pkg.price >= 2500 && pkg.price <= 5000
        if (selectedPrice === "₹5,000 - ₹7,500") return pkg.price > 5000 && pkg.price <= 7500
        if (selectedPrice === "Above ₹7,500") return pkg.price > 7500
        return true
      })
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "duration":
        result.sort((a, b) => extractDurationDays(a.duration || "") - extractDurationDays(b.duration || ""))
        break
      case "all":
      default:
        // No sorting, keep original order
        break
    }

    return result
  }, [packages, searchQuery, selectedRegion, selectedDuration, selectedTheme, selectedPrice, sortBy])

  const displayedPackages = filteredPackages.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPackages.length

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedRegion("All")
    setSelectedDuration("All")
    setSelectedTheme("All")
    setSelectedPrice("All")
    setSortBy("all")
  }

  const hasActiveFilters =
    !!searchQuery ||
    selectedRegion !== "All" ||
    selectedDuration !== "All" ||
    selectedTheme !== "All" ||
    selectedPrice !== "All"

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <InfiniteScrollHero
        images={[
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967133/hqjivfndozpkicr5eddz.png", alt: "Himalayan Mountains" },
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967181/vor6a288gor8vhrmnej1.png", alt: "Mountain Peaks" },
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765970056/irdkpi0rs4cfcdmo985u.png", alt: "Rafting" },
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967996/nmnqkuvgik8wokp82kiv.jpg", alt: "Chintpurni Temple" },
          { url: "https://res.cloudinary.com/dabqqymqe/image/upload/v1765967269/flj6ga0vacjary3hscgt.png", alt: "Paragliding" },
        ]}
        badge="Handcrafted Himalayan Experiences"
        title="Unforgettable Travel Packages"
        subtitle="From snow-capped peaks to ancient temples, from thrilling adventures to serene retreats — discover curated journeys that transform travelers into storytellers. Every package is designed with love, local expertise, and a passion for creating memories that last a lifetime."
      />

      {/* Mobile Filter Bar - Visible only on mobile/tablet */}
      <section className="lg:hidden bg-background/95 border-b border-border py-3 sm:py-4">
        <div className="container mx-auto px-4">
          <PackageFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </section>

      {/* Packages Grid with Desktop Sidebar */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-linear-to-b from-background via-[oklch(0.97_0.02_85)] to-background">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px] lg:gap-8">
            {/* Main Content */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Showing <span className="font-semibold text-saffron">{displayedPackages.length}</span> of{" "}
                  <span className="font-semibold">{filteredPackages.length}</span> packages
                </p>
              </div>

              {filteredPackages.length === 0 ? (
                <div className="text-center py-8 sm:py-12 md:py-16 bg-linear-to-br from-muted/50 to-muted/30 rounded-2xl sm:rounded-3xl">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-saffron/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-saffron" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2">No packages found</h3>
                  <p className="text-muted-foreground mb-4 text-xs sm:text-sm md:text-base">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters} variant="gradient" className="rounded-full text-sm">
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                >
                  {displayedPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </motion.div>
              )}

              {hasMore && (
                <div className="text-center mt-6 sm:mt-8 md:mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="rounded-full border-2 border-saffron text-saffron hover:bg-saffron hover:text-white text-sm sm:text-base"
                  >
                    Load More Packages
                  </Button>
                </div>
              )}
            </div>

            {/* Desktop Sidebar - Visible only on desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <PackageFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  selectedDuration={selectedDuration}
                  setSelectedDuration={setSelectedDuration}
                  selectedTheme={selectedTheme}
                  setSelectedTheme={setSelectedTheme}
                  selectedPrice={selectedPrice}
                  setSelectedPrice={setSelectedPrice}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
