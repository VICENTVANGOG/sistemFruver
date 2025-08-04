"use client"

import { POSLayout } from "@/components/templates/POSLayout"
import { ProductsPanel } from "@/components/organisms/ProductsPanel"
import { CartPanel } from "@/components/organisms/CartPanel"
import { CheckoutPanel } from "@/components/organisms/CheckoutPanel"
import { useCart } from "@/hooks/useCart"
import useProducts from "@/hooks/useProducts"
import { Product } from "@/types"

interface SalesPageProps {
  onBack: () => void
}

const SalesPage = ({ onBack }: SalesPageProps) => {
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    discount, 
    shipping, 
    total,
    updateDiscount,
    updateShipping
  } = useCart()
  
  const { 
    filteredProducts, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory, 
    setProducts 
  } = useProducts()

  // Función para actualizar el stock de un producto
  const handleProductUpdate = (productId: string, newStock: number) => {
    const updatedProducts = filteredProducts.map((product) =>
      product.id === productId ? { ...product, stock: newStock } : product
    )
    setProducts(updatedProducts)
  }

  // Función para manejar cambios en descuento
  const handleDiscountChange = (newDiscount: number) => {
    updateDiscount(newDiscount)
  }

  // Función para manejar cambios en envío
  const handleShippingChange = (newShipping: number) => {
    updateShipping(newShipping)
  }

  return (
    <POSLayout onBack={onBack}>
      <div className="flex w-full h-full gap-4 p-4">
        {/* Panel de Productos - 40% del ancho */}
        <div className="w-2/5 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg border border-slate-700">
          <ProductsPanel
            products={filteredProducts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onProductClick={addToCart}
            onProductUpdate={handleProductUpdate}
          />
        </div>

        {/* Panel del Carrito - 30% del ancho */}
        <div
          className="w-3/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg border border-slate-700 p-4"
          style={{ width: "30%" }}
        >
          <CartPanel 
            cart={cart} 
            onUpdateQuantity={updateQuantity} 
            onRemoveItem={removeFromCart} 
          />
        </div>

        {/* Panel de Checkout - 30% del ancho */}
        <div
          className="w-3/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg border border-slate-700"
          style={{ width: "30%" }}
        >
          <CheckoutPanel
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
            hasItems={cart.length > 0}
            cart={cart}
            onClearCart={clearCart}
            onDiscountChange={handleDiscountChange}
            onShippingChange={handleShippingChange}
          />
        </div>
      </div>
    </POSLayout>
  )
}

export default SalesPage