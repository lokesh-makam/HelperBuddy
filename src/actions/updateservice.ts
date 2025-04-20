"use server"
import { db} from "@/src/lib/db";
export async function getServices() {
    try {
        const services = await db.service.findMany({
            include: {
                requests: {
                    select: {
                        id: true,
                        status: true,
                        Review: {
                            where: {
                                status: "true",
                            },
                            include: {
                                serviceRequest: {
                                    include: {
                                        user: true,
                                        service: true,
                                        servicePartner: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const enriched = services.map((service) => {
            const allRequests = service.requests || [];

            const approvedReviews = allRequests.flatMap((req) => req.Review);
            const totalReviews = approvedReviews.length;
            const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalReviews ? totalRating / totalReviews : 0;

            const totalOrders = allRequests.length;
            const completedOrders = allRequests.filter((r) => r.status === "completed").length;

            return {
                ...service,
                averageRating,
                totalOrders,
                completedOrders,
                approvedReviews,
            };
        });

        return { success: true, services: enriched };
    } catch (error) {
        console.error("Error fetching services:", error);
        return { success: false, error: "Failed to fetch services." };
    }
}
