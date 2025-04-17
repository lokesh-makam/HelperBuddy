"use server";

import { db } from "@/src/lib/db";
import nodemailer from "nodemailer";
import {sendMail} from "@/src/lib/mail";
// 📧 Sends confirmation to the user
async function sendConfirmationEmailToUser(email: string, userData: any, service: any) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Poppins', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f9f9f9;
        }
        .container {
          padding: 20px 15px;
          border: 1px solid #e1e1e1;
          border-radius: 12px;
          background-color: #ffffff;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          margin: 10px;
        }
        .header {
          background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
          color: white;
          padding: 20px 15px;
          border-radius: 8px 8px 0 0;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .logo {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }
        .tagline {
          font-size: 14px;
          opacity: 0.9;
        }
        .footer {
          background-color: #f8f8f8;
          padding: 20px 15px;
          border-radius: 0 0 8px 8px;
          text-align: center;
          margin-top: 25px;
          border-top: 1px solid #e1e1e1;
        }
        h2 {
          color: #ffffff;
          margin: 0 0 10px 0;
          font-weight: 600;
          font-size: 24px;
        }
        h3 {
          color: #1976D2;
          margin-top: 20px;
          margin-bottom: 12px;
          border-bottom: 2px solid #e1e1e1;
          padding-bottom: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
         h4 {
          color: #ffffff;
          margin: 0 0 10px 0;
          font-weight: 600;
          font-size: 24px;
        }
        h3 span {
          margin-right: 8px;
        }
        ul {
          padding-left: 15px;
          list-style-type: none;
          margin: 0;
        }
        li {
          margin-bottom: 10px;
          position: relative;
          padding-left: 5px;
        }
        li strong {
          color: #555;
          font-weight: 600;
        }
        .address {
          background-color: #f5f5f5;
          padding: 12px;
          border-radius: 8px;
          margin: 10px 0;
          border-left: 4px solid #1976D2;
        }
        .info-section {
          margin: 20px 0;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .highlight {
          font-weight: 600;
          color: #1976D2;
        }
        .thank-you {
          background-color: #e8f5e9;
          padding: 12px;
          border-radius: 8px;
          margin: 20px 0 15px;
          text-align: center;
          border-left: 4px solid #4CAF50;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-links a {
          display: inline-block;
          margin: 0 8px;
          color: #666;
          text-decoration: none;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
          color: white;
          padding: 10px 22px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 15px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Helper Buddy</div>
          <div class="tagline">Your Home Service Partner</div>
          <h3 style="color: #ffffff">✅ Your Service Booking is Confirmed!</h3>
        </div>
        
        <p style="font-size: 17px; margin-top: 20px;">Hi <strong>${userData.firstName}</strong>,</p>
        <p>Thanks for booking with us. We're excited to serve you! Here's your booking summary:</p>

        <div class="info-section">
          <h3><span>🛠️</span> Service Info</h3>
          <ul>
            <li><strong>Service:</strong> ${service.name}</li>
            ${service.description ? `<li><strong>Description:</strong> ${service.description}</li>` : ""}
            ${service.category ? `<li><strong>Category:</strong> ${service.category}</li>` : ""}
            ${service.basePrice ? `<li><strong>Base Price:</strong> <span class="highlight">₹${service.basePrice}</span></li>` : ""}
          </ul>
        </div>

        <div class="info-section">
          <h3><span>📍</span> Address</h3>
          <div class="address">
            ${userData.houseNo}, ${userData.street},<br/>
            ${userData.city}, ${userData.state} - ${userData.postalCode},<br/>
            ${userData.country}
          </div>
        </div>

        <div class="info-section">
          <h3><span>📅</span> Schedule</h3>
          <ul>
            <li><strong>Date:</strong> ${new Date(userData.serviceDate).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${userData.serviceTime}</li>
          </ul>
        </div>

        <div class="info-section">
          <h3><span>💳</span> Payment</h3>
          <ul>
            <li><strong>Method:</strong> ${userData.paymentMethod}</li>
            <li><strong>Status:</strong> ${userData.paymentStatus}</li>
            <li><strong>Total:</strong> <span class="highlight">₹${userData.orderTotal}</span></li>
            <li><strong>Wallet Used:</strong> ₹${userData.walletAmountUsed}</li>
            <li><strong>Payable:</strong> <span class="highlight">₹${userData.amountToPay}</span></li>
          </ul>
        </div>

        <div class="thank-you">
          <p style="margin: 0; font-size: 15px;">We'll keep you updated on your service status.</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="#" class="button">View Booking Details</a>
        </div>
        
        <div class="footer">
          <p>Regards,<br/><strong>Helper Buddy Team</strong></p>
          
          <div class="social-links">
            <a href="#">Facebook</a> • 
            <a href="#">Twitter</a> • 
            <a href="#">Instagram</a>
          </div>
          
          <p style="font-size: 12px; color: #666; margin-top: 15px;">© 2025 Helper Buddy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendMail(email, "Your Service Booking Confirmation ✅", html);
}

// 📧 Notify service providers
// 📧 Notify service providers
async function sendEmailToProviders(providerEmails: string[], userData: any, serviceName: string) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 8px;
        }
        .header {
          background-color: #FF9800;
          color: white;
          padding: 15px;
          border-radius: 6px 6px 0 0;
          text-align: center;
        }
        .footer {
          background-color: #f8f8f8;
          padding: 15px;
          border-radius: 0 0 6px 6px;
          text-align: center;
          margin-top: 20px;
          border-top: 1px solid #e1e1e1;
        }
        h2 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .booking-details {
          background-color: #f9f9f9;
          border-left: 4px solid #FF9800;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
        }
        .customer-info {
          background-color: #eff8ff;
          border-left: 4px solid #2196F3;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
        }
        .schedule-info {
          background-color: #f1f8e9;
          border-left: 4px solid #8BC34A;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
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
        .btn {
          display: inline-block;
          background-color: #FF9800;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 15px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🚨 New Service Booking</h2>
        </div>
        
        <div class="content">
          <p>A new service has been booked that requires your attention:</p>
          
          <div class="booking-details">
            <h3>📋 Booking Details</h3>
            <ul>
              <li><strong>Service:</strong> ${serviceName}</li>
              <li><strong>Payment Method:</strong> ${userData.paymentMethod}</li>
            </ul>
          </div>
          
          <div class="customer-info">
            <h3>👤 Customer Information</h3>
            <ul>
              <li><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</li>
              <li><strong>Email:</strong> ${userData.email}</li>
              <li><strong>Phone:</strong> ${userData.phone}</li>
              <li><strong>Address:</strong> ${userData.houseNo}, ${userData.street}, ${userData.city}, ${userData.state} - ${userData.postalCode}</li>
            </ul>
          </div>
          
          <div class="schedule-info">
            <h3>🕒 Schedule</h3>
            <ul>
              <li><strong>Service Date:</strong> ${userData.serviceDate}</li>
              <li><strong>Service Time:</strong> ${userData.serviceTime}</li>
            </ul>
          </div>
          
          <p>Log in to your dashboard to view full details and manage this booking.</p>
          <a href="#" class="btn">View Booking Details</a>
        </div>
        
        <div class="footer">
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendMail(providerEmails.join(","), "🚀 New Service Booking Alert", html);
}
// ✅ Main action
export async function createServiceRequest(data: any) {
    try {
        console.log("📩 Creating service request with data:", data);

        if (
            !data.userId ||
            !data.serviceId ||
            !data.firstName ||
            !data.lastName ||
            !data.email ||
            !data.phone ||
            !data.houseNo ||
            !data.street ||
            !data.city ||
            !data.state ||
            !data.postalCode ||
            !data.country ||
            !data.serviceDate ||
            !data.serviceTime ||
            data.amountToPay === undefined
        ) {
            throw new Error("Missing required fields.");
        }

        const cartTotal = parseInt(data.cartTotal, 10);
        const tax = parseInt(data.tax, 10);
        const shippingCost = parseInt(data.shippingCost, 10);
        const orderTotal = parseInt(data.orderTotal, 10);
        const walletBalance = parseInt(data.walletBalance, 10) || 0;
        const walletAmountUsed = parseInt(data.walletAmountUsed, 10) || 0;
        const amountToPay = parseInt(data.amountToPay, 10);

        if ([cartTotal, tax, shippingCost, orderTotal, amountToPay].some(isNaN)) {
            throw new Error("Invalid amount values.");
        }

        // Deduct wallet
        if (walletAmountUsed > 0) {
            await db.user.update({
                where: { id: data.userId },
                data: {
                    walletBalance: { decrement: walletAmountUsed },
                },
            });
        }

        // Get service info
        const service = await db.service.findUnique({
            where: { id: data.serviceId },
            select: {
                name: true,
                description: true,
                category: true,
                basePrice: true,
            },
        });

        if (!service) throw new Error("Service not found.");

        // Create request
        const serviceRequest = await db.serviceRequest.create({
            data: {
                userId: data.userId,
                serviceId: data.serviceId,
                status: data.status || "pending",
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                houseNo: data.houseNo,
                street: data.street,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country,
                addressType: data.addressType || null,
                serviceDate: new Date(data.serviceDate),
                serviceTime: data.serviceTime,
                cartTotal,
                tax,
                shippingCost,
                orderTotal,
                walletBalance,
                walletAmountUsed,
                amountToPay,
                useWallet: !!data.useWallet,
                paymentStatus: data.paymentStatus || "pending",
                paymentMethod: data.paymentMethod || "cod",
            },
        });

        // Send user confirmation
        await sendConfirmationEmailToUser(data.email, data, service);

        // Notify providers
        const linkedProviders = await db.servicePartnerService.findMany({
            where: {
                serviceId: data.serviceId,
                status: "approved",
                servicePartner: {
                    status: "approved", // Ensure provider is approved too, if needed
                },
            },
            select: {
                servicePartner: {
                    select: { email: true },
                },
            },
        });

        const providerEmails = linkedProviders.map(p => p.servicePartner.email).filter(Boolean);
          if(providerEmails.length>0){
            await sendEmailToProviders(providerEmails, data, service.name);
          }

        return { success: true, data: serviceRequest };
    } catch (error: any) {
        console.error("❌ Error in service request:", error.message);
        return { success: false, error: error.message };
    }
}



// export async function sendEmailToProviders(providerEmails: string[], userData: any) {
//     console.log("📨 Sending email to providers:", providerEmails);
//
//     const fullAddress = `${userData.houseNo}, ${userData.street}, ${userData.city}, ${userData.state} - ${userData.postalCode}, ${userData.country}`;
//
//     const serviceDate = new Date(userData.serviceDate).toLocaleDateString();
//     const serviceTime = userData.serviceTime || "Not specified";
//
//     const mailOptions = {
//         to: providerEmails.join(","),
//         subject: "New Service Booking Alert 🚀",
//         html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <h2>📋 New Service Booking</h2>
//         <p>A new service request has been submitted. Here are the details:</p>
//         <ul>
//           <li><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</li>
//           <li><strong>Email:</strong> ${userData.email}</li>
//           <li><strong>Phone:</strong> ${userData.phone}</li>
//           <li><strong>Service Date:</strong> ${serviceDate}</li>
//           <li><strong>Service Time:</strong> ${serviceTime}</li>
//           <li><strong>Address:</strong> ${fullAddress}</li>
//           <li><strong>Payment Method:</strong> ${userData.paymentMethod}</li>
//           <li><strong>Payment Status:</strong> ${userData.paymentStatus}</li>
//           <li><strong>Amount Paid:</strong> ₹${userData.amountToPay}</li>
//         </ul>
//         <p>Login to your partner dashboard to view and manage this request.</p>
//       </div>
//     `,
//     };
//
//     try {
//         await sendMail(mailOptions.to, mailOptions.subject, mailOptions.html);
//         console.log("✅ Email notification sent successfully!");
//     } catch (error) {
//         console.error("❌ Error sending email to providers:", error);
//     }
// }
//
