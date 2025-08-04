"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  SkipBackIcon as Backspace,
  Users,
  QrCode,
  CheckCircle,
  User,
  Phone,
  Calendar,
  ShoppingBag,
  Receipt,
  DollarSign,
  Banknote,
} from "lucide-react"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Tipos
interface Product {
  id: string
  name: string
  price: number
  image: string
  stock?: number
}

interface CartItem {
  product: Product
  quantity: number
}

interface SaleDetails {
  cart: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
}

interface PaymentSuccessData {
  saleDetails: SaleDetails
  paymentMethod: "efectivo" | "qr"
  receivedAmount: number
  change: number
  saleDate: Date
}

// Función para actualizar el stock en Firestore
const updateProductStockInFirestore = async (productId: string, quantitySold: number) => {
  const productRef = doc(db, "productos", productId)
  
  try {
    // Primero obtenemos el stock actual
    const productDoc = await getDoc(productRef)
    if (productDoc.exists()) {
      const currentStock = productDoc.data().stock || 0
      const newStock = Math.max(0, currentStock - quantitySold) // Evitamos stock negativo
      
      // Actualizamos el stock
      await updateDoc(productRef, {
        stock: newStock,
      })
      
      console.log(`Stock actualizado para producto ${productId}: ${currentStock} -> ${newStock}`)
    }
  } catch (error) {
    console.error("Error al actualizar el stock en Firestore:", error)
    throw error
  }
}

// Función para actualizar múltiples productos
const updateMultipleProductsStock = async (cartItems: CartItem[]) => {
  try {
    const updatePromises = cartItems.map(item => 
      updateProductStockInFirestore(item.product.id, item.quantity)
    )
    
    await Promise.all(updatePromises)
    console.log("Todos los stocks han sido actualizados correctamente")
  } catch (error) {
    console.error("Error al actualizar los stocks:", error)
    throw error
  }
}

