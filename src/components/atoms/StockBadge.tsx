import { Badge } from "@/components/ui/badge"

interface StockBadgeProps {
  stock: number
  lowStockThreshold?: number
}

export const StockBadge = ({ stock, lowStockThreshold = 10 }: StockBadgeProps) => {
  if (stock >= lowStockThreshold) return null

  return <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs">{stock}</Badge>
}
