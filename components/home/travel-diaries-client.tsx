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
    <section className="py-8 md:py-8 lg:py-12 bg-linear-to-br from-background via-[oklch(0.97_0.02_85)] to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 md:right-20 w-48 md:w-64 h-48 md:h-64 bg-linear-to-br from-golden-yellow/20 to-saffron/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 md:left-20 w-36 md:w-48 h-36 md:h-48 bg-linear-to-tr from-mountain-blue/15 to-forest-green/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12"
        >
          <div>
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-forest-green/15 rounded-full mb-3 md:mb-4"
            >
              <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-forest-green" />
              <span className="text-xs md:text-sm font-semibold text-forest-green uppercase tracking-wider">
                Stories & Inspiration
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-2 md:mt-3"
            >
              Travel{" "}
              <span className="text-forest-green">
                Diaries
              </span>
            </motion.h2>
          </div>
          <motion.div variants={fadeInUp}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-4 md:mt-0 border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white rounded-full bg-transparent text-sm md:text-base"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
        >
          {displayBlogs.map((blog, index) => (
            <motion.article key={blog.title} variants={fadeInUp} className="group">
              <Link href={`/blog/${blog.slug}`} className="block">
                <div className="bg-linear-to-br from-[oklch(0.99_0.015_145)] to-[oklch(0.97_0.02_130)] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-forest-green/10 hover:border-forest-green/30">
                  {/* Image container with hover effect */}
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <Image
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    {index === 0 && (
                      <div className="absolute top-3 md:top-4 left-3 md:left-4 px-2.5 md:px-3 py-1 bg-linear-to-r from-forest-green to-mountain-blue text-white text-xs font-bold rounded-full">
                        FEATURED
                      </div>
                    )}

                    {/* Read more indicator */}
                    <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0">
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-forest-green" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    {blog.date && (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                        <div className="p-1 md:p-1.5 bg-golden-yellow/15 rounded-lg">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4 text-golden-yellow" />
                        </div>
                        <span>{blog.date}</span>
                      </div>
                    )}
                    <h3 className="text-base md:text-xl font-bold text-foreground mb-2 md:mb-3 group-hover:text-forest-green transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed text-sm md:text-base">
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
