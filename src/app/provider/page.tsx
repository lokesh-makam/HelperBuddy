"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-toastify";
import { registerServicePartner } from "@/src/actions/provider";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Clerk Authentication Hook

const MAX_FILE_SIZE_MB = 5; // 5MB max file size

export default function ServicePartnerForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user} = useUser(); // Get user authentication status

    const [form, setForm] = useState({
        experience: "",
        bio: "",
        upi: "",
        serviceAreas: "",
    });

    const [idCard, setIdCard] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

        // **Check if user is logged in**
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

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Register as a Service Partner</h1>

            {/* Show login warning if user is not logged in */}
            {!user && (
                <p className="mb-4 text-red-600 font-semibold">
                    ⚠ You must be logged in to register.
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {[
                    { id: "serviceAreas", label: "Service Areas (comma-separated pincodes/cities)", type: "text", required: true },
                    { id: "experience", label: "Experience (years)", type: "number", required: true, min: "1" },
                    { id: "bio", label: "Bio", component: Textarea },
                    { id: "upi", label: "UPI ID", type: "text" },
                ].map(({ id, label, component: Component = Input, ...rest }) => (
                    <div key={id}>
                        <Label htmlFor={id}>{label}</Label>
                        <Component
                            id={id}
                            name={id}
                            placeholder={label}
                            value={form[id as keyof typeof form]}
                            onChange={handleChange}
                            disabled={loading || !user} // Disable input if user is not logged in
                            {...rest}
                        />
                    </div>
                ))}

                {/* File Upload */}
                <div>
                    <Label htmlFor="idCard">Upload ID Card (Image/PDF)</Label>
                    <div className="relative">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="idCard"
                            disabled={loading || !user} // Disable if user is not logged in
                        />
                        <label
                            htmlFor="idCard"
                            className={`cursor-pointer flex items-center justify-center w-full h-12 rounded-md transition ${
                                user ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-400 text-gray-600 cursor-not-allowed"
                            }`}
                        >
                            {idCard ? "Change File" : "Choose File"}
                        </label>
                    </div>
                    {preview && (
                        <div className="mt-2">
                            {idCard?.type.includes("pdf") ? (
                                <iframe
                                    src={preview}
                                    title="PDF Preview"
                                    className="w-full h-64 border rounded-lg"
                                ></iframe>
                            ) : (
                                <img
                                    src={preview}
                                    alt="ID Card Preview"
                                    className="w-full h-48 object-cover rounded-lg shadow-md"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={loading || !user} className="w-full">
                    {loading ? "Registering..." : "Register"}
                </Button>
            </form>
        </div>
    );
}
