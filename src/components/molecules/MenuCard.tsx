"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MenuCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: string
  onClick: () => void
}

export const MenuCard = ({ title, description, icon: Icon, color, onClick }: MenuCardProps) => {
  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105" onClick={onClick}>
      <CardContent className="p-8 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${color} text-white mb-4`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}
