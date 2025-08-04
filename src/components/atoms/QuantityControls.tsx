"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface QuantityControlsProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  disabled?: boolean
}

export const QuantityControls = ({ quantity, onIncrease, onDecrease, disabled = false }: QuantityControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onDecrease}
        disabled={disabled}
        className="w-8 h-8 p-0 bg-red-100 hover:bg-red-200 border-red-300"
      >
        <Minus className="h-3 w-3 text-red-600" />
      </Button>

      <span className="w-8 text-center font-medium">{quantity}</span>

      <Button
        size="sm"
        variant="outline"
        onClick={onIncrease}
        disabled={disabled}
        className="w-8 h-8 p-0 bg-green-100 hover:bg-green-200 border-green-300"
      >
        <Plus className="h-3 w-3 text-green-600" />
      </Button>
    </div>
  )
}
