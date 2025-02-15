"use client";

import { useState } from "react";
import Script from "next/script";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [amount1, setAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createOrder = async () => {
        let amount=parseInt(amount1);
        if (amount<= 0) {
            toast.error("Please enter a valid amount!");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/createOrder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amount * 100 }),
            });

            const data = await res.json();

            const paymentData = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                order_id: data.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/verifyOrder", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            orderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });

                    const result = await verifyRes.json();
                    if (result.isOk) {
                        toast.success("Payment Successful!");
                    } else {
                        toast.error("Payment Failed. Please try again.");
                    }
                },
            };

            const payment = new (window as any).Razorpay(paymentData);
            payment.open();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-screen h-screen items-center justify-center bg-gray-900">
            <Script
                type="text/javascript"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col items-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Make a Payment</h1>

                <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={amount1}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[0-9]+$/.test(value)) {
                            setAmount(value);
                        }
                    }}
                />
                <button
                    className={`w-full mt-4 px-4 py-2 rounded-md text-white font-medium transition ${
                        isLoading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500"
                    }`}
                    onClick={createOrder}
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Proceed to Pay"}
                </button>
            </div>
        </div>
    );
}
