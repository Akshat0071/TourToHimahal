"use client"

import { motion } from "framer-motion"
import { Twitter, Facebook, Linkedin, Link2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
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
      name: "WhatsApp",
      icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ]

  const copyToClipboard = async () => {
    try {
      // If url is relative, prepend window.location.origin
      const absoluteUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`
      await navigator.clipboard.writeText(absoluteUrl)
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
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className="h-9 w-9 bg-transparent"
          aria-label="Copy link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
