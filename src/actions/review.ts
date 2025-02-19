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
            select: { status: true, servicePartnerId: true },
        });

        if (!serviceRequest) {
            return { error: "Service request not found." };
        }

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

        // Update the service partner's rating
        if (serviceRequest.servicePartnerId) {
            const reviews = await db.review.findMany({
                where: { serviceRequest: { servicePartnerId: serviceRequest.servicePartnerId } },
                select: { rating: true },
            });

            // Calculate new average rating
            const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = Math.round(totalRatings / reviews.length);

            await db.servicePartner.update({
                where: { id: serviceRequest.servicePartnerId },
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
                        user: true, // Include user details
                        service: true, // Include service details
                        servicePartner: true
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // Latest reviews first
            },
        });
        return { success: true, data: reviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: "Failed to fetch reviews." };
    }
}

