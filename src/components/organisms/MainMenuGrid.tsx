"use client"

import { MENU_ITEMS } from "@/constants/menuItems"
import { MenuCard } from "@/components/molecules/MenuCard"
import type { SectionType } from "@/types"

interface MainMenuGridProps {
  onSectionSelect: (section: SectionType) => void
}

export const MainMenuGrid = ({ onSectionSelect }: MainMenuGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MENU_ITEMS.map((item) => (
        <MenuCard
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
          color={item.color}
          onClick={() => onSectionSelect(item.id)}
        />
      ))}
    </div>
  )
}
