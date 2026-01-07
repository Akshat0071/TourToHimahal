import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-lg shadow-destructive/25",
        outline:
          "border-2 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/50 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        saffron:
          "bg-saffron text-white hover:bg-saffron/90 shadow-lg shadow-saffron/30 hover:shadow-xl hover:shadow-saffron/40",
        green:
          "bg-forest-green text-white hover:bg-forest-green/90 shadow-lg shadow-forest-green/30 hover:shadow-xl hover:shadow-forest-green/40",
        blue: "bg-mountain-blue text-white hover:bg-mountain-blue/90 shadow-lg shadow-mountain-blue/30 hover:shadow-xl hover:shadow-mountain-blue/40",
        golden:
          "bg-golden-yellow text-foreground hover:bg-golden-yellow/90 shadow-lg shadow-golden-yellow/30",
        gradient:
          "bg-gradient-to-r from-saffron via-sunset-orange to-temple-red text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-full",
        sm: "h-9 gap-1.5 px-4 rounded-full text-xs",
        lg: "h-12 px-8 rounded-full text-base",
        xl: "h-14 px-10 rounded-full text-lg",
        icon: "size-10 rounded-full",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
