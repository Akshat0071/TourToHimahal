"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Calendar, ArrowRight, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cardHover, fadeInUp } from "@/lib/animation-variants"

interface Diary {
  id?: string
  slug: string
  title: string
  excerpt?: string
  content?: string
  cover_image?: string
  coverImage?: string // Support both field names
  author_name?: string
  author_avatar?: string
  author?: { name: string; avatar: string } // Support old format
  destination?: string
  travel_date?: string
  published_at?: string
  date?: string // Support both field names
  tags?: string[]
  readTime?: number
  gallery?: string[]
}

interface DiaryCardProps {
  diary: Diary
  featured?: boolean
}

export function DiaryCard({ diary, featured = false }: DiaryCardProps) {
  const dateString = diary.published_at || diary.travel_date || diary.date
  const formattedDate = dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : ""

  const imageUrl =
    diary.gallery?.[0] ||
    diary.cover_image ||
    diary.coverImage ||
    `/placeholder.svg?height=400&width=600&query=${diary.title}`
  const authorName = diary.author_name || diary.author?.name || "Traveler"
  const authorAvatar = diary.author_avatar || diary.author?.avatar || "/diverse-avatars.png"

  if (featured) {
    return (
      <motion.article variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Link href={`/diaries/${diary.slug}`}>
          <motion.div
            className="group bg-card relative overflow-hidden rounded-2xl shadow-lg"
            variants={cardHover}
            initial="rest"
            whileHover="hover"
          >
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-4/3 md:aspect-auto">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={diary.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-saffron text-white">Featured Story</Badge>
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                {diary.destination && (
                  <div className="text-muted-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{diary.destination}</span>
                  </div>
                )}
                <h2 className="text-foreground group-hover:text-mountain-blue mb-3 font-serif text-2xl font-bold transition-colors md:text-3xl">
                  {diary.title}
                </h2>
                {diary.excerpt && (
                  <p className="text-muted-foreground mb-4 leading-relaxed">{diary.excerpt}</p>
                )}
                <div className="text-muted-foreground mb-6 flex items-center gap-4 text-sm">
                  {diary.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {diary.readTime} min read
                    </span>
                  )}
                  {formattedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formattedDate}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src={authorAvatar || "/placeholder.svg"}
                    alt={authorName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-foreground font-medium">{authorName}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.article>
    )
  }

  return (
    <motion.article variants={fadeInUp} initial="hidden" animate="visible" className="min-w-0">
      <Link href={diary.slug ? `/diaries/${diary.slug}` : "#"} className="block min-w-0">
        <motion.div
          className="group bg-card border-border hover:border-mountain-blue/40 flex h-full min-w-0 flex-col overflow-hidden rounded-xl border shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:flex-row md:rounded-2xl"
          variants={cardHover}
          initial="rest"
          whileHover="hover"
        >
          {/* Left: Image */}
          <div
            className="relative w-full flex-shrink-0 overflow-hidden rounded-xl md:w-2/5 md:rounded-2xl"
            style={{ aspectRatio: "16/9", display: "block" }}
          >
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={diary.title}
              width={800}
              height={450}
              layout="responsive"
              className="block h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105 md:rounded-2xl"
              style={{ objectFit: "cover", borderRadius: "inherit" }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-t from-black/50 via-black/20 to-transparent md:rounded-2xl" />
            {diary.destination && (
              <div className="absolute top-2 left-2 md:top-3 md:left-3">
                <Badge
                  variant="secondary"
                  className="text-mountain-blue bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm md:px-2.5 md:py-0.5 md:text-xs"
                >
                  <MapPin className="mr-1 h-3 w-3" />
                  {diary.destination}
                </Badge>
              </div>
            )}
          </div>
          {/* Right: Content */}
          <div className="flex flex-1 flex-col justify-center bg-gradient-to-b from-transparent to-white/60 p-4 md:p-6 lg:p-8">
            <h3 className="text-foreground group-hover:text-mountain-blue mb-2 line-clamp-2 font-serif text-lg leading-tight font-bold transition-colors md:text-2xl">
              {diary.title}
            </h3>
            {diary.excerpt && (
              <p className="text-muted-foreground mb-3 line-clamp-2 flex-1 text-base leading-relaxed md:mb-4">
                {diary.excerpt}
              </p>
            )}
            <div className="mt-auto flex items-center justify-between pt-2">
              <div className="text-muted-foreground flex items-center gap-3 text-xs md:text-sm">
                {diary.readTime && (
                  <span className="bg-mountain-blue/10 flex items-center gap-1 rounded-full px-2 py-1">
                    <Clock className="h-3 w-3" />
                    {diary.readTime} min
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
