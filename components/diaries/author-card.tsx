"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Twitter, Instagram } from "lucide-react"
import { fadeInUp } from "@/lib/animation-variants"

interface AuthorCardProps {
  author: {
    name: string
    avatar?: string
    bio?: string
    social?: {
      twitter?: string
      instagram?: string
    }
  }
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-muted rounded-xl p-6 md:p-8"
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Image
          src={author.avatar || "/placeholder.svg"}
          alt={author.name}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="text-center sm:text-left">
          <h3 className="text-foreground mb-2 font-serif text-xl font-bold">About the Author</h3>
          <p className="text-foreground mb-2 text-lg font-medium">{author.name}</p>
          {author.bio && <p className="text-muted-foreground mb-4">{author.bio}</p>}
          <div className="flex justify-center gap-4 sm:justify-start">
            {author.social?.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-mountain-blue transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {author.social?.instagram && (
              <a
                href={author.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-mountain-blue transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
