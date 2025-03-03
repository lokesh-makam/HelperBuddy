"use client";

import React, { useEffect, useState } from "react";
import { getServices } from "@/src/actions/admin";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { MessageSquare, Plus, Pencil } from "lucide-react";
import ServiceForm from "@/src/components/other/registerservice"; // Import the ServiceForm component

interface Service {
    id: string;
    serviceName: string;
    description?: string;
    category: string;
    basePrice: number;
    estimatedTime?: string;
    rating?: number;
    imageUrl?: string;
    numberOfRequests: number;
}

export default function ServiceManagement() {
    const [services, setServices] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        async function fetchServices() {
            const data: Service[] = await getServices();
            setServices(data);
        }
        fetchServices();
    }, []);

    const filteredServices = services.filter((service) =>
        service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddServiceClick = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Service Management
                </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-1/2 shadow-sm"
                />
                <Button className="w-full sm:w-auto" size="default" onClick={handleAddServiceClick}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                </Button>
            </div>

            {/* Modal for Add Service */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <ServiceForm onClose={handleCloseModal} />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                    <Card
                        key={service.id}
                        className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-0 max-w-sm"
                    >
                        {service.imageUrl && (
                            <div className="relative w-full h-[45vh] overflow-hidden">
                                <img
                                    src={service.imageUrl}
                                    alt={service.serviceName}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full shadow-sm">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>
                        <CardHeader className="space-y-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    {service.serviceName}
                                </CardTitle>
                            </div>
                            <div className="text-md font-semibold text-gray-600">
                                Price: Rs {service.basePrice}
                            </div>
                            <div className="text-md font-semibold text-gray-600">
                                Description: {service.description}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                                        {service.category}
                                    </span>
                                    <span className="px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 rounded-full">
                                        {service.estimatedTime ?? "N/A"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-1">
                                    <span className="text-yellow-400 text-lg">⭐</span>
                                    <span className="font-medium">
                                        {service.rating ?? "No Rating"}/5
                                    </span>
                                </div>
                                <div className="flex items-center text-blue-600">
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    <span className="font-medium">{service.numberOfRequests}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}