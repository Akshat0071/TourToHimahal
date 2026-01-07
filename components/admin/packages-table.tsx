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
    const nextIsActive = !currentValue
    const updateData = nextIsActive ? { is_active: true } : { is_active: false, is_featured: false }

    const { error } = await supabase.from("packages").update(updateData).eq("id", id)

    if (error) {
      toast.error("Failed to update package")
    } else {
      toast.success(`Package ${!currentValue ? "activated" : "deactivated"}`)
      router.refresh()
    }
  }

  const toggleFeatured = async (id: string, currentValue: boolean, isActive: boolean) => {
    if (!isActive && !currentValue) {
      toast.error("Activate the package before featuring it")
      return
    }

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
      <div className="bg-background border-border rounded-xl border p-12 text-center">
        <PackageIcon className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="text-foreground mb-2 text-lg font-medium">No packages yet</h3>
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
                    <p className="text-foreground truncate font-medium">{pkg.title}</p>
                    <p className="text-muted-foreground truncate text-xs">/{pkg.slug}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/packages/${pkg.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deletePackage(pkg.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="border-border rounded-lg border p-2">
                    <p className="text-muted-foreground text-[11px]">Price</p>
                    <p className="font-medium">₹{pkg.price.toLocaleString()}</p>
                    {pkg.original_price && (
                      <p className="text-muted-foreground text-[11px] line-through">
                        ₹{pkg.original_price.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="border-border rounded-lg border p-2">
                    <p className="text-muted-foreground text-[11px]">Duration</p>
                    <p className="truncate font-medium">{pkg.duration}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <Badge variant="outline" className="truncate text-xs">
                    {pkg.category || "General"}
                  </Badge>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Active</span>
                      <Switch
                        checked={pkg.is_active}
                        onCheckedChange={() => toggleActive(pkg.id, pkg.is_active)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Featured</span>
                      <Switch
                        checked={pkg.is_featured}
                        disabled={!pkg.is_active}
                        onCheckedChange={() => toggleFeatured(pkg.id, pkg.is_featured, pkg.is_active)}
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
      <div className="bg-background border-border hidden overflow-x-auto rounded-xl border md:block">
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
                className="border-border hover:bg-muted/50 border-b transition-colors"
              >
                <TableCell className="text-xs sm:text-sm">
                  <div>
                    <p className="text-foreground truncate font-medium">{pkg.title}</p>
                    <p className="text-muted-foreground truncate text-[10px] sm:text-xs">/{pkg.slug}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <div>
                    <p className="font-medium">₹{pkg.price.toLocaleString()}</p>
                    {pkg.original_price && (
                      <p className="text-muted-foreground text-[10px] line-through sm:text-xs">
                        ₹{pkg.original_price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs whitespace-nowrap sm:text-sm">{pkg.duration}</TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    {pkg.category || "General"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={pkg.is_active}
                    onCheckedChange={() => toggleActive(pkg.id, pkg.is_active)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={pkg.is_featured}
                    disabled={!pkg.is_active}
                    onCheckedChange={() => toggleFeatured(pkg.id, pkg.is_featured, pkg.is_active)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/packages/${pkg.slug}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deletePackage(pkg.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
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
