"use server";

import {db} from "@/src/lib/db"; // Update this path based on your project structure
import {sendMail} from "../lib/mail";
import {auth} from "@clerk/nextjs/server";

export async function getPendingServiceRequests() {
    try {
        // Confirm service provider is approved
        // Use `auth()` to get the user's ID
        const { userId } = await auth();

        // Protect the route by checking if the user is signed in
        if (!userId) {
            return {success: false,error:"something went wrong"};
        }
        const servicePartner=await db.servicePartner.findUnique({
            where:{
                userId:userId,
                status: "approved"
            }
        })
        if (!servicePartner) {
            return { success: false, error: "Service provider is not approved by admin." };
        }

        // Fetch services accepted for this service provider
        const approvedServices = await db.servicePartnerService.findMany({
            where: {
                servicePartnerId:servicePartner.id,
                status: "approved",
            },
            select: {
                serviceId: true,
            },
        });

        const approvedServiceIds = approvedServices.map((s) => s.serviceId);
        // Now fetch pending service requests ONLY for those approved services
        const requests = await db.serviceRequest.findMany({
            where: {
                acceptedByProvider: false,
                status: "pending",
                serviceId: { in: approvedServiceIds },
            },
            include: {
                user: true,
                service: true,
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
    partnerId: string,
    userId: string
) => {
    if (!orderId || !status || !partnerId) {
        throw new Error("Missing required parameters.");
    }
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
    if(existingOrder.user.id===userId){
        throw new Error("You can't accept your own order");
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
export const sendOrderUpdateEmail = async (
    userEmail: string,
    status: string,
    order: any,
    partner: any
) => {
    const statusColor = {
        'pending': '#FFA500',
        'completed': '#2196F3',
        'cancelled': '#F44336',
        'Accepted': '#00BCD4'
    }[status.toLowerCase()] || '#757575';

    const emailSubject = `Update on Your Service Request: ${status}`;
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #f0f0f0;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2196F3;
        }
        .status-badge {
          display: inline-block;
          padding: 8px 15px;
          background-color: ${statusColor};
          color: white;
          border-radius: 20px;
          font-weight: bold;
          margin: 15px 0;
        }
        .section {
          margin: 25px 0;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
          border-left: 4px solid #2196F3;
        }
        .partner-section {
          border-left: 4px solid #4CAF50;
        }
        h3 {
          color: #2196F3;
          margin-top: 0;
          border-bottom: 1px solid #e1e1e1;
          padding-bottom: 8px;
        }
        .partner-section h3 {
          color: #4CAF50;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 8px 0;
          border-bottom: 1px dashed #e1e1e1;
        }
        li:last-child {
          border-bottom: none;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
          text-align: center;
          font-size: 14px;
          color: #757575;
        }
        .highlight {
          font-weight: bold;
          color: #2196F3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Helper Buddy</div>
          <p>Your trusted service provider</p>
        </div>
        
        <p>Hello ${order.user?.name || "Valued Customer"},</p>
        
        <p>Your service request for <strong>${order.service?.name}</strong> has been updated to:</p>
        <div style="text-align: center;">
          <span class="status-badge">${status}</span>
        </div>
        
        <div class="section">
          <h3>🧾 Order Summary</h3>
          <ul>
            <li><strong>Service:</strong> ${order.service?.name || "N/A"}</li>
            <li><strong>Requested On:</strong> ${new Date(order.createdAt).toLocaleString()}</li>
            <li><strong>Scheduled For:</strong> ${order.scheduledAt ? new Date(order.scheduledAt).toLocaleString() : "Not scheduled"}</li>
            <li><strong>Order Status:</strong> ${status}</li>
            <li><strong>Location:</strong> ${order.houseNo}, ${order.street},<br/>
            ${order.city}, ${order.state} - ${order.postalCode},<br/>
            ${order.country}</li>
            <li><strong>Payment Method:</strong> ${order.paymentMethod || "N/A"}</li>
          </ul>
        </div>
        
        <div class="section partner-section">
          <h3>🤝 Service Partner Details</h3>
          <ul>
            <li><strong>Name:</strong> ${partner?.fullName || "N/A"}</li>
            <li><strong>Email:</strong> ${partner?.email || "N/A"}</li>
            <li><strong>Phone:</strong> ${partner?.phone || "N/A"}</li>
          </ul>
        </div>
        
        ${status === 'accepted'? `
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>What's next?</strong> Your service partner will arrive at the scheduled time. Please ensure someone is available at the location.</p>
        </div>
        ` : ''}
        
        <p>If you have any questions or need assistance, feel free to contact your service provider or reach out to our customer support team.</p>
        
        <div class="footer">
          <p>Thank you for using <span class="highlight">Helper Buddy</span>!<br/>We're always happy to help 😄</p>
          <p>© 2025 Helper Buddy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
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