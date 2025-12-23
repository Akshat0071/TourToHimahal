"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { SocialShare } from "@/components/diaries/social-share"
import { MarkdownRenderer } from "@/lib/markdown-renderer"
import { fadeInUp } from "@/lib/animation-variants"
import { BlogTOC } from "@/components/blog/blog-toc"
import { DiaryCard } from "@/components/diaries/diary-card"

interface Diary {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  cover_image?: string
  gallery?: string[]
  author_name: string
  author_avatar?: string
  destination?: string
  travel_date?: string
  published_at?: string
  tags?: string[]
  readTime?: number
}

interface DiaryDetailClientProps {
  diary: Diary
  relatedDiaries: Diary[]
  popularDiaries: Diary[]
  url: string
}

export function DiaryDetailClient({ diary, relatedDiaries, popularDiaries, url }: DiaryDetailClientProps) {
  const shareUrl = url
  const gallery = (diary.gallery && diary.gallery.length > 0 ? diary.gallery : diary.cover_image ? [diary.cover_image] : []) as string[]
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const width = el.clientWidth
    const next = ((index + dir) % gallery.length + gallery.length) % gallery.length
    el.scrollTo({ left: next * width, behavior: "smooth" })
    setIndex(next)
  }

  useEffect(() => {
    if (gallery.length < 2) return
    const el = scrollerRef.current
    if (!el) return
    const id = setInterval(() => {
      if (paused) return
      const width = el.clientWidth
      const next = (index + 1) % gallery.length
      el.scrollTo({ left: next * width, behavior: "smooth" })
      setIndex(next)
    }, 3000)
    return () => clearInterval(id)
  }, [gallery.length, index, paused])

  return (
    <>
      <Header />
      <main>
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-6">
          <Link href="/diaries" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Diaries
          </Link>
        </div>

        {/* Title-only header */}
        <section className="bg-background border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              {/* Destination + Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {diary.destination && (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-mountain-blue/10 text-mountain-blue ring-1 ring-mountain-blue/20">
                    {diary.destination}
                  </span>
                )}
                {diary.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                {diary.author_name && <span>{diary.author_name}</span>}
                {(diary.travel_date || diary.published_at) && (
                  <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/60" />
                )}
                {(diary.travel_date || diary.published_at) && (
                  <span>
                    {new Date(diary.travel_date || diary.published_at || "").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight text-foreground">{diary.title}</h1>
            </motion.div>
          </div>
        </section>

        {/* Article grid: content left, sidebar right */}
        <article className="container mx-auto px-4 py-10">
          <div className="grid gap-10 items-start max-w-[1400px] mx-auto xl:grid-cols-[1fr_minmax(0,768px)_320px_1fr]">
            {/* Left: gallery + content (centered column) */}
            <div className="w-full xl:col-start-2 xl:col-span-1">
              {gallery.length > 0 && (
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
                  <div className="relative group">
                    <div
                      ref={scrollerRef}
                      className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-2xl border bg-card shadow"
                      onMouseEnter={() => setPaused(true)}
                      onMouseLeave={() => setPaused(false)}
                      style={{ scrollbarWidth: "none" }}
                    >
                      {gallery.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`${diary.title} ${idx + 1}`}
                          className="min-w-full snap-start object-cover"
                        />
                      ))}
                    </div>
                    {gallery.length > 1 && (
                      <>
                        <button
                          aria-label="Previous image"
                          onClick={() => scrollBy(-1)}
                          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur border shadow hover:bg-background transition group-hover:flex"
                        >
                          ‹
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={() => scrollBy(1)}
                          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur border shadow hover:bg-background transition group-hover:flex"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Social Share */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8 pb-8 border-b">
                <SocialShare title={diary.title} url={shareUrl} />
              </motion.div>

              {/* Content Body */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <MarkdownRenderer content={diary.content || ""} />
              </motion.div>

              {/* Tags */}
              {diary.tags && diary.tags.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="mt-12 pt-8 border-t"
                >
                  <h4 className="text-sm font-semibold text-foreground mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {diary.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Again */}
              <div className="py-8 border-t border-b mt-8">
                <SocialShare title={diary.title} url={shareUrl} />
              </div>
            </div>

            {/* Right: sticky sidebar */}
            <aside className="hidden xl:block xl:col-start-3 xl:col-span-1 sticky top-24 self-start">
              <div className="space-y-6">
                <BlogTOC content={diary.content || ""} />
                {/* Popular Stories card (same style as diaries list page) */}
                {popularDiaries.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-md border-2 border-muted/50">
                    <h3 className="text-lg font-serif font-bold text-foreground mb-4">Popular Stories</h3>
                    <div className="space-y-4">
                      {popularDiaries.slice(0, 4).map((d, idx) => (
                        <Link key={d.slug} href={`/diaries/${d.slug}`} className="flex gap-3 group">
                          <span className="text-2xl font-bold text-muted-foreground/30 group-hover:text-saffron transition-colors">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h4 className="font-medium text-foreground group-hover:text-mountain-blue transition-colors line-clamp-2 text-sm">
                              {d.title}
                            </h4>
                            <span className="text-xs text-muted-foreground">{d.destination}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {relatedDiaries.length > 0 && (
                  <div className="rounded-xl border bg-muted/50 backdrop-blur-sm p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Related Diaries</h3>
                    <div className="space-y-4">
                      {relatedDiaries.map((d) => (
                        <DiaryCard key={d.slug} diary={d} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
