"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Edit, Trash2, Eye, MoreHorizontal, BookOpen } from "lucide-react"
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

interface Diary {
  id: string
  title: string
  slug: string
  author_name: string
  destination?: string
  is_published: boolean
  created_at: string
}

interface DiariesTableProps {
  diaries: Diary[]
}

export function DiariesTable({ diaries }: DiariesTableProps) {
  const router = useRouter()

  const togglePublished = async (id: string, currentValue: boolean) => {
    const supabase = createClient()
    const updateData: { is_published: boolean; published_at?: string | null } = {
      is_published: !currentValue,
    }
    if (!currentValue) {
      updateData.published_at = new Date().toISOString()
    }

    const { error } = await supabase.from("diaries").update(updateData).eq("id", id)

    if (error) {
      toast.error("Failed to update diary")
    } else {
      toast.success(`Diary ${!currentValue ? "published" : "unpublished"}`)
      router.refresh()
    }
  }

  const deleteDiary = async (id: string) => {
    if (!confirm("Are you sure you want to delete this diary?")) return

    const supabase = createClient()
    const { error } = await supabase.from("diaries").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete diary")
    } else {
      toast.success("Diary deleted successfully")
      router.refresh()
    }
  }

  if (diaries.length === 0) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No travel diaries yet</h3>
        <p className="text-muted-foreground mb-4">Add traveler stories and experiences.</p>
        <Button asChild>
          <Link href="/admin/diaries/new">Add Diary</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {diaries.map((diary, index) => (
          <motion.div
            key={diary.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{diary.title}</p>
                    <p className="text-xs text-muted-foreground truncate">/{diary.slug}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/diaries/${diary.slug}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/diaries/${diary.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteDiary(diary.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-muted-foreground">Author</span>
                    <span className="text-sm font-medium truncate">{diary.author_name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(diary.created_at), "MMM d, yyyy")}</p>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <Badge variant="outline" className="text-xs truncate w-fit max-w-full">
                    {diary.destination || "Various"}
                  </Badge>

                  <div className="flex items-center justify-end gap-2 min-w-0">
                    <Switch
                      checked={diary.is_published}
                      onCheckedChange={() => togglePublished(diary.id, diary.is_published)}
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {diary.is_published ? "Published" : "Draft"}
                    </span>
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
              <TableHead>Author</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diaries.map((diary, index) => (
              <motion.tr
                key={diary.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{diary.title}</p>
                    <p className="text-sm text-muted-foreground">/{diary.slug}</p>
                  </div>
                </TableCell>
                <TableCell>{diary.author_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{diary.destination || "Various"}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Switch
                      checked={diary.is_published}
                      onCheckedChange={() => togglePublished(diary.id, diary.is_published)}
                    />
                    <span className="text-sm text-muted-foreground">{diary.is_published ? "Published" : "Draft"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(diary.created_at), "MMM d, yyyy")}
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
                        <Link href={`/diaries/${diary.slug}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/diaries/${diary.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteDiary(diary.id)}>
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
