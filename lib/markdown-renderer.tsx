"use client"

import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { cn } from "@/lib/utils"
import React from "react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

function hasImageChild(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      if (child.type === "img" || (child.props as { node?: { tagName?: string } })?.node?.tagName === "img") {
        return true
      }
    }
    return false
  })
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  function extractText(node: React.ReactNode): string {
    return React.Children.toArray(node)
      .map((child) => {
        if (typeof child === "string") return child
        if (typeof child === "number") return String(child)
        if (React.isValidElement(child)) return extractText(child.props.children)
        return ""
      })
      .join("")
  }

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      <ReactMarkdown
        components={{
        h2: ({ children }) => {
          const id = slugify(extractText(children))
          return (
            <h2
              id={id}
              className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-12 mb-6 scroll-mt-24"
            >
              {children}
            </h2>
          )
        },
        h3: ({ children }) => {
          const id = slugify(extractText(children))
          return (
            <h3 id={id} className="text-xl md:text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
              {children}
            </h3>
          )
        },
        p: ({ children }) => {
          if (hasImageChild(children)) {
            return <div className="mb-6">{children}</div>
          }
          return <p className="text-muted-foreground leading-relaxed mb-6">{children}</p>
        },
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-saffron pl-6 py-2 my-8 bg-muted/50 rounded-r-lg italic text-foreground">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => <strong className="font-semibold text-orange-500">{children}</strong>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mountain-blue hover:text-mountain-blue/80 underline underline-offset-4"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <figure className="my-8">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image src={src || ""} alt={alt || ""} fill className="object-cover" />
            </div>
            {alt && <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">{alt}</figcaption>}
          </figure>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse border border-border rounded-lg">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="border border-border px-4 py-2 text-muted-foreground">{children}</td>,
        code: ({ children }) => (
          <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">{children}</code>
        ),
        hr: () => <hr className="my-12 border-border" />,
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
