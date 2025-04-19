"use server";

import {db} from "@/src/lib/db";
import {endOfMonth, format, startOfMonth, subMonths} from "date-fns";

export async function getServiceStats() {
    try {
        // Fetch total customers
        const totalCustomers = await db.user.count();

        // Fetch total service requests
        const totalServiceRequests = await db.serviceRequest.count();

        // Fetch total revenue
        const totalRevenue = await db.serviceRequest.aggregate({
            _sum: { orderTotal: true },
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
                    _sum: { orderTotal: true },
                });

                return {
                    month: format(monthStart, "MMM yyyy"), // "Jan 2024"
                    revenue: revenueData._sum.orderTotal || 0,
                };
            })
        );

        return {
            totalCustomers,
            totalServiceRequests,
            totalRevenue: totalRevenue._sum.orderTotal || 0,
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
            orderBy: { createdAt: "desc" }
        });

        return services.map((service) => {

            return {
                id: service.id,
                serviceName: service.name,
                description: service.description || "No description available",
                category: service.category,
                basePrice: service.basePrice,
                estimatedTime: service.estimatedTime || "N/A",
                imageUrl: service.imageUrl || "/default-image.jpg",
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
export async function getAllOrders() {
    try {
        return await db.serviceRequest.findMany({
            include: {
                user: true,
                service: true,
                servicePartner: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    } catch (err) {
        console.error('Error fetching all orders:', err)
        return []
    }
}

export async function getOrderSummary() {
    try {
        const orders = await db.serviceRequest.findMany({
            select: {
                status: true,
                orderTotal: true,
            },
        })
        const totalOrders = orders.length
        const totalRevenue = orders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + o.orderTotal, 0)

        const pendingOrders = orders.filter(o => o.status === 'pending').length
        const completedOrders = orders.filter(o => o.status === 'completed').length
        const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

        return {
            totalOrders,
            totalRevenue,
            pendingOrders,
            completedOrders,
            cancelledOrders,
        }
    } catch (error) {
        console.error('Error fetching summary:', error)
        return {
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
        }
    }
}
export async function getPriceDistributionByService() {
    try {
        const serviceTotals = await db.serviceRequest.groupBy({
            by: ["serviceId"],
            _sum: {
                orderTotal: true,
            },
        });

        return await Promise.all(
            serviceTotals.map(async (entry:any) => {
                const service = await db.service.findUnique({
                    where: {id: entry.serviceId},
                });

                return {
                    name: service?.name ?? "Unknown",
                    total: entry._sum.orderTotal || 0,
                };
            })
        );
    } catch (error) {
        console.error("Error fetching price distribution", error);
        return [];
    }
}
