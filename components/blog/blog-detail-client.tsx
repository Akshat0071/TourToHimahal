"use client"

import Link from "next/link"
import Image from "next/image"
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

  const whatsappLink = generateWhatsAppLink(
    {
      message: `Check out this article: ${post.title}`,
    },
    settings?.whatsapp_number
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
    <main className="min-h-screen bg-background">
      {/* Back Button and Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <Link href="/blog">
          <Button variant="ghost" className="gap-2 mb-4 hover:bg-muted">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Enhanced Hero Section */}
      <div className="bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-background">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Author and Date Metadata */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              {post.published_at && !isNaN(new Date(post.published_at).getTime()) && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.published_at), "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* Featured Image Below Title */}
      {post.cover_image && (
        <div className="bg-background">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted shadow-lg">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Sticky Sidebar */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar - On This Page (Sticky) */}
          {toc.length > 0 && (
            <div className="lg:col-span-3">
              <div className="sticky top-20 bg-muted/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 max-h-[calc(100vh-100px)] overflow-y-auto">
                <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                  On This Page
                </h3>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTocClick(item.text)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        activeSection === item.text
                          ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/50 glow"
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
            <div ref={contentRef} className="prose prose-lg max-w-none dark:prose-invert">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Share and Tags Section */}
            <div className="mt-12 pt-8 border-t border-border space-y-6">
              {/* Share Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-semibold text-foreground">Share:</span>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="gap-2 hover:bg-[#25D366]/10">
                    <Share2 className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>

              {/* All Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition">
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
              <div className="sticky top-20 bg-muted/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <div className="group cursor-pointer space-y-2 p-3 rounded-xl hover:bg-background transition-all duration-200 hover:shadow-md">
                        <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        {relatedPost.category && (
                          <p className="text-xs text-muted-foreground font-medium">{relatedPost.category}</p>
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

