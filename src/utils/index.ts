export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString()}`
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const calculateCartTotals = (items: import("@/types").CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = 0 // Implementar lógica de descuentos
  const shipping = 0 // Implementar lógica de envío
  const total = subtotal - discount + shipping

  return { subtotal, discount, shipping, total }
}
