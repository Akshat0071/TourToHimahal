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
    <div className=" rounded-xl p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">

      {/* Unified Search + Filter Toggle */}
      <div className="flex flex-row gap-3">
        <div className="relative flex-1">
          <Search className="text-saffron absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 md:h-5 md:w-5" />
          <Input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-saffron/20 focus:border-saffron h-10 w-full rounded-full border-2 bg-white pr-12 pl-9 text-xs sm:h-11 sm:pl-10 sm:text-sm md:h-12 md:text-base lg:rounded-xl"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          variant="outline"
          className="border-saffron/30 hover:bg-saffron/10 relative flex h-10 w-auto items-center justify-center gap-1.5 rounded-full border-2 bg-white px-3 sm:h-11 sm:gap-2 sm:px-4 md:h-12 lg:w-auto lg:rounded-xl"
        >
          <Filter className="text-saffron h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-foreground text-xs font-medium sm:text-sm">Filters</span>
          {hasActiveFilters && (
            <span className="from-saffron to-sunset-orange absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r text-[10px] font-bold text-white sm:h-5 sm:w-5 sm:text-xs">
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
            <div className="border-saffron/20 mt-4 flex flex-col gap-8 border-t pt-4 sm:mt-6 sm:gap-8 sm:pt-6 lg:flex-row lg:items-start">
              {/* Price Range Slider */}
              <div className="border-golden-yellow/20 flex-1 rounded-xl border bg-white p-4 sm:rounded-2xl sm:p-6 lg:w-2/5 lg:flex-none">
                <div className="mb-2 flex items-center justify-between sm:mb-3">
                  <label className="text-foreground text-xs font-semibold sm:text-sm">Price Range</label>
                  <span className="text-saffron text-xs font-bold sm:text-sm">
                    ₹{priceRange.toLocaleString()}
                  </span>
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
                <div className="text-muted-foreground mt-1 flex justify-between text-[10px] sm:mt-2 sm:text-xs">
                  <span>From ₹500</span>
                  <span>Up to ₹10,000</span>
                </div>
              </div>

              {/* Filter Grid */}
              <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    Region
                  </label>
                  <Select value={localRegion} onValueChange={setLocalRegion}>
                    <SelectTrigger className="border-mountain-blue/20 h-9 rounded-lg border-2 bg-white text-xs sm:h-10 sm:rounded-xl sm:text-sm md:h-11">
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
                  <label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    Duration
                  </label>
                  <Select value={localDuration} onValueChange={setLocalDuration}>
                    <SelectTrigger className="border-forest-green/20 h-9 rounded-lg border-2 bg-white text-xs sm:h-10 sm:rounded-xl sm:text-sm md:h-11">
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
                  <label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    Theme
                  </label>
                  <Select value={localTheme} onValueChange={setLocalTheme}>
                    <SelectTrigger className="border-saffron/20 h-9 rounded-lg border-2 bg-white text-xs sm:h-10 sm:rounded-xl sm:text-sm md:h-11">
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
                  <label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    Sort By
                  </label>
                  <Select value={localSortBy} onValueChange={setLocalSortBy}>
                    <SelectTrigger className="border-sunset-orange/20 h-9 rounded-lg border-2 bg-white text-xs sm:h-10 sm:rounded-xl sm:text-sm md:h-11">
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

                <div className="col-span-2 space-y-1 sm:space-y-2 lg:col-span-1 xl:col-span-2">
                  <label className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    Actions
                  </label>
                  <div className="flex gap-2">
                    <Button
                      onClick={applyFilters}
                      variant="gradient"
                      className="h-9 flex-1 rounded-lg text-xs sm:h-10 sm:rounded-xl sm:text-sm md:h-11"
                    >
                      Apply
                    </Button>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={handleClear}
                        className="border-temple-red/30 text-temple-red hover:bg-temple-red/10 h-9 rounded-lg border-2 px-3 sm:h-10 sm:rounded-xl md:h-11"
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
