"use client"

import { useState, useEffect } from "react"
import { ClientService } from "@/services/clientService"
import type { Client } from "@/types/index"

// Definimos el tipo para crear un nuevo cliente sin incluir propiedades generadas por el backend
type CreateClientInput = Pick<Client, "name" | "phone" | "email" | "address" | "totalDebt">

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const clientsData = await ClientService.getAllClients()
      setClients(clientsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando clientes")
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (clientData: CreateClientInput) => {
    try {
      const clientId = await ClientService.createClient(clientData)
      await loadClients()
      return clientId
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando cliente")
      throw err
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  return {
    clients,
    loading,
    error,
    loadClients,
    createClient,
  }
}
