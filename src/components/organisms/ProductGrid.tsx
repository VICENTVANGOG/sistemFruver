"use client"

import type { Product } from "@/types"
import { ProductCard } from "@/components/molecules/ProductCard"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export const ProductGrid = ({ products, onProductClick }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={onProductClick} />
      ))}
    </div>
  )
}
