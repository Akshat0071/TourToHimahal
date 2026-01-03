import type { MetadataRoute } from "next"

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim()
  const fallback = "https://www.tourtohimachal.in"
  return (configured || fallback).replace(/\/$/, "")
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
