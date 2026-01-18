"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  href?: string | null
  onClick?: () => void
}

export function Logo({
  className,
  size = "md",
  href = "/",
  onClick,
}: LogoProps) {
  const sizes = {
    sm: "h-10 md:h-12",
    md: "h-12 md:h-16",
    lg: "h-16 md:h-20",
  }

  const responsiveSizes = {
    sm: "(min-width: 768px) 168px, 140px",
    md: "(min-width: 768px) 224px, 168px",
    lg: "(min-width: 768px) 280px, 224px",
  }

  // Use optimized dimensions based on actual display size
  const dimensions = {
    sm: { width: 140, height: 40 },
    md: { width: 224, height: 64 },
    lg: { width: 280, height: 80 },
  }

  const LogoContent = () => (
    <div className={cn("group flex items-center", className)}>
      {/* Full Logo Image container */}
      <Image
        src="/Images/logot.webp"
        alt="TourToHimachal Logo"
        width={dimensions[size].width}
        height={dimensions[size].height}
        className={cn(sizes[size], "w-auto transition-all duration-300")}
        sizes={responsiveSizes[size]}
        quality={85}
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} onClick={onClick}>
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
