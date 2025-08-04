import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Edit, Trash2, Users } from "lucide-react"
import useProducts from "@/hooks/useProducts"
import { Product } from "@/types"

// Modal de edición
const Modal = ({ onClose, children }: { onClose: () => void, children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 rounded-lg w-1/3">
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-300">X</button>
        {children}
      </div>
    </div>
  )
}

interface InventoryPageProps {
  onBack: () => void;  // Propiedad onBack para regresar
}

export default function InventoryPage({ onBack }: InventoryPageProps) {
  const { filteredProducts, searchTerm, setSearchTerm, handleProductUpdate, handleProductDelete } = useProducts()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Función para manejar el regreso a la página anterior
  const handleGoBack = () => {
    onBack()
  }

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("es-CO", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  // Barra de búsqueda
  useEffect(() => {
    // Actualización de productos al modificar el término de búsqueda
  }, [searchTerm])

  // Función para abrir el modal de edición
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProduct(null)
  }

  // Función para manejar la actualización del producto
  const handleUpdateProduct = (updatedProduct: Product) => {
    if (updatedProduct) {
      handleProductUpdate(updatedProduct) // Pasamos el producto completo a la función
      handleCloseEditModal()
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4 pt-4">
        <div className="flex items-center space-x-4">
          <Button onClick={handleGoBack} variant="ghost" className="text-slate-200 hover:bg-slate-800/50 p-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-200">Inventario de Productos</h1>
            <p className="text-slate-400 text-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="px-4 mb-6">
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardContent className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, categoría o precio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-3">
            <Users className="h-7 w-7 text-slate-500 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-slate-200 mb-1">
              {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-300 font-medium">Producto</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Categoría</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Precio</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Stock</th>
                  <th className="text-right p-4 text-slate-300 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer`}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {product.name ? product.name.charAt(0).toUpperCase() : ''}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-200">{product.category || "Sin categoría"}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-200">${formatCurrency(product.price)}</p>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium">
                        {product.stock}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditProduct(product) // Abre el modal de edición
                          }}
                          className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/50 text-blue-300"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleProductDelete(product.id)  // Eliminar el producto, pasamos solo el id
                          }}
                          className="bg-red-500/20 hover:bg-red-500/30 border-red-400/50 text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de edición de producto */}
      {isEditModalOpen && editingProduct && (
        <Modal onClose={handleCloseEditModal}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Editar Producto</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdateProduct(editingProduct) // Pasamos el producto actualizado
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block text-slate-300">Nombre</label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-slate-300">Categoría</label>
                <Input
                  id="category"
                  value={editingProduct.category || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block text-slate-300">Precio</label>
                <Input
                  id="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="stock" className="block text-slate-300">Stock</label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white mt-4">
                Guardar cambios
              </Button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}
