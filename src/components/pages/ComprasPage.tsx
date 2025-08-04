import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SectionLayout } from "@/components/templates/SectionLayout"
import { SectionHeader } from "@/components/molecules/SectionHeader"
import { Truck } from "lucide-react"

interface ComprasPageProps {
  onBack: () => void
}

export const ComprasPage = ({ onBack }: ComprasPageProps) => {
  return (
    <SectionLayout>
      <SectionHeader
        title="Compras"
        icon={Truck}
        iconColor="text-green-600"
        onBack={onBack}
        onAdd={() => console.log("Nueva compra")}
        addButtonText="Nueva Compra"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Órdenes de Compra</CardTitle>
            <CardDescription>Gestiona las compras a proveedores</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Compra</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#C001</TableCell>
                  <TableCell>Proveedor ABC</TableCell>
                  <TableCell>14/01/2024</TableCell>
                  <TableCell>$2,500.00</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">Recibida</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SectionLayout>
  )
}
