"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, BookOpen } from "lucide-react"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"
import { Button } from "@/components/ui/button"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover_image?: string
  published_at?: string
}

interface TravelDiariesClientProps {
  blogs: Blog[]
}

// Fallback data if no blogs from database
const fallbackBlogs = [
  {
    title: "10 Hidden Gems of Himachal You Must Visit",
    excerpt: "Discover secret spots away from the tourist crowds that will take your breath away...",
    image: "/hidden-gems-himachal.jpg",
    date: "Dec 10, 2025",
    slug: "hidden-gems-himachal",
  },
  {
    title: "Complete Guide to Spiti Valley Road Trip",
    excerpt: "Everything you need to know before embarking on this epic Himalayan adventure...",
    image: "/spiti-valley-road-trip.jpg",
    date: "Dec 5, 2025",
    slug: "spiti-valley-guide",
  },
  {
    title: "Best Time to Visit Manali: Season by Season",
    excerpt: "Plan your perfect Manali trip with our comprehensive seasonal guide...",
    image: "/manali-seasons.jpg",
    date: "Nov 28, 2025",
    slug: "best-time-manali",
  },
]

export function TravelDiariesClient({ blogs }: TravelDiariesClientProps) {
  // Use blogs from database or fallback
  const displayBlogs =
    blogs.length > 0
      ? blogs.map((blog) => ({
          title: blog.title,
          excerpt: blog.excerpt || "",
          image: blog.cover_image || `/placeholder.svg?height=300&width=500&query=${blog.title}`,
          date: blog.published_at
            ? new Date(blog.published_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
          slug: blog.slug,
        }))
      : fallbackBlogs

  return (
    <section className="from-background to-background relative overflow-hidden bg-linear-to-br via-[oklch(0.97_0.02_85)] py-8 md:py-8 lg:py-12">
      {/* Background decorations */}
      <div className="from-golden-yellow/20 to-saffron/20 absolute top-20 right-10 h-48 w-48 rounded-full bg-linear-to-br blur-3xl md:right-20 md:h-64 md:w-64" />
      <div className="from-mountain-blue/15 to-forest-green/15 absolute bottom-20 left-10 h-36 w-36 rounded-full bg-linear-to-tr blur-3xl md:left-20 md:h-48 md:w-48" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-8 flex flex-col md:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <motion.div
              variants={fadeInUp}
              className="bg-forest-green/15 mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:mb-4 md:px-4 md:py-2"
            >
              <BookOpen className="text-forest-green h-3 w-3 md:h-4 md:w-4" />
              <span className="text-forest-green text-xs font-semibold tracking-wider uppercase md:text-sm">
                Stories & Inspiration
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-foreground mt-2 font-serif text-2xl font-bold sm:text-3xl md:mt-3 md:text-4xl lg:text-5xl"
            >
              Travel <span className="text-forest-green">Diaries</span>
            </motion.h2>
          </div>
          <motion.div variants={fadeInUp}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-forest-green text-forest-green hover:bg-forest-green mt-4 rounded-full border-2 bg-transparent text-sm hover:text-white md:mt-0 md:text-base"
            >
              <Link href="/blog" className="gap-2">
                View All Posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
          {displayBlogs.map((blog, index) => (
            <motion.article key={blog.title} variants={fadeInUp} className="group">
              <Link href={`/blog/${blog.slug}`} className="block">
                <div className="border-forest-green/10 hover:border-forest-green/30 overflow-hidden rounded-2xl border bg-linear-to-br from-[oklch(0.99_0.015_145)] to-[oklch(0.97_0.02_130)] shadow-lg transition-all duration-500 hover:shadow-xl md:rounded-3xl">
                  {/* Image container with hover effect */}
                  <div className="relative h-48 overflow-hidden sm:h-56 md:h-64">
                    <Image
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Category badge */}
                    {index === 0 && (
                      <div className="from-forest-green to-mountain-blue absolute top-3 left-3 rounded-full bg-linear-to-r px-2.5 py-1 text-xs font-bold text-white md:top-4 md:left-4 md:px-3">
                        FEATURED
                      </div>
                    )}

                    {/* Read more indicator */}
                    <div className="absolute right-3 bottom-3 flex h-10 w-10 translate-y-4 transform items-center justify-center rounded-full bg-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:right-4 md:bottom-4 md:h-12 md:w-12">
                      <ArrowRight className="text-forest-green h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    {blog.date && (
                      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs md:mb-3 md:text-sm">
                        <div className="bg-golden-yellow/15 rounded-lg p-1 md:p-1.5">
                          <Calendar className="text-golden-yellow h-3 w-3 md:h-4 md:w-4" />
                        </div>
                        <span>{blog.date}</span>
                      </div>
                    )}
                    <h3 className="text-foreground group-hover:text-forest-green mb-2 line-clamp-2 text-base font-bold transition-colors md:mb-3 md:text-xl">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed md:text-base">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
