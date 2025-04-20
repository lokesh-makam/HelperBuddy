"use client";

import React, { useEffect, useState } from "react";
import { SearchBar } from "@/src/components/other/searchbar";
import { Filters } from "@/src/components/other/filter";
import { ServicesGrid } from "@/src/components/other/servicesgrid";
import { useBoundStore } from "@/src/store/store";
import { getServices } from "@/src/actions/updateservice";
import Loading from "@/src/app/loading";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading,setIsLoading]=useState(true);
  const [isError, setIsError] = useState(false);
  const router=useRouter();
  const services = useBoundStore((state) => state.services);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const  { success, services } = await getServices();  // Fetch services from the backend
        if (success) {
          useBoundStore.getState().setServices(services); // Store services in state
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setIsError(true);  // Set error state if the request fails
      } finally {
        setIsLoading(false);  // Set loading to false once the request is complete
      }
    };
    fetchServices();  // Call the fetch function on component mount
  }, []);  // Empty dependency array means it runs once on mount
  if (isLoading) {
    return <Loading/>;  // Show a loading message or spinner
  }
  if (isError) {
    toast.error("Services not fetched.");
    router.push('/');// Show an error message
    return null;
  }
  const filteredServices = (services || []).filter((service) => {
    const matchesCategory =
        selectedCategory === "All Products" ||
        service.category === selectedCategory;
    const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating =
        selectedRating === "All Ratings" ||
        service.rating >= parseFloat(selectedRating);
    const matchesPrice =
        selectedPrice === "All Prices" ||
        (selectedPrice === "Under ₹50" && service.basePrice < 50) ||
        (selectedPrice === "₹50 - ₹100" &&
            service.basePrice >= 50 &&
            service.basePrice <= 100) ||
        (selectedPrice === "Above ₹100" && service.basePrice > 100);

    return matchesCategory && matchesSearch && matchesRating && matchesPrice;
  });
  console.log(filteredServices)
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navbar Placeholder */}
        <div className="h-16"></div>
        <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-grey-200 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {/* Search Bar (takes most space but not all) */}
              <div className="flex-1">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
              </div>
              <div className="flex-shrink-0">
                <Filters
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedRating={selectedRating}
                    setSelectedRating={setSelectedRating}
                    selectedPrice={selectedPrice}
                    setSelectedPrice={setSelectedPrice}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ServicesGrid services={filteredServices} />
        </div>
      </div>
  );
};

export default ServicesPage;