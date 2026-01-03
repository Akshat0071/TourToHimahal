"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
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
  const normalizedAuthor = post.author?.trim()
  const displayAuthor =
    !normalizedAuthor || normalizedAuthor.toLowerCase() === "himachal yatra"
      ? "TourToHimachal"
      : normalizedAuthor

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
                {displayAuthor && <span>{displayAuthor}</span>}
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
