"use client"

import { useBoundStore } from "@/src/store/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Separator } from "@/src/components/ui/separator"
import Image from "next/image"
import { formatCurrency } from "@/src/lib/utils"
import { useEffect, useState } from "react"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Label } from "@/src/components/ui/label"
import { useUser } from "@clerk/nextjs"
import Loading from "@/src/app/loading";
import { getuser } from "@/src/actions/user"
import {useCheckout} from "@/src/components/checkout1/checkout-context"; // Adjust path as needed

export default function OrderSummary() {
  const cartItems = useBoundStore((state) => state.cart)
  const [useWallet, setUseWallet] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [walletAmountUsed, setWalletAmountUsed] = useState(0)
  const [amountToPay, setAmountToPay] = useState(0)
  const [loading, setLoading] = useState(true)

  const { formData, setFormData } = useCheckout();
  const { user } = useUser()

  const cartTotal = cartItems.reduce(
      (sum, item) => sum + item.basePrice * item.quantity,
      0
  )
  const shippingCost = cartTotal > 0 ? 40 : 0
  const tax = cartTotal * 0.08
  const orderTotal = cartTotal + shippingCost + tax

  // Fetch wallet balance
  useEffect(() => {
    const fetchWallet = async () => {
      if (user?.emailAddresses[0]?.emailAddress) {
        const res = await getuser(user.emailAddresses[0].emailAddress)
        const balance = res?.walletBalance || 0
        setWalletBalance(balance)
        setUseWallet(balance > 0)
        setLoading(false)
      }
    }
    fetchWallet()
  }, [user])

  // Calculate deductions and sync with formData
  useEffect(() => {
    let deduction = 0
    let amountDue = orderTotal

    if (useWallet && walletBalance > 0) {
      deduction = Math.min(walletBalance, orderTotal)
      amountDue = orderTotal - deduction
    }

    setWalletAmountUsed(deduction)
    setAmountToPay(amountDue)

    // Update context formData
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        cartTotal,
        tax,
        shippingCost,
        orderTotal,
        walletBalance,
        walletAmountUsed: deduction,
        amountToPay: amountDue,
        useWallet,
      }))
    }
  }, [useWallet, walletBalance, orderTotal, cartTotal, tax, shippingCost, setFormData])

  if (loading) return <Loading />

  return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.basePrice * item.quantity)}
                  </p>
                </div>
            ))}
          </div>

          <Separator />

          {/* Price Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p className="font-medium">{formatCurrency(cartTotal)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p className="font-medium">{formatCurrency(shippingCost)}</p>
            </div>
            <div className="flex justify-between">
              <p>Tax</p>
              <p className="font-medium">{formatCurrency(tax)}</p>
            </div>
          </div>

          <Separator />

          {/* Wallet Option */}
          {walletBalance > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                      id="use-wallet"
                      checked={useWallet}
                      onCheckedChange={() => setUseWallet(!useWallet)}
                  />
                  <Label htmlFor="use-wallet">
                    Use wallet balance (Available: {formatCurrency(walletBalance)})
                  </Label>
                </div>

                {useWallet && walletAmountUsed > 0 && (
                    <div className="rounded-md bg-green-50 p-4 text-sm">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-green-800">Wallet Deduction</p>
                        <p className="font-semibold text-green-700">
                          -{formatCurrency(walletAmountUsed)}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-green-600">
                        You are using {formatCurrency(walletAmountUsed)} from your wallet balance.
                      </p>
                    </div>
                )}
              </div>

          )}
          {
              walletBalance > 0 &&<Separator />
          }


          {/* Final Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-base font-medium">
              <p>Amount to pay</p>
              <p>{formatCurrency(amountToPay)}</p>
            </div>
            {useWallet && walletAmountUsed > 0 && (
                <p className="text-sm text-gray-500">
                  {walletAmountUsed === orderTotal
                      ? "Fully paid with wallet balance"
                      : `Paid ${formatCurrency(walletAmountUsed)} from wallet`}
                </p>
            )}
          </div>
        </CardContent>
      </Card>
  )
}
