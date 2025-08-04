"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Plus,
  X,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  User,
  Phone,
  Calendar,
  ShoppingBag,
  Receipt,
  Truck,
  Percent,
  SkipBackIcon as Backspace,
} from "lucide-react"
import { ClientService } from "@/services/clientService"
import type { Client } from "@/types/index"

interface CheckoutPanelProps {
  subtotal: number
  discount: number
  shipping: number
  total: number
  hasItems: boolean
  cart: any[]
  onClearCart: () => void
  onDiscountChange: (discount: number) => void
  onShippingChange: (shipping: number) => void
}

interface PaymentSuccessData {
  client: Client
  saleDetails: {
    cart: any[]
    subtotal: number
    discount: number
    shipping: number
    total: number
  }
  previousDebt: number
  newDebt: number
  saleDate: Date
}

interface ShippingOption {
  id: number
  name: string
  price: number
}

const shippingOptions: ShippingOption[] = [
  { id: 1, name: "Tarifa 1", price: 1000 },
  { id: 2, name: "Tarifa 2", price: 2000 },
  { id: 3, name: "Tarifa 3", price: 3000 },
]

export const CheckoutPanel = ({
  subtotal,
  discount,
  shipping,
  total,
  hasItems,
  cart,
  onClearCart,
  onDiscountChange,
  onShippingChange,
}: CheckoutPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [paymentSuccessData, setPaymentSuccessData] = useState<PaymentSuccessData | null>(null)
  
  // Estados para modales de descuento y domicilio
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [discountInput, setDiscountInput] = useState<string>("0")
  const [discountType, setDiscountType] = useState<"amount" | "percentage">("amount")

  // Verificar si hay un cliente seleccionado al cargar el componente
  useEffect(() => {
    const checkSelectedClient = () => {
      const savedClient = localStorage.getItem("selectedClient")
      if (savedClient) {
        try {
          const client = JSON.parse(savedClient)
          setSelectedClient(client)
          localStorage.removeItem("selectedClient")
        } catch (error) {
          console.error("Error parsing selected client:", error)
        }
      }
    }

    checkSelectedClient()

    const handleStorageChange = () => {
      checkSelectedClient()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", checkSelectedClient)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", checkSelectedClient)
    }
  }, [])

  const handleClientClick = () => {
    localStorage.setItem("returnToSales", "true")
    window.location.href = "/dashboard/clients"
  }

  const handleCreditPayment = async () => {
    if (!selectedClient) {
      setIsModalOpen(true)
      return
    }

    try {
      setLoading(true)

      const previousDebt = selectedClient.totalDebt
      const nuevaDeuda = selectedClient.totalDebt + total

      await ClientService.updateClientDebt(selectedClient.id, nuevaDeuda)

      const successData: PaymentSuccessData = {
        client: selectedClient,
        saleDetails: {
          cart,
          subtotal,
          discount,
          shipping,
          total,
        },
        previousDebt,
        newDebt: nuevaDeuda,
        saleDate: new Date(),
      }

      setPaymentSuccessData(successData)
      setShowSuccessModal(true)
      onClearCart()
      setSelectedClient(null)
    } catch (error) {
      console.error("❌ Error al realizar pago a crédito:", error)
      alert("❌ Ocurrió un error al registrar el pago.")
    } finally {
      setLoading(false)
    }
  }

  const handleCashPayment = () => {
    const saleDetails = {
      cart,
      subtotal,
      discount,
      shipping,
      total,
    }

    localStorage.setItem("saleDetails", JSON.stringify(saleDetails))
    window.location.href = "/dashboard/payment"
  }

  // Funciones para descuento
  const handleDiscountNumberClick = (num: string) => {
    const newAmount = discountInput === "0" ? num : discountInput + num
    setDiscountInput(newAmount)
  }

  const handleDiscountClear = () => {
    setDiscountInput("0")
  }

  const handleDiscountBackspace = () => {
    const newAmount = discountInput.length > 1 ? discountInput.slice(0, -1) : "0"
    setDiscountInput(newAmount)
  }

  const applyDiscount = () => {
    const inputValue = Number.parseInt(discountInput) || 0
    let finalDiscount = 0

    if (discountType === "percentage") {
      // Calcular porcentaje del subtotal
      finalDiscount = Math.round((subtotal * inputValue) / 100)
    } else {
      // Descuento en monto fijo
      finalDiscount = inputValue
    }

    // No permitir descuento mayor al subtotal
    finalDiscount = Math.min(finalDiscount, subtotal)
    
    onDiscountChange(finalDiscount)
    setShowDiscountModal(false)
    setDiscountInput("0")
  }

  const removeDiscount = () => {
    onDiscountChange(0)
  }

  const removeShipping = () => {
    onShippingChange(0)
  }

  const applyShipping = (option: ShippingOption) => {
    onShippingChange(option.price)
    setShowShippingModal(false)
  }

  const closeModal = () => setIsModalOpen(false)
  const closeSuccessModal = () => {
    setShowSuccessModal(false)
    setPaymentSuccessData(null)
  }

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("es-CO", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-full flex flex-col p-3">
      {/* Cliente - clickeable */}
      <div
        className="flex items-center space-x-2 mb-4 cursor-pointer hover:bg-slate-700/30 rounded-lg p-2 transition-colors duration-200"
        onClick={handleClientClick}
      >
        <div className="w-11 h-11 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">
            {selectedClient ? selectedClient.name : "Seleccionar Cliente"}
          </p>
          <p className="text-sm text-slate-400 truncate">
            {selectedClient
              ? `${selectedClient.phone} • Deuda: $${formatCurrency(selectedClient.totalDebt)}`
              : "Haz clic para seleccionar"}
          </p>
        </div>
        {selectedClient && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedClient(null)
            }}
            className="w-6 h-6 p-0 bg-red-500/20 hover:bg-red-500/30 border-red-400/50 flex-shrink-0"
          >
            <X className="h-3 w-3 text-red-300" />
          </Button>
        )}
      </div>

      {/* Totales */}
      <div className="space-y-3 mb-4 flex-1">
        {/* Descuento */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-200">Descuento</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">${formatCurrency(discount)}</span>
            <div className="flex space-x-1">
              {discount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={removeDiscount}
                  className="w-6 h-6 p-0 bg-red-500/20 hover:bg-red-500/30 border-red-400/50"
                >
                  <X className="h-3 w-3 text-red-300" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDiscountModal(true)}
                className="w-6 h-6 p-0 bg-transparent border-slate-600 text-slate-300"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-200">Subtotal</span>
          <span className="text-sm font-medium text-white">${formatCurrency(subtotal)}</span>
        </div>

        {/* Domicilio */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-200">Domicilio</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">${formatCurrency(shipping)}</span>
            <div className="flex space-x-1">
              {shipping > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={removeShipping}
                  className="w-6 h-6 p-0 bg-red-500/20 hover:bg-red-500/30 border-red-400/50"
                >
                  <X className="h-3 w-3 text-red-300" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowShippingModal(true)}
                className="w-6 h-6 p-0 bg-transparent border-slate-600 text-slate-300"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-white">Total</span>
            <span className="text-lg font-bold text-purple-400">${formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="space-y-2">
        <Button
          onClick={onClearCart}
          variant="outline"
          className="w-full h-11 text-sm bg-red-500/20 hover:bg-red-500/30 border-red-400/50 text-red-300"
          disabled={!hasItems || loading}
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar venta
        </Button>

        <Button
          onClick={handleCreditPayment}
          className="w-full h-11 text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          disabled={!hasItems || loading || !selectedClient}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {loading ? "Procesando..." : selectedClient ? "Pago a crédito" : "Selecciona cliente"}
        </Button>

        <Button
          onClick={handleCashPayment}
          className="w-full h-11 text-sm bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!hasItems || loading}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Pago de Contado
        </Button>

        <Button
          variant="outline"
          className="w-full h-11 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-400/50 text-yellow-300"
          disabled={!hasItems || loading}
        >
          <Clock className="h-4 w-4 mr-2" />
          Venta temporal
        </Button>
      </div>

      {/* Modal de Descuento */}
      {showDiscountModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Card className="bg-slate-800 border-slate-700 w-80 mx-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Aplicar Descuento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Selector de tipo de descuento */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={discountType === "amount" ? "default" : "outline"}
                  onClick={() => setDiscountType("amount")}
                  className={`flex-1 text-sm ${
                    discountType === "amount"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "border-slate-600 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  💵 Monto
                </Button>
                <Button
                  variant={discountType === "percentage" ? "default" : "outline"}
                  onClick={() => setDiscountType("percentage")}
                  className={`flex-1 text-sm ${
                    discountType === "percentage"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "border-slate-600 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  % Porcentaje
                </Button>
              </div>

              {/* Display del valor */}
              <div className="mb-4">
                <div className="bg-purple-400 text-slate-900 text-lg font-bold p-3 rounded-lg text-center">
                  {discountType === "percentage" 
                    ? `${discountInput}%` 
                    : `$${formatCurrency(Number.parseInt(discountInput) || 0)}`
                  }
                </div>
                {discountType === "percentage" && (
                  <p className="text-xs text-slate-400 mt-1 text-center">
                    ≈ ${formatCurrency(Math.round((subtotal * (Number.parseInt(discountInput) || 0)) / 100))}
                  </p>
                )}
              </div>

              {/* Teclado numérico */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    onClick={() => handleDiscountNumberClick(num.toString())}
                    className="h-10 font-bold bg-slate-700 hover:bg-slate-600 text-slate-200"
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  onClick={handleDiscountClear}
                  className="h-10 font-bold bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  C
                </Button>
                <Button
                  onClick={() => handleDiscountNumberClick("0")}
                  className="h-10 font-bold bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  0
                </Button>
                <Button
                  onClick={handleDiscountBackspace}
                  className="h-10 bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  <Backspace className="h-4 w-4" />
                </Button>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDiscountModal(false)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={applyDiscount}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Aplicar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Domicilio */}
      {showShippingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <Card className="bg-slate-800 border-slate-700 w-80 mx-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Seleccionar Domicilio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => applyShipping(option)}
                    className="w-full h-12 justify-between bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                  >
                    <span>{option.name}</span>
                    <span className="font-bold">${formatCurrency(option.price)}</span>
                  </Button>
                ))}
              </div>
              
              <div className="mt-4">
                <Button
                  onClick={() => setShowShippingModal(false)}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de selección de cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-slate-800 p-6 rounded-lg w-80 mx-4">
            <h3 className="text-lg font-semibold text-white mb-3">¡Atención!</h3>
            <p className="text-base text-slate-400 mb-4">
              Debes seleccionar un cliente para poder realizar un pago a crédito.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={closeModal}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
              >
                Cerrar
              </Button>
              <Button onClick={handleClientClick} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                Seleccionar Cliente
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito del pago a crédito */}
      {showSuccessModal && paymentSuccessData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 p-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">¡Pago a Crédito Exitoso!</CardTitle>
              <p className="text-slate-400">La venta ha sido registrada correctamente</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Información del cliente */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{paymentSuccessData.client.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Phone className="h-4 w-4" />
                      {paymentSuccessData.client.phone}
                    </div>
                  </div>
                </div>

                {/* Estado de deuda */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-600/50 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Deuda Anterior</p>
                    <p className="text-lg font-bold text-slate-200">
                      ${formatCurrency(paymentSuccessData.previousDebt)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                    <p className="text-xs text-red-300 mb-1">Nueva Deuda</p>
                    <p className="text-lg font-bold text-red-400">${formatCurrency(paymentSuccessData.newDebt)}</p>
                  </div>
                </div>
              </div>

              {/* Detalles de la venta */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Detalles de la Venta</h3>
                </div>

                {/* Productos */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">
                      Productos ({paymentSuccessData.saleDetails.cart.length})
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {paymentSuccessData.saleDetails.cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-slate-600/30 rounded p-2"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.image || "/placeholder.svg?height=24&width=24"}
                            alt={item.product.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span className="text-slate-200">{item.product.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            x{item.quantity}
                          </Badge>
                        </div>
                        <span className="font-medium text-purple-400">
                          ${formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="space-y-2 border-t border-slate-600 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-slate-200">${formatCurrency(paymentSuccessData.saleDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Descuento</span>
                    <span className="text-green-400">-${formatCurrency(paymentSuccessData.saleDetails.discount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Domicilio</span>
                    <span className="text-slate-200">${formatCurrency(paymentSuccessData.saleDetails.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-slate-600 pt-2">
                    <span className="text-white">Total</span>
                    <span className="text-purple-400">${formatCurrency(paymentSuccessData.saleDetails.total)}</span>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Fecha y hora</span>
                </div>
                <p className="text-white font-medium">{formatDate(paymentSuccessData.saleDate)}</p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={closeSuccessModal}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Continuar Vendiendo
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                  onClick={() => {
                    console.log("Generar recibo")
                  }}
                >
                  Generar Recibo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}