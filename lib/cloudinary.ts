/**
 * Cloudinary Helper Utilities
 *
 * This file provides helper functions for working with Cloudinary images and files
 * in the Next.js application.
 */

function getCloudName(): string | undefined {
  return process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
}

/**
 * Build a Cloudinary image URL with transformations
 * @param publicId - The Cloudinary public ID (e.g., "himachal-yatra/blogs/cover-image")
 * @param transformations - Optional transformation parameters
 * @returns Full Cloudinary URL
 */
export function buildCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number
    height?: number
    crop?: "fill" | "fit" | "scale" | "crop" | "thumb" | "pad" | "limit"
    quality?: "auto" | "auto:good" | "auto:eco" | "auto:low" | number
    format?: "auto" | "webp" | "avif" | "jpg" | "png"
    gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west"
    aspectRatio?: string
    blur?: number
    sharpen?: boolean
    dpr?: number
  },
): string {
  const cloudName = getCloudName()

  if (!cloudName) {
    console.error("Cloudinary cloud name is not defined")
    return ""
  }

  // Build transformation string
  const transforms: string[] = []

  if (transformations?.width) transforms.push(`w_${transformations.width}`)
  if (transformations?.height) transforms.push(`h_${transformations.height}`)
  if (transformations?.crop) transforms.push(`c_${transformations.crop}`)
  if (transformations?.quality) transforms.push(`q_${transformations.quality}`)
  if (transformations?.format) transforms.push(`f_${transformations.format}`)
  if (transformations?.gravity) transforms.push(`g_${transformations.gravity}`)
  if (transformations?.aspectRatio) transforms.push(`ar_${transformations.aspectRatio}`)
  if (transformations?.blur) transforms.push(`e_blur:${transformations.blur}`)
  if (transformations?.sharpen) transforms.push("e_sharpen")
  if (transformations?.dpr) transforms.push(`dpr_${transformations.dpr}`)

  const transformString = transforms.length > 0 ? `${transforms.join(",")}/` : ""

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`
}

/**
 * Get optimized image URL with automatic format and quality
 * @param publicId - The Cloudinary public ID
 * @param width - Target width in pixels
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(publicId: string, width: number): string {
  return buildCloudinaryUrl(publicId, {
    width,
    quality: "auto",
    format: "auto",
    crop: "limit",
  })
}

/**
 * Get responsive image srcset for different screen sizes
 * @param publicId - The Cloudinary public ID
 * @param widths - Array of widths for responsive images
 * @returns srcset string for img tag
 */
export function getResponsiveSrcSet(
  publicId: string,
  widths: number[] = [640, 768, 1024, 1280, 1536],
): string {
  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(publicId, width)
      return `${url} ${width}w`
    })
    .join(", ")
}

/**
 * Get thumbnail URL for preview images
 * @param publicId - The Cloudinary public ID
 * @param size - Thumbnail size (default: 200)
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 200): string {
  return buildCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    format: "auto",
  })
}

/**
 * Get URL for a PDF file stored in Cloudinary
 * @param publicId - The Cloudinary public ID
 * @returns PDF URL
 */
export function getPdfUrl(publicId: string): string {
  const cloudName = getCloudName()

  if (!cloudName) {
    console.error("Cloudinary cloud name is not defined")
    return ""
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.pdf`
}

/**
 * Extract public ID from a full Cloudinary URL
 * @param url - Full Cloudinary URL
 * @returns Public ID or empty string
 */
export function extractPublicId(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/)
  return match ? match[1] : ""
}

/**
 * Check if a URL is a Cloudinary URL
 * @param url - URL to check
 * @returns true if Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com")
}

/**
 * Optimize an existing Cloudinary delivery URL (res.cloudinary.com) by injecting
 * transformations like f_auto and q_auto and an optional width.
 *
 * This is useful when you already have full URLs (including version folders)
 * rather than publicIds.
 */
