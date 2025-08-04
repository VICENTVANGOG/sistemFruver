import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore"
import type { Client } from "@/types"

const clientCollection = collection(db, "client")

export const ClientService = {
  async getAllClients(): Promise<Client[]> {
    try {
      const querySnapshot = await getDocs(clientCollection)
      const clients: Client[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()

        console.log("🔥 Cliente encontrado:", data)

        clients.push({
          id: doc.id,
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          totalDebt: data.totalDebt || 0,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        })
      })

      console.log("✅ Clientes cargados:", clients.length)
      return clients
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error)
      throw error
    }
  },

  async createClient(client: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const now = Timestamp.now()
      const docRef = await addDoc(clientCollection, {
        ...client,
        totalDebt: 0,
        createdAt: now,
        updatedAt: now,
      })

      console.log("✅ Cliente creado con ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("❌ Error al crear cliente:", error)
      throw error
    }
  },

  async updateClientDebt(clientId: string, amount: number): Promise<void> {
    try {
      const clientDocRef = doc(db, "client", clientId)
      const now = Timestamp.now()

      await updateDoc(clientDocRef, {
        totalDebt: amount,
        updatedAt: now,
      })

      console.log(`✅ Deuda actualizada para cliente ${clientId}`)
    } catch (error) {
      console.error(`❌ Error al actualizar la deuda:`, error)
      throw error
    }
  },
}
