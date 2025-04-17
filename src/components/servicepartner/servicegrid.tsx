import React, {useEffect, useState} from "react";
import ServiceCard from "@/src/components/servicepartner/servicecard";
import {useUser} from "@clerk/nextjs";
import Loading from "@/src/app/loading";
export const ServicesGrid: React.FC<any> = ({ services}) => {
    const {user}=useUser();
    const [loading,setloading]=useState(true);
    useEffect(() => {
        if(user){
          setloading(false);
        }
    }, [user]);
    if(loading){
        return <Loading/>
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {services.map((service: { id: any; }) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    user={user}
                />
            ))}
        </div>
    );
};
