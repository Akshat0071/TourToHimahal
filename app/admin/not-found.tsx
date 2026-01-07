import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function AdminNotFound() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <FileQuestion className="text-muted-foreground mb-4 h-16 w-16" />
      <h1 className="mb-2 text-2xl font-bold">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/admin/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
