"use server";

import { db } from "@/src/lib/db";

interface ReviewInput {
    serviceRequestId: string;
    rating: number;
    review: string;
}

export async function submitreview({serviceRequestId, rating, review }: ReviewInput): Promise<{ success?: string; error?: string; review?: any }> {
    if (!serviceRequestId || rating === undefined || !review) {
        return { error: "All fields are required." };
    }

    try {
        // Check if the service request exists and is eligible for a review
        const serviceRequest = await db.serviceRequest.findUnique({
            where: { id: serviceRequestId },
            select: { status: true, userId: true },
        });

        if (!serviceRequest) {
            return { error: "Service request not found." };
        }

        if (!["Accepted", "Completed"].includes(serviceRequest.status)) {
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
