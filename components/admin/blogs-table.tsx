"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Edit, Trash2, Eye, MoreHorizontal, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { format } from "date-fns"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  category?: string
  is_published: boolean
  created_at: string
  published_at?: string
}

interface BlogsTableProps {
  blogs: Blog[]
}

export function BlogsTable({ blogs }: BlogsTableProps) {
  const router = useRouter()

  const togglePublished = async (id: string, currentValue: boolean) => {
    const supabase = createClient()
    const updateData: { is_published: boolean; published_at?: string | null } = {
      is_published: !currentValue,
    }
    if (!currentValue) {
      updateData.published_at = new Date().toISOString()
    }

    const { error } = await supabase.from("blogs").update(updateData).eq("id", id)

    if (error) {
      toast.error("Failed to update blog")
    } else {
      toast.success(`Blog ${!currentValue ? "published" : "unpublished"}`)
      router.refresh()
    }
  }

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    const supabase = createClient()
    const { error } = await supabase.from("blogs").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete blog")
    } else {
      toast.success("Blog deleted successfully")
      router.refresh()
    }
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No blogs yet</h3>
        <p className="text-muted-foreground mb-4">Write your first blog post to get started.</p>
        <Button asChild>
          <Link href="/admin/blogs/new">Write Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{blog.title}</p>
                    <p className="text-xs text-muted-foreground truncate">/{blog.slug}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/blog/${blog.slug}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/blogs/${blog.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteBlog(blog.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs">
                    {blog.category || "Uncategorized"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{format(new Date(blog.created_at), "MMM d, yyyy")}</p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={blog.is_published}
                      onCheckedChange={() => togglePublished(blog.id, blog.is_published)}
                    />
                    <span className="text-sm text-muted-foreground">{blog.is_published ? "Published" : "Draft"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-background border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog, index) => (
              <motion.tr
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{blog.title}</p>
                    <p className="text-sm text-muted-foreground">/{blog.slug}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{blog.category || "Uncategorized"}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={blog.is_published}
                      onCheckedChange={() => togglePublished(blog.id, blog.is_published)}
                    />
                    <span className="text-sm text-muted-foreground">{blog.is_published ? "Published" : "Draft"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(blog.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/blog/${blog.slug}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/blogs/${blog.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteBlog(blog.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
