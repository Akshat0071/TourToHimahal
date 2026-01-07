"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { StaticHero } from "@/components/ui/static-hero"
import { DiaryCard } from "@/components/diaries/diary-card"
import { DiaryFilter } from "@/components/diaries/diary-filter"
import { Button } from "@/components/ui/button"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"
import { diaryAuthors, diaryRegions } from "@/data/diaries"

interface DiaryAuthor {
  name: string
  avatar: string
  bio: string
  social: {
    twitter?: string
    instagram?: string
  }
}

interface Diary {
  id?: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  cover_image?: string
  coverImage?: string // Handle both casing from data vs interface
  author_name?: string
  author?: DiaryAuthor
  author_avatar?: string
  destination?: string
  region?: string
  travel_date?: string
  date?: string
  published_at?: string
  created_at?: string
  gallery?: string[]
  images?: string[]
  tags?: string[]
}

interface DiariesPageClientProps {
  diaries: Diary[]
}

const ITEMS_PER_PAGE = 6

export function DiariesPageClient({ diaries }: DiariesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const filteredDiaries = useMemo(() => {
    return diaries.filter((diary) => {
      // 1. Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const title = diary.title?.toLowerCase() || ""
        const excerpt = diary.excerpt?.toLowerCase() || ""
        const region = (diary.region || diary.destination)?.toLowerCase() || ""

        if (!title.includes(query) && !excerpt.includes(query) && !region.includes(query)) {
          return false
        }
      }

      // 2. Region Filter
      if (selectedRegion !== "All") {
        const dRegion = diary.region || diary.destination
        if (dRegion !== selectedRegion) return false
      }

      // 3. Tags Filter
      if (selectedTags.length > 0) {
        const dTags = diary.tags || []
        // Match if diary contains ANY of the selected tags (OR logic)
        const hasMatch = selectedTags.some((tag) => dTags.includes(tag))
        if (!hasMatch) return false
      }

      // 4. Month Filter (Season)
      if (selectedMonth) {
        // Rudimentary season check based on date month
        // Spring: Mar-May, Summer: Jun-Aug, Autumn: Sep-Nov, Winter: Dec-Feb
        const dDate = diary.date || diary.travel_date
        if (dDate) {
          const month = new Date(dDate).getMonth() // 0-11
          let season = ""
          if (month >= 2 && month <= 4) season = "Spring"
          else if (month >= 5 && month <= 7) season = "Summer"
          else if (month >= 8 && month <= 10) season = "Autumn"
          else season = "Winter" // 11, 0, 1

          if (season !== selectedMonth) return false
        }
      }

      return true
    })
  }, [diaries, searchQuery, selectedRegion, selectedTags, selectedMonth])

  const visibleDiaries = filteredDiaries.slice(0, visibleCount)
  const hasMore = visibleCount < filteredDiaries.length

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedRegion("All")
    setSelectedTags([])
    setSelectedMonth(null)
  }

  const loadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <StaticHero
          image="/Images/diary.png"
          badge="Real Stories, Real Adventures"
          title="Tales from the Mountains"
          subtitle="Dive into authentic travel experiences shared by fellow wanderers. From hidden waterfalls to sunrise treks, from cozy homestays to local chai stops — these diaries capture the soul of Himachal like no guidebook ever could."
        />

        {/* Mobile Filter Bar - Visible only on mobile/tablet */}
        <section className="bg-background/95 border-border border-b py-3 sm:py-4 lg:hidden">
          <div className="container mx-auto px-4">
            <DiaryFilter
              selectedRegion={selectedRegion}
              selectedTags={selectedTags}
              selectedMonth={selectedMonth}
              searchQuery={searchQuery}
              onRegionChange={setSelectedRegion}
              onTagChange={setSelectedTags}
              onMonthChange={setSelectedMonth}
              onSearchChange={setSearchQuery}
              onClearFilters={clearFilters}
            />
          </div>
        </section>

        {/* Main Content with Desktop Sidebar */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 xl:grid-cols-[1fr_380px]">
              {/* Main Column */}
              <div>
                {/* Diaries Grid */}
                {filteredDiaries.length === 0 ? (
                  <div className="bg-muted/30 rounded-3xl py-16 text-center">
                    <p className="text-muted-foreground mb-4">No diaries found matching your filters.</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-6"
                  >
                    {visibleDiaries.map((diary) => (
                      <DiaryCard key={diary.slug} diary={diary} />
                    ))}
                  </motion.div>
                )}

                {/* Load More */}
                {hasMore && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                  >
                    <Button variant="outline" size="lg" onClick={loadMore}>
                      Load More Stories
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Desktop Sidebar - Visible only on desktop */}
              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-6">
                  {/* Filter Section */}
                  <DiaryFilter
                    selectedRegion={selectedRegion}
                    selectedTags={selectedTags}
                    selectedMonth={selectedMonth}
                    searchQuery={searchQuery}
                    onRegionChange={setSelectedRegion}
                    onTagChange={setSelectedTags}
                    onMonthChange={setSelectedMonth}
                    onSearchChange={setSearchQuery}
                    onClearFilters={clearFilters}
                  />

                  {/* Popular Diaries */}
                  {diaries.length > 0 && (
                    <div className="bg-card border-muted/50 rounded-xl border-2 p-6 shadow-md">
                      <h3 className="text-foreground mb-4 font-serif text-lg font-bold">Popular Stories</h3>
                      <div className="space-y-4">
                        {diaries.slice(0, 4).map((diary, index) => (
                          <Link key={diary.slug} href={`/diaries/${diary.slug}`} className="group flex gap-3">
                            <span className="text-muted-foreground/30 group-hover:text-saffron text-2xl font-bold transition-colors">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <h4 className="text-foreground group-hover:text-mountain-blue line-clamp-2 text-sm font-medium transition-colors">
                                {diary.title}
                              </h4>
                              <span className="text-muted-foreground text-xs">
                                {diary.region || diary.destination}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
