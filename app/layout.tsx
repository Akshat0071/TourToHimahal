import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SettingsProvider } from "@/lib/settings-context"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { createPublicClient } from "@/lib/supabase/public"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
})

const siteMetadataAssets: Pick<Metadata, "icons" | "manifest"> = {
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
}

// Default fallback metadata
const defaultMetadata = {
  title: "TourToHimachal - Tours, Travel Packages & Taxi Services",
  description:
    "Discover the magic of Himachal Pradesh with our curated tour packages, reliable taxi services, and personalized travel experiences. Book spiritual tours, honeymoon packages, adventure trips, and more.",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anon) {
      return {
        title: defaultMetadata.title,
        description: defaultMetadata.description,
        ...siteMetadataAssets,
        keywords:
          "Himachal Pradesh tours, Manali packages, Shimla travel, taxi service Himachal, spiritual tours, honeymoon packages, adventure trekking",
        openGraph: {
          title: "TourToHimachal - Your Gateway to Himalayan Adventures",
          description:
            "Experience breathtaking mountains, sacred temples, thrilling adventures with our curated tour packages and reliable taxi services.",
          type: "website",
        },
      }
    }

    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["meta_title", "meta_description", "site_name"])

    if (error || !data || data.length === 0) {
      return {
        title: defaultMetadata.title,
        description: defaultMetadata.description,
        ...siteMetadataAssets,
        keywords:
          "Himachal Pradesh tours, Manali packages, Shimla travel, taxi service Himachal, spiritual tours, honeymoon packages, adventure trekking",
        openGraph: {
          title: "TourToHimachal - Your Gateway to Himalayan Adventures",
          description:
            "Experience breathtaking mountains, sacred temples, thrilling adventures with our curated tour packages and reliable taxi services.",
          type: "website",
        },
      }
    }

    // Extract meta_title and meta_description from settings
    const settingsMap: Record<string, string> = {}
    data.forEach((row: { key: string; value: any }) => {
      settingsMap[row.key] = row.value
    })

    const metaTitle = settingsMap.meta_title || defaultMetadata.title
    const metaDescription = settingsMap.meta_description || defaultMetadata.description

    return {
      title: metaTitle,
      description: metaDescription,
      ...siteMetadataAssets,
      keywords:
        "Himachal Pradesh tours, Manali packages, Shimla travel, taxi service Himachal, spiritual tours, honeymoon packages, adventure trekking",
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: "website",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: defaultMetadata.title,
      description: defaultMetadata.description,
      ...siteMetadataAssets,
      keywords:
        "Himachal Pradesh tours, Manali packages, Shimla travel, taxi service Himachal, spiritual tours, honeymoon packages, adventure trekking",
      openGraph: {
        title: "TourToHimachal - Your Gateway to Himalayan Adventures",
        description:
          "Experience breathtaking mountains, sacred temples, thrilling adventures with our curated tour packages and reliable taxi services.",
        type: "website",
      },
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <SettingsProvider>{children}</SettingsProvider>
        <Analytics />
        <ScrollToTop />
      </body>
    </html>
  )
}
