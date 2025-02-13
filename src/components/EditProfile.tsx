"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, getSession } from "next-auth/react";  // Import next-auth session hook
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Access session data

  // Local state to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the backend API to save changes
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // Show success toast
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Wait a moment before redirecting
      setTimeout(async () => {
        // Fetch the latest session after the profile update
        const updatedSession = await getSession();
        if (updatedSession?.user) {
          // Now the session data is refreshed
          router.push("/user/profile"); // Redirect to profile
        } else {
          router.push("/login"); // Redirect to login if the session is invalid
        }
      }, 3000);
    } catch (error) {
      console.error(error);

      // Show error toast
      toast.error("Failed to update profile. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  if (status === "loading") {
    // Optionally, show a loading state while the session is loading
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    // If there's no session, handle this case (redirect, show error, etc.)
    return <div>Please sign in to edit your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-600 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-600 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      {/* Toast Container for Notifications */}
      <ToastContainer />
    </div>
  );
}
