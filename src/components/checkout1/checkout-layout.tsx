import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import OrderSummary from "@/src/components/checkout1/order-summary"

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Checkout</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
