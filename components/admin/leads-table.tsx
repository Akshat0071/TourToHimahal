"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Mail, Phone, MoreHorizontal, Eye, Trash2, Inbox } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  service_type: string
  status: string
  created_at: string
  reference_number: string
  file_url?: string
}

interface LeadsTableProps {
  leads: Lead[]
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  booked: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

const serviceLabels: Record<string, string> = {
  package: "Package",
  taxi: "Taxi",
  enquiry: "Enquiry",
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setIsUpdating(true)
    const supabase = createClient()

    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId)

    if (error) {
      toast.error("Failed to update status")
    } else {
      toast.success(`Status updated to ${newStatus}`)
      router.refresh()
    }
    setIsUpdating(false)
  }

  const deleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return

    const supabase = createClient()
    const { error } = await supabase.from("leads").delete().eq("id", leadId)

    if (error) {
      toast.error("Failed to delete lead")
    } else {
      toast.success("Lead deleted successfully")
      router.refresh()
    }
  }

  if (leads.length === 0) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <Inbox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No leads found</h3>
        <p className="text-muted-foreground">When customers submit inquiries, they will appear here.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-background border border-border rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Customer</TableHead>
              <TableHead className="text-xs sm:text-sm">Contact</TableHead>
              <TableHead className="text-xs sm:text-sm">Type</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
              <TableHead className="text-xs sm:text-sm">Date</TableHead>
              <TableHead className="hidden md:table-head text-xs sm:text-sm">Reference</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-xs sm:text-sm">
                  <div>
                    <p className="font-medium text-foreground truncate">{lead.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-30 sm:max-w-50">{lead.subject}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <a
                      href={`mailto:${lead.email}`}
                      className="p-1 sm:p-1.5 rounded-md hover:bg-muted transition-colors shrink-0"
                      title={lead.email}
                    >
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    </a>
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-1 sm:p-1.5 rounded-md hover:bg-muted transition-colors shrink-0"
                      title={lead.phone}
                    >
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    </a>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Hi ${lead.name}, thank you for contacting TourToHimachal!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 sm:p-1.5 rounded-md bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors shrink-0"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#25D366]" />
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">{serviceLabels[lead.service_type] || lead.service_type}</Badge>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <Select
                    value={lead.status}
                    onValueChange={(value) => updateLeadStatus(lead.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className={`w-24 sm:w-28 h-7 sm:h-8 text-[10px] sm:text-xs ${statusColors[lead.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-[10px] sm:text-sm text-muted-foreground whitespace-nowrap">
                  {format(new Date(lead.created_at), "MMM d")}
                </TableCell>
                <TableCell className="hidden md:table-cell text-[10px] sm:text-xs">
                  <code className="bg-muted px-1 sm:px-2 py-0.5 sm:py-1 rounded">{lead.reference_number}</code>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteLead(lead.id)}>
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

      {/* Lead Details Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>Reference: {selectedLead?.reference_number}</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-sm sm:text-base">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-xs sm:text-base break-all">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm sm:text-base">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium text-sm sm:text-base capitalize">{selectedLead.service_type}</p>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Subject</p>
                <p className="font-medium text-sm sm:text-base">{selectedLead.subject}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Message</p>
                <p className="text-foreground whitespace-pre-wrap bg-muted p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
                  {selectedLead.message}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button asChild className="bg-[#25D366] hover:bg-[#25D366]/90 text-sm flex-1">
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/\D/g, "")}?text=Hi ${selectedLead.name}, thank you for contacting TourToHimachal regarding your ${selectedLead.service_type} inquiry!`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" asChild className="text-sm flex-1 bg-transparent">
                  <a href={`mailto:${selectedLead.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
