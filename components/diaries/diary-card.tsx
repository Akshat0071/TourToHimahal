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
    diary.gallery?.[0] || diary.cover_image || diary.coverImage || `/placeholder.svg?height=400&width=600&query=${diary.title}`
  const authorName = diary.author_name || diary.author?.name || "Traveler"
  const authorAvatar = diary.author_avatar || diary.author?.avatar || "/diverse-avatars.png"

  if (featured) {
    return (
      <motion.article variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Link href={`/diaries/${diary.slug}`}>
          <motion.div
            className="group relative bg-card rounded-2xl overflow-hidden shadow-lg"
            variants={cardHover}
            initial="rest"
            whileHover="hover"
          >
            <div className="grid md:grid-cols-2 gap-0">
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
              <div className="p-6 md:p-8 flex flex-col justify-center">
                {diary.destination && (
                  <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{diary.destination}</span>
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3 group-hover:text-mountain-blue transition-colors">
                  {diary.title}
                </h2>
                {diary.excerpt && <p className="text-muted-foreground mb-4 leading-relaxed">{diary.excerpt}</p>}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
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
                  <span className="font-medium text-foreground">{authorName}</span>
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
          className="group bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-md h-full flex flex-col md:flex-row border border-border hover:border-mountain-blue/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 min-w-0"
          variants={cardHover}
          initial="rest"
          whileHover="hover"
        >
          {/* Left: Image */}
          <div className="relative w-full md:w-2/5 flex-shrink-0 overflow-hidden rounded-xl md:rounded-2xl" style={{ aspectRatio: '16/9', display: 'block' }}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={diary.title}
              width={800}
              height={450}
              layout="responsive"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-xl md:rounded-2xl block"
              style={{ objectFit: 'cover', borderRadius: 'inherit' }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent rounded-xl md:rounded-2xl pointer-events-none" />
            {diary.destination && (
              <div className="absolute top-2 left-2 md:top-3 md:left-3">
                <Badge variant="secondary" className="bg-white/90 text-mountain-blue font-semibold text-[10px] md:text-xs px-2 py-0.5 md:px-2.5 md:py-0.5 shadow-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  {diary.destination}
                </Badge>
              </div>
            )}
          </div>
          {/* Right: Content */}
          <div className="flex-1 flex flex-col justify-center p-4 md:p-6 lg:p-8 bg-gradient-to-b from-transparent to-white/60">
            <h3 className="text-lg md:text-2xl font-serif font-bold text-foreground mb-2 group-hover:text-mountain-blue transition-colors line-clamp-2 leading-tight">
              {diary.title}
            </h3>
            {diary.excerpt && (
              <p className="text-base text-muted-foreground mb-3 md:mb-4 line-clamp-2 flex-1 leading-relaxed">
                {diary.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground">
                {diary.readTime && (
                  <span className="flex items-center gap-1 bg-mountain-blue/10 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    {diary.readTime} min
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
