"use server";

import {db} from "@/src/lib/db"; // Update this path based on your project structure
import {sendMail} from "../lib/mail";

export async function getPendingServiceRequests() {
    try {
        const requests = await db.serviceRequest.findMany({
            where: {
                acceptedByProvider: false, // Fetch only unaccepted requests
                status: "pending",
            },
            include: {
                user: true, // Include user details
                service: true, // Include service details
            },
        });
        return { success: true, data: requests };
    } catch (error) {
        console.error("Error fetching service requests:", error);
        return { success: false, error: "Failed to fetch service requests" };
    }
}

export const updateServiceRequestStatus = async (
    orderId: string,
    status: string,
    partnerId: string
) => {
    if (!orderId || !status || !partnerId) {
        throw new Error("Missing required parameters.");
    }

    // Fetch the existing order along with user and partner details
    const existingOrder = await db.serviceRequest.findUnique({
        where: { id: orderId },
        include: {
            user: true,  // Assuming the user model has an email field
            servicePartner: true, // Assuming this stores partner details
            service: true,
        },
    });

    if (!existingOrder) {
        throw new Error("Service request not found.");
    }

    if (existingOrder.acceptedByProvider) {
        throw new Error("This service request has already been accepted.");
    }
    if(status==="cancelled"){
        throw new Error("This service request has been cancelled.");
    }
    // Update the order status
    await db.serviceRequest.update({
        where: { id: orderId },
        data: {
            status,
            servicePartnerId: partnerId,
            acceptedByProvider: status === "Accepted",
            acceptedAt: status === "Accepted" ? new Date() : existingOrder.acceptedAt,
        },
    });
    const partner=await db.servicePartner.findUnique({where:{id:partnerId}});
    // Send email notification to the user
    if (existingOrder.user?.email) {
        await sendOrderUpdateEmail(existingOrder.user.email, status, existingOrder, partner);
    }

    return { success: true, message: "Service request status updated successfully." };
};

// Email sending function using your `sendMail` function
const sendOrderUpdateEmail = async (
    userEmail: string,
    status: string,
    order: any,
    partner: any
) => {
    const emailSubject = `Update on Your Service Request`;
    const emailHtml = `
        <p>Hello,</p>
        <p>Your service request for <strong>${order.service.name}</strong> has been updated to <strong>${status}</strong>.</p>
        <p>Here are the details of the service partner:</p>
        <ul>
            <li><strong>Name:</strong> ${partner?.fullName || "N/A"}</li>
            <li><strong>Email:</strong> ${partner?.email || "N/A"}</li>
            <li><strong>Phone:</strong> ${partner?.phone || "N/A"}</li>
        </ul>
        <p>If you have any questions, feel free to contact your service provider.</p>
        <p>Thank you for using our service.</p>
    `;

    // Use your existing `sendMail` function
    const emailResult = await sendMail(userEmail, emailSubject, emailHtml);

    if (!emailResult.success) {
        console.error("Failed to send email:", emailResult.error);
    } else {
        console.log(`Order update email sent to ${userEmail}`);
    }
};
export const countPartnerServices = async (partnerId: string) => {
    if (!partnerId) {
        throw new Error("Partner ID is required.");
    }

    // Count the number of pending services for the partner
    const pendingServicesCount = await db.serviceRequest.count({
        where: {
            servicePartnerId: partnerId,
            completionstatus: 'pending',
        },
    });

    // Count the number of completed services for the partner
    const completedServicesCount = await db.serviceRequest.count({
        where: {
            servicePartnerId: partnerId,
            completionstatus: 'completed',
        },
    });

    return {
        pendingServicesCount,
        completedServicesCount,
    };
};
export const getAcceptedServiceRequests = async (partnerId: string) => {
    if (!partnerId) {
        throw new Error("Partner ID is required.");
    }

    // Fetch all service requests accepted by the partner
    return db.serviceRequest.findMany({
        where: {
            servicePartnerId: partnerId,
            acceptedByProvider: true, // Only requests accepted by the partner
        },
        include: {
            user: true, // Include user details
            service: true, // Include service details
        },
    });
};
// export const getAcceptedServiceRequests = async () => {
//
//     return db.serviceRequest.findMany({
//         where: {
//             acceptedByProvider: true, // Only requests accepted by the partner
//         },
//         include: {
//             user: true, // Include user details
//             service: true, // Include service details
//         },
//     });
// };