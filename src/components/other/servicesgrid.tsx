import React from "react";
import ServiceCard from "@/src/components/other/servicecard";
export const ServicesGrid: React.FC<any> = ({ services}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service: { id: any; }) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                />
            ))}
        </div>
    );
};
