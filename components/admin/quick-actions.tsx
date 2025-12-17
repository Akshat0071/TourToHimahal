"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Package, FileText, ImageIcon, Settings, Car, Route, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const actions = [
  { id: "package", href: "/admin/packages/new", label: "Add Package", icon: Package, color: "bg-blue-100 text-blue-600" },
  { id: "blog", href: "/admin/blogs/new", label: "Write Blog", icon: FileText, color: "bg-green-100 text-green-600" },
  { id: "diary", href: "/admin/diaries/new", label: "Add Diary", icon: BookOpen, color: "bg-pink-100 text-pink-600" },
  { id: "vehicle", href: "/admin/taxi", label: "Add Vehicle", icon: Car, color: "bg-orange-100 text-orange-600" },
  { id: "route", href: "/admin/taxi", label: "Add Route", icon: Route, color: "bg-cyan-100 text-cyan-600" },
  { id: "media", href: "/admin/media", label: "Upload Media", icon: ImageIcon, color: "bg-amber-100 text-amber-600" },
  { id: "settings", href: "/admin/settings", label: "Settings", icon: Settings, color: "bg-purple-100 text-purple-600" },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={action.href}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-muted transition-colors group w-full xs:w-auto"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-medium text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
                {action.label}
              </span>
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
