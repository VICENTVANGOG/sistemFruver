"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Plus, Users, Phone, Mail, MapPin, DollarSign, Edit, Trash2, Check } from "lucide-react"
import { ClientService } from "@/services/clientService"
import type { Client } from "@/types/index"

interface ClientsPageProps {
  onBack: () => void;  // Agregar la propiedad onBack aquí
}

export default function ClientsPage({ onBack }: ClientsPageProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Cargar clientes
  const loadClients = async () => {
    try {
      setLoading(true)
      const clientsData = await ClientService.getAllClients()
      setClients(clientsData)
      setFilteredClients(clientsData)
    } catch (error) {
      console.error("Error loading clients:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar clientes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm) ||
          (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  useEffect(() => {
    loadClients()
  }, [])

  const handleGoBack = () => {
    onBack();  // Usar el prop onBack para regresar a la página anterior
  }

  const handleSelectClient = (client: Client) => {
    // Guardar cliente seleccionado
    localStorage.setItem("selectedClient", JSON.stringify(client))

    // Regresar específicamente a la página de ventas después de un breve delay
    setTimeout(() => {
      window.location.href = "/dashboard/sales" // O la ruta específica de tu página de ventas
    }, 500)
  }

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("es-CO", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  const getDebtBadgeColor = (debt: number) => {
    if (debt === 0) return "bg-green-500/20 text-green-300 border-green-500/30"
    if (debt < 100000) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    return "bg-red-500/20 text-red-300 border-red-500/30"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando clientes...</div>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-slate-200">Seleccionar Cliente</h1>
            <p className="text-slate-400 text-sm">
              {filteredClients.length} {filteredClients.length === 1 ? "cliente" : "clientes"}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="px-4 mb-6">
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardContent className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de clientes */}
      <div className="px-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-3">
            <Users className="h-7 w-7 text-slate-500 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-slate-200 mb-1">
              {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer cliente"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-slate-300 font-medium">Cliente</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Contacto</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Deuda</th>
                  <th className="text-left p-4 text-slate-300 font-medium">Registro</th>
                  <th className="text-right p-4 text-slate-300 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer`}
                    onClick={() => handleSelectClient(client)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{client.name}</p>
                          {client.address && (
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {client.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-200 flex items-center gap-2">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {client.phone}
                        </p>
                        {client.email && (
                          <p className="text-sm text-slate-400 flex items-center gap-2">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {client.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getDebtBadgeColor(client.totalDebt)} font-medium`}>
                        <DollarSign className="h-3 w-3 mr-1" />${formatCurrency(client.totalDebt)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-400">
                        {client.createdAt.toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
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
                            // Lógica para eliminar cliente
                            console.log("Eliminar cliente:", client.id)
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
    </div>
  )
}
