"use client";

import React, {useEffect, useState} from "react";
import {SearchBar} from "@/src/components/other/searchbar";
import {Filters} from "@/src/components/other/filter";
import {ServicesGrid} from "@/src/components/adminservice/servicegrid";
import {useBoundStore} from "@/src/store/store";
import {getServices} from "@/src/actions/services";
import {useQuery} from "@tanstack/react-query";
import Loading from "@/src/app/loading";

const ServicesPage = ({searchQuery}:any) => {
    const setServices = useBoundStore((state) => state.setServices);
    const services = useBoundStore((state) => state.services);
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
    if(isLoading) return <Loading/>
    if(isError) return <div>Error</div>
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <ServicesGrid
                    services={services}
                    searchQuery={searchQuery}
                />
            </div>
        </div>
    );
};

export default ServicesPage;