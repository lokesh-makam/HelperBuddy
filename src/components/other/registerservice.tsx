"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-toastify";
import { addService } from "@/src/actions/services";
import { useRouter } from "next/navigation";
import { X } from "lucide-react"; // Import a close icon

const MAX_FILE_SIZE_MB = 5;

interface ServiceFormProps {
    onClose: () => void; // Callback to close the modal
}

export default function ServiceForm({ onClose }: ServiceFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal container

    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        basePrice: "",
        estimatedTime: "",
        includes: ""
    });

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Close the modal when clicking outside the form
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose(); // Close the modal
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

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

        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed!");
            return;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
        e.target.value = "";
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            category: "",
            basePrice: "",
            estimatedTime: "",
            includes: ""
        });
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.category || !form.basePrice || !image|| !form.includes) {
            return toast.error("Please fill out all required fields!");
        }

        if (isNaN(Number(form.basePrice)) || Number(form.basePrice) < 0) {
            return toast.error("Base Price must be a valid number and greater than or equal to 0.");
        }

        setLoading(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });
            formData.append("file", image);
            console.log(formData.getAll("file"));
            const result = await addService(formData);

            if (result.success) {
                toast.success("Service added successfully!");
                resetForm();
                onClose(); // Close the modal after successful submission
            } else {
                toast.error(result.error || "Error adding service.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Add Service</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { id: "name", label: "Service Name", type: "text", required: true },
                            { id: "description", label: "Description", component: Textarea },
                            { id: "category", label: "Category", type: "text", required: true },
                            { id: "basePrice", label: "Base Price", type: "number", required: true, min: "0" },
                            { id: "includes", label: "Includes(comma seperated)", type: "text" },
                            { id: "estimatedTime", label: "Estimated Time", type: "text" },
                        ].map(({ id, label, component: Component = Input, ...rest }) => (
                            <div key={id}>
                                <Label htmlFor={id}>{label}</Label>
                                <Component
                                    id={id}
                                    name={id}
                                    placeholder={label}
                                    value={form[id as keyof typeof form]}
                                    onChange={handleChange}
                                    disabled={loading}
                                    {...rest}
                                />
                            </div>
                        ))}

                        {/* File Upload */}
                        <div>
                            <Label htmlFor="fileUpload">Upload Image</Label>
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="fileUpload"
                                    disabled={loading}
                                />
                                <label
                                    htmlFor="fileUpload"
                                    className="cursor-pointer flex items-center justify-center w-full h-12 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                                >
                                    {image ? "Change Image" : "Choose Image"}
                                </label>
                            </div>
                            {preview && <img src={preview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg shadow-md" />}
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Adding..." : "Add Service"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}