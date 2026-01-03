"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Edit, Trash2, Eye, MoreHorizontal, PackageIcon } from "lucide-react"
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

interface Package {
  id: string
  title: string
  slug: string
  price: number
  original_price?: number
  duration: string
  category?: string
  is_active: boolean
  is_featured: boolean
  created_at: string
}

interface PackagesTableProps {
  packages: Package[]
}

export function PackagesTable({ packages }: PackagesTableProps) {
  const router = useRouter()

  const toggleActive = async (id: string, currentValue: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from("packages").update({ is_active: !currentValue }).eq("id", id)

    if (error) {
      toast.error("Failed to update package")
    } else {
      toast.success(`Package ${!currentValue ? "activated" : "deactivated"}`)
      router.refresh()
    }
  }

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from("packages").update({ is_featured: !currentValue }).eq("id", id)

    if (error) {
      toast.error("Failed to update package")
    } else {
      toast.success(`Package ${!currentValue ? "featured" : "unfeatured"}`)
      router.refresh()
    }
  }

  const deletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return

    const supabase = createClient()
    const { error } = await supabase.from("packages").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete package")
    } else {
      toast.success("Package deleted successfully")
      router.refresh()
    }
  }

  if (packages.length === 0) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <PackageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No packages yet</h3>
        <p className="text-muted-foreground mb-4">Create your first tour package to get started.</p>
        <Button asChild>
          <Link href="/admin/packages/new">Create Package</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{pkg.title}</p>
                    <p className="text-xs text-muted-foreground truncate">/{pkg.slug}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/packages/${pkg.slug}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deletePackage(pkg.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border border-border p-2">
                    <p className="text-[11px] text-muted-foreground">Price</p>
                    <p className="font-medium">₹{pkg.price.toLocaleString()}</p>
                    {pkg.original_price && (
                      <p className="text-[11px] text-muted-foreground line-through">₹{pkg.original_price.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="rounded-lg border border-border p-2">
                    <p className="text-[11px] text-muted-foreground">Duration</p>
                    <p className="font-medium truncate">{pkg.duration}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <Badge variant="outline" className="text-xs truncate">
                    {pkg.category || "General"}
                  </Badge>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <Switch checked={pkg.is_active} onCheckedChange={() => toggleActive(pkg.id, pkg.is_active)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Featured</span>
                      <Switch
                        checked={pkg.is_featured}
                        onCheckedChange={() => toggleFeatured(pkg.id, pkg.is_featured)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-background border border-border rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Package</TableHead>
              <TableHead className="text-xs sm:text-sm">Price</TableHead>
              <TableHead className="text-xs sm:text-sm">Duration</TableHead>
              <TableHead className="text-xs sm:text-sm">Categories</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Active</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Featured</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg, index) => (
              <motion.tr
                key={pkg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-xs sm:text-sm">
                  <div>
                    <p className="font-medium text-foreground truncate">{pkg.title}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">/{pkg.slug}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <div>
                    <p className="font-medium">₹{pkg.price.toLocaleString()}</p>
                    {pkg.original_price && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-through">₹{pkg.original_price.toLocaleString()}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm whitespace-nowrap">{pkg.duration}</TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">{pkg.category || "General"}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={pkg.is_active} onCheckedChange={() => toggleActive(pkg.id, pkg.is_active)} />
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={pkg.is_featured} onCheckedChange={() => toggleFeatured(pkg.id, pkg.is_featured)} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/packages/${pkg.slug}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deletePackage(pkg.id)}>
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
