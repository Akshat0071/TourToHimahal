"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MoreHorizontal, Eye, Trash2, Inbox } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
      <div className="bg-background border-border rounded-xl border p-12 text-center">
        <Inbox className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
        <h3 className="text-foreground mb-2 text-lg font-medium">No leads found</h3>
        <p className="text-muted-foreground">When customers submit inquiries, they will appear here.</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {leads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card>
              <CardContent className="space-y-3 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs">Reference</p>
                    <code className="bg-muted inline-block rounded px-2 py-1 text-xs break-all">
                      {lead.reference_number}
                    </code>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteLead(lead.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="min-w-0">
                  <p className="text-foreground truncate font-medium">{lead.name}</p>
                  <p className="text-muted-foreground truncate text-xs">{lead.subject}</p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:bg-muted rounded-md p-1.5 transition-colors"
                      title={lead.email}
                    >
                      <Mail className="text-muted-foreground h-4 w-4" />
                    </a>
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:bg-muted rounded-md p-1.5 transition-colors"
                      title={lead.phone}
                    >
                      <Phone className="text-muted-foreground h-4 w-4" />
                    </a>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Hi ${lead.name}, thank you for contacting TourToHimachal!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-[#25D366]/10 p-1.5 transition-colors hover:bg-[#25D366]/20"
                      title="WhatsApp"
                    >
                      <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    </a>
                  </div>

                  <p className="text-muted-foreground text-xs whitespace-nowrap">
                    {format(new Date(lead.created_at), "MMM d")}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs">
                    {serviceLabels[lead.service_type] || lead.service_type}
                  </Badge>

                  <Select
                    value={lead.status}
                    onValueChange={(value) => updateLeadStatus(lead.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className={`h-9 w-32 text-xs ${statusColors[lead.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
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
              <TableHead className="text-xs sm:text-sm">Reference ID</TableHead>
              <TableHead className="text-xs sm:text-sm">Customer</TableHead>
              <TableHead className="text-xs sm:text-sm">Contact</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Type</TableHead>
              <TableHead className="text-center text-xs sm:text-sm">Status</TableHead>
              <TableHead className="text-center text-xs whitespace-nowrap sm:text-sm">Date</TableHead>
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
                className="border-border hover:bg-muted/50 border-b transition-colors"
              >
                <TableCell className="text-[10px] sm:text-xs">
                  <code className="bg-muted rounded px-1 py-0.5 sm:px-2 sm:py-1">
                    {lead.reference_number}
                  </code>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <div>
                    <p className="text-foreground truncate font-medium">{lead.name}</p>
                    <p className="text-muted-foreground max-w-30 truncate text-[10px] sm:max-w-50 sm:text-xs">
                      {lead.subject}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:bg-muted shrink-0 rounded-md p-1 transition-colors sm:p-1.5"
                      title={lead.email}
                    >
                      <Mail className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:bg-muted shrink-0 rounded-md p-1 transition-colors sm:p-1.5"
                      title={lead.phone}
                    >
                      <Phone className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
                    </a>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Hi ${lead.name}, thank you for contacting TourToHimachal!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-md bg-[#25D366]/10 p-1 transition-colors hover:bg-[#25D366]/20 sm:p-1.5"
                      title="WhatsApp"
                    >
                      <WhatsAppIcon className="h-3 w-3 text-[#25D366] sm:h-4 sm:w-4" />
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    {serviceLabels[lead.service_type] || lead.service_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm">
                  <Select
                    value={lead.status}
                    onValueChange={(value) => updateLeadStatus(lead.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger
                      className={`mx-auto h-7 w-24 text-[10px] sm:h-8 sm:w-28 sm:text-xs ${statusColors[lead.status]}`}
                    >
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
                <TableCell className="text-muted-foreground text-center text-[10px] whitespace-nowrap sm:text-sm">
                  {format(new Date(lead.created_at), "MMM d")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteLead(lead.id)}>
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

      {/* Lead Details Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto sm:w-full">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>Reference: {selectedLead?.reference_number}</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Name</p>
                  <p className="text-sm font-medium sm:text-base">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Email</p>
                  <p className="text-xs font-medium break-all sm:text-base">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Phone</p>
                  <p className="text-sm font-medium sm:text-base">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm">Service Type</p>
                  <p className="text-sm font-medium capitalize sm:text-base">{selectedLead.service_type}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Subject</p>
                <p className="text-sm font-medium sm:text-base">{selectedLead.subject}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Message</p>
                <p className="text-foreground bg-muted rounded-lg p-2 text-xs whitespace-pre-wrap sm:p-3 sm:text-sm">
                  {selectedLead.message}
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                <Button asChild className="flex-1 bg-[#25D366] text-sm hover:bg-[#25D366]/90">
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/\D/g, "")}?text=Hi ${selectedLead.name}, thank you for contacting TourToHimachal regarding your ${selectedLead.service_type} inquiry!`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex-1 bg-transparent text-sm">
                  <a href={`mailto:${selectedLead.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
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
