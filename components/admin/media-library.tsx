"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Upload, Trash2, Copy, ImageIcon, FileText, Check, Folder, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Media {
  id: string
  name: string
  url: string
  type: string
  size?: number
  folder?: string
  alt_text?: string
  created_at: string
}

interface MediaLibraryProps {
  media: Media[]
}

const folders = [
  { value: "general", label: "General" },
  { value: "packages", label: "Packages" },
  { value: "blogs", label: "Blogs" },
  { value: "diaries", label: "Diaries" },
  { value: "vehicles", label: "Vehicles" },
]

export function MediaLibrary({ media }: MediaLibraryProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFolder, setUploadFolder] = useState("general")

  const filteredMedia = filter === "all" ? media : media.filter((m) => m.folder === filter)

  const copyUrl = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success("URL copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteMedia = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        toast.error(data?.error || "Failed to delete media")
        return
      }

      toast.success("Media deleted successfully")
      router.refresh()
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete media")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB")
      return
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only images (JPG, PNG, WebP, GIF) and PDF files are allowed")
      return
    }

    setIsUploading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      formDataToSend.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formDataToSend,
        },
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      // Determine file type
      let fileType = "image"
      if (file.type === "application/pdf") {
        fileType = "pdf"
      }

      // Register into Media Library (server-side, cookie-authenticated)
      const registerRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name.replace(/\.[^/.]+$/, ""),
          url: data.secure_url,
          public_id: data.public_id,
          folder: uploadFolder,
          alt_text: file.name,
          size: data.bytes,
          format: data.format,
          resource_type: data.resource_type,
          mime_type: file.type,
          type: fileType,
        }),
      })

      const registerData = await registerRes.json().catch(() => null)

      if (!registerRes.ok) {
        toast.error(registerData?.error || "Failed to save media to database")
        return
      }

      toast.success("File uploaded successfully!")
      setIsUploadOpen(false)
      setUploadFolder("general")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      router.refresh()
    } catch (error) {
      toast.error("Upload failed. Please check your Cloudinary configuration.")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Folder className="text-muted-foreground h-5 w-5" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-35 sm:w-45">
              <SelectValue placeholder="All folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.value} value={folder.value}>
                  {folder.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="xs:flex-row flex w-full flex-col gap-2 sm:w-auto">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="xs:w-auto w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto sm:w-full">
              <DialogHeader>
                <DialogTitle>Upload Media to Cloudinary</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-folder">Folder</Label>
                  <Select value={uploadFolder} onValueChange={setUploadFolder}>
                    <SelectTrigger id="upload-folder">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((folder) => (
                        <SelectItem key={folder.value} value={folder.value}>
                          {folder.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Select File</Label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Button
                      className="w-full justify-center"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Supported: JPG, PNG, WebP, GIF, PDF (Max 50MB)
                  </p>
                </div>

                <div className="xs:flex-row flex flex-col-reverse justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadOpen(false)}
                    className="xs:w-auto w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredMedia.length === 0 ? (
        <div className="bg-background border-border rounded-xl border p-12 text-center">
          <ImageIcon className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="text-foreground mb-2 text-lg font-medium">No media yet</h3>
          <p className="text-muted-foreground mb-4">Upload images and documents to use across your site.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="group overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-muted relative aspect-square">
                    {item.type === "image" ? (
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.alt_text || item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/Images/logo.webp"
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FileText className="text-muted-foreground h-16 w-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyUrl(item.id, item.url)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => deleteMedia(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <p className="truncate text-xs font-medium sm:text-sm">{item.name}</p>
                    <p className="text-muted-foreground truncate text-[10px] capitalize sm:text-xs">
                      {item.folder}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
