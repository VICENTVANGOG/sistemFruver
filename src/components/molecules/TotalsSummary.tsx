import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PriceDisplay } from "@/components/atoms/PriceDisplay"

interface TotalsSummaryProps {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export const TotalsSummary = ({ subtotal, discount, shipping, total }: TotalsSummaryProps) => {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Descuento</span>
        <div className="flex items-center space-x-2">
          <PriceDisplay amount={discount} size="sm" />
          <Button size="sm" variant="outline" className="w-6 h-6 p-0 bg-transparent">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Subtotal</span>
        <PriceDisplay amount={subtotal} size="sm" />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Domicilio</span>
        <div className="flex items-center space-x-2">
          <PriceDisplay amount={shipping} size="sm" />
          <Button size="sm" variant="outline" className="w-6 h-6 p-0 bg-transparent">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <PriceDisplay amount={total} size="lg" color="primary" />
        </div>
      </div>
    </div>
  )
}
