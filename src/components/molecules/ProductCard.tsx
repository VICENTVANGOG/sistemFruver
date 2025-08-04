"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-transform duration-200 hover:scale-105 bg-slate-800 border border-slate-700 rounded-lg"
      onClick={() => onClick(product)}
    >
      <CardContent className="p-4 text-center">
        <div className="relative mb-3">
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="w-20 h-20 mx-auto object-cover rounded-full border border-slate-600 shadow-md"
          />
          {product.stock < 10 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md">
              Bajo stock
            </Badge>
          )}
        </div>

        <h3 className="text-sm font-semibold text-slate-200 mb-1 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-base font-bold text-purple-400 mb-1">
          ${product.price.toLocaleString()}
        </p>

        <p className="text-xs text-slate-400 font-semibold">
          Stock disponible: {product.stock}
        </p>
      </CardContent>
    </Card>
  )
}
