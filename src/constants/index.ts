import { ShoppingCart, Truck, Users, Package, Wallet, FileText } from "lucide-react"
import type { Product } from "@/types"

export const MENU_ITEMS = [
  {
    id: "ventas" as const,
    title: "Ventas",
    description: "Gestionar ventas y facturación",
    icon: ShoppingCart,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    id: "compras" as const,
    title: "Compras",
    description: "Compras a proveedores",
    icon: Truck,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    id: "clientes" as const,
    title: "Clientes",
    description: "Gestión de clientes",
    icon: Users,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    id: "inventario" as const,
    title: "Inventario",
    description: "Control de stock y productos",
    icon: Package,
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    id: "caja" as const,
    title: "Caja",
    description: "Resumen de caja y pagos",
    icon: Wallet,
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    id: "reportes" as const,
    title: "Reportes",
    description: "Estadísticas y reportes",
    icon: FileText,
    color: "bg-red-500 hover:bg-red-600",
  },
]

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "BUÑUELOS",
    price: 1000,
    image: "/placeholder.svg?height=80&width=80",
    category: "panaderia",
    stock: 50,
  },
  {
    id: "2",
    name: "PASTEL POLLO",
    price: 4800,
    image: "/placeholder.svg?height=80&width=80",
    category: "panaderia",
    stock: 20,
  },
  {
    id: "3",
    name: "LECHE DESLACTOSADA COLANTA X 1000ML",
    price: 4000,
    image: "/placeholder.svg?height=80&width=80",
    category: "lacteos",
    stock: 30,
  },
  {
    id: "4",
    name: "EMPANADAS",
    price: 2500,
    image: "/placeholder.svg?height=80&width=80",
    category: "panaderia",
    stock: 40,
  },
  {
    id: "5",
    name: "SHAMPOO",
    price: 8500,
    image: "/placeholder.svg?height=80&width=80",
    category: "cuidado",
    stock: 15,
  },
  {
    id: "6",
    name: "QUESITO",
    price: 1500,
    image: "/placeholder.svg?height=80&width=80",
    category: "lacteos",
    stock: 25,
  },
  {
    id: "7",
    name: "CASERITAS SABOR A LIMÓN",
    price: 5300,
    image: "/placeholder.svg?height=80&width=80",
    category: "snacks",
    stock: 35,
  },
  {
    id: "8",
    name: "CHOCOLATINA SNICKERS X 52.7 G",
    price: 6000,
    image: "/placeholder.svg?height=80&width=80",
    category: "dulces",
    stock: 60,
  },
  {
    id: "9",
    name: "CERVEZA HEINEKEN LATA GRANDE X 473 ML",
    price: 5500,
    image: "/placeholder.svg?height=80&width=80",
    category: "bebidas",
    stock: 45,
  },
]

export const DEFAULT_CUSTOMER = {
  id: "default",
  name: "Cliente Rápido",
  phone: "2222222222222",
}
