"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Route {
  id: string
  from_location: string
  to_location: string
  distance_km?: number
  estimated_time?: string
  base_fare?: number
  is_active: boolean
}

interface RoutesSectionProps {
  routes: Route[]
}

export function RoutesSection({ routes }: RoutesSectionProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    distance_km: 0,
    estimated_time: "",
    base_fare: 0,
  })

  const resetForm = () => {
    setFormData({
      from_location: "",
      to_location: "",
      distance_km: 0,
      estimated_time: "",
      base_fare: 0,
    })
    setEditingRoute(null)
  }

  const openEdit = (route: Route) => {
    setEditingRoute(route)
    setFormData({
      from_location: route.from_location,
      to_location: route.to_location,
      distance_km: route.distance_km || 0,
      estimated_time: route.estimated_time || "",
      base_fare: route.base_fare || 0,
    })
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    const supabase = createClient()

    const data = {
      ...formData,
      distance_km: Number(formData.distance_km),
      base_fare: Number(formData.base_fare),
    }

    let error

    if (editingRoute) {
      const result = await supabase.from("taxi_routes").update(data).eq("id", editingRoute.id)
      error = result.error
    } else {
      const result = await supabase.from("taxi_routes").insert(data)
      error = result.error
    }

    if (error) {
      toast.error("Failed to save route")
    } else {
      toast.success(`Route ${editingRoute ? "updated" : "added"} successfully`)
      setIsOpen(false)
      resetForm()
      router.refresh()
    }
  }

  const toggleActive = async (id: string, currentValue: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from("taxi_routes").update({ is_active: !currentValue }).eq("id", id)

    if (error) {
      toast.error("Failed to update route")
    } else {
      toast.success(`Route ${!currentValue ? "enabled" : "disabled"}`)
      router.refresh()
    }
  }

  const deleteRoute = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return

    const supabase = createClient()
    const { error } = await supabase.from("taxi_routes").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete route")
    } else {
      toast.success("Route deleted successfully")
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 md:p-6">
        <CardTitle className="flex items-center gap-1 text-sm sm:gap-2 sm:text-base lg:text-lg">
          <MapPin className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          <span className="truncate">Routes</span>
        </CardTitle>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="shrink-0 text-xs sm:text-sm">
              <Plus className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="xs:inline hidden">Add Route</span>
              <span className="xs:hidden">Add Route</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto sm:w-full">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">
                {editingRoute ? "Edit Route" : "Add Route"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-xs sm:text-sm">
                    From
                  </Label>
                  <Input
                    id="from"
                    className="text-base sm:text-sm"
                    value={formData.from_location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, from_location: e.target.value }))}
                    placeholder="e.g., Chandigarh"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to" className="text-xs sm:text-sm">
                    To
                  </Label>
                  <Input
                    id="to"
                    className="text-base sm:text-sm"
                    value={formData.to_location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, to_location: e.target.value }))}
                    placeholder="e.g., Shimla"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance" className="text-xs sm:text-sm">
                    Distance (km)
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0"
                    className="text-base sm:text-sm"
                    value={formData.distance_km}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, distance_km: Number(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-xs sm:text-sm">
                    Estimated Time
                  </Label>
                  <Input
                    id="time"
                    className="text-base sm:text-sm"
                    value={formData.estimated_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, estimated_time: e.target.value }))}
                    placeholder="e.g., 4 hours"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fare" className="text-xs sm:text-sm">
                  Base Fare (₹)
                </Label>
                <Input
                  id="fare"
                  type="number"
                  min="0"
                  className="text-base sm:text-sm"
                  value={formData.base_fare}
                  onChange={(e) => setFormData((prev) => ({ ...prev, base_fare: Number(e.target.value) }))}
                />
              </div>
              <div className="xs:flex-row flex flex-col justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="xs:w-auto w-full text-xs sm:text-sm"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="xs:w-auto w-full text-xs sm:text-sm">
                  {editingRoute ? "Update" : "Add"} Route
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        {routes.length === 0 ? (
          <div className="py-6 text-center sm:py-8">
            <MapPin className="text-muted-foreground mx-auto mb-2 h-10 w-10 sm:mb-3 sm:h-12 sm:w-12" />
            <p className="text-muted-foreground text-xs sm:text-sm">No routes added yet</p>
          </div>
        ) : (
          <div className="border-border overflow-hidden overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Route</TableHead>
                  <TableHead className="hidden text-xs sm:text-sm md:table-cell">Distance</TableHead>
                  <TableHead className="hidden text-xs sm:table-cell sm:text-sm">Time</TableHead>
                  <TableHead className="text-xs sm:text-sm">Fare</TableHead>
                  <TableHead className="xs:table-cell hidden text-xs sm:text-sm">Active</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route, index) => (
                  <motion.tr
                    key={route.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-border border-b"
                  >
                    <TableCell className="text-xs font-medium sm:text-sm">
                      {route.from_location} → {route.to_location}
                    </TableCell>
                    <TableCell className="hidden text-xs sm:text-sm md:table-cell">
                      {route.distance_km} km
                    </TableCell>
                    <TableCell className="hidden text-xs sm:table-cell sm:text-sm">
                      {route.estimated_time}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">₹{route.base_fare?.toLocaleString()}</TableCell>
                    <TableCell className="xs:table-cell hidden">
                      <Switch
                        checked={route.is_active}
                        onCheckedChange={() => toggleActive(route.id, route.is_active)}
                        className="scale-90 sm:scale-100"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={() => openEdit(route)}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={() => deleteRoute(route.id)}
                      >
                        <Trash2 className="text-destructive h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
