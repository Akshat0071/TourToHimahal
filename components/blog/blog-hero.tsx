"use client"

import { motion } from "framer-motion"
import { Clock, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fadeInUp } from "@/lib/animation-variants"

interface BlogPost {
  id?: string
  title: string
  excerpt?: string
  content?: string
  cover_image?: string
  featuredImage?: string
  gallery?: string[]
  author?: string
  category?: string
  tags?: string[]
  published_at?: string
  created_at?: string
  date?: string
  readTime?: number
}

interface BlogHeroProps {
  post: BlogPost
}

export function BlogHero({ post }: BlogHeroProps) {
  // Handle date formatting - support both database format (published_at) and static data format (date)
  const dateString = post.published_at || post.date || new Date().toISOString()
  const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const normalizedAuthor = post.author?.trim()
  const displayAuthor =
    !normalizedAuthor || normalizedAuthor.toLowerCase() === "himachal yatra"
      ? "TourToHimachal"
      : normalizedAuthor

  return (
    <section className="bg-background border-b">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-4xl">
          <Badge className="bg-saffron mb-4 text-white">{post.category || "Travel"}</Badge>
          <h1 className="mb-4 font-serif text-3xl font-bold text-balance text-[#fc9700] md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="text-muted-foreground mb-6 text-lg">{post.excerpt}</p>}
          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            {displayAuthor && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {displayAuthor}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
