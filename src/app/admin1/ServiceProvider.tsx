"use client";

import { useEffect, useState } from "react";
import { getAllServicePartners, approveServicePartner, removeServicePartner, rejectServicePartner } from "@/src/actions/servicePartnerActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

interface ServiceProvider {
  id: string;
  fullName: string;
  serviceAreas: string[];
  experience: number;
  email: string;
  phone: string;
  address: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  idCard?: string;
}

export default function AdminServiceProviders() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State to track the selected image

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      const providers = await getAllServicePartners();
      setServiceProviders(providers);
    }
    fetchData();
  }, []);

  // Handle Approval
  const handleApprove = async (id: string) => {
    await approveServicePartner(id);
    setServiceProviders((prev) =>
        prev.map((provider) => (provider.id === id ? { ...provider, status: "approved" } : provider))
    );
  };

  // Handle Rejection
  const handleReject = async (id: string) => {
    await rejectServicePartner(id);
    setServiceProviders((prev) =>
        prev.map((provider) => (provider.id === id ? { ...provider, status: "rejected" } : provider))
    );
  };

  // Handle Removal
  const handleRemove = async (id: string) => {
    await removeServicePartner(id);
    setServiceProviders((prev) => prev.filter((provider) => provider.id !== id));
  };

  // Filtered Providers
  const filteredProviders = serviceProviders.filter((provider) => {
    const matchesSearch = provider.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || provider.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle Image Click
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Close Image Modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Service Providers Review Panel</h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/2"
          />
          <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/4"
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Provider Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                  <Card key={provider.id} className="rounded-2xl transform transition-all duration-300 hover:shadow-2xl">
                    <CardHeader>
                      <img
                          src={provider.idCard || "https://via.placeholder.com/150"}
                          alt={provider.fullName}
                          className="w-full h-40 object-cover rounded-t-2xl cursor-pointer"
                          onClick={() => provider.idCard && handleImageClick(provider.idCard)}
                      />
                      <CardTitle className="mt-3">{provider.fullName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-800"><strong>Service Areas:</strong> {provider.serviceAreas.join(", ")}</p>
                      <p className="text-gray-800"><strong>Experience:</strong> {provider.experience} years</p>
                      <p className="text-gray-800"><strong>Email:</strong> {provider.email}</p>
                      <p className="text-gray-800"><strong>Phone:</strong> {provider.phone}</p>
                      <p className="text-gray-800"><strong>Address:</strong> {provider.address}</p>
                      <p className="text-gray-800"><strong>Rating:</strong> {provider.rating}</p>
                      <p className="text-gray-800"><strong>Status:</strong> {provider.status}</p>

                      {/* Approve/Reject/Remove Buttons */}
                      {provider.status === "pending" ? (
                          <div className="flex gap-2 mt-3">
                            <Button onClick={() => handleApprove(provider.id)} className="w-full bg-green-500 text-white hover:bg-green-700">
                              Approve
                            </Button>
                            <Button onClick={() => handleReject(provider.id)} className="w-full bg-yellow-500 text-white hover:bg-yellow-700">
                              Reject
                            </Button>
                          </div>
                      ) : provider.status === "approved" ? (
                          <Button onClick={() => handleRemove(provider.id)} className="w-full bg-red-500 text-white hover:bg-red-700 mt-3">
                            Remove
                          </Button>
                      ) : (
                          <p className="text-red-600 font-semibold text-center mt-3">Rejected</p>
                      )}
                    </CardContent>
                  </Card>
              ))
          ) : (
              <p className="text-center col-span-full text-gray-600">No matching service providers found.</p>
          )}
        </div>

        {/* Image Pop-Up Modal */}
        {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageModal}>
              <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                <img src={selectedImage} alt="Enlarged ID Card" className="w-full h-auto rounded-lg" />
              </div>
            </div>
        )}
      </div>
  );
}