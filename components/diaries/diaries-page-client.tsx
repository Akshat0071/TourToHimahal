"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { PenLine, Mail } from "lucide-react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { StaticHero } from "@/components/ui/static-hero"
import { DiaryCard } from "@/components/diaries/diary-card"
import { DiaryFilter } from "@/components/diaries/diary-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"

interface Diary {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  cover_image?: string
  author_name?: string
  author_avatar?: string
  destination?: string
  travel_date?: string
  published_at?: string
  created_at?: string
  gallery?: string[]
}

interface DiariesPageClientProps {
  diaries: Diary[]
}

const ITEMS_PER_PAGE = 6

export function DiariesPageClient({ diaries }: DiariesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  // Get unique destinations
  const destinations = [...new Set(diaries.map((d) => d.destination).filter(Boolean))]

  const filteredDiaries = useMemo(() => {
    return diaries.filter((diary) => {
      // Destination filter
      if (selectedDestination && diary.destination !== selectedDestination) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          diary.title.toLowerCase().includes(query) ||
          diary.excerpt?.toLowerCase().includes(query) ||
          diary.destination?.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [diaries, selectedDestination, searchQuery])

  const visibleDiaries = filteredDiaries.slice(0, visibleCount)
  const hasMore = visibleCount < filteredDiaries.length

  const clearFilters = () => {
    setSelectedDestination(null)
    setSearchQuery("")
  }

  const loadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  return (
    <>
      <Header />
      <main>
        <StaticHero
          image="/Images/diary.png"
          badge="Real Stories, Real Adventures"
          title="Tales from the Mountains"
          subtitle="Dive into authentic travel experiences shared by fellow wanderers. From hidden waterfalls to sunrise treks, from cozy homestays to local chai stops — these diaries capture the soul of Himachal like no guidebook ever could."
        />

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-2">
                {/* Filter Bar */}
                <DiaryFilter
                  selectedTags={selectedDestination ? [selectedDestination] : []}
                  selectedMonth={null}
                  selectedAuthor={null}
                  searchQuery={searchQuery}
                  onTagChange={(tags) => setSelectedDestination(tags[0] || null)}
                  onMonthChange={() => {}}
                  onAuthorChange={() => {}}
                  onSearchChange={setSearchQuery}
                  onClearFilters={clearFilters}
                />

                {/* Diaries Grid */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 gap-6"
                >
                  {visibleDiaries.map((diary) => (
                    <DiaryCard key={diary.slug} diary={diary} />
                  ))}
                </motion.div>

                {/* No Results */}
                {filteredDiaries.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">No diaries found matching your filters.</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Load More */}
                {hasMore && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mt-12"
                  >
                    <Button variant="outline" size="lg" onClick={loadMore}>
                      Load More Stories
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {/* Popular Diaries */}
                {diaries.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-serif font-bold text-foreground mb-4">Popular Stories</h3>
                    <div className="space-y-4">
                      {diaries.slice(0, 4).map((diary, index) => (
                        <Link key={diary.slug} href={`/diaries/${diary.slug}`} className="flex gap-3 group">
                          <span className="text-2xl font-bold text-muted-foreground/50 group-hover:text-saffron transition-colors">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h4 className="font-medium text-foreground group-hover:text-mountain-blue transition-colors line-clamp-2">
                              {diary.title}
                            </h4>
                            <span className="text-sm text-muted-foreground">{diary.destination}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter removed */}

                {/* Destinations */}
                {destinations.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-md">
                    <h3 className="text-lg font-serif font-bold text-foreground mb-4">Destinations</h3>
                    <div className="flex flex-wrap gap-2">
                      {destinations.map((destination) => (
                        <button
                          key={destination}
                          onClick={() =>
                            setSelectedDestination(selectedDestination === destination ? null : destination || null)
                          }
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedDestination === destination
                              ? "bg-mountain-blue text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {destination}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>


      </main>
      <Footer />
    </>
  )
}
