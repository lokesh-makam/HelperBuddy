"use client"

import { useCheckout } from "@/src/components/checkout1/checkout-context"
import { Button } from "@/src/components/ui/button"
import { CheckCircle2, Package, Clock, MapPin, Home, FileText, Share2, Printer } from "lucide-react"
import { FaIndianRupeeSign } from "react-icons/fa6"
import { useState, useEffect } from "react"
import { motion } from "framer-motion" // Note: You'll need to install framer-motion

export default function SuccessStep({ setStep }: { setStep: (step: number) => void }) {
  const { formData } = useCheckout()
  const [orderNumber, setOrderNumber] = useState("")

  // Generate a random order number on component mount
  useEffect(() => {
    const randomOrderId = Math.floor(100000 + Math.random() * 900000).toString()
    setOrderNumber(`ORD-${randomOrderId}`)
  }, [])

  const handleContinueShopping = () => {
    setStep(1)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Order Confirmation',
          text: `Order #${orderNumber} has been confirmed!`,
        })
      } catch (err) {
        console.error('Could not share', err)
      }
    } else {
      alert('Web Share API not supported in your browser')
    }
  }

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-8 text-center max-w-3xl mx-auto"
      >
        {/* Success icon with animation */}
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative mb-6"
        >
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={56} className="text-green-600" />
          </div>
          <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -right-2 -bottom-2 bg-white rounded-full p-1 shadow-md"
          >
            <div className="bg-black text-white rounded-full p-2">
              <FaIndianRupeeSign size={18} />
            </div>
          </motion.div>
        </motion.div>

        <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-2 max-w-md">
          Your order has been confirmed and will be processed shortly.
        </p>
        <p className="text-gray-600 mb-6 max-w-md">
          We've sent the details to <span className="font-medium">{formData.email}</span>
        </p>

        {/* Order ID banner */}
        <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-black text-white p-2 rounded-lg mr-3">
              <FileText size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{orderNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share order"
                title="Share order"
            >
              <Share2 size={18} className="text-gray-600" />
            </button>
            <button
                onClick={handlePrint}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Print receipt"
                title="Print receipt"
            >
              <Printer size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4 mb-8">
          {/* Order Summary Card */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
          >
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Package className="mr-2 text-gray-700" /> Order Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium">{new Date().toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}</span>
              </div>

              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-600">Delivery Date</span>
                <span className="font-medium">{formData.serviceDate}</span>
              </div>

              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-600">Delivery Time</span>
                <span className="font-medium">{formData.serviceTime}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium capitalize">
                {formData.paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery"}
              </span>
              </div>
            </div>
          </motion.div>

          {/* Delivery Address Card */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
          >
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <MapPin className="mr-2 text-gray-700" /> Delivery Address
            </h3>
            <div className="text-left">
              <p className="font-medium text-lg">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="text-gray-600 mt-2">{formData.address}</p>
              {formData.addressLine2 && <p className="text-gray-600">{formData.addressLine2}</p>}
              <p className="text-gray-600">
                {formData.city}, {formData.state} {formData.postalCode}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center">
                <div className="p-1 bg-gray-100 rounded-full mr-2">
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <CheckCircle2 size={14} />
                  </div>
                </div>
                <p className="text-gray-600">{formData.phone}</p>
              </div>
            </div>
          </motion.div>

          {/* Next Steps Card */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
          >
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Clock className="mr-2 text-gray-700" /> Next Steps
            </h3>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start">
                <div className="min-w-6 h-6 flex items-center justify-center bg-green-100 rounded-full mr-3 text-green-600">
                  1
                </div>
                <span>You'll receive a confirmation email shortly</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full mr-3 text-blue-600">
                  2
                </div>
                <span>Our team will contact you to confirm details</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full mr-3 text-purple-600">
                  3
                </div>
                <span>Your order will arrive at the scheduled time</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-6">
          <Button
              onClick={handleContinueShopping}
              className="flex-1 bg-black text-white hover:bg-gray-800 py-6"
          >
            <Home size={18} className="mr-2" /> Return to Home
          </Button>
          <Button
              variant="outline"
              onClick={handlePrint}
              className="flex-1 border-black text-black hover:bg-gray-100 py-6"
          >
            <FileText size={18} className="mr-2" /> Print Order Details
          </Button>
        </div>

        {/* Customer support section */}
        <div className="text-center w-full max-w-md">
          <p className="text-gray-500 text-sm mb-2">Need help with your order?</p>
          <a href="#" className="text-blue-600 hover:underline text-sm font-medium">Contact Customer Support</a>
        </div>
      </motion.div>
  )
}