"use client"

import { useState, useMemo, useRef } from "react"
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

  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      if (selectedCategory && post.category !== selectedCategory) return false
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

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length


  return (
    <>
      <Header />
      <main>
        <StaticHero
          image="/Images/blog.png"
          badge="Expert Insights & Local Secrets"
          title="Your Ultimate Himachal Guide"
          subtitle="Go beyond the tourist trail with our comprehensive travel guides. From budget itineraries to luxury escapes, from monsoon trekking tips to winter road safety — we've got the insider knowledge to make your trip extraordinary."
        />

        {/* Featured section removed as requested */}

        {/* Main Content */}
        <section className="py-10 md:py-16 bg-gradient-to-b from-background via-[oklch(0.97_0.02_85)] to-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Main Column */}
              <div className="lg:col-span-2">
                {/* Search */}
                <div className="mb-6 md:mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mountain-blue" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-full border-2 border-mountain-blue/20 focus:border-mountain-blue h-11 md:h-12"
                    />
                  </div>
                </div>

                {/* Category Filter - Horizontal scroll on mobile */}
                <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                  <Badge
                    variant={selectedCategory === null ? "default" : "outline"}
                    className={`cursor-pointer shrink-0 rounded-full px-4 py-2 text-sm ${
                      selectedCategory === null
                        ? "bg-gradient-to-r from-mountain-blue to-forest-green text-white"
                        : "border-2 hover:bg-mountain-blue/10"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`cursor-pointer shrink-0 rounded-full px-4 py-2 text-sm ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-mountain-blue to-forest-green text-white"
                          : "border-2 hover:bg-mountain-blue/10"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Posts Grid */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 gap-4 md:gap-6"
                >
                  {visiblePosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </motion.div>

                {/* No Results */}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12 md:py-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl">
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
