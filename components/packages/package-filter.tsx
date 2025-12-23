"use client"

import { useState, useEffect } from "react"
import { Search, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { regions, durations, themes } from "@/data/packages"
import { motion, AnimatePresence } from "framer-motion"

interface PackageFilterProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  selectedRegion: string
  setSelectedRegion: (value: string) => void
  selectedDuration: string
  setSelectedDuration: (value: string) => void
  selectedTheme: string
  setSelectedTheme: (value: string) => void
  selectedPrice: string
  setSelectedPrice: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function PackageFilter({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  selectedDuration,
  setSelectedDuration,
  selectedTheme,
  setSelectedTheme,
  selectedPrice,
  setSelectedPrice,
  sortBy,
  setSortBy,
  onClearFilters,
  hasActiveFilters,
}: PackageFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState(50000)

  // Local state for deferred filtering
  const [localRegion, setLocalRegion] = useState(selectedRegion)
  const [localDuration, setLocalDuration] = useState(selectedDuration)
  const [localTheme, setLocalTheme] = useState(selectedTheme)
  const [localSortBy, setLocalSortBy] = useState(sortBy)

  // Sync local state with props when filters updates (e.g. clear)
  useEffect(() => {
    setLocalRegion(selectedRegion)
    setLocalDuration(selectedDuration)
    setLocalTheme(selectedTheme)
    setLocalSortBy(sortBy)

    if (selectedPrice === "All") {
      setPriceRange(10000)
    } else if (selectedPrice.startsWith("Up to")) {
      const price = Number(selectedPrice.replace(/[^0-9]/g, ""))
      setPriceRange(price)
    }
  }, [selectedRegion, selectedDuration, selectedTheme, sortBy, selectedPrice])

  const handlePriceChange = (value: number) => {
    setPriceRange(value)
  }

  const applyFilters = () => {
    setSelectedRegion(localRegion)
    setSelectedDuration(localDuration)
    setSelectedTheme(localTheme)
    setSortBy(localSortBy)

    // Apply "Up to" logic for continuous max price filtering
    // If slider is at max (10000), you might consider treating it as "All" if you want to show higher priced items. 
    // But per user request "price range 500 to 10000", limiting to 10000 is likely desired.
    // If we want "All" behavior at max, we can add: if (priceRange === 10000) setSelectedPrice("All") else ...
    // For now, let's respect the slider as a strict filter.
    setSelectedPrice(`Up to ₹${priceRange.toLocaleString()}`)

    setIsFilterOpen(false)
  }

  const handleClear = () => {
    onClearFilters()
    setPriceRange(10000)
    // Local state will be synced via useEffect
  }

  return (
    <div className="bg-gradient-to-r from-[oklch(0.99_0.02_85)] to-[oklch(0.98_0.025_70)] border-2 border-saffron/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-lg">
      <div className="hidden lg:block mb-4">
        <h3 className="text-xl font-serif font-bold text-foreground">Filter & Search</h3>
        <p className="text-sm text-muted-foreground">Find your perfect package</p>
      </div>

      {/* Unified Search + Filter Toggle */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-saffron" />
          <Input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 bg-white border-2 border-saffron/20 focus:border-saffron rounded-full lg:rounded-xl h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base pr-12 w-full"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          variant="outline"
          className="lg:w-auto w-full relative rounded-full lg:rounded-xl border-2 border-saffron/30 bg-white hover:bg-saffron/10 h-10 sm:h-11 md:h-12 px-3 sm:px-4 gap-1.5 sm:gap-2 flex justify-center items-center"
        >
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-saffron" />
          <span className="text-xs sm:text-sm font-medium text-foreground">Filters</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-saffron to-sunset-orange text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Collapsible filters (Unified) */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-saffron/20 space-y-3 sm:space-y-4">
              {/* Price Range Slider */}
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-golden-yellow/20">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <label className="text-xs sm:text-sm font-semibold text-foreground">Price Range</label>
                  <span className="text-xs sm:text-sm font-bold text-saffron">₹{priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="price-slider w-full"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">
                  <span>From ₹500</span>
                  <span>Up to ₹10,000</span>
                </div>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Region
                  </label>
                  <Select value={localRegion} onValueChange={setLocalRegion}>
                    <SelectTrigger className="rounded-lg sm:rounded-xl border-2 border-mountain-blue/20 bg-white h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Duration
                  </label>
                  <Select value={localDuration} onValueChange={setLocalDuration}>
                    <SelectTrigger className="rounded-lg sm:rounded-xl border-2 border-forest-green/20 bg-white h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                      <SelectValue placeholder="Any Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Theme
                  </label>
                  <Select value={localTheme} onValueChange={setLocalTheme}>
                    <SelectTrigger className="rounded-lg sm:rounded-xl border-2 border-saffron/20 bg-white h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                      <SelectValue placeholder="All Themes" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme} value={theme}>
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sort By
                  </label>
                  <Select value={localSortBy} onValueChange={setLocalSortBy}>
                    <SelectTrigger className="rounded-lg sm:rounded-xl border-2 border-sunset-orange/20 bg-white h-9 sm:h-10 md:h-11 text-xs sm:text-sm">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:space-y-2 col-span-2 lg:col-span-1 xl:col-span-2">
                  <label className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </label>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyFilters}
                      variant="gradient"
                      className="flex-1 rounded-lg sm:rounded-xl h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                    >
                      Apply
                    </Button>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={handleClear}
                        className="rounded-lg sm:rounded-xl border-2 border-temple-red/30 text-temple-red hover:bg-temple-red/10 h-9 sm:h-10 md:h-11 px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
