"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { updateService } from "@/src/actions/services";
import {useBoundStore} from "@/src/store/store"; // <-- replace with your edit action

const MAX_FILE_SIZE_MB = 5;

interface EditServiceFormProps {
    onClose: () => void;
    service: any;
}

export default function EditServiceForm({ onClose, service }: EditServiceFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const setServices = useBoundStore((state) => state.setServices);
    const services=useBoundStore((state)=>state.services);
    const [form, setForm] = useState({
        name: service.name || "",
        description: service.description || "",
        category: service.category || "",
        basePrice: service.basePrice || "",
        estimatedTime: service.estimatedTime || "",
        includes: service.includes || "",
        imageUrl: service.imageUrl || ""
    });

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(service.imageUrl);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.category || !form.basePrice || !form.includes) {
            return toast.error("Please fill out all required fields!");
        }

        if (isNaN(Number(form.basePrice)) || Number(form.basePrice) < 0) {
            return toast.error("Base Price must be a valid number and >= 0.");
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("serviceId", service.id); // or service._id
            Object.entries(form).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            if (image) {
                formData.append("file", image);
            }

            const result = await updateService(service.id,formData); // Replace this with your edit handler
            if(result.success) {
                const data = services.map(item => item.id === service.id ? result.service : item);
                setServices(data);
            }
            if (result.success) {
                toast.success("Service updated successfully!");
                onClose();
            } else {
                toast.error(result.error || "Error updating service.");
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
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { id: "name", label: "Service Name", type: "text", required: true },
                            { id: "description", label: "Description", component: Textarea },
                            { id: "category", label: "Category", type: "text", required: true },
                            { id: "basePrice", label: "Base Price", type: "number", required: true, min: "0" },
                            { id: "includes", label: "Includes (comma separated)", type: "text" },
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
                            <Label htmlFor="fileUpload">Upload New Image (optional)</Label>
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
                                    {"Change Image"}
                                </label>
                            </div>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-2 w-full h-48 object-cover rounded-lg shadow-md"
                                />
                            )}
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Updating..." : "Update Service"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
