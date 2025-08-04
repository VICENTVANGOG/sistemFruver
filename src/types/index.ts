export interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
  category?: string  // Hacer la categoría opcional
}


export interface CartItem {
  product: Product
  quantity: number
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
}

export interface Sale {
  id: string
  customer: Customer
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  date: Date
  status: "completed" | "pending" | "cancelled"
}

export type SectionType = "ventas" | "compras" | "clientes" | "inventario" | "caja" | "reportes"


export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  totalDebt: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateClientDTO {
  name: string
  phone: string
  email: string
  address: string
}