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
        }
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Folder className="w-5 h-5 text-muted-foreground" />
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

        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="w-full xs:w-auto">
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto">
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
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported: JPG, PNG, WebP, GIF, PDF (Max 50MB)
                  </p>
                </div>

                <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)} className="w-full xs:w-auto">
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredMedia.length === 0 ? (
        <div className="bg-background border border-border rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No media yet</h3>
          <p className="text-muted-foreground mb-4">Upload images and documents to use across your site.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-muted">
                    {item.type === "image" ? (
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.alt_text || item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/broken-image.png"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyUrl(item.id, item.url)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => deleteMedia(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <p className="text-xs sm:text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground capitalize truncate">{item.folder}</p>
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
