"use client"
import { useState } from "react"
import type { SectionType } from "@/types"
import { MainMenuPage } from "@/components/pages/MainMenuPage"
import SalesPage from "@/app/(main)/(private)/dashboard/sales/page"; // Importación nombrada
import ClientsPage from "@/app/(main)/(private)/dashboard/clients/page"
import { ComprasPage } from "@/components/pages/ComprasPage"
import InventoryPage from "../inventari/page";

export default function StoreDashboard() {
  const [currentSection, setCurrentSection] = useState<SectionType | null>(null)

  const handleSectionSelect = (section: SectionType) => {
    setCurrentSection(section)
  }

  const handleBack = () => {
    setCurrentSection(null)
  }

  const renderSection = () => {
    switch (currentSection) {
      case "ventas":
        return <SalesPage onBack={handleBack} />
      case "compras":
        return <ComprasPage onBack={handleBack} />
      case "clientes":
        return <ClientsPage onBack={handleBack} />
      case "inventario":
        return <InventoryPage onBack={handleBack} />
      case "caja":
        return <div>Caja - En desarrollo</div>
      case "reportes":
        return <div>Reportes - En desarrollo</div>
      default:
        return <MainMenuPage onSectionSelect={handleSectionSelect} />
    }
  }

  return renderSection()
}
