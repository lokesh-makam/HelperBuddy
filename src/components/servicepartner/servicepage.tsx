"use client";

import React, {useEffect, useState} from "react";
import {ServicesGrid} from "@/src/components/servicepartner/servicegrid";
import {useBoundStore} from "@/src/store/store";
import {getServices} from "@/src/actions/services";
import {useQuery} from "@tanstack/react-query";
import Loading from "@/src/app/loading";

const ServicesPage = () => {
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
    return (
        <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
                <ServicesGrid services={services}/>
            </div>
        </main>
    );
};

export default ServicesPage;
