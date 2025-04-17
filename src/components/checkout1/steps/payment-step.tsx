"use client"

import React, {useEffect} from "react"
import { useCheckout } from "@/src/components/checkout1/checkout-context"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { ArrowLeft, AlertCircle, CreditCard, DollarSign } from "lucide-react"
import clsx from "clsx"
import {FaIndianRupeeSign} from "react-icons/fa6";
interface PaymentStepProps {
  setStep: (step: number) => void
  loading: boolean
  error?: string
  onSubmit: (e: React.FormEvent, formData: any) => Promise<void>
}
   interface FormDataType{
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    houseNo: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: string;
    paymentMethod: string;
    serviceDate: string;
    serviceTime: string;
}
export default function PaymentStep({setStep, loading, error, onSubmit,}: PaymentStepProps) {

    const { formData, setFormData } = useCheckout() as {
        formData: FormDataType;
        setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    };
  const handlePaymentChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, paymentMethod: value }))
  }
  const handleBack = () => setStep(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e, formData);
  }
    useEffect(() => {
        if (!formData.paymentMethod) {
            setFormData((prev) => ({ ...prev, paymentMethod: "cod" }));
        }
    }, []);

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard size={18} className="mr-2" />
            Payment Method
          </h2>

          <RadioGroup
              value={formData.paymentMethod}
              onValueChange={handlePaymentChange}
              className="space-y-3"
          >
            {[
              {
                value: "razorpay",
                label: "Razorpay",
                icon: <CreditCard size={18} className="mr-2" />,
              },
              {
                value: "cod",
                label: "Cash on Delivery",
                icon: <FaIndianRupeeSign size={18} className="mr-2" />,
              },
            ].map(({ value, label, icon }) => (
                <div
                    key={value}
                    className={clsx(
                        "border rounded-lg p-4 transition-colors",
                        formData.paymentMethod === value
                            ? "border-black bg-gray-50"
                            : "border-gray-200"
                    )}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="flex items-center text-base cursor-pointer">
                      {icon}
                      {label}
                    </Label>
                  </div>
                </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 border-black text-black hover:bg-gray-100"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white hover:bg-gray-800 flex items-center justify-center"
          >
            {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
            ) : (
                "Place Order"
            )}
          </Button>
        </div>
      </form>
  )
}
