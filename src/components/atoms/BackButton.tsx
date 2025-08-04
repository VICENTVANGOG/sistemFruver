"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  onClick: () => void
  variant?: "default" | "ghost"
  className?: string
}

export const BackButton = ({ onClick, variant = "ghost", className = "" }: BackButtonProps) => {
  return (
    <Button variant={variant} onClick={onClick} className={className}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Volver
    </Button>
  )
}
