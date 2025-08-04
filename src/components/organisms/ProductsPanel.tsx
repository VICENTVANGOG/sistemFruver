"use client"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/atoms/SearchInput"
import { ProductCard } from "@/components/molecules/ProductCard"
import type { Product } from "@/types"

interface ProductsPanelProps {
  products: Product[] // Lista de productos
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onProductClick: (product: Product) => void
  onProductUpdate: (productId: string, stock: number) => void // Nueva función para actualizar cantidad
}

export const ProductsPanel = ({
  products,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onProductClick,
  onProductUpdate, // Recibimos la función para actualizar el inventario
}: ProductsPanelProps) => {

  const handleBuyProduct = (product: Product) => {
    // Validamos que el stock sea mayor a 0 antes de permitir la compra
    if (product.stock > 0) {
      // Reducimos el stock en el inventario
      onProductUpdate(product.id, product.stock - 1)  // Reducir el stock en 1
      // Realizar cualquier acción adicional como agregar al carrito
      onProductClick(product)
    } else {
      alert("No hay suficiente stock para realizar esta compra.")
    }
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500 py-2 text-sm rounded-lg"
        />
      </div>

      {/* Botón de categorías */}
      <div className="mb-4 flex justify-center">
        <Button
          variant={selectedCategory === "favoritos" ? "default" : "outline"}
          onClick={() => onCategoryChange("favoritos")}
          className={`text-white font-semibold text-sm py-2 px-4 rounded-lg transition-all duration-200
            ${
              selectedCategory === "favoritos"
                ? "bg-purple-600 hover:bg-purple-700 border-purple-600 shadow-lg"
                : "border-purple-600 hover:bg-purple-800/30 text-purple-300 hover:text-white"
            }`}
        >
          Mis favoritos
        </Button>
      </div>

      {/* Grid de productos con scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleBuyProduct(product)}  // Llamamos a handleBuyProduct al hacer clic en el producto
            />
          ))}
        </div>
      </div>
    </div>
  )
}
