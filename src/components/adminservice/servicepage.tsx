"use client";

import React, { useEffect, useState } from "react";
import { SearchBar } from "@/src/components/other/searchbar";
import { Filters } from "@/src/components/other/filter";
import { ServicesGrid } from "@/src/components/adminservice/servicegrid";
import { useBoundStore } from "@/src/store/store";
import { getServices } from "@/src/actions/updateservice";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/src/app/loading";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ServicesPage = ({ searchQuery }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const services = useBoundStore((state) => state.services);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const { success, services } = await getServices(); // Fetch services from the backend
        if (success) {
          useBoundStore.getState().setServices(services); // Store services in state
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setIsError(true); // Set error state if the request fails
      } finally {
        setIsLoading(false); // Set loading to false once the request is complete
      }
    };
    fetchServices(); // Call the fetch function on component mount
  }, []); // Empty dependency array means it runs once on mount
  if (isLoading) {
    return <Loading />; // Show a loading message or spinner
  }
  if (isError) {
    toast.error("Services not fetched.");
    router.push("/"); // Show an error message
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <ServicesGrid services={services} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default ServicesPage;
