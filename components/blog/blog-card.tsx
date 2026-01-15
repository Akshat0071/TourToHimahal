"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cardHover, fadeInUp } from "@/lib/animation-variants"

interface BlogPost {
  id?: string
  slug: string
  title: string
  excerpt?: string
  cover_image?: string
  featuredImage?: string
  gallery?: string[]
  author?: string
  category?: string
  tags?: string[]
  published_at?: string
  date?: string
  readTime?: number
}

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const dateString = post.published_at || post.date
  const formattedDate = dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : ""

  const imageUrl =
    post.gallery?.[0] ||
    post.cover_image ||
    post.featuredImage ||
    `/placeholder.svg?height=400&width=600&query=${post.title}`

  if (featured) {
    return (
      <motion.article variants={fadeInUp} initial="hidden" animate="visible">
        <Link href={`/blog/${post.slug}`}>
          <motion.div
            className="group relative overflow-hidden "
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full rounded-xl object-contain"
              />
            </div>
            <div className="absolute right-0 bottom-0 left-0 p-4 md:p-6 lg:p-8">
              {post.category && (
                <Badge className="from-saffron to-sunset-orange mb-2 bg-gradient-to-r text-xs text-white md:mb-3">
                  {post.category}
                </Badge>
              )}
              <h3 className="group-hover:text-saffron mb-2 line-clamp-2 font-serif text-lg font-bold text-white transition-colors sm:text-xl md:text-2xl lg:text-3xl">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mb-3 line-clamp-2 hidden text-sm text-white/80 sm:block md:mb-4 md:text-base">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-white/70 md:gap-4 md:text-sm">
                {post.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    {post.readTime} min
                  </span>
                )}
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.article>
    )
  }

  return (
    <motion.article variants={fadeInUp} initial="hidden" animate="visible" className="min-w-0">
      <Link href={post.slug ? `/blog/${post.slug}` : "#"} className="block min-w-0">
        <motion.div
          className="group bg-card border-border hover:border-mountain-blue/40 flex h-full min-w-0 flex-col overflow-hidden rounded:xl md:rounded-xl transition-all duration-300 md:flex-row "
        >
          {/* Left: Image */}
          <div className="relative aspect-[16/9] overflow-hidden md:w-2/5">
  <Image
    src={imageUrl || `/placeholder.svg?height=400&width=600&query=${post.title}`}
    alt={post.title}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-t from-black/50 via-black/20 to-transparent md:rounded-2xl" />
            {post.category && (
              <div className="absolute top-2 left-2 md:top-3 md:left-3">
                <Badge
                  variant="secondary"
                  className="text-mountain-blue bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm md:px-2.5 md:py-0.5 md:text-xs"
                >
                  {post.category}
                </Badge>
              </div>
            )}
          </div>
          {/* Right: Content */}
          <div className="flex flex-1 flex-col justify-center bg-gradient-to-b from-transparent to-white/60 p-4 md:p-6 lg:p-8">
            <h3 className="text-foreground group-hover:text-mountain-blue mb-2 line-clamp-2 font-serif text-lg leading-tight font-bold transition-colors md:text-2xl">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-muted-foreground mb-3 line-clamp-2 flex-1 text-base leading-relaxed md:mb-4">
                {post.excerpt}
              </p>
            )}
            <div className="mt-auto flex items-center justify-between pt-2">
              <div className="text-muted-foreground flex items-center gap-3 text-xs md:text-sm">
                {post.readTime && (
                  <span className="bg-mountain-blue/10 flex items-center gap-1 rounded-full px-2 py-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min
                  </span>
                )}
                {formattedDate && <span>{formattedDate}</span>}
              </div>
              <span className="text-mountain-blue flex items-center text-xs font-medium transition-all group-hover:gap-1 md:text-sm">
                Read <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  )
}
