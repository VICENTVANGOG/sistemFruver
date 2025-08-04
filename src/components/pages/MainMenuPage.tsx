import { MainLayout } from "@/components/templates/MainLayout"
import { MainMenuGrid } from "@/components/organisms/MainMenuGrid"
import type { SectionType } from "@/types"

interface MainMenuPageProps {
  onSectionSelect: (section: SectionType) => void
}

export const MainMenuPage = ({ onSectionSelect }: MainMenuPageProps) => {
  return (
    <MainLayout>
      <MainMenuGrid onSectionSelect={onSectionSelect} />
    </MainLayout>
  )
}
