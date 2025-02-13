"use client"; // Make sure the component is a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, getSession } from "next-auth/react"; // Import session hooks
import Skeleton from "react-loading-skeleton"; 
import "react-loading-skeleton/dist/skeleton.css"; 

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Access session
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Re-fetch the session on page load or after redirect to ensure we have updated data
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data) {
        setLoading(false);
      } else {
        router.push("/login"); // Redirect if no session found
      }
    };

    fetchSession();
  }, [router]); // Only run once on mount or when session changes

  // Handle loading state when the session is still loading
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-3xl w-full p-6 lg:p-10 bg-white shadow-lg rounded-lg">
          <header className="mb-6">
            <Skeleton width={250} height={30} />
            <Skeleton width={150} height={20} className="mt-2" />
          </header>
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              <Skeleton width={100} height={20} />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index}>
                  <Skeleton width="100%" height={20} />
                  <Skeleton width="100%" height={40} className="mt-2" />
                </div>
              ))}
            </div>
          </section>
          <div className="mt-8 flex justify-end">
            <Skeleton width={120} height={40} />
          </div>
        </div>
      </div>
    );
  }

  // Once the session is loaded, show the profile page content
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-3xl w-full p-6 lg:p-10 bg-white shadow-lg rounded-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
          </h1>
          <p className="text-sm text-gray-600">Manage your account details below.</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "First Name", value: session?.user|| "N/A" },
              { label: "Last Name", value: session?.user || "N/A" },
              { label: "Email Address", value: session?.user?.email || "N/A" },
              { label: "Birthdate", value: "Not Provided" },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-600">
                  {field.label}
                </label>
                <p className="mt-1 text-gray-800 font-semibold bg-gray-50 p-3 rounded-md shadow-sm">
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <button
            onClick={async () => {
              await router.push("/user/profile/edit"); // Redirect to profile edit page
            }}
            className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
