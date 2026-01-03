"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Edit, Trash2, MoreHorizontal, Star, MessageSquare } from "lucide-react"
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

interface Review {
    id: string
    name: string
    rating: number
    review_text: string
    is_approved: boolean
    created_at: string
    city?: string
    phone?: string
}

interface ReviewsTableProps {
    reviews: Review[]
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
    const router = useRouter()

    const toggleApproved = async (id: string, currentValue: boolean) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("reviews")
            .update({ is_approved: !currentValue })
            .eq("id", id)

        if (error) {
            toast.error("Failed to update review status")
        } else {
            toast.success(`Review ${!currentValue ? "approved" : "unapproved"}`)
            router.refresh()
        }
    }

    const deleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return

        const supabase = createClient()
        const { error } = await supabase.from("reviews").delete().eq("id", id)

        if (error) {
            toast.error("Failed to delete review")
        } else {
            toast.success("Review deleted successfully")
            router.refresh()
        }
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-background border border-border rounded-xl p-12 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">Reviews submitted by customers will appear here.</p>
                <Button asChild>
                    <Link href="/admin/reviews/new">Add Manual Review</Link>
                </Button>
            </div>
        )
    }

    return (
        <>
            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <Card>
                            <CardContent className="p-3 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-medium text-foreground truncate">{review.name}</p>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                            {review.city && <span className="truncate">{review.city}</span>}
                                            {review.phone && <span className="truncate">{review.phone}</span>}
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/reviews/${review.id}`}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onClick={() => deleteReview(review.id)}>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex text-golden-yellow" aria-label={`Rating ${review.rating} out of 5`}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-muted-foreground/30"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                                        {format(new Date(review.created_at), "MMM d, yyyy")}
                                    </p>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-3" title={review.review_text}>
                                    {review.review_text}
                                </p>

                                <div className="flex items-center justify-end gap-2 min-w-0">
                                    <Switch
                                        checked={review.is_approved}
                                        onCheckedChange={() => toggleApproved(review.id, review.is_approved)}
                                    />
                                    <Badge
                                        variant={review.is_approved ? "default" : "secondary"}
                                        className="whitespace-nowrap"
                                    >
                                        {review.is_approved ? "Approved" : "Pending"}
                                    </Badge>
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
                            <TableHead>Customer</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="w-100">Review</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((review, index) => (
                            <motion.tr
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="border-b border-border hover:bg-muted/50 transition-colors"
                            >
                                <TableCell>
                                    <div>
                                        <p className="font-medium text-foreground">{review.name}</p>
                                        {review.city && <p className="text-sm text-muted-foreground">{review.city}</p>}
                                        {review.phone && <p className="text-xs text-muted-foreground">{review.phone}</p>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex text-golden-yellow">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-muted-foreground/30"}`}
                                            />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm text-muted-foreground line-clamp-2" title={review.review_text}>
                                        {review.review_text}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                        <Switch
                                            checked={review.is_approved}
                                            onCheckedChange={() => toggleApproved(review.id, review.is_approved)}
                                        />
                                        <Badge variant={review.is_approved ? "default" : "secondary"}>
                                            {review.is_approved ? "Approved" : "Pending"}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {format(new Date(review.created_at), "MMM d, yyyy")}
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
                                                <Link href={`/admin/reviews/${review.id}`}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onClick={() => deleteReview(review.id)}>
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
