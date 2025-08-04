"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import type { ReactNode } from "react"

interface POSLayoutProps {
  onBack: () => void
  children: ReactNode
}

export const POSLayout = ({ onBack, children }: POSLayoutProps) => {
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Configurar para zona horaria de Colombia (UTC-5)
      const colombiaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }))
      const timeString = colombiaTime.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      setCurrentTime(timeString)
    }

    // Actualizar inmediatamente
    updateTime()

    // Actualizar cada segundo
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="text-slate-200 hover:bg-slate-700/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-slate-200">Ventas</h1>
          </div>
          <div className="text-sm text-slate-300 font-medium">{currentTime}</div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-80px)]">{children}</div>
    </div>
  )
}