export function optimizeCloudinaryDeliveryUrl(
  url: string,
  options?: {
    width?: number
    crop?: "limit" | "fill" | "fit" | "scale" | "crop" | "thumb" | "pad"
    quality?: "auto" | "auto:good" | "auto:eco" | "auto:low" | number
    format?: "auto" | "webp" | "avif" | "jpg" | "png"
    gravity?: "auto" | "center" | "north" | "south" | "east" | "west" | "face"
    dpr?: number
  },
): string {
  if (!url) return url
  if (!isCloudinaryUrl(url)) return url
  if (!url.includes("/image/upload/")) return url

  const width = options?.width
  const crop = options?.crop ?? (width ? "limit" : undefined)
  const quality = options?.quality ?? "auto:good"
  const format = options?.format ?? "auto"
  const gravity = options?.gravity
  const dpr = options?.dpr ?? 1.0

  const transforms: string[] = []
  if (format) transforms.push(`f_${format}`)
  if (quality) transforms.push(`q_${quality}`)
  if (width) transforms.push(`w_${width}`)
  if (crop) transforms.push(`c_${crop}`)
  if (gravity) transforms.push(`g_${gravity}`)
  if (dpr) transforms.push(`dpr_${dpr}`)

  const transformString = transforms.join(",")
  if (!transformString) return url

  const [prefix, rest] = url.split("/image/upload/")
  if (!rest) return url

  const restParts = rest.split("/")
  const first = restParts[0] ?? ""

  const looksLikeVersion = /^v\d+$/.test(first)
  const looksLikeTransform = first.includes(",") || /^([a-z]{1,2}_[^/]+)$/.test(first)

  // If URL already has a transform segment, prepend missing f_/q_ only if not present.
  if (looksLikeTransform && !looksLikeVersion) {
    const existing = first
    const existingParts = existing.split(",")
    const hasFormat = existingParts.some((p) => p.startsWith("f_"))
    const hasQuality = existingParts.some((p) => p.startsWith("q_"))
    const merged = [
      ...(hasFormat ? [] : ["f_auto"]),
      ...(hasQuality ? [] : ["q_auto"]),
      ...existingParts,
      ...(width ? [`w_${width}`] : []),
      ...(crop ? [`c_${crop}`] : []),
      ...(gravity ? [`g_${gravity}`] : []),
    ]
    restParts[0] = Array.from(new Set(merged)).join(",")
    return `${prefix}/image/upload/${restParts.join("/")}`
  }

  // Otherwise insert transform segment before the version or publicId
  return `${prefix}/image/upload/${transformString}/${rest}`
}

/**
 * Get a blurred placeholder image URL for lazy loading
 * @param publicId - The Cloudinary public ID
 * @returns Blurred placeholder URL
 */
export function getBlurredPlaceholder(publicId: string): string {
  return buildCloudinaryUrl(publicId, {
    width: 20,
    quality: 1,
    format: "auto",
    blur: 1000,
  })
}

/**
 * Configuration for Cloudinary Upload Widget
 * Use this in your admin components
 */
export const uploadWidgetConfig = {
  cloudName: getCloudName(),
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  sources: ["local", "url", "camera"],
  multiple: false,
  maxFiles: 1,
  clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif", "pdf"],
  maxFileSize: 10000000, // 10MB
  folder: "himachal-yatra",
  tags: ["website", "upload"],
  context: {
    alt: "Image from Himachal Yatra",
  },
  styles: {
    palette: {
      window: "#FFFFFF",
      windowBorder: "#90A0B3",
      tabIcon: "#0078FF",
      menuIcons: "#5A616A",
      textDark: "#000000",
      textLight: "#FFFFFF",
      link: "#0078FF",
      action: "#FF620C",
      inactiveTabIcon: "#0E2F5A",
      error: "#F44235",
      inProgress: "#0078FF",
      complete: "#20B832",
      sourceBg: "#E4EBF1",
    },
  },
}
