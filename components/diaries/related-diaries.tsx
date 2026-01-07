"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DiaryCard } from "./diary-card"
import { fadeInUp } from "@/lib/animation-variants"

interface Diary {
  slug: string
  title: string
  excerpt?: string
  cover_image?: string
  gallery?: string[]
  author_name?: string
  author_avatar?: string
  destination?: string
  travel_date?: string
  published_at?: string
}

interface RelatedDiariesProps {
  diaries: Diary[]
}

export function RelatedDiaries({ diaries }: RelatedDiariesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = 400
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  if (diaries.length === 0) return null

  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-12"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground font-serif text-2xl font-bold md:text-3xl">Read Next</h2>
        <div className="hidden gap-2 md:flex">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} aria-label="Scroll left">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} aria-label="Scroll right">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-4 flex gap-6 overflow-x-auto px-4 pb-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {diaries.map((diary) => (
          <div key={diary.slug} className="w-[320px] flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
            <DiaryCard diary={diary} />
          </div>
        ))}
      </div>
    </motion.section>
  )
}
