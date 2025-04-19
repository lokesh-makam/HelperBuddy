"use server";

import { db } from "@/src/lib/db";

interface ReviewInput {
    serviceRequestId: string;
    rating: number;
    review: string;
}

export async function submitreview({ serviceRequestId, rating, review }: ReviewInput): Promise<{ success?: string; error?: string; review?: any }> {
    if (!serviceRequestId || rating === undefined || !review) {
        return { error: "All fields are required." };
    }

    try {
        // Fetch the service request and its service partner
        const serviceRequest = await db.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: { status: true, servicePartnerId: true ,serviceId:true},
        });

        if (!serviceRequest) {
            return { error: "Service request not found." };
        }
        const res=await db.review.findMany({where:{serviceRequestId:serviceRequestId}});
        if(res.length>0) return { error: "You have already submitted a review for this service."};
        if (!["Accepted", "completed"].includes(serviceRequest.status)) {
            return { error: "You can only review an accepted or completed service." };
        }

        // Create the review
        const newReview = await db.review.create({
            data: {
                serviceRequestId,
                rating,
                review,
            },
        });
        await db.homepageReview.create({
            data:{
                reviewId: newReview.id
            }
        })

        // Update the service partner's rating
        if (serviceRequest.servicePartnerId) {
            const reviews = await db.review.findMany({
                where: { serviceRequest: { servicePartnerId: serviceRequest.servicePartnerId } },
                select: { rating: true },
            });

            // Calculate new average rating
            const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalRatings / reviews.length;

            await db.servicePartner.update({
                where: { id: serviceRequest.servicePartnerId },
                data: { rating: averageRating },
            });
        }
        if(serviceRequest.serviceId){
            const reviews = await db.review.findMany({
                where: { serviceRequest: { serviceId: serviceRequest.serviceId } },
                select: { rating: true },
            });
            const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = Math.round(totalRatings / reviews.length);
            await db.service.update({
                where: { id: serviceRequest.serviceId },
                data: { rating: averageRating },
            });
        }
        return { success: "Review submitted successfully.", review: newReview };
    } catch (error) {
        console.error("Error submitting review:", error);
        return { error: "Failed to submit review. Please try again later." };
    }
}



export async function getReviewsByServicePartner(servicePartnerId: string) {
    if (!servicePartnerId) {
        return { error: "Service Partner ID is required." };
    }

    try {
        const reviews = await db.review.findMany({
            where: {
                serviceRequest: {
                    servicePartnerId: servicePartnerId, // Ensure this field exists in the ServiceRequest model
                },
            },
            include: {
                serviceRequest: {
                    include: {
                        user: true, // Includes all user fields
                        service: true, // Includes all service details
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { success: true, data:reviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { error: "Failed to fetch reviews. Please try again later." };
    }
}
export async function getReviews() {
    try {
        const reviews = await db.review.findMany({
            include: {
                serviceRequest: {
                    include: {
                        user: true,
                        service: true,
                        servicePartner: true,
                    },
                },
                homepageReview: true,
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



export async function updateReviewStatus(reviewId: string, status: string){
    try {
        if(!reviewId) return { success: false, error: "Review ID is required." };
        const updatedReview = await db.review.update({
            where: {
                id: reviewId,  // Ensure `reviewId` exists and is valid
            },
            data: {
                status: status, // Boolean status value being updated
            }
        });

        return {
            success: true,
            message: "Review status updated successfully.",
            data: updatedReview,
        };
    } catch (error) {
        console.error("Error updating review status:", error);

        return {
            success: false,
            message: "Failed to update review status.",
            error: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

export async function toggleHomepageStatus(reviewId: string, status: boolean) {
    try {
        const existing = await db.homepageReview.findUnique({
            where: { reviewId },
        });
        if (existing) {
            await db.homepageReview.update({
                where: { reviewId },
                data: { status },
            });
        }
        return { success: true };
    } catch (error) {
        console.error("Error toggling homepage status:", error);
        return { success: false, error: "Something went wrong" };
    }
}

import { formatDistanceToNow } from "date-fns";

export async function getHomepageReviews() {
    try {
        const homepageReviews = await db.homepageReview.findMany({
            where: {
                status: true, // Only fetch reviews marked for homepage
            },
            include: {
                review: {
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
            orderBy: {
                createdAt: "desc",
            },
        });

        const formatted = homepageReviews.map((item) => ({
            ...item,
            date: formatDistanceToNow(new Date(item.review.createdAt), { addSuffix: true }),
        }));

        console.log(formatted)
        return { success: true, data: formatted };
    } catch (error) {
        console.error("Error fetching homepage reviews:", error);
        return { success: false, error: "Something went wrong" };
    }
}

