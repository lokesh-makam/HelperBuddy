"use server";
import { db } from "@/src/lib/db";
export async function saveUserToDatabase(props: any) {
    try {
        const existingUser = await db.user.findUnique({
            where: { email:props.email },
        });
        if(existingUser) return { success: false, existingUser };

        const user = await db.user.create({
            data: {
                id:props.id,
                email: props.email,
                firstName: props.firstname,
                lastName: props.lastname,
            },
        });
        return { success: true, user };
    } catch (error) {
        console.error("Error saving user:", error);
        return { success: false, error: "Failed to save user." };
    }
}
// src/actions/orderActions.js
export async function fetchOrders(userId:any) {
    try {
        const orders = await db.serviceRequest.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                user: true, // Include user details
                service: true, // Include service details
                servicePartner: true,
            },
        });
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders.");
    }
}

export async function cancelOrderServer(orderId: string,reason: string) {
    try {
        const order = await db.serviceRequest.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new Error("Order not found");
        }

        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        // Users can cancel **only if** more than 2 hours have passed
        if (order.createdAt >= twoHoursAgo) {
            return { success: false, message: "You can cancel an order only after 2 hours." };
        }

        // If a provider has accepted, cancellation is not allowed
        if (order.acceptedByProvider) {
            return { success: false, message: "You cannot cancel an order that has already been accepted by a service provider." };
        }

        await db.serviceRequest.update({
            where: { id: orderId },
            data: { status: "cancelled", cancellationReason: reason ,cancelledAt: new Date()},
        });

        return { success: true, message: "Order cancelled successfully." };
    } catch (error) {
        console.error("Error cancelling order:", error);
        return { success: false, message: error || "Something went wrong" };
    }
}
