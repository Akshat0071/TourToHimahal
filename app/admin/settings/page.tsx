"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Clock,
  Shield,
  Bell,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

interface Settings {
  site_name: string
  contact_email: string
  contact_phone: string
  whatsapp_number: string
  address: string
  google_maps_embed: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  youtube_url: string
  business_hours: string
  about_text: string
  meta_title: string
  meta_description: string
  maintenance_mode: boolean
}

const defaultSettings: Settings = {
  site_name: "TourToHimachal",
  contact_email: "info@tourtohimachal.com",
  contact_phone: "+91 98765 43210",
  whatsapp_number: "+919876543210",
  address: "Near Temple Complex, Chintpurni, HP 177106",
  google_maps_embed: "",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  youtube_url: "",
  business_hours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM",
  about_text:
    "Your trusted partner for exploring the majestic Himachal Pradesh. From spiritual journeys to adventure trips, we make your travel dreams come true.",
  meta_title: "TourToHimachal - Tours, Travel Packages & Taxi Services",
  meta_description:
    "Discover the magic of Himachal Pradesh with our curated tour packages, reliable taxi services, and personalized travel experiences.",
  maintenance_mode: false,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      if (!supabase) {
        setSettings(defaultSettings)
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from("settings").select("key, value")

      if (error) {
        console.error("Error fetching settings:", error)
        setSettings(defaultSettings)
        setLoading(false)
        return
      }

      if (data && data.length > 0) {
        const settingsObj = { ...defaultSettings }
        data.forEach((row: { key: string; value: any }) => {
          if (row.key in settingsObj) {
            // Handle JSON values
            const value = typeof row.value === "string" ? row.value : row.value
            ;(settingsObj as any)[row.key] = value
          }
        })
        setSettings(settingsObj)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (!supabase) {
        toast.error("Database connection not available")
        return
      }

      // Save each setting as a separate key-value pair
      const settingsEntries = Object.entries(settings)

      for (const [key, value] of settingsEntries) {
        const { error } = await supabase.from("settings").upsert(
          {
            key,
            value: value,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "key",
          },
        )

        if (error) {
          console.error(`Error saving setting ${key}:`, error)
          throw error
        }
      }

      toast.success("Settings saved successfully! Changes will reflect across the website.")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your website configuration. Changes will reflect on the header, footer, and contact pages.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="general" className="text-xs sm:text-sm">
            General
          </TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">
            Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs sm:text-sm">
            Social Media
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm">
            SEO
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs sm:text-sm">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Basic information about your travel business (shown in header & footer)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => updateSetting("site_name", e.target.value)}
                    placeholder="TourToHimachal"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_text">About Text (shown in footer)</Label>
                <Textarea
                  id="about_text"
                  value={settings.about_text}
                  onChange={(e) => updateSetting("about_text", e.target.value)}
                  placeholder="Brief description about your business..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_hours" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Business Hours (shown on contact page)
                </Label>
                <Input
                  id="business_hours"
                  value={settings.business_hours}
                  onChange={(e) => updateSetting("business_hours", e.target.value)}
                  placeholder="Mon-Sat: 9AM-7PM, Sun: 10AM-5PM"
                />
                <p className="text-xs text-muted-foreground">Format: "Day-Day: Time - Time, Day: Time - Time"</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Details
              </CardTitle>
              <CardDescription>How customers can reach you (shown in header, footer, and contact page)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => updateSetting("contact_email", e.target.value)}
                    placeholder="info@tourtohimachal.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone}
                    onChange={(e) => updateSetting("contact_phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Number
                </Label>
                <Input
                  id="whatsapp_number"
                  value={settings.whatsapp_number}
                  onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
                  placeholder="+919876543210"
                />
                <p className="text-xs text-muted-foreground">
                  Include country code without spaces (e.g., +919876543210). Used for "Book Now" buttons.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Business Address
                </Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateSetting("address", e.target.value)}
                  placeholder="Your full business address"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_maps_embed">Google Maps Embed URL</Label>
                <Input
                  id="google_maps_embed"
                  value={settings.google_maps_embed}
                  onChange={(e) => updateSetting("google_maps_embed", e.target.value)}
                  placeholder="https://www.google.com/maps/embed?..."
                />
                <p className="text-xs text-muted-foreground">
                  Paste the embed URL from Google Maps (Share → Embed a map)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>Connect your social media profiles (shown in footer)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook_url"
                    value={settings.facebook_url}
                    onChange={(e) => updateSetting("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram_url"
                    value={settings.instagram_url}
                    onChange={(e) => updateSetting("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_url" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter_url"
                    value={settings.twitter_url}
                    onChange={(e) => updateSetting("twitter_url", e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube_url" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube_url"
                    value={settings.youtube_url}
                    onChange={(e) => updateSetting("youtube_url", e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO Settings
              </CardTitle>
              <CardDescription>Optimize your site for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Default Meta Title</Label>
                <Input
                  id="meta_title"
                  value={settings.meta_title}
                  onChange={(e) => updateSetting("meta_title", e.target.value)}
                  placeholder="TourToHimachal - Tours, Travel & Taxi Services"
                />
                <p className="text-xs text-muted-foreground">{settings.meta_title.length}/60 characters recommended</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Default Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={settings.meta_description}
                  onChange={(e) => updateSetting("meta_description", e.target.value)}
                  placeholder="A brief description of your website..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {settings.meta_description.length}/160 characters recommended
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>System configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show a maintenance page to visitors while you make updates
                  </p>
                </div>
                <Switch
                  id="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => updateSetting("maintenance_mode", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive email alerts for new lead submissions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions - proceed with caution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Clear All Leads</p>
                  <p className="text-sm text-muted-foreground">Permanently delete all contact form submissions</p>
                </div>
                <Button variant="destructive" size="sm">
                  Clear Leads
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
