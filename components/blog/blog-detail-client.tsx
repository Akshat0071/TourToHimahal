"use client"

import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Share2, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MarkdownRenderer } from "@/lib/markdown-renderer"
import { useSettings } from "@/lib/settings-context"
import { generateWhatsAppLink } from "@/lib/whatsapp"
import { useEffect, useState, useRef } from "react"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  cover_image?: string
  content: string
  author: string
  category?: string
  tags?: string[]
  published_at: string
  created_at: string
  is_published: boolean
}

interface BlogDetailClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const { settings } = useSettings()
  const [toc, setToc] = useState<TableOfContentsItem[]>([])
  const [activeSection, setActiveSection] = useState<string>("")
  const contentRef = useRef<HTMLDivElement>(null)

  const normalizedAuthor = (post.author ?? "").trim()
  const displayAuthor =
    !normalizedAuthor || normalizedAuthor.toLowerCase() === "himachal yatra"
      ? "TourToHimachal"
      : normalizedAuthor

  const whatsappLink = generateWhatsAppLink(
    {
      message: `Check out this article: ${post.title}`,
    },
    settings?.whatsapp_number,
  )

  // Extract headings from markdown content to create table of contents
  useEffect(() => {
    const lines = post.content.split("\n")
    const headings: TableOfContentsItem[] = []

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = `heading-${index}`

        headings.push({ id, text, level })
      }
    })

    setToc(headings)
  }, [post.content])

  // Handle scroll for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const headingElements = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
      let currentActive = ""

      headingElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100) {
          currentActive = element.textContent || ""
        }
      })

      setActiveSection(currentActive)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTocClick = (text: string) => {
    const headingElements = contentRef.current?.querySelectorAll("h1, h2, h3, h4, h5, h6") || []

    for (const element of headingElements) {
      if (element.textContent === text) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
        setActiveSection(text)
        break
      }
    }
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Back Button and Navigation */}
      <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6">
        <Link href="/blog">
          <Button variant="ghost" className="hover:bg-muted mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Enhanced Hero Section */}
      <div className="dark:to-background bg-linear-to-b from-slate-50 to-white dark:from-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <article className="space-y-6">
            {/* Category and Tags */}
            <div className="flex flex-wrap gap-2">
              {post.category && (
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {post.category}
                </Badge>
              )}
              {post.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title Only */}
            <h1 className="text-foreground font-serif text-4xl leading-tight font-bold sm:text-5xl md:text-6xl">
              {post.title}
            </h1>

            {/* Author and Date Metadata */}
            <div className="text-muted-foreground border-border flex flex-wrap items-center gap-4 border-t pt-6 text-sm sm:gap-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{displayAuthor}</span>
              </div>
              {post.published_at && !isNaN(new Date(post.published_at).getTime()) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.published_at), "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* Main Content with Sticky Sidebar */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Sidebar - On This Page (Sticky) */}
          {toc.length > 0 && (
            <div className="lg:col-span-3">
              <div className="bg-muted/50 border-border/50 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border p-6 backdrop-blur-sm">
                <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                  On This Page
                </h3>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTocClick(item.text)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                        activeSection === item.text
                          ? "bg-primary text-primary-foreground shadow-primary/50 glow font-semibold shadow-lg"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                      style={{
                        marginLeft: `${(item.level - 2) * 12}px`,
                        opacity: item.level > 3 ? 0.8 : 1,
                      }}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className={`${toc.length > 0 ? "lg:col-span-6" : "lg:col-span-8"}`}>
            <div ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Share and Tags Section */}
            <div className="border-border mt-12 space-y-6 border-t pt-8">
              {/* Share Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-foreground font-semibold">Share:</span>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="gap-2 hover:bg-[#25D366]/10">
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>

              {/* All Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="space-y-3">
                  <p className="text-foreground font-semibold">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="lg:col-span-3">
              <div className="bg-muted/50 border-border/50 sticky top-20 rounded-2xl border p-6 backdrop-blur-sm">
                <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <div className="group hover:bg-background cursor-pointer space-y-2 rounded-xl p-3 transition-all duration-200 hover:shadow-md">
                        <p className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-medium transition">
                          {relatedPost.title}
                        </p>
                        {relatedPost.category && (
                          <p className="text-muted-foreground text-xs font-medium">{relatedPost.category}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS for glow effect */}
      <style>{`
        .glow {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(var(--primary), 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(var(--primary), 0.8);
          }
        }
      `}</style>
    </main>
  )
}
