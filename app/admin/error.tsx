"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <AlertTriangle className="text-destructive mb-4 h-16 w-16" />
      <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        An error occurred while loading this page. Please try again or contact support if the problem
        persists.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}
