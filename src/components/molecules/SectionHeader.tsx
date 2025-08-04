"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BackButton } from "@/components/atoms/BackButton"
import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  title: string
  icon: LucideIcon
  iconColor: string
  onBack: () => void
  onAdd?: () => void
  addButtonText?: string
}

export const SectionHeader = ({ title, icon: Icon, iconColor, onBack, onAdd, addButtonText }: SectionHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <BackButton onClick={onBack} />
            <div className="flex items-center space-x-3">
              <Icon className={`h-6 w-6 ${iconColor}`} />
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
          </div>
          {onAdd && addButtonText && (
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
