// src/lib/getProducts.ts
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/types"

export const getProductsFromFirestore = async (): Promise<Product[]> => {
  const productosRef = collection(db, "productos")
  const snapshot = await getDocs(productosRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">)
  }))
}
