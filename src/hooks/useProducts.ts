import { useState, useEffect } from "react"
import { getProductsFromFirestore } from "@/constants/products"
import { Product } from "@/types"
import { doc, updateDoc, deleteDoc, addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Función para actualizar el stock en Firestore
const updateProductStockInFirestore = async (productId: string, newStock: number) => {
  const productRef = doc(db, "productos", productId)  // Referencia al producto en Firestore

  try {
    await updateDoc(productRef, {
      stock: newStock,  // Actualizamos el stock
    })
    console.log("Stock actualizado correctamente en Firestore")
  } catch (error) {
    console.error("Error al actualizar el stock en Firestore:", error)
  }
}

// Función para crear un nuevo producto en Firestore
const createProductInFirestore = async (product: Product) => {
  const productCollection = collection(db, "productos")
  try {
    await addDoc(productCollection, product)  // Agregamos el producto a Firestore
    console.log("Producto creado correctamente en Firestore")
  } catch (error) {
    console.error("Error al crear el producto en Firestore:", error)
  }
}

// Función para eliminar un producto en Firestore
const deleteProductInFirestore = async (productId: string) => {
  const productRef = doc(db, "productos", productId)  // Referencia al producto en Firestore

  try {
    await deleteDoc(productRef)  // Eliminamos el producto de Firestore
    console.log("Producto eliminado correctamente en Firestore")
  } catch (error) {
    console.error("Error al eliminar el producto en Firestore:", error)
  }
}

const useProducts = () => {
  // Estado para los productos filtrados
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Estado para la búsqueda y categoría seleccionada
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // Función para actualizar el estado de los productos
  const setProducts = (products: Product[]) => {
    setFilteredProducts(products)
  }

  // Función para actualizar el stock de un producto
  const handleProductUpdate = async (updatedProduct: Product) => {
    // Actualizamos el estado de los productos en el filtro
    const updatedProducts = filteredProducts.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    )
    setProducts(updatedProducts)

    // Actualizamos el stock en Firestore
    await updateProductStockInFirestore(updatedProduct.id, updatedProduct.stock)
  }

  // Función para crear un producto
  const handleProductCreate = async (newProduct: Product) => {
    // Crear el nuevo producto en Firestore
    await createProductInFirestore(newProduct)

    // Actualizar el estado de los productos con el nuevo producto creado
    setProducts([...filteredProducts, newProduct])
  }

  // Función para eliminar un producto
  const handleProductDelete = async (productId: string) => {
    // Eliminar el producto en Firestore
    await deleteProductInFirestore(productId)

    // Filtrar el producto eliminado de la lista de productos
    const updatedProducts = filteredProducts.filter((product) => product.id !== productId)
    setProducts(updatedProducts)
  }

  // Cargar los productos desde Firestore
  useEffect(() => {
    const loadProducts = async () => {
      const products = await getProductsFromFirestore()
      setFilteredProducts(products)  // Guardamos los productos obtenidos en el estado
    }

    loadProducts()
  }, [])

  return {
    filteredProducts,
    setProducts,  // Proveemos la función setProducts
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    handleProductUpdate,  // Proveemos la función para actualizar el producto
    handleProductCreate,  // Proveemos la función para crear un producto
    handleProductDelete,  // Proveemos la función para eliminar un producto
  }
}

export default useProducts
