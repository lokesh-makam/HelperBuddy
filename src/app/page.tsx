"use client";

import Home from "@/src/components/Home";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { saveUserToDatabase } from "@/src/actions/user";
import Loading from "@/src/app/loading";
import { enterReferralCode } from "@/src/actions/referal";
import { toast } from "react-toastify";

let Main = () => {
  const { user, isLoaded } = useUser();
  const [referal, setReferal] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  useEffect(() => {
    const handleUserCheck = async () => {
      if (!isLoaded || !user) return;
      const res = await saveUserToDatabase({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstname: user.firstName || "",
        lastname: user.lastName || "",
      });
      if (res.success) setReferal(true);
    };
    handleUserCheck();
  }, [isLoaded, user]);
  const handleReferralSubmit = () => {
    if (referralCode.trim()) {
      // Handle referral code submission logic
      console.log("Referral Code Submitted:", referralCode);
      //@ts-ignore
      enterReferralCode(user.id, referralCode).then((res) => {
        if (res.success) {
          toast.success(res.success);
          setReferal(false);
        } else {
          toast.error(res.error);
        }
      }); // Close popup on submit
    }
  };

  if (!isLoaded) return <Loading />;

  return (
    <>
      <Home />
      {/* Popup for entering referral code */}
      {referal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Enter Referral Code</h2>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter referral code"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReferal(false)}
                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={handleReferralSubmit}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Main;