"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LeadsFiltersProps {
  currentStatus?: string
  currentType?: string
}

export function LeadsFilters({ currentStatus = "all", currentType = "all" }: LeadsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/admin/leads?${params.toString()}`)
  }

  const handleExport = () => {
    // Create CSV export
    const params = new URLSearchParams(searchParams.toString())
    window.open(`/api/admin/leads/export?${params.toString()}`, "_blank")
  }

  return (
    <div className="bg-background border-border flex flex-col gap-3 rounded-xl border p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <Filter className="text-muted-foreground h-5 w-5 shrink-0" />
        <span className="text-foreground text-xs font-medium sm:text-sm">Filters:</span>
        {/* Mobile: Export button aligned with filter label */}
        <Button
          variant="outline"
          onClick={handleExport}
          className="ml-auto gap-2 bg-transparent text-xs whitespace-nowrap sm:hidden sm:text-sm"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Controls row: All Status | All Types | Export CSV on one line with spacing */}
      <div className="flex flex-row flex-wrap items-center gap-2">
        <Select value={currentStatus} onValueChange={(value) => updateFilter("status", value)}>
          <SelectTrigger className="w-36 text-xs sm:text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentType} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="w-36 text-xs sm:text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="package">Package</SelectItem>
            <SelectItem value="taxi">Taxi</SelectItem>
            <SelectItem value="enquiry">Enquiry</SelectItem>
          </SelectContent>
        </Select>

        {/* Desktop/Tablet: Export button on controls row, right-aligned */}
        <Button
          variant="outline"
          onClick={handleExport}
          className="ml-auto hidden gap-2 bg-transparent text-xs whitespace-nowrap sm:inline-flex sm:text-sm"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>
    </div>
  )
}