// Utilidad para formatear moneda
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export default function CashPaymentPage() {
  const [saleDetails, setSaleDetails] = useState<SaleDetails | null>(null)
  const [receivedAmount, setReceivedAmount] = useState<string>("0")
  const [change, setChange] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "qr">("efectivo")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [paymentSuccessData, setPaymentSuccessData] = useState<PaymentSuccessData | null>(null)
  const [isUpdatingStock, setIsUpdatingStock] = useState(false)

  const denominations = [1000, 2000, 5000, 10000, 20000, 50000]

  useEffect(() => {
    const savedSaleDetails = localStorage.getItem("saleDetails")
    if (savedSaleDetails) {
      setSaleDetails(JSON.parse(savedSaleDetails))
    } else {
      alert("No se encontraron detalles de la venta.")
    }
  }, [])

  // Reset received amount and change when switching payment methods
  useEffect(() => {
    if (paymentMethod === "qr") {
      setReceivedAmount("0")
      setChange(0)
    }
  }, [paymentMethod])

  if (!saleDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  const { cart, subtotal, discount, shipping, total } = saleDetails

  const calculateChange = (received: string) => {
    const receivedNum = Number.parseInt(received) || 0
    const changeAmount = receivedNum - total
    setChange(changeAmount >= 0 ? changeAmount : 0)
  }

  const handleNumberClick = (num: string) => {
    if (paymentMethod === "qr") return
    const newAmount = receivedAmount === "0" ? num : receivedAmount + num
    setReceivedAmount(newAmount)
    calculateChange(newAmount)
  }

  const handleClear = () => {
    if (paymentMethod === "qr") return
    setReceivedAmount("0")
    setChange(0)
  }

  const handleBackspace = () => {
    if (paymentMethod === "qr") return
    const newAmount = receivedAmount.length > 1 ? receivedAmount.slice(0, -1) : "0"
    setReceivedAmount(newAmount)
    calculateChange(newAmount)
  }

  const handleDenominationClick = (amount: number) => {
    if (paymentMethod === "qr") return

    const currentAmount = Number.parseInt(receivedAmount) || 0
    const newAmount = (currentAmount + amount).toString()

    setReceivedAmount(newAmount)
    calculateChange(newAmount)
  }

  const handleAccept = async () => {
    setIsUpdatingStock(true)
    
    try {
      // Actualizar el stock de los productos vendidos
      await updateMultipleProductsStock(cart)
      
      if (paymentMethod === "qr") {
        // Preparar datos para el modal de éxito QR
        const successData: PaymentSuccessData = {
          saleDetails,
          paymentMethod: "qr",
          receivedAmount: total,
          change: 0,
          saleDate: new Date(),
        }

        setPaymentSuccessData(successData)
        setShowSuccessModal(true)
        localStorage.removeItem("saleDetails")
      } else {
        const receivedNum = Number.parseInt(receivedAmount) || 0
        if (receivedNum >= total) {
          // Preparar datos para el modal de éxito efectivo
          const successData: PaymentSuccessData = {
            saleDetails,
            paymentMethod: "efectivo",
            receivedAmount: receivedNum,
            change,
            saleDate: new Date(),
          }

          setPaymentSuccessData(successData)
          setShowSuccessModal(true)
          localStorage.removeItem("saleDetails")
        } else {
          alert("El monto recibido debe ser mayor o igual al total")
        }
      }
    } catch (error) {
      console.error("Error al procesar la venta:", error)
      alert("Error al actualizar el inventario. Por favor, intenta nuevamente.")
    } finally {
      setIsUpdatingStock(false)
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
    setPaymentSuccessData(null)
    window.history.back()
  }

  const isAcceptDisabled = () => {
    if (isUpdatingStock) return true
    
    if (paymentMethod === "qr") {
      return false // En QR siempre se puede aceptar
    } else {
      return Number.parseInt(receivedAmount) < total
    }
  }

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
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button onClick={handleGoBack} variant="ghost" className="text-slate-200 hover:bg-slate-800/50 p-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-200 ml-4">Venta de contado</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Lista de productos y totales - Izquierda */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 p-4 h-fit">
            <div className="space-y-3">
              {/* Productos */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Productos</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={item.product.image || "/placeholder.svg?height=40&width=40"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200 text-sm line-clamp-1">{item.product.name}</p>
                          <p className="text-purple-400 text-xs font-semibold">${formatCurrency(item.product.price)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-200">{item.quantity}</p>
                        <p className="font-bold text-purple-400">
                          ${formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cliente y totales */}
              <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">Cliente Rápido</p>
                    <p className="text-xs text-slate-400">2222222222222</p>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={paymentMethod === "efectivo" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("efectivo")}
                    className={`flex-1 text-sm ${
                      paymentMethod === "efectivo"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-slate-600 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    💵 Efectivo
                  </Button>
                  <Button
                    variant={paymentMethod === "qr" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("qr")}
                    className={`flex-1 text-sm ${
                      paymentMethod === "qr"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-slate-600 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    QR
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Descuento</span>
                    <span className="font-medium text-slate-200">${formatCurrency(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-medium text-slate-200">${formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Domicilio</span>
                    <span className="font-medium text-slate-200">${formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-slate-600 pt-2">
                    <span className="text-slate-200">Total</span>
                    <span className="text-purple-400">${formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Teclado numérico o QR - Centro */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 p-6 h-fit">
            {paymentMethod === "efectivo" ? (
              <>
                {/* Campo Recibido */}
                <div className="mb-2">
                  <label className="text-slate-200 text-sm mb-1 block font-medium">Recibido</label>
                  <div className="bg-purple-400 text-slate-900 text-lg font-bold p-2 rounded-lg text-center border border-slate-600">
                    ${formatCurrency(Number.parseInt(receivedAmount) || 0)}
                  </div>
                </div>

                {/* Teclado numérico */}
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleNumberClick(num.toString())}
                      className="h-8 text-sm font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
                      disabled={isUpdatingStock}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    onClick={handleClear}
                    className="h-8 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
                    disabled={isUpdatingStock}
                  >
                    C
                  </Button>
                  <Button
                    onClick={() => handleNumberClick("0")}
                    className="h-8 text-sm font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
                    disabled={isUpdatingStock}
                  >
                    0
                  </Button>
                  <Button
                    onClick={handleBackspace}
                    className="h-8 bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
                    disabled={isUpdatingStock}
                  >
                    <Backspace className="h-3 w-3" />
                  </Button>
                </div>

                {/* Campo Cambio */}
                <div className="mb-3">
                  <label className="text-slate-200 text-sm mb-1 block font-medium">Cambio</label>
                  <div className="bg-purple-400 text-slate-900 text-lg font-bold p-2 rounded-lg text-center border border-slate-600">
                    ${formatCurrency(change)}
                  </div>
                </div>
              </>
            ) : (
              /* Vista QR */
              <div className="text-center py-8">
                <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-slate-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">Escanea el código QR</h3>
                <p className="text-slate-400 mb-4">Total a pagar: ${formatCurrency(total)}</p>
                <p className="text-sm text-slate-500">El cliente debe escanear este código con su aplicación de pago</p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleGoBack}
                className="h-12 bg-red-600 hover:bg-red-700 text-white font-bold border border-red-500"
                disabled={isUpdatingStock}
              >
                Regresar
              </Button>
              <Button
                onClick={handleAccept}
                className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold border border-green-500"
                disabled={isAcceptDisabled()}
              >
                {isUpdatingStock ? "Procesando..." : "Aceptar"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Denominaciones - Derecha */}
        <div className="lg:col-span-4">
          {paymentMethod === "efectivo" ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Denominaciones</h3>
              {denominations.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleDenominationClick(amount)}
                  className="w-full h-16 text-2xl font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  disabled={isUpdatingStock}
                >
                  ${formatCurrency(amount)}
                </Button>
              ))}
            </div>
          ) : (
            /* Información adicional para QR */
            <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Instrucciones de Pago QR</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400 font-bold">1.</span>
                  <span>El cliente debe abrir su aplicación de pago móvil</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400 font-bold">2.</span>
                  <span>Escanear el código QR mostrado</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400 font-bold">3.</span>
                  <span>Confirmar el pago por ${formatCurrency(total)}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400 font-bold">4.</span>
                  <span>Esperar confirmación del pago</span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="text-xs text-slate-400 text-center">
                  Una vez confirmado el pago, presiona "Aceptar" para completar la transacción
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de éxito del pago */}
      {showSuccessModal && paymentSuccessData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 p-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                ¡Pago {paymentSuccessData.paymentMethod === "efectivo" ? "en Efectivo" : "QR"} Exitoso!
              </CardTitle>
              <p className="text-slate-400">La venta ha sido procesada correctamente</p>
              <p className="text-green-400 text-sm">✅ Inventario actualizado</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Información del cliente */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Cliente Rápido</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Phone className="h-4 w-4" />
                      2222222222222
                    </div>
                  </div>
                </div>

                {/* Información del pago */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {paymentSuccessData.paymentMethod === "efectivo" ? (
                        <Banknote className="h-4 w-4 text-green-300" />
                      ) : (
                        <QrCode className="h-4 w-4 text-green-300" />
                      )}
                      <p className="text-xs text-green-300">
                        {paymentSuccessData.paymentMethod === "efectivo" ? "Recibido" : "Pagado"}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-400">
                      ${formatCurrency(paymentSuccessData.receivedAmount)}
                    </p>
                  </div>
                  {paymentSuccessData.paymentMethod === "efectivo" && (
                    <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-blue-300" />
                        <p className="text-xs text-blue-300">Cambio</p>
                      </div>
                      <p className="text-lg font-bold text-blue-400">${formatCurrency(paymentSuccessData.change)}</p>
                    </div>
                  )}
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
                <div className="mt-2 flex items-center gap-2">
                  {paymentSuccessData.paymentMethod === "efectivo" ? (
                    <Banknote className="h-4 w-4 text-green-400" />
                  ) : (
                    <QrCode className="h-4 w-4 text-blue-400" />
                  )}
                  <span className="text-sm text-slate-300">
                    Método de pago: {paymentSuccessData.paymentMethod === "efectivo" ? "Efectivo" : "Código QR"}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={closeSuccessModal}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Continuar Vendiendo
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                  onClick={() => {
                    // Aquí podrías agregar lógica para imprimir o generar PDF
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
    </div>)}