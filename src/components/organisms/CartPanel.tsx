"use client"

import { useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { CartItem } from "@/components/molecules/CartItem"
import type { CartItem as CartItemType } from "@/types"

interface CartPanelProps {
  cart: CartItemType[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}

export const CartPanel = ({ cart, onUpdateQuantity, onRemoveItem }: CartPanelProps) => {
  // Guarda los detalles de la venta en localStorage cada vez que el carrito cambie
  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const discount = 0 // Puedes modificar esto para aplicar descuentos
    const shipping = 0 // Agrega lógica de envío si es necesario
    const total = subtotal - discount + shipping

    const saleDetails = {
      cart,
      subtotal,
      discount,
      shipping,
      total,
    }

    localStorage.setItem("saleDetails", JSON.stringify(saleDetails))
  }, [cart])

  return (
    <div className="h-full flex flex-col">
      {/* Header del carrito */}
      <div className="mb-3">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-purple-400" />
          <span className="truncate">Productos en Venta</span>
        </h2>
        {cart.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            {cart.length} {cart.length === 1 ? "producto" : "productos"}
          </p>
        )}
      </div>

      {/* Contenido del carrito */}
      <div className="flex-1 overflow-hidden">
        {cart.length > 0 ? (
          <div className="h-full overflow-y-auto pr-1 space-y-2">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-6">
            <div className="bg-slate-800/50 rounded-full p-4 mb-3">
              <ShoppingCart className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-sm font-medium text-white mb-2">No hay productos</h3>
            <p className="text-xs text-slate-400 px-2 leading-relaxed">Haz clic en un producto para agregarlo</p>
          </div>
        )}
      </div>
    </div>
  )
}
