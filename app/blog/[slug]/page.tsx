import { notFound } from "next/navigation"
import { createPublicClient } from "@/lib/supabase/public"
import { BlogDetailClient } from "./blog-detail-client"

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 0 // Always fetch fresh data

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const supabase = createPublicClient()

  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | TourToHimachal Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.gallery && post.gallery.length > 0 ? post.gallery : post.cover_image ? [post.cover_image] : [],
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const supabase = createPublicClient()

  const { data: post, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !post) {
    notFound()
  }

  // Fetch related posts from the same category or with similar tags
  const { data: relatedPosts } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .or(`category.eq.${post.category},tags.cs.{${post.tags?.join(",") || ""}}`)
    .neq("slug", slug)
    .limit(3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image || "",
    datePublished: post.published_at,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "TouToHimachal",
    },
  }

  const blogUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${slug}`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogDetailClient post={post} relatedPosts={relatedPosts || []} url={blogUrl} />
    </>
  )
}
