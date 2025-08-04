import { ShoppingCart, Truck, Users, Package, Wallet, FileText } from "lucide-react"

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
