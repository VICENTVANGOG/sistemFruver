import { doc, addDoc, updateDoc, collection, increment, serverTimestamp } from "firebase/firestore"; 
import { db } from "./firebase"; // tu archivo firebase.ts

interface ProductoCompra {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export async function registrarCompra(
  proveedorId: string,
  productos: ProductoCompra[]
) {
  try {
    // 1️⃣ Calcular total de la compra
    const total = productos.reduce((sum, p) => sum + p.cantidad * p.precioUnitario, 0);

    // 2️⃣ Guardar compra en Firestore
    const compraRef = await addDoc(collection(db, "compras"), {
      proveedorId,
      fecha: serverTimestamp(),
      total,
      productos
    });

    console.log("Compra registrada con ID:", compraRef.id);

    // 3️⃣ Actualizar stock de cada producto
    for (const prod of productos) {
      const productoRef = doc(db, "productos", prod.productoId);
      await updateDoc(productoRef, {
        stock: increment(prod.cantidad)
      });
    }

    console.log("Stock actualizado correctamente.");
  } catch (error) {
    console.error("Error registrando compra:", error);
  }
}
