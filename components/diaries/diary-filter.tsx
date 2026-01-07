"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { diaryTags, diaryMonths, diaryRegions } from "@/data/diaries"

interface DiaryFilterProps {
  selectedRegion: string
  selectedTags: string[]
  selectedMonth: string | null
  searchQuery: string
  onRegionChange: (region: string) => void
  onTagChange: (tags: string[]) => void
  onMonthChange: (month: string | null) => void
  onSearchChange: (query: string) => void
  onClearFilters: () => void
}

export function DiaryFilter({
  selectedRegion,
  selectedTags,
  selectedMonth,
  searchQuery,
  onRegionChange,
  onTagChange,
  onMonthChange,
  onSearchChange,
  onClearFilters,
}: DiaryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Local state for deferred filtering
  const [localRegion, setLocalRegion] = useState<string>(selectedRegion)
  const [localTags, setLocalTags] = useState<string[]>(selectedTags)
  const [localMonth, setLocalMonth] = useState<string | null>(selectedMonth)

  // Sync local state when props change (external update or clear)
  useEffect(() => {
    setLocalRegion(selectedRegion)
    setLocalTags(selectedTags)
    setLocalMonth(selectedMonth)
  }, [selectedRegion, selectedTags, selectedMonth])

  const hasActiveFilters =
    selectedRegion !== "All" ||
    selectedTags.length > 0 ||
    (selectedMonth !== null && selectedMonth !== "All") ||
    !!searchQuery

  const handleTagToggle = (tag: string) => {
    if (tag === "All") {
      setLocalTags([])
      return
    }

    if (localTags.includes(tag)) {
      setLocalTags(localTags.filter((t) => t !== tag))
    } else {
      setLocalTags([...localTags, tag])
    }
  }

  const applyFilters = () => {
    onRegionChange(localRegion)
    onTagChange(localTags)
    onMonthChange(localMonth)
    setIsExpanded(false)
  }

  const handleClear = () => {
    onClearFilters()
    // Local state will be synced via useEffect
  }

  return (
    <div className="border-saffron/20 rounded-xl border-2 bg-gradient-to-r from-[oklch(0.99_0.02_85)] to-[oklch(0.98_0.025_70)] p-3 shadow-lg sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
      <div className="mb-4 hidden lg:block">
        <h3 className="text-foreground font-serif text-xl font-bold">Filter & Search</h3>
        <p className="text-muted-foreground text-sm">Find your perfect story</p>
      </div>

      {/* Unified Search + Filter Toggle */}
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="text-saffron absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 md:h-5 md:w-5" />
          <Input
            type="text"
            placeholder="Search diaries..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-saffron/20 focus:border-saffron h-10 w-full rounded-full border-2 bg-white pr-12 pl-9 text-xs sm:h-11 sm:pl-10 sm:text-sm md:h-12 md:text-base lg:rounded-xl"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="border-saffron/30 hover:bg-saffron/10 relative flex h-10 w-full items-center justify-center gap-1.5 rounded-full border-2 bg-white px-3 sm:h-11 sm:gap-2 sm:px-4 md:h-12 lg:w-auto lg:rounded-xl"
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
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-saffron/20 mt-3 space-y-4 border-t pt-3 sm:mt-4 sm:pt-4">
              {/* Region */}
              <div className="border-golden-yellow/20 rounded-xl border bg-white p-3 sm:rounded-2xl sm:p-4">
                <h4 className="text-foreground mb-3 text-xs font-semibold sm:text-sm">Region</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={localRegion === "All" ? "default" : "outline"}
                    className={`hover:bg-mountain-blue/10 cursor-pointer text-xs ${
                      localRegion === "All" ? "bg-mountain-blue hover:bg-mountain-blue text-white" : ""
                    }`}
                    onClick={() => setLocalRegion("All")}
                  >
                    All
                  </Badge>
                  {diaryRegions.map((region) => (
                    <Badge
                      key={region}
                      variant={localRegion === region ? "default" : "outline"}
                      className={`hover:bg-mountain-blue/10 cursor-pointer text-xs ${
                        localRegion === region ? "bg-mountain-blue hover:bg-mountain-blue text-white" : ""
                      }`}
                      onClick={() => setLocalRegion(localRegion === region ? "All" : region)}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="border-golden-yellow/20 rounded-xl border bg-white p-3 sm:rounded-2xl sm:p-4">
                <h4 className="text-foreground mb-3 text-xs font-semibold sm:text-sm">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={localTags.length === 0 ? "default" : "outline"}
                    className={`hover:bg-mountain-blue/10 cursor-pointer text-xs ${
                      localTags.length === 0 ? "bg-mountain-blue hover:bg-mountain-blue text-white" : ""
                    }`}
                    onClick={() => handleTagToggle("All")}
                  >
                    All
                  </Badge>
                  {diaryTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={localTags.includes(tag) ? "default" : "outline"}
                      className={`hover:bg-mountain-blue/10 cursor-pointer text-xs capitalize ${
                        localTags.includes(tag) ? "bg-mountain-blue hover:bg-mountain-blue text-white" : ""
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div className="border-golden-yellow/20 rounded-xl border bg-white p-3 sm:rounded-2xl sm:p-4">
                <h4 className="text-foreground mb-3 text-xs font-semibold sm:text-sm">Season</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!localMonth || localMonth === "All" ? "default" : "outline"}
                    className={`hover:bg-mountain-blue/10 cursor-pointer text-xs ${
                      !localMonth || localMonth === "All"
                        ? "bg-mountain-blue hover:bg-mountain-blue text-white"
                        : ""
                    }`}
                    onClick={() => setLocalMonth(null)}
                  >
                    All
                  </Badge>
                  {diaryMonths.map((month) => (
                    <Badge
                      key={month}
                      variant={localMonth === month ? "default" : "outline"}
                      className={`hover:bg-mountain-blue/10 cursor-pointer text-xs ${
                        localMonth === month ? "bg-mountain-blue hover:bg-mountain-blue text-white" : ""
                      }`}
                      onClick={() => setLocalMonth(localMonth === month ? null : month)}
                    >
                      {month}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={applyFilters}
                  variant="gradient"
                  className="h-10 flex-1 rounded-xl text-sm shadow-md hover:shadow-lg sm:h-11"
                >
                  Apply Filters
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="border-temple-red/30 text-temple-red hover:bg-temple-red/10 h-10 rounded-xl border-2 px-4 sm:h-11"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
