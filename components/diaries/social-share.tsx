"use client"

import { motion } from "framer-motion"
import { Twitter, Facebook, Linkedin, Link2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fadeInUp } from "@/lib/animation-variants"

interface SocialShareProps {
  title: string
  url: string
}

export function SocialShare({ title, url }: SocialShareProps) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-center gap-4"
    >
      <span className="text-muted-foreground text-sm font-medium">Share:</span>
      <div className="flex gap-2">
        {shareLinks.map((link) => (
          <Button key={link.name} variant="outline" size="icon" asChild className="h-9 w-9 bg-transparent">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${link.name}`}
            >
              <link.icon className="h-4 w-4" />
            </a>
          </Button>
        ))}
        <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-9 w-9 bg-transparent">
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
