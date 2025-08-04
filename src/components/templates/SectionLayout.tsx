import type { ReactNode } from "react"

interface SectionLayoutProps {
  children: ReactNode
}

export const SectionLayout = ({ children }: SectionLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{/* Content will be passed as children */}</div>
    </div>
  )
}
