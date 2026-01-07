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

  const LogoContent = () => (
    <div className={cn("group flex items-center", className)}>
      {/* Full Logo Image container */}
      <Image
        src="/Images/logot.webp"
        alt="TourToHimachal Logo"
        width={560}
        height={160}
        className={cn(sizes[size], "w-auto transition-all duration-300")}
        priority
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
