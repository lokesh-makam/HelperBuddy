"use client";

import React, { useEffect, useState } from "react";
import { ServicesGrid } from "@/src/components/servicepartner/servicegrid";
import { getServices } from "@/src/actions/user";
import Loading from "@/src/app/loading";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const ServicesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const [services, setservices] = useState<any>([]);
  useEffect(() => {
    if (user) {
      const fetchServices = async () => {
        try {
          setIsLoading(true);
          const { success, services } = await getServices(user.id); // Fetch services from the backend
          if (success) {
            setservices(services); // Store services in state
          }
        } catch (error) {
          console.error("Error fetching services:", error);
          setIsError(true); // Set error state if the request fails
        } finally {
          setIsLoading(false); // Set loading to false once the request is complete
        }
      };
      fetchServices(); // Call the fetch function on component mount
    }
  }, [user]);
  if (isLoading) return <Loading />;
  if (isError) {
    toast.error("Services not fetched.");
    router.push("/"); // Show an error message
    return null;
  }
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <ServicesGrid services={services} user={user} />
      </div>
    </main>
  );
};

export default ServicesPage;
