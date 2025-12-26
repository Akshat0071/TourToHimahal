"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { StaticHero } from "@/components/ui/static-hero"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  cover_image?: string
  author?: string
  category?: string
  tags?: string[]
  published_at?: string
  created_at?: string
}

interface BlogPageClientProps {
  blogs: Blog[]
  categories: string[]
}

const ITEMS_PER_PAGE = 6

export function BlogPageClient({ blogs, categories }: BlogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory((prev) => {
      // Toggle off if clicking the same category again
      if (prev && category && prev.toLowerCase().trim() === category.toLowerCase().trim()) {
        return null
      }
      return category
    })
    if (category === null) {
      // Clear search when resetting to 'All' to avoid empty results
      setSearchQuery("")
    }
  }

  const filteredPosts = useMemo(() => {
    const normalizedSelected = selectedCategory?.toLowerCase().trim()
    return blogs.filter((post) => {
      const postCategory = post.category?.toLowerCase().trim()
      // Apply category filter only when a specific category is selected
      if (normalizedSelected && normalizedSelected !== "all") {
        if (!postCategory) return false
        const matchExact = postCategory === normalizedSelected
        const matchIncludes = postCategory.includes(normalizedSelected)
        if (!(matchExact || matchIncludes)) return false
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
        )
      }
      return true
    })
  }, [blogs, selectedCategory, searchQuery])

  const showAll = selectedCategory === null
  const visiblePosts = showAll ? filteredPosts : filteredPosts.slice(0, visibleCount)
  const hasMore = showAll ? false : visibleCount < filteredPosts.length

  useEffect(() => {
    // Reset pagination when filters change to avoid stale counts
    setVisibleCount(ITEMS_PER_PAGE)
  }, [selectedCategory, searchQuery])


  return (
    <>
      <Header />
      <main className="min-h-screen bg-background overflow-x-hidden">
        <div className="mt-16">
          <StaticHero
          image="/Images/blog.png"
          badge="Expert Insights & Local Secrets"
          title="Your Ultimate Himachal Guide"
          subtitle="Go beyond the tourist trail with our comprehensive travel guides. From budget itineraries to luxury escapes, from monsoon trekking tips to winter road safety — we've got the insider knowledge to make your trip extraordinary."
          />
        </div>

        {/* Featured section removed as requested */}

        {/* Main Content */}
        <section className="relative z-10 py-10 md:py-16 pb-20 md:pb-24 bg-linear-to-b from-background via-[oklch(0.97_0.02_85)] to-background overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start min-w-0">
              {/* Main Column */}
              <div className="lg:col-span-2 min-w-0">
                {/* Search */}
                <div className="mb-4 md:mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-mountain-blue" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 md:pl-10 rounded-full border-2 border-mountain-blue/20 focus:border-mountain-blue h-10 md:h-12 text-sm md:text-base"
                    />
                  </div>
                </div>

                {/* Category Filter - Horizontal scroll on mobile (non-sticky for small screens) */}
                <div className="flex gap-2 mb-4 md:mb-8 overflow-x-auto pb-2 scrollbar-hide py-2 md:py-0 md:overflow-visible md:pb-0">
                  <Badge
                    variant={selectedCategory === null ? "default" : "outline"}
                    className={`cursor-pointer shrink-0 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm transition-all ${selectedCategory === null
                        ? "bg-linear-to-r from-mountain-blue to-forest-green text-white shadow-md"
                        : "border-2 hover:bg-mountain-blue/10"
                      }`}
                    onClick={() => handleCategoryClick(null)}
                  >
                    All
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`cursor-pointer shrink-0 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm transition-all ${selectedCategory === category
                          ? "bg-linear-to-r from-mountain-blue to-forest-green text-white shadow-md"
                          : "border-2 hover:bg-mountain-blue/10"
                        }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Posts Grid */}
                <motion.div
                  key={`${selectedCategory ?? 'all'}-${searchQuery}-${visibleCount}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="relative z-10 flex flex-col gap-4 md:gap-6 min-w-0"
                >
                  {/* Status helper */}
                  {filteredPosts.length > 0 && (
                    <div className="sm:col-span-2 text-xs md:text-sm text-muted-foreground">
                      Showing <span className="font-semibold text-saffron">{visiblePosts.length}</span> of {filteredPosts.length}
                    </div>
                  )}
                  {visiblePosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </motion.div>

                {/* No Results */}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12 md:py-16 bg-linear-to-br from-muted/50 to-muted/30 rounded-3xl">
                    <p className="text-muted-foreground mb-4">No posts found matching your search.</p>
                    <Button
                      variant="outline"
                      className="rounded-full border-2 bg-transparent"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory(null)
                      }}
                    >
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
                    className="text-center mt-8 md:mt-12"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                      className="rounded-full border-2 border-mountain-blue text-mountain-blue hover:bg-mountain-blue hover:text-white"
                    >
                      Load More Posts
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Sidebar - Hidden on mobile, shown on lg+ */}
              <div className="hidden lg:block">
                <BlogSidebar blogs={blogs} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
