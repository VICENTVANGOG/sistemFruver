"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/atoms/SearchInput"
import { ProductCard } from "@/components/molecules/ProductCard"
import type { Product } from "@/types"
import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { ArrowLeft } from "lucide-react"

interface ComprasPageProps {
  onBack: () => void
}

export const ComprasPage = ({ onBack }: ComprasPageProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Cargar productos de Firestore
  const fetchProducts = async () => {
    setLoading(true)
    const querySnapshot = await getDocs(collection(db, "productos"))
    const productsData = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Product[]
    setProducts(productsData)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Comprar producto
  const handleBuyProduct = async (product: Product) => {
    if (product.stock > 0) {
      try {
        // 1️⃣ Registrar la compra
        await addDoc(collection(db, "compras"), {
          productoId: product.id,
          nombre: product.name,
          precio: product.price,
          cantidad: 1,
          fecha: serverTimestamp(),
        })

        // 2️⃣ Actualizar stock
        const productRef = doc(db, "productos", product.id)
        await updateDoc(productRef, { stock: product.stock - 1 })

        // 3️⃣ Refrescar lista
        fetchProducts()
      } catch (error) {
        console.error("Error al registrar la compra:", error)
      }
    } else {
      alert("No hay suficiente stock para realizar esta compra.")
    }
  }

  // Filtrar por búsqueda
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col p-4">
      {/* Botón volver */}
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-4 flex items-center gap-2 border-purple-600 text-purple-300 hover:bg-purple-800/30"
      >
        <ArrowLeft size={18} /> Volver
      </Button>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar producto..."
          className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500 py-2 text-sm rounded-lg"
        />
      </div>

      {/* Grid de productos */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-400">Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-400">No hay productos disponibles</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleBuyProduct(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
