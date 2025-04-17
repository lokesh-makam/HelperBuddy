"use server"
import { db } from "@/src/lib/db";

export async function getServicePartnerServices(UserId: string, serviceId: string) {
    try {
        if (!UserId || !serviceId) {
            throw new Error("Both ServicePartner ID and Service ID are required.");
        }
        const servicePartner=await db.servicePartner.findUnique({where:{userId:UserId}});
        if(!servicePartner) throw new Error("Service partner not found.");
        // Fetch services associated with the given ServicePartner and specific Service ID
        const services = await db.servicePartnerService.findMany({
            where: {
                servicePartnerId:servicePartner.id,
                serviceId
            },
            include: {
                servicePartner: true, // Include details about the ServicePartner (optional)
                service: true, // Include service details (optional)
            },
        });
        if (services.length === 0) return { success: false, message: "Not found" };
        console.log(services)
        return {
            success: true,
            data: services[0],
        };
    } catch (error) {
        console.error("Error fetching service partner services:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

export const applyForService = async (userId: string, serviceId: string) => {
    try {
        if (!userId || !serviceId) {
            throw new Error("Both ServicePartner ID and Service ID are required.");
        }
        const servicePartner=await db.servicePartner.findUnique({where:{userId:userId}});
        if(!servicePartner) throw new Error("Service partner not found.");
        const existingApplication  = await db.servicePartnerService.findMany({
            where: {
                servicePartnerId:servicePartner.id,
                serviceId
            },
            include: {
                servicePartner: true, // Include details about the ServicePartner (optional)
                service: true, // Include service details (optional)
            },
        });
        if (existingApplication.length>0) {
            return { success: false, message: "You have already applied for this service." };
        }

        await db.servicePartnerService.create({
            data: {
                servicePartnerId:servicePartner.id,
                serviceId,
                status: "pending",
            },
        });

        return { success: true, message: "Service applied successfully. Your request is pending approval." };
    } catch (error) {
        return { success: false, message: "Error applying for service." };
    }
};

export const withdrawApplication = async (userId: string, serviceId: string) => {
    try {
        const servicePartner=await db.servicePartner.findUnique({where:{userId:userId}});
        if(!servicePartner) throw new Error("Service partner not found.");
        await db.servicePartnerService.deleteMany({
            where: { servicePartnerId:servicePartner.id, serviceId, status: "pending" },
        });

        return { success: true, message: "Your service request has been withdrawn." };
    } catch (error) {
        return { success: false, message: "Error withdrawing request." };
    }
};

export const removeService = async (userId: string, serviceId: string) => {
    try {
        const servicePartner=await db.servicePartner.findUnique({where:{userId:userId}});
        if(!servicePartner) throw new Error("Service partner not found.");
        await db.servicePartnerService.deleteMany({
            where: { servicePartnerId: servicePartner.id, serviceId, status: "approved" },
        });

        return { success: true, message: "Service has been removed successfully." };
    } catch (error) {
        return { success: false, message: "Error removing service." };
    }
};
