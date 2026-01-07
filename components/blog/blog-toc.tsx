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

  /* ---------------------------------------------
   * Extract headings (h2, h3) from markdown
   * --------------------------------------------- */
  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const items: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      items.push({ id, text, level })
    }

    setTocItems(items)
  }, [content])

  /* ---------------------------------------------
   * Scroll-spy using scroll listener for precise tracking
   * --------------------------------------------- */
  useEffect(() => {
    if (tocItems.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // Offset for header

      // Find the heading that's currently in view
      let currentId = ""

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const heading = document.getElementById(tocItems[i].id)
        if (heading) {
          const headingTop = heading.offsetTop
          if (scrollPosition >= headingTop) {
            currentId = tocItems[i].id
            break
          }
        }
      }

      // If no section found above, use the first one
      if (!currentId && tocItems.length > 0) {
        currentId = tocItems[0].id
      }

      setActiveId(currentId)
    }

    // Initial check
    handleScroll()

    // Listen to scroll
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [tocItems])

  if (tocItems.length === 0) return null

  /* ---------------------------------------------
   * Header-safe smooth scroll
   * --------------------------------------------- */
  const onClickItem = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return

    const y = el.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top: y, behavior: "smooth" })
    history.replaceState(null, "", `#${id}`)
  }

  return (
    <motion.nav initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden xl:block">
      <div className="bg-muted/50 rounded-xl border p-4 shadow-sm backdrop-blur-sm">
        <h4 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">On This Page</h4>

        <ul className="space-y-1.5">
          {tocItems.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => onClickItem(e, item.id)}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm transition-all",
                  activeId === item.id
                    ? "text-mountain-blue bg-mountain-blue/10 ring-mountain-blue/30 font-medium ring-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.45)]"
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
