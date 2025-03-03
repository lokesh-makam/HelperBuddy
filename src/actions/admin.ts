"use server";

import { db } from "@/src/lib/db";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

export async function getServiceStats() {
    try {
        // Fetch total customers
        const totalCustomers = await db.user.count();

        // Fetch total service requests
        const totalServiceRequests = await db.serviceRequest.count();

        // Fetch total revenue
        const totalRevenue = await db.serviceRequest.aggregate({
            _sum: { amount: true },
        });

        // Fetch monthly revenue for the last 12 months
        const monthlyRevenue = await Promise.all(
            Array.from({ length: 12 }).map(async (_, index) => {
                const monthStart = startOfMonth(subMonths(new Date(), index));
                const monthEnd = endOfMonth(monthStart);
                const revenueData = await db.serviceRequest.aggregate({
                    where: {
                        createdAt: { gte: monthStart, lte: monthEnd },
                    },
                    _sum: { amount: true },
                });

                return {
                    month: format(monthStart, "MMM yyyy"), // "Jan 2024"
                    revenue: revenueData._sum.amount || 0,
                };
            })
        );

        return {
            totalCustomers,
            totalServiceRequests,
            totalRevenue: totalRevenue._sum.amount || 0,
            monthlyRevenue: monthlyRevenue.reverse(), // Keep months in correct order
        };
    } catch (error) {
        console.error("Error fetching service stats:", error);
        return { error: "Failed to fetch data. Please try again later." };
    }
}

export async function getAllServiceRequests() {
    try {
        const serviceRequests = await db.serviceRequest.findMany({
            include: {
                user: true,
                service: true,
                servicePartner: true
            },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: serviceRequests };
    } catch (error) {
        console.error("Error fetching service requests:", error);
        return { success: false, error: "Failed to fetch service requests. Please try again later." };
    }
}

export async function markServiceCompleted(serviceRequestId: string) {
    try {
        const partner=await db.serviceRequest.findUnique({where:{id:serviceRequestId,status:"pending"}});
        if(partner){
            return { success: false, error: "Cannot mark service as completed until partner accepts the request." };
        }
        const updatedRequest = await db.serviceRequest.update({
            where: { id: serviceRequestId },
            data: { status: "completed",completionstatus: "completed", completedAt: new Date() },
        });

        return { success: true, message: "Service marked as completed.", data: updatedRequest };
    } catch (error) {
        console.error("Error marking service as completed:", error);
        return { success: false, error: "Failed to mark service as completed." };
    }
}


export async function getServices() {
    try {
        const services = await db.service.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                requests: {
                    include: {
                        Review: true, // Fetch associated reviews
                    },
                },
            },
        });

        return services.map((service) => {
            const reviews = service.requests.flatMap((request) => request.review || []);
            const totalReviews = reviews.length;
            const averageRating = totalReviews > 0
                // @ts-ignore
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                : 0;

            return {
                id: service.id,
                serviceName: service.name,
                description: service.description || "No description available",
                category: service.category,
                basePrice: service.basePrice,
                estimatedTime: service.estimatedTime || "N/A",
                rating: Math.round(averageRating), // Rounded average rating
                numberOfReviews: totalReviews,
                imageUrl: service.imageUrl || "/default-image.jpg",
                numberOfRequests: service.requests.length || 0,
            };
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}
export async function getReviewsByServiceId(serviceId:string) {
    try {
        const reviews = await db.review.findMany({
            where: {
                serviceRequest: {
                    serviceId: serviceId,
                },
            },
            include: {
                serviceRequest: {
                    include: {
                        user: true, // Include user details
                        service: true, // Include service details
                        servicePartner: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { success: true, data: reviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: "Failed to fetch reviews." };
    }
}