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
    <main className="bg-background min-h-screen">
      <Header />

      <InfiniteScrollHero
        images={[
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795277/v7svtjhbjhj6cyadgfhz.webp",
            alt: "Himalayan Mountains",
          },
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795901/y1plr2wekvbv7g7yjyk0.webp",
            alt: "Mountain Peaks",
          },
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767796909/m3ugl4axz8mqwscuvf4y.webp",
            alt: "Rafting",
          },
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767794969/himachal-yatra/packages/jbngdslx5ivqucojuvx3.webp",
            alt: "Chintpurni Temple",
          },
          {
            url: "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795350/wjfrlwcmh0ckc16iwwax.webp",
            alt: "Paragliding",
          },
        ]}
        badge="Handcrafted Himalayan Experiences"
        title="Unforgettable Travel Packages"
        subtitle="From snow-capped peaks to ancient temples, from thrilling adventures to serene retreats — discover curated journeys that transform travelers into storytellers. Every package is designed with love, local expertise, and a passion for creating memories that last a lifetime."
      />

      {/* Mobile Filter Bar - Visible only on mobile/tablet */}
      <section className="bg-background/95 border-border border-b py-3 sm:py-4 lg:hidden">
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
      <section className="from-background to-background bg-linear-to-b via-[oklch(0.97_0.02_85)] py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 xl:grid-cols-[1fr_380px]">
            {/* Main Content */}
            <div>
              <div className="mb-4 flex items-center justify-between sm:mb-6 md:mb-8">
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                  Showing <span className="text-saffron font-semibold">{displayedPackages.length}</span> of{" "}
                  <span className="font-semibold">{filteredPackages.length}</span> packages
                </p>
              </div>

              {filteredPackages.length === 0 ? (
                <div className="from-muted/50 to-muted/30 rounded-2xl bg-linear-to-br py-8 text-center sm:rounded-3xl sm:py-12 md:py-16">
                  <div className="bg-saffron/10 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full sm:mb-4 sm:h-20 sm:w-20">
                    <MapPin className="text-saffron h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <h3 className="text-foreground mb-2 text-base font-semibold sm:text-lg md:text-xl">
                    No packages found
                  </h3>
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
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
                >
                  {displayedPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </motion.div>
              )}

              {hasMore && (
                <div className="mt-6 text-center sm:mt-8 md:mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="border-saffron text-saffron hover:bg-saffron rounded-full border-2 text-sm hover:text-white sm:text-base"
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
