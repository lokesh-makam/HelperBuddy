"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoundStore } from '@/src/store/store';
import { OrderSummary } from '@/src/components/checkout/ordersummary';
import { CheckoutForm } from '@/src/components/checkout/checkoutform';
import { Alert } from '@/src/components/ui/alert';

const CheckoutPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const cart:any = useBoundStore((state) => state.cart);

    const totalAmount = cart.reduce((sum: any, item: any) => sum + item.basePrice, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
        // Show success state
        setStep(3);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20">
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
