import { Users } from "lucide-react"
import type { Customer } from "@/types"

interface CustomerInfoProps {
  customer: Customer
}

export const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium">{customer.name}</p>
          <p className="text-xs text-gray-600">{customer.phone}</p>
        </div>
      </div>
    </div>
  )
}
