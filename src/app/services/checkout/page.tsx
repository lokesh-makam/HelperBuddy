"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoundStore } from '@/src/store/store';
import { OrderSummary } from '@/src/components/checkout/ordersummary';
import { CheckoutForm } from '@/src/components/checkout/checkoutform';
import { Alert } from '@/src/components/ui/alert';
import {toast} from "react-toastify";
import Script from "next/script";
import {createServiceRequest} from "@/src/actions/request";
import {useUser} from "@clerk/nextjs";

const CheckoutPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const cart:any = useBoundStore((state) => state.cart);
    const removeFromCart=useBoundStore((state) => state.removeFromCart);
    const clearCart=useBoundStore((state) => state.clearCart);
    const totalAmount = cart.reduce((sum: any, item: any) => sum + item.basePrice, 0);
    const {user}=useUser();
    const handleSubmit = async (e: React.FormEvent, formData: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            let paymentStatus = "Pending";

            // ✅ Handle Online Payment
            if (formData.paymentMethod === "card") {
                try {
                    const res = await fetch("/api/createOrder", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount: totalAmount * 100 }),
                    });

                    if (!res.ok) throw new Error("Failed to create payment order.");

                    const data = await res.json();

                    const paymentData = {
                        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                        order_id: data.id,
                        handler: async function (response: any) {
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

                                if (!verifyRes.ok) throw new Error("Payment verification failed.");

                                const result = await verifyRes.json();
                                if (result.isOk) {
                                    paymentStatus = "Completed";
                                    toast.success("Payment Successful!");
                                    await createServiceRequests(formData, paymentStatus);
                                } else {
                                    toast.error("Payment Failed. Please try again.");
                                    setStep(1);
                                    return;
                                }
                            } catch (error) {
                                console.error("Error verifying payment:", error);
                                toast.error("Payment verification failed.");
                                setStep(1);
                                return;
                            }
                        },
                    };

                    const payment = new (window as any).Razorpay(paymentData);
                    payment.open();
                } catch (error) {
                    console.error("Payment Error:", error);
                    toast.error("Payment failed. Please try again.");
                    setStep(1);
                    return;
                }
            } else {
                // ✅ Handle COD Orders Directly

                await createServiceRequests(formData, paymentStatus);

            }
        } catch (error) {
            console.error("Checkout Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Server Action Call (Handles Each Service Request Separately)
    const createServiceRequests = async (formData: any, paymentStatus: string) => {
        try {
            const failedItems = [];
            console.log(formData)
            for (const item of cart) {
                     const result= await createServiceRequest({
                        userId: user?.id,
                        serviceId: item.id,
                        status: "pending",
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        postalCode: formData.postalCode,
                        paymentStatus: paymentStatus,
                        paymentMethod: formData.paymentMethod,
                        amount: totalAmount
                    });
                    if(!result.success){
                        failedItems.push(item.id);
                    }
            }
            if (failedItems.length > 0) {
                toast.error(`Failed to place orders for ${failedItems.length} items.`);
                setStep(1);
                return;
            }
            // ✅ Clear Cart Only If All Requests Succeed
            clearCart();
            setStep(3);
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error("Service Request Error:", error);
            toast.error("Order placement failed. Please try again.");
            setStep(1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <Script
                type="text/javascript"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <CheckoutForm
                            step={step}
                            setStep={setStep}
                            loading={loading}
                            onSubmit={handleSubmit}
                        />
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary cart={cart} totalAmount={totalAmount} />
                        {step === 2 && (
                            <Alert className="mt-4">
                                Your order will be processed securely. We do not store your card details.
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
