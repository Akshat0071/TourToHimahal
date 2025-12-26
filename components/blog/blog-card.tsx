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
            className="group relative rounded-2xl md:rounded-3xl overflow-hidden"
            variants={cardHover}
            initial="rest"
            whileHover="hover"
          >
            <div className="relative aspect-video">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
              {post.category && (
                <Badge className="bg-gradient-to-r from-saffron to-sunset-orange text-white mb-2 md:mb-3 text-xs">
                  {post.category}
                </Badge>
              )}
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white mb-2 group-hover:text-saffron transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-white/80 mb-3 md:mb-4 line-clamp-2 text-sm md:text-base hidden sm:block">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 md:gap-4 text-white/70 text-xs md:text-sm">
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
          className="group bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-md h-full flex flex-col md:flex-row border border-border hover:border-mountain-blue/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-w-0"
          variants={cardHover}
          initial="rest"
          whileHover="hover"
        >
          {/* Left: Image */}
          <div className="relative w-full md:w-2/5 flex-shrink-0 overflow-hidden rounded-xl md:rounded-2xl" style={{ aspectRatio: '16/9', display: 'block' }}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={post.title}
              width={800}
              height={450}
              layout="responsive"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-xl md:rounded-2xl block"
              style={{ objectFit: 'cover', borderRadius: 'inherit' }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent rounded-xl md:rounded-2xl pointer-events-none" />
            {post.category && (
              <div className="absolute top-2 left-2 md:top-3 md:left-3">
                <Badge variant="secondary" className="bg-white/90 text-mountain-blue font-semibold text-[10px] md:text-xs px-2 py-0.5 md:px-2.5 md:py-0.5 shadow-sm">
                  {post.category}
                </Badge>
              </div>
            )}
          </div>
          {/* Right: Content */}
          <div className="flex-1 flex flex-col justify-center p-4 md:p-6 lg:p-8 bg-gradient-to-b from-transparent to-white/60">
            <h3 className="text-lg md:text-2xl font-serif font-bold text-foreground mb-2 group-hover:text-mountain-blue transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-base text-muted-foreground mb-3 md:mb-4 line-clamp-2 flex-1 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                {post.readTime && (
                  <span className="flex items-center gap-1 bg-mountain-blue/10 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min
                  </span>
                )}
                {formattedDate && <span>{formattedDate}</span>}
              </div>
              <span className="text-mountain-blue text-xs md:text-sm font-medium flex items-center group-hover:gap-1 transition-all">
                Read <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  )
}
