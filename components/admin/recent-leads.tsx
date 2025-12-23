"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MessageCircle, ArrowRight, Inbox } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service_type: string
  status: string
  created_at: string
  reference_number: string
}

interface RecentLeadsProps {
  leads: Lead[]
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  booked: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
}

const serviceLabels: Record<string, string> = {
  package: "Package",
  taxi: "Taxi",
  enquiry: "Enquiry",
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg truncate">Recent Leads</CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm shrink-0">
          <Link href="/admin/leads" className="gap-1">
            <span className="hidden xs:inline">View All</span>
            <span className="xs:hidden">View</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-2 ">
        {leads.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <Inbox className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-muted-foreground">No leads yet</p>
            <p className="text-xs text-muted-foreground">New inquiries will appear here</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-medium text-xs sm:text-sm text-foreground truncate">{lead.name}</p>
                    <Badge variant="outline" className={`${statusColors[lead.status]} text-[10px] sm:text-xs`}>
                      {lead.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                    <span>{serviceLabels[lead.service_type] || lead.service_type}</span>
                    <span>•</span>
                    <span suppressHydrationWarning>
                      {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Hi ${lead.name}, thank you for contacting TourToHimachal!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#25D366]/90 transition-colors shrink-0"
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
