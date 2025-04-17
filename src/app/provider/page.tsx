"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-toastify";
import {
  isServicePartner,
  registerServicePartner,
} from "@/src/actions/provider";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loading from "@/src/app/loading"; // Clerk Authentication Hook

const MAX_FILE_SIZE_MB = 5; // 5MB max file size

export default function ServicePartnerForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser(); // Get user authentication details

  // Initialize form with user name and email from Clerk
  const [form, setForm] = useState({
    fullName: "",
    userId: "",
    email: "",
    phone: "",
    experience: "",
    bio: "",
    upi: "",
    serviceAreas: "",
  });

  const [idCard, setIdCard] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [load, setload] = useState(true);
  // Prefill user details once Clerk data is available
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        userId: user.id || "",
      }));
      setload(false);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.includes("pdf")) {
      toast.error("Only image or PDF files are allowed!");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setIdCard(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const resetForm = () => {
    setForm({
      fullName: user?.firstName + " " + user?.lastName || "",
      userId: user?.id || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phone: "",
      experience: "",
      bio: "",
      upi: "",
      serviceAreas: "",
    });
    setIdCard(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to register!");
      return;
    }

    if (!form.experience || !form.serviceAreas || !idCard) {
      return toast.error("Please fill out all required fields!");
    }

    if (isNaN(Number(form.experience)) || Number(form.experience) < 1) {
      return toast.error("Experience must be at least 1 year.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      formData.append("idCard", idCard);
      const result = await registerServicePartner(formData);

      if (result.success) {
        toast.success("Registered successfully!");
        resetForm();
        router.push("/");
      } else {
        toast.error(result.error || "Error registering service partner.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      const res = isServicePartner(user?.id);
      res.then((res) => {
        if (res?.data?.status === "pending") {
          toast.error("Please wait for admin approval!");
          router.push("/provider");
          return;
        }
        if (res?.data?.status === "rejected") {
          toast.error(
            "Your documents are rejected by admin! Please Register as service partner again!"
          );
          router.push("/provider");
          return;
        }
        if (res?.data?.status === "approved") {
          router.push("/partners");
          return;
        }
      });
    }
  }, [user]);
  if (load) {
    return <Loading />;
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-white shadow-xl rounded-lg border border-gray-400">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Register as a Service Partner
      </h1>

      {!user && (
        <div className="mb-6 p-4 bg-gray-50 border-l-4 border-gray-900 rounded">
          <p className="text-gray-700 font-semibold">
            ⚠ You must be logged in to register.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name (Disabled) */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={form.fullName}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Email (Disabled) */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700"
          >
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            value={form.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Other Editable Fields */}
        {[
          { id: "phone", label: "Phone Number", type: "tel", required: true },
          { id: "address", label: "Address", type: "text", required: true },
          {
            id: "serviceAreas",
            label: "Service Areas (comma-separated pincodes/cities)",
            type: "text",
            required: true,
          },
          {
            id: "experience",
            label: "Experience (years)",
            type: "number",
            required: true,
            min: "1",
          },
          { id: "bio", label: "Bio", component: Textarea },
          { id: "upi", label: "UPI ID", type: "text" },
        ].map(({ id, label, component: Component = Input, ...rest }) => (
          <div key={id} className="space-y-2">
            <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
              {label}
            </Label>
            <Component
              id={id}
              name={id}
              placeholder={label}
              value={form[id as keyof typeof form]}
              onChange={handleChange}
              disabled={loading || !user}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              {...rest}
            />
          </div>
        ))}

        {/* File Upload */}
        <div className="space-y-2">
          <Label
            htmlFor="idCard"
            className="text-sm font-semibold text-gray-700"
          >
            Upload ID Card (Image)
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="idCard"
            disabled={loading || !user}
          />
          <label
            htmlFor="idCard"
            className="cursor-pointer flex items-center justify-center w-full h-12 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-lg"
          >
            {idCard ? "Change File" : "Choose File"}
          </label>
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="Preview" className="max-w-full h-auto" />
            </div>
          )}
        </div>

        <Button type="submit" disabled={loading || !user} className="w-full">
          {loading ? "Processing..." : "Submit Registration"}
        </Button>
      </form>
    </div>
  );
}
