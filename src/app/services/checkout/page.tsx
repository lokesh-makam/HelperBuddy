"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { useBoundStore } from "@/src/store/store";
import OrderSummary from "@/src/components/checkout1/order-summary";
import { CheckoutProvider } from "@/src/components/checkout1/checkout-context";
import PersonalDetailsStep from "@/src/components/checkout1/steps/personal-details-step";
import PaymentStep from "@/src/components/checkout1/steps/payment-step";
import SuccessStep from "@/src/components/checkout1/steps/success-step";
import FailureStep from "@/src/components/checkout1/steps/failure-step";
import { Alert } from "@/src/components/ui/alert";
import { toast } from "react-toastify";
import Script from "next/script";
import { createServiceRequest } from "@/src/actions/request";
import { useUser } from "@clerk/nextjs";
import Loading from "@/src/app/loading";
import { getwallet } from "@/src/actions/referal";

export default function CheckoutPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string | undefined>();
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failure" | null
  >(null);
  const { user } = useUser();
  const [loader, setloader] = useState<boolean>(true);
  useEffect(() => {
    if (user) {
      setloader(false);
    }
  }, [user]);
  const fun = async () => {
    return await getwallet(user?.id);
  };
  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      let paymentStatus = "Pending";
      console.log(formData);
      if (formData.paymentMethod === "razorpay") {
        try {
          const res = await fetch("/api/createOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: formData.amountToPay * 100 }),
          });

          if (!res.ok) throw new Error("Failed to create payment order.");

          const data = await res.json();

          const paymentData = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            order_id: data.id,
            handler: async (response: any) => {
              try {
                const verifyRes = await fetch("/api/verifyOrder", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  }),
                });

                if (!verifyRes.ok)
                  throw new Error("Payment verification failed.");

                const result = await verifyRes.json();
                if (result.isOk) {
                  paymentStatus = "Completed";
                  toast.success("Payment Successful!");
                  await createServiceRequests(formData, paymentStatus);
                } else {
                  toast.error("Payment Failed. Please try again.");
                  setPaymentStatus("failure");
                  setStep(4);
                  return;
                }
              } catch (error) {
                console.error("Error verifying payment:", error);
                toast.error("Payment verification failed.");
                setPaymentStatus("failure");
                setStep(4);
                return;
              }
            },
          };

          const payment = new (window as any).Razorpay(paymentData);
          payment.open();
        } catch (error) {
          console.error("Payment Error:", error);
          toast.error("Payment failed. Please try again.");
          setPaymentStatus("failure");
          setStep(4);
          return;
        }
      } else {
        // Handle COD Orders Directly
        await createServiceRequests(formData, paymentStatus);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Something went wrong. Please try again.");
      setPaymentStatus("failure");
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const createServiceRequests = async (
    formData: any,
    paymentStatus: string
  ) => {
    try {
      setLoading(true);
      const cart = useBoundStore.getState().cart;
      const clearCart = useBoundStore.getState().clearCart;

      const failedItems = [];

      const useWallet = formData.useWallet;
      const totalTax = formData.tax;
      const totalShipping = formData.shippingCost;
      const totalWallet = useWallet ? (await fun()) || 0 : 0;

      const totalItemAmount = cart.reduce(
        (sum, item) => sum + item.basePrice * item.quantity,
        0
      );
      let remainingWallet = totalWallet;

      for (const item of cart) {
        const itemAmount = item.basePrice * item.quantity;
        const itemShare = itemAmount / totalItemAmount;

        const itemTax = Math.round(totalTax * itemShare);
        const itemShipping = Math.round(totalShipping * itemShare);
        const itemTotalBeforeWallet = itemAmount + itemTax + itemShipping;

        let walletUsed = 0;
        let finalAmount = itemTotalBeforeWallet;

        if (useWallet && remainingWallet > 0) {
          walletUsed = Math.min(itemTotalBeforeWallet, remainingWallet);
          finalAmount = itemTotalBeforeWallet - walletUsed;
          remainingWallet -= walletUsed;
        }

        const result = await createServiceRequest({
          userId: user?.id,
          serviceId: item.id,
          status: "pending",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          houseNo: formData.houseNo,
          street: formData.street || formData.streetAddress || "",
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          addressType: formData.addressType,
          serviceDate: new Date(formData.serviceDate),
          serviceTime: formData.serviceTime,

          cartTotal: itemAmount,
          tax: itemTax,
          shippingCost: itemShipping,
          orderTotal: itemTotalBeforeWallet,
          walletBalance: remainingWallet,
          walletAmountUsed: walletUsed,
          amountToPay: finalAmount,
          useWallet: useWallet,

          paymentStatus: paymentStatus,
          paymentMethod: formData.paymentMethod,
        });

        if (!result.success) {
          failedItems.push(item.id);
        }
      }

      if (failedItems.length > 0) {
        toast.error(`Failed to place orders for ${failedItems.length} items.`);
        setStep(1);
        return;
      }

      clearCart();
      setPaymentStatus("success");
      setStep(3);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Service Request Error:", error);
      toast.error("Order placement failed. Please try again.");
      setPaymentStatus("failure");
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  if (loader) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <CheckoutProvider>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && <PersonalDetailsStep setStep={setStep} />}
              {step === 2 && (
                <PaymentStep
                  setStep={setStep}
                  loading={loading}
                  error={error}
                  onSubmit={handleSubmit}
                />
              )}
              {step === 3 && paymentStatus === "success" && (
                <SuccessStep setStep={setStep} />
              )}
              {step === 4 && paymentStatus === "failure" && (
                <FailureStep setStep={setStep} />
              )}
            </div>
            <div className="lg:col-span-1">
              <OrderSummary />
              {step === 2 && (
                <Alert className="mt-4">
                  Your order will be processed securely. We do not store your
                  card details.
                </Alert>
              )}
            </div>
          </div>
        </div>
      </CheckoutProvider>
    </div>
  );
}
