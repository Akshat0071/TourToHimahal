"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { BlogTOC } from "@/components/blog/blog-toc"
import { BlogCard } from "@/components/blog/blog-card"
import { SocialShare } from "@/components/diaries/social-share"
import { MarkdownRenderer } from "@/lib/markdown-renderer"
import { fadeInUp } from "@/lib/animation-variants"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  cover_image?: string
  gallery?: string[]
  author?: string
  category?: string
  tags?: string[]
  published_at?: string
  created_at?: string
}

interface BlogDetailClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
  url: string
}

export function BlogDetailClient({ post, relatedPosts, url }: BlogDetailClientProps) {
  const shareUrl = url
  const markdownContent = post.content || ""
  const gallery = (post.gallery && post.gallery.length > 0 ? post.gallery : post.cover_image ? [post.cover_image] : []) as string[]
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

  // Auto-advance every 3 seconds, loop infinitely
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
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        {/* Title-only header (excerpt removed) */}
        <section className="bg-background border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              {/* Category + Tags Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {post.category && (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-mountain-blue/10 text-mountain-blue ring-1 ring-mountain-blue/20">
                    {post.category}
                  </span>
                )}
                {post.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                {post.author && <span>{post.author}</span>}
                {post.published_at && <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/60" />}
                {post.published_at && (
                  <span>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight text-foreground">{post.title}</h1>
            </motion.div>
          </div>
        </section>

        {/* Main article grid: content left, sidebar right */}
        <article className="container mx-auto px-4 py-10">
          <div className="grid gap-10 items-start max-w-[1400px] mx-auto xl:grid-cols-[1fr_minmax(0,768px)_320px_1fr]">
            {/* Left: Image gallery + content (centered column) */}
            <div className="w-full xl:col-start-2 xl:col-span-1">
              {/* Image gallery at top of content; scrolls with article */}
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
                          alt={`${post.title} ${idx + 1}`}
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
                <SocialShare title={post.title} url={shareUrl} />
              </motion.div>

              {/* Content Body */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <MarkdownRenderer content={markdownContent} />
              </motion.div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="mt-12 pt-8 border-t"
                >
                  <h4 className="text-sm font-semibold text-foreground mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Again */}
              <div className="py-8 border-t border-b mt-8">
                <SocialShare title={post.title} url={shareUrl} />
              </div>
            </div>

            {/* Right: Sticky sidebar with TOC and related posts */}
            <aside className="hidden xl:block xl:col-start-3 xl:col-span-1 sticky top-24 self-start">
              <div className="space-y-6">
                <BlogTOC content={markdownContent} />
                {relatedPosts.length > 0 && (
                  <div className="rounded-xl border bg-muted/50 backdrop-blur-sm p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <BlogCard key={relatedPost.slug} post={relatedPost} />
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
