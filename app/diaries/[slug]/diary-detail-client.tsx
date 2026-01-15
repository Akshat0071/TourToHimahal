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
  popularDiaries: Diary[]
  url: string
}

export function DiaryDetailClient({ diary, popularDiaries, url }: DiaryDetailClientProps) {
  const shareUrl = url
  const gallery = (
    diary.gallery && diary.gallery.length > 0 ? diary.gallery : diary.cover_image ? [diary.cover_image] : []
  ) as string[]
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const width = el.clientWidth
    const next = (((index + dir) % gallery.length) + gallery.length) % gallery.length
    el.scrollTo({ left: next * width, behavior: "smooth" })
    setIndex(next)
  }

  useEffect(() => {
    if (gallery.length < 2) return undefined
    const el = scrollerRef.current
    if (!el) return undefined
    const id = setInterval(() => {
      if (paused) return undefined
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
          <Link
            href="/diaries"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Diaries
          </Link>
        </div>

        {/* Title-only header */}
        <section className="bg-background border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              {/* Destination + Tags */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {diary.destination && (
                  <span className="bg-mountain-blue/10 text-mountain-blue ring-mountain-blue/20 rounded-full px-2.5 py-1 text-xs ring-1">
                    {diary.destination}
                  </span>
                )}
                {diary.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="text-muted-foreground mb-3 flex items-center gap-3 text-sm">
                {diary.author_name && <span>{diary.author_name}</span>}
                {(diary.travel_date || diary.published_at) && (
                  <span className="bg-muted-foreground/60 inline-block h-1 w-1 rounded-full" />
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
              <h1 className="text-foreground font-serif text-3xl leading-tight font-bold md:text-5xl">
                {diary.title}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Article grid: content left, sidebar right */}
        <article className="container mx-auto px-4 py-10">
          <div className="mx-auto grid max-w-[1400px] items-start gap-10 xl:grid-cols-[1fr_minmax(0,768px)_320px_1fr]">
            {/* Left: gallery + content (centered column) */}
            <div className="w-full xl:col-span-1 xl:col-start-2">
              {gallery.length > 0 && (
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
                  <div className="group relative">
                    <div
                      ref={scrollerRef}
                      className="bg-card flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl border shadow"
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
                          className="bg-background/80 hover:bg-background absolute top-1/2 left-3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow backdrop-blur transition group-hover:flex md:flex"
                        >
                          ‹
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={() => scrollBy(1)}
                          className="bg-background/80 hover:bg-background absolute top-1/2 right-3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow backdrop-blur transition group-hover:flex md:flex"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Social Share */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="mb-8 border-b pb-8"
              >
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
                  className="mt-12 border-t pt-8"
                >
                  <h4 className="text-foreground mb-3 text-sm font-semibold">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {diary.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Again */}
              <div className="mt-8 border-t border-b py-8">
                <SocialShare title={diary.title} url={shareUrl} />
              </div>
            </div>

            {/* Right: sticky sidebar */}
            <aside className="sticky top-24 hidden self-start xl:col-span-1 xl:col-start-3 xl:block">
              <div className="space-y-6">
                <BlogTOC content={diary.content || ""} />
                {/* Popular Stories card (same style as diaries list page) */}
                {popularDiaries.length > 0 && (
                  <div className="bg-card border-muted/50 rounded-xl border-2 p-6 shadow-md">
                    <h3 className="text-foreground mb-4 font-serif text-lg font-bold">Popular Stories</h3>
                    <div className="space-y-4">
                      {popularDiaries.slice(0, 4).map((d, idx) => (
                        <Link key={d.slug} href={`/diaries/${d.slug}`} className="group flex gap-3">
                          <span className="text-muted-foreground/30 group-hover:text-saffron text-2xl font-bold transition-colors">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h4 className="text-foreground group-hover:text-mountain-blue line-clamp-2 text-sm font-medium transition-colors">
                              {d.title}
                            </h4>
                            <span className="text-muted-foreground text-xs">{d.destination}</span>
                          </div>
                        </Link>
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
