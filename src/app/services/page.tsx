"use client";

import React, {useEffect, useState} from "react";
import { useCart } from "@/src/context/CartContext";
import {SearchBar} from "@/src/components/other/searchbar";
import {Filters} from "@/src/components/other/filter";
import {ServicesGrid} from "@/src/components/other/servicesgrid";
import {useBoundStore} from "@/src/store/store";
import {getServices} from "@/src/actions/services";
import {useQuery} from "@tanstack/react-query";
import Loading from "@/src/app/loading";

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [searchQuery, setSearchQuery] = useState("");
  const setServices = useBoundStore((state) => state.setServices);
  const {data, isLoading,isError} = useQuery(
      {
        queryKey: ['service'],
        queryFn: getServices,
      }
  )
  useEffect(() => {
    if(data){
      // @ts-ignore
        setServices(data.services);
    }
  }, [data]);
  const services = useBoundStore((state) => state.services);
  if(isLoading) return <Loading/>
  if(isError) return <div>Error</div>
  const filteredServices = (services || []).filter((service) => {
    const matchesCategory =
        selectedCategory === "All Products" || service.category === selectedCategory;
    const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating =
        selectedRating === "All Ratings" || service.rating >= parseFloat(selectedRating);
    const matchesPrice =
        selectedPrice === "All Prices" ||
        (selectedPrice === "Under ₹50" && service.basePrice < 50) ||
        (selectedPrice === "₹50 - ₹100" && service.basePrice >= 50 && service.basePrice <= 100) ||
        (selectedPrice === "Above ₹100" && service.basePrice > 100);

    return matchesCategory && matchesSearch && matchesRating && matchesPrice;
  });

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        {/* Search and Filter Header */}
        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-white/20 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ServicesGrid
              services={filteredServices}
          />
        </div>
      </div>
  );
};

export default ServicesPage;
