"use client";

import React, { useEffect, useState } from "react";
import { getServices } from "@/src/actions/admin";
import ServicePage from "@/src/components/adminservice/servicepage";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus } from "lucide-react";
import ServiceForm from "@/src/components/other/registerservice"; // Import the ServiceForm component


export default function ServiceManagement() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

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
        <Button
          className="w-full sm:w-auto"
          size="default"
          onClick={handleAddServiceClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>
      <ServicePage searchQuery={searchQuery}/>
      {/* Modal for Add Service */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <ServiceForm onClose={handleCloseModal}/>
          </div>
        </div>
      )}
    </div>
  );
}