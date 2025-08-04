import { formatCurrency } from "@/utils"

interface PriceDisplayProps {
  amount: number
  size?: "sm" | "md" | "lg"
  color?: "default" | "primary" | "success" | "danger"
}

export const PriceDisplay = ({ amount, size = "md", color = "default" }: PriceDisplayProps) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  }

  const colorClasses = {
    default: "text-gray-900",
    primary: "text-blue-600",
    success: "text-green-600",
    danger: "text-red-600",
  }

  return <span className={`font-bold ${sizeClasses[size]} ${colorClasses[color]}`}>{formatCurrency(amount)}</span>
}
