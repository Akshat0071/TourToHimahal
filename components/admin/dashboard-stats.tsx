"use client"

import { motion } from "framer-motion"
import { Users, UserPlus, Package, Car, TrendingUp, MapPin, FileText, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  stats: {
    totalLeads: number
    newToday: number
    packageEnquiries: number
    taxiEnquiries: number
    activePackages: number
    activeVehicles: number
    activeRoutes: number
    activeBlogs: number
    activeDiaries: number
  }
}

const statCards = [
  {
    key: "totalLeads",
    label: "Total Leads",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    key: "newToday",
    label: "New Today",
    icon: UserPlus,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    key: "packageEnquiries",
    label: "Package Enquiries",
    icon: Package,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    key: "taxiEnquiries",
    label: "Taxi Enquiries",
    icon: Car,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    key: "activePackages",
    label: "Active Packages",
    icon: Package,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  {
    key: "activeVehicles",
    label: "Active Vehicles",
    icon: Car,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    key: "activeRoutes",
    label: "Active Routes",
    icon: MapPin,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    key: "activeBlogs",
    label: "Active Blogs",
    icon: FileText,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  {
    key: "activeDiaries",
    label: "Active Diaries",
    icon: BookOpen,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
]

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{stats[stat.key as keyof typeof stats]}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: stat.color.replace('text-', '') }} />
                </div>
              </div>
              {stat.key === "newToday" && stats.newToday > 0 && (
                <div className="flex items-center gap-1 mt-2 sm:mt-3 text-xs sm:text-sm text-green-600">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Active inquiries</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
