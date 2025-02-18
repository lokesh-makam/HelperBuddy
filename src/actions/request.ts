"use server";

import { db } from "@/src/lib/db";
import nodemailer from "nodemailer";
import {sendMail} from "@/src/lib/mail";

export async function createServiceRequest(data: any) {
    try {
        console.log("📩 Creating service request with data:", data);

        // ✅ Step 1: Store the Service Request in the Database
        const serviceRequest = await db.serviceRequest.create({
            data: {
                userId: data.userId,
                serviceId: data.serviceId,
                status: data.status || "Pending",
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                paymentStatus: data.paymentStatus,
                paymentMethod: data.paymentMethod,
                amount: data.amount
            },
        });

        console.log("✅ Service request created:", serviceRequest);

        // ✅ Step 2: Fetch Verified Service Providers
        const verifiedProviders = await db.servicePartner.findMany({
            where: { status: "approved" },
            select: { email: true },
        });

        const providerEmails = verifiedProviders.map((provider:any) => provider.email);

        if (providerEmails.length === 0) {
            console.warn("⚠️ No verified service providers found.");
            return { success: true, message: "No providers to notify.", data: serviceRequest };
        }

        // ✅ Step 3: Send Email to All Verified Service Providers
        await sendEmailToProviders(providerEmails, data);

        console.log("📧 Emails sent to verified service providers.");
        return { success: true, data: serviceRequest };
    } catch (error) {
        console.error("❌ Error in service request creation:", error);
        return { success: false, error: error };
    }
}

// ✅ Email Sending Function
async function sendEmailToProviders(providerEmails: string[], userData: any) {
    console.log(providerEmails);
    const mailOptions = {
        to: providerEmails.join(","), // Send to all verified providers
        subject: "New Service Booking Alert 🚀",
        html: `
            <h2>New Service Booking</h2>
            <p>A user has booked a service. Here are the details:</p>
            <ul>
                <li><b>Name:</b> ${userData.firstName} ${userData.lastName}</li>
                <li><b>Email:</b> ${userData.email}</li>
                <li><b>Phone:</b> ${userData.phone}</li>
                <li><b>Address:</b> ${userData.address}, ${userData.city}, ${userData.state} - ${userData.postalCode}</li>
                <li><b>Payment Method:</b> ${userData.paymentMethod}</li>
                <li><b>Payment Status:</b> ${userData.paymentStatus}</li>
            </ul>
            <p>Visit your dashboard to manage service requests.</p>
        `,
    };

    try {
        await sendMail(mailOptions.to, mailOptions.subject, mailOptions.html);
        console.log("✅ Email notification sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

