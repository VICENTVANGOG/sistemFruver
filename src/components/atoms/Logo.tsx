import { Store } from "lucide-react"

export const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <Store className="h-8 w-8 text-blue-600" />
      <h1 className="text-2xl font-bold text-gray-900">Sistema de Tienda</h1>
    </div>
  )
}
