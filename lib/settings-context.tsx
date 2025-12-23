"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

export interface SiteSettings {
  id?: string
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

const defaultSettings: SiteSettings = {
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

interface SettingsContextType {
  settings: SiteSettings | null
  loading: boolean
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const supabase = createBrowserClient()
      if (!supabase) {
        setSettings(defaultSettings)
        return
      }

      const { data, error } = await supabase.from("settings").select("key, value")

      if (error) {
        console.error("Error fetching settings:", error)
        setSettings(defaultSettings)
        return
      }

      if (data && data.length > 0) {
        // Convert key-value pairs to settings object
        const settingsObj = { ...defaultSettings }
        data.forEach((row: { key: string; value: any }) => {
          if (row.key in settingsObj) {
            ;(settingsObj as any)[row.key] = row.value
          }
        })
        setSettings(settingsObj)
      } else {
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error("Error in fetchSettings:", error)
      setSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
