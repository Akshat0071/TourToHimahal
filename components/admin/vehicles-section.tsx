"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Car } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CloudinaryUploadWidget, UploadedImagePreview, type CloudinaryUploadResult } from "./cloudinary-upload-widget"
import { registerMedia } from "@/lib/admin/media-client"

interface Vehicle {
  id: string
  name: string
  type: string
  capacity: number
  luggage_capacity?: number
  features?: string[]
  per_km_rate?: number
  image_url?: string
  is_available: boolean
}

interface VehiclesSectionProps {
  vehicles: Vehicle[]
}

export function VehiclesSection({ vehicles }: VehiclesSectionProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: 4,
    luggage_capacity: 2,
    features: "",
    image_url: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      capacity: 4,
      luggage_capacity: 2,
      features: "",
      image_url: "",
    })
    setEditingVehicle(null)
  }

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      luggage_capacity: vehicle.luggage_capacity || 2,
      features: vehicle.features?.join(", ") || "",
      image_url: vehicle.image_url || "",
    })
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    const supabase = createClient()

    const data = {
      ...formData,
      capacity: Number(formData.capacity),
      luggage_capacity: Number(formData.luggage_capacity),
      features: formData.features
        .split(",")
        .map((f: string) => f.trim())
        .filter((f: string) => f.length > 0),
    }

    let error

    if (editingVehicle) {
      const result = await supabase.from("vehicles").update(data).eq("id", editingVehicle.id)
      error = result.error
    } else {
      const result = await supabase.from("vehicles").insert(data)
      error = result.error
    }

    if (error) {
      toast.error("Failed to save vehicle")
    } else {
      toast.success(`Vehicle ${editingVehicle ? "updated" : "added"} successfully`)
      setIsOpen(false)
      resetForm()
      router.refresh()
    }
  }

  const toggleAvailability = async (id: string, currentValue: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from("vehicles").update({ is_available: !currentValue }).eq("id", id)

    if (error) {
      toast.error("Failed to update vehicle")
    } else {
      toast.success(`Vehicle ${!currentValue ? "enabled" : "disabled"}`)
      router.refresh()
    }
  }

  const deleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return

    const supabase = createClient()
    const { error } = await supabase.from("vehicles").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete vehicle")
    } else {
      toast.success("Vehicle deleted successfully")
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 md:p-6">
        <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-lg">
          <Car className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="truncate">Vehicles</span>
        </CardTitle>
        <Dialog
          modal={false}
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs sm:text-sm shrink-0">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Add Vehicle</span>
              <span className="xs:hidden">Add Vehicle</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs sm:text-sm">Vehicle Name</Label>
                  <Input
                    id="name"
                    className="text-base sm:text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Swift Dzire"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs sm:text-sm">Type</Label>
                  <Input
                    id="type"
                    className="text-base sm:text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                    placeholder="e.g., sedan, suv"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-xs sm:text-sm">Passenger Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    className="text-base sm:text-sm"
                    value={formData.capacity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, capacity: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="luggage" className="text-xs sm:text-sm">Luggage Capacity</Label>
                  <Input
                    id="luggage"
                    type="number"
                    min="0"
                    className="text-base sm:text-sm"
                    value={formData.luggage_capacity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, luggage_capacity: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features" className="text-xs sm:text-sm">Features (comma separated)</Label>
                <Input
                  id="features"
                  className="text-base sm:text-sm"
                  value={formData.features}
                  onChange={(e) => setFormData((prev) => ({ ...prev, features: e.target.value }))}
                  placeholder="e.g., AC, Music System, Sunroof, WiFi"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Vehicle Image</Label>
                {formData.image_url ? (
                  <div className="space-y-2">
                    <UploadedImagePreview
                      imageUrl={formData.image_url}
                      onRemove={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                      alt={formData.name}
                    />
                  </div>
                ) : (
                  <CloudinaryUploadWidget
                    onUploadSuccess={async (result: CloudinaryUploadResult) => {
                      const url = result.secure_url
                      setFormData((prev) => ({ ...prev, image_url: url }))

                      const registered = await registerMedia({
                        url,
                        public_id: result.public_id,
                        folder: "vehicles",
                        name: result.original_filename,
                        alt_text: result.original_filename,
                        size: result.bytes,
                        format: result.format,
                        resource_type: result.resource_type,
                      })

                      if (!registered.ok) {
                        toast.error(registered.error)
                        return
                      }

                      // If editing an existing vehicle, persist immediately for clarity
                      if (editingVehicle?.id) {
                        const supabase = createClient()
                        const { error } = await supabase
                          .from("vehicles")
                          .update({ image_url: url })
                          .eq("id", editingVehicle.id)

                        if (error) {
                          toast.error("Image uploaded, but failed to save. Please try Update.")
                        } else {
                          toast.success("Image uploaded and saved.")
                        }
                      } else {
                        toast.success("Image uploaded. Click Add to save.")
                      }
                    }}
                    onUploadError={(error) => {
                      console.error("Upload failed:", error)
                      toast.error("Failed to upload image")
                    }}
                    folder="himachal-yatra/vehicles"
                    maxFiles={1}
                    acceptedFormats={["jpg", "jpeg", "png", "webp"]}
                    buttonText="Upload Vehicle Image"
                    buttonVariant="outline"
                  />
                )}
              </div>

              <div className="flex flex-col xs:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full xs:w-auto text-xs sm:text-sm">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="w-full xs:w-auto text-xs sm:text-sm">{editingVehicle ? "Update" : "Add"} Vehicle</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        {vehicles.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <Car className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-muted-foreground">No vehicles added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 sm:p-4 border border-border rounded-xl"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div>
                    <h4 className="font-medium text-xs sm:text-sm text-foreground">{vehicle.name}</h4>
                    <Badge variant="outline" className="mt-1 text-[10px] sm:text-xs">
                      {vehicle.type}
                    </Badge>
                  </div>
                  <Switch
                    checked={vehicle.is_available}
                    onCheckedChange={() => toggleAvailability(vehicle.id, vehicle.is_available)}
                    className="scale-90 sm:scale-100"
                  />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <p>
                    {vehicle.capacity} passengers • {vehicle.luggage_capacity || 0} bags
                  </p>
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vehicle.features.slice(0, 3).map((feature, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-1 h-5">
                          {feature}
                        </Badge>
                      ))}
                      {vehicle.features.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{vehicle.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-2 sm:mt-3">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(vehicle)} className="h-8 px-2 sm:h-9 sm:px-3">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteVehicle(vehicle.id)} className="h-8 px-2 sm:h-9 sm:px-3">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card >
  )
}
