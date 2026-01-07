"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Plus,
  Package,
  FileText,
  ImageIcon,
  Settings,
  Car,
  Route,
  BookOpen,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const actions = [
  {
    id: "package",
    href: "/admin/packages/new",
    label: "Add Package",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "blog",
    href: "/admin/blogs/new",
    label: "Write Blog",
    icon: FileText,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "diary",
    href: "/admin/diaries/new",
    label: "Add Diary",
    icon: BookOpen,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "vehicle",
    href: "/admin/taxi",
    label: "Add Vehicle",
    icon: Car,
    color: "bg-orange-100 text-orange-600",
  },
  { id: "route", href: "/admin/taxi", label: "Add Route", icon: Route, color: "bg-cyan-100 text-cyan-600" },
  {
    id: "review",
    href: "/admin/reviews/new",
    label: "Add Review",
    icon: MessageSquare,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "media",
    href: "/admin/media",
    label: "Upload Media",
    icon: ImageIcon,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "settings",
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    color: "bg-purple-100 text-purple-600",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={action.href}
              className="hover:bg-muted group xs:w-auto flex w-full items-center gap-2 rounded-lg p-1.5 transition-colors sm:gap-3"
            >
              <div
                className={`h-9 w-9 rounded-lg sm:h-10 sm:w-10 ${action.color} flex shrink-0 items-center justify-center`}
              >
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-foreground group-hover:text-primary truncate text-xs font-medium transition-colors sm:text-sm">
                {action.label}
              </span>
              <Plus className="text-muted-foreground group-hover:text-primary ml-auto h-3 w-3 shrink-0 transition-colors sm:h-4 sm:w-4" />
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
