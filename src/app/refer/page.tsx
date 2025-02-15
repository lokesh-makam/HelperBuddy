"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk authentication
import { getReferralCode, enterReferralCode } from "@/src/actions/referal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Referral() {
    const { user, isLoaded } = useUser(); // Get user info from Clerk
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [inputCode, setInputCode] = useState("");

    // Fetch referral code when button is clicked
    const fetchReferralCode = async () => {
        if (!user) {
            toast.error("You must be logged in to get a referral code!");
            return;
        }
        const code = await getReferralCode(user.id);
        console.log(code)
        setReferralCode(code);
    };

    // Enter referral code
    const handleEnterReferral = async () => {
        if (!user) {
            toast.error("You must be logged in to enter a referral code!");
            return;
        }
        const response = await enterReferralCode(user.id, inputCode);
        if (response.error) {
            toast.error(response.error);
        } else {
            toast.success(response.success);
            setInputCode("");
        }
    };

    if (!isLoaded) return <p>Loading...</p>;

    return (
        <div className="p-6 bg-white shadow-md rounded-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Referral Program</h2>

            {user ? (
                <>
                    {/* Get Referral Code */}
                    <div className="mb-4">
                        <p className="text-gray-600">Your Referral Code:</p>
                        <p className="text-xl font-bold text-blue-600">
                            {referralCode || "Click to generate"}
                        </p>
                        <button
                            onClick={fetchReferralCode}
                            className="mt-2 bg-blue-500 text-white p-2 rounded-md w-full"
                        >
                            Generate Referral Code
                        </button>
                    </div>

                    {/* Enter Referral Code */}
                    <div className="mb-4">
                        <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="Enter referral code"
                            className="border p-2 w-full rounded-md"
                        />
                        <button
                            onClick={handleEnterReferral}
                            className="bg-green-500 text-white p-2 rounded-md w-full mt-2"
                        >
                            Submit Referral Code
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-red-500 text-center">Please log in to access the referral program.</p>
            )}
        </div>
    );
}
