"use client"

import { Button } from "@/src/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function FailureStep({ setStep }: { setStep: (step: number) => void }) {
  const handleTryAgain = () => {
    setStep(2)
  }

  const handleBackToDetails = () => {
    setStep(1)
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <AlertCircle size={48} className="text-red-600" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn't process your payment. This could be due to insufficient funds, incorrect card details, or a
        temporary issue with the payment provider.
      </p>

      <div className="w-full max-w-md space-y-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">What went wrong?</h3>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your card may have been declined by your bank</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>There might be a temporary issue with the payment gateway</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>The card details entered might be incorrect</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">What can you do?</h3>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Try again with the same payment method</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use a different payment method</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contact your bank if the issue persists</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Button onClick={handleTryAgain} className="flex-1 bg-black text-white hover:bg-gray-800">
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={handleBackToDetails}
          className="flex-1 border-black text-black hover:bg-gray-100"
        >
          Change Details
        </Button>
      </div>
    </div>
  )
}
