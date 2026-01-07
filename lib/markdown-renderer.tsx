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
                className="text-foreground mt-12 mb-6 scroll-mt-24 font-serif text-2xl font-bold md:text-3xl"
              >
                {children}
              </h2>
            )
          },
          h3: ({ children }) => {
            const id = slugify(extractText(children))
            return (
              <h3 id={id} className="text-foreground mt-8 mb-4 font-serif text-xl font-semibold md:text-2xl">
                {children}
              </h3>
            )
          },
          p: ({ children }) => {
            if (hasImageChild(children)) {
              return <div className="mb-6">{children}</div>
            }
            return <p className="text-muted-foreground mb-6 leading-relaxed">{children}</p>
          },
          ul: ({ children }) => (
            <ul className="text-muted-foreground mb-6 list-inside list-disc space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="text-muted-foreground mb-6 list-inside list-decimal space-y-2">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-saffron bg-muted/50 text-foreground my-8 rounded-r-lg border-l-4 py-2 pl-6 italic">
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
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image src={src || ""} alt={alt || ""} fill className="object-cover" />
              </div>
              {alt && (
                <figcaption className="text-muted-foreground mt-3 text-center text-sm italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto">
              <table className="border-border w-full border-collapse rounded-lg border">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-border bg-muted text-foreground border px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-border text-muted-foreground border px-4 py-2">{children}</td>
          ),
          code: ({ children }) => (
            <code className="bg-muted text-foreground rounded px-2 py-1 font-mono text-sm">{children}</code>
          ),
          hr: () => <hr className="border-border my-12" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
