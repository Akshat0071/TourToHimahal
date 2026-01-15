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

interface Diary {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover_image?: string
  date?: string
}

interface TravelDiariesClientProps {
  blogs: Blog[]
  diaries: Diary[]
}

interface DisplayItem {
  title: string
  excerpt: string
  image: string
  date: string
  slug: string
  type: "blog" | "diary"
}

// Fallback data if no blogs from database
const fallbackBlogs = [
  {
    title: "10 Hidden Gems of Himachal You Must Visit",
    excerpt: "Discover secret spots away from tourist crowds that will take your breath away...",
    image: "/hidden-gems-himachal.jpg",
    date: "Dec 10, 2025",
    slug: "hidden-gems-himachal",
    type: "blog" as const,
  },
  {
    title: "Complete Guide to Spiti Valley Road Trip",
    excerpt: "Everything you need to know before embarking on this epic Himalayan adventure...",
    image: "/spiti-valley-road-trip.jpg",
    date: "Dec 5, 2025",
    slug: "spiti-valley-guide",
    type: "blog" as const,
  },
  {
    title: "Best Time to Visit Manali: Season by Season",
    excerpt: "Plan your perfect Manali trip with our comprehensive seasonal guide...",
    image: "/manali-seasons.jpg",
    date: "Nov 28, 2025",
    slug: "best-time-manali",
    type: "blog" as const,
  },
]

const fallbackDiaries = [
  {
    title: "A Winter Expedition Through Spiti Valley",
    excerpt: "Surviving -30°C and discovering the frozen heart of the Himalayas...",
    image: "/spiti-winter-expedition.jpg",
    date: "Feb 15, 2024",
    slug: "spiti-valley-winter-expedition",
    type: "diary" as const,
  },
  {
    title: "Triund Trek: A First-Timer's Complete Guide",
    excerpt: "Everything you need to know before your first Himalayan trek...",
    image: "/triund-trek-guide.jpg",
    date: "Mar 20, 2024",
    slug: "triund-trek-first-timer-guide",
    type: "diary" as const,
  },
  {
    title: "The Sacred Hot Springs of Manikaran",
    excerpt: "A spiritual journey to where Shiva found Parvati's lost earring...",
    image: "/manikaran-hot-springs.jpg",
    date: "Jan 10, 2024",
    slug: "manikaran-hot-springs-pilgrimage",
    type: "diary" as const,
  },
]

export function TravelDiariesClient({ blogs, diaries }: TravelDiariesClientProps) {
  // Combine blogs and diaries with type indicator
  const displayItems: DisplayItem[] = []

  // Process blogs
  if (blogs.length > 0) {
    blogs.forEach((blog) => {
      displayItems.push({
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
        type: "blog",
      })
    })
  }

  // Process diaries
  if (diaries.length > 0) {
    diaries.forEach((diary) => {
      displayItems.push({
        title: diary.title,
        excerpt: diary.excerpt || "",
        image: diary.cover_image || `/placeholder.svg?height=300&width=500&query=${diary.title}`,
        date: diary.date
          ? new Date(diary.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        slug: diary.slug,
        type: "diary",
      })
    })
  }

  // Use fallback data if no items from database
  const finalItems: DisplayItem[] =
    displayItems.length > 0
      ? displayItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
      : [...fallbackBlogs, ...fallbackDiaries].slice(0, 3)

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
                View All Stories
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
          {finalItems.map((item, index) => (
            <motion.article key={`${item.type}-${item.slug}`} variants={fadeInUp} className="group">
              <Link href={`/${item.type === "blog" ? "blog" : "diaries"}/${item.slug}`} className="block">
                <div className="border-forest-green/10 hover:border-forest-green/30 overflow-hidden rounded-2xl border bg-linear-to-br from-[oklch(0.99_0.015_145)] to-[oklch(0.97_0.02_130)] shadow-lg transition-all duration-500 hover:shadow-xl md:rounded-3xl">
                  {/* Image container with hover effect */}
                  <div className="relative h-48 overflow-hidden sm:h-56 md:h-64">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-center transition-transform duration-700"
                    />

                    {/* Category badge */}
                    {index === 0 && (
                      <div className={`absolute top-3 left-3 rounded-full bg-linear-to-r px-2.5 py-1 text-xs font-bold text-white md:top-4 md:left-4 md:px-3 ${
                        item.type === "blog" ? "from-forest-green to-mountain-blue" : "from-saffron to-golden-yellow"
                      }`}>
                        {item.type === "blog" ? "BLOG" : "DIARY"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    {item.date && (
                      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs md:mb-3 md:text-sm">
                        <div className="bg-golden-yellow/15 rounded-lg p-1 md:p-1.5">
                          <Calendar className="text-golden-yellow h-3 w-3 md:h-4 md:w-4" />
                        </div>
                        <span>{item.date}</span>
                      </div>
                    )}
                    <h3 className="text-foreground group-hover:text-forest-green mb-2 line-clamp-2 text-base font-bold transition-colors md:mb-3 md:text-xl">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed md:text-base">
                      {item.excerpt}
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
