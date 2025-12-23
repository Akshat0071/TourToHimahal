"use client"

import { useEffect, useState, MouseEvent } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

interface BlogTOCProps {
  content: string
}

export function BlogTOC({ content }: BlogTOCProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [tocItems, setTocItems] = useState<TocItem[]>([])

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const items: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      items.push({ id, text, level })
    }

    setTocItems(items)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0% -66%" },
    )

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [tocItems])

  if (tocItems.length === 0) return null

  const onClickItem = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden xl:block"
    >
      <div className="rounded-xl border bg-muted/50 backdrop-blur-sm p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">On This Page</h4>
        <ul className="space-y-1.5">
        {tocItems.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
            <a
              href={`#${item.id}`}
              onClick={(e) => onClickItem(e, item.id)}
              className={cn(
                "text-sm transition-colors block py-1.5 px-2 rounded-md",
                activeId === item.id
                  ? "text-mountain-blue font-medium bg-mountain-blue/10 ring-1 ring-mountain-blue/30 drop-shadow-[0_0_8px_rgba(59,130,246,0.45)] animate-pulse"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
        </ul>
      </div>
    </motion.nav>
  )
}
