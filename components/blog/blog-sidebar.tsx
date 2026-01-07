"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { fadeInUp } from "@/lib/animation-variants"

interface Blog {
  id?: string
  slug: string
  title: string
  category?: string
  tags?: string[]
}

interface BlogSidebarProps {
  blogs?: Blog[]
}

export function BlogSidebar({ blogs = [] }: BlogSidebarProps) {
  const popularPosts = blogs.slice(0, 4)
  const allTags = [...new Set(blogs.flatMap((post) => post.tags || []))]
  const categories = [...new Set(blogs.map((post) => post.category).filter(Boolean))]

  return (
    <aside className="space-y-8">
      {/* Categories */}
      {categories.length > 0 && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-card rounded-xl p-6 shadow-md"
        >
          <h3 className="text-foreground mb-4 font-serif text-lg font-bold">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => {
              const count = blogs.filter((p) => p.category === category).length
              return (
                <li key={category}>
                  <Link
                    href={`/blog?category=${encodeURIComponent(category || "")}`}
                    className="text-muted-foreground hover:text-mountain-blue flex items-center justify-between py-2 transition-colors"
                  >
                    <span>{category}</span>
                    <span className="bg-muted rounded px-2 py-0.5 text-sm">{count}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </motion.div>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-card rounded-xl p-6 shadow-md"
        >
          <h3 className="text-foreground mb-4 font-serif text-lg font-bold">Popular Posts</h3>
          <div className="space-y-4">
            {popularPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex gap-3">
                <span className="text-muted-foreground/50 group-hover:text-saffron text-2xl font-bold transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-foreground group-hover:text-mountain-blue line-clamp-2 text-sm font-medium transition-colors">
                    {post.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Newsletter removed as requested */}

      {/* Tag Cloud removed as requested */}
    </aside>
  )
}
