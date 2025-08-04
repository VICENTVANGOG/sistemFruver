"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, X } from "lucide-react"
import type { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-purple-700 rounded-lg p-3">
      {/* Fila superior: Imagen, nombre y botón eliminar */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <img
            src={item.product.image || "/placeholder.svg"}
            alt={item.product.name}
            className="w-9 h-9 object-cover rounded flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">{item.product.name}</h3>
            <p className="text-sm text-slate-300">${item.product.price.toLocaleString()}</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRemove(item.product.id)}
          className="w-7 h-7 p-0 bg-red-500/20 hover:bg-red-500/30 border-red-400/50 flex-shrink-0"
        >
          <X className="h-3 w-3 text-red-300" />
        </Button>
      </div>

      {/* Fila inferior: Controles de cantidad y total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            className="w-7 h-7 p-0 bg-red-500/20 hover:bg-red-500/30 border-red-400/50"
          >
            <Minus className="h-3 w-3 text-red-300" />
          </Button>

          <div className="flex items-center justify-center w-9">
            <span className="text-sm font-medium text-white">{item.quantity}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            className="w-7 h-7 p-0 bg-green-500/20 hover:bg-green-500/30 border-green-400/50"
          >
            <Plus className="h-3 w-3 text-green-300" />
          </Button>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-purple-300">
            ${(item.product.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
