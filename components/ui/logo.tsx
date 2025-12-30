"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
  isScrolled?: boolean
  href?: string | null
  onClick?: () => void
  forceColors?: boolean
}

export function Logo({
  className,
  size = "md",
  variant = "full",
  isScrolled = false,
  href = "/",
  onClick,
  forceColors = false,
}: LogoProps) {
  const sizes = {
    sm: { icon: "w-32 h-10 md:w-40 md:h-12", text: "text-base", tagline: "text-[9px]" },
    md: { icon: "w-40 h-12 md:w-56 md:h-16", text: "text-lg md:text-xl", tagline: "text-[10px] md:text-xs" },
    lg: { icon: "w-56 h-16 md:w-72 md:h-20", text: "text-xl md:text-2xl", tagline: "text-xs" },
  }

  const useColors = forceColors || isScrolled || true

  const LogoContent = () => (
    <div className={cn("flex items-center gap-2 md:gap-3 group", className)}>
      {/* Full Logo Image container */}
      <div
        className={cn(
          sizes[size].icon,
          "relative transition-all duration-300",
        )}
      >
        <Image
          src="/Images/logo1.webp.png"
          alt="TourToHimachal Logo"
          fill
          className="object-contain object-center"
          priority
        />
      </div>

      {/* Text hidden as it is included in the logo image
      {variant === "full" && (
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              sizes[size].text,
              "font-serif font-bold tracking-tight transition-colors",
              isScrolled ? "text-foreground" : "text-foreground",
            )}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-golden-yellow to-sunset-orange">
              Tour
            </span>
            <span className="text-mountain-blue">To</span>
            <span className="text-forest-green">Himachal</span>
          </span>
          <span className={cn(sizes[size].tagline, "font-medium tracking-[0.15em] uppercase text-saffron")}>
            Your Himalayan Journey
          </span>
        </div>
      )}
      */}
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
