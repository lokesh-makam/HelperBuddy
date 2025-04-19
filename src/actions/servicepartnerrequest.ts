'use server';

import {db} from '@/src/lib/db';
import {sendMail} from "@/src/lib/mail"; // Ensure you have a prisma client setup

export async function fetchServicePartnerRequests() {
    try {
        return await db.servicePartnerService.findMany({
            include: {
                servicePartner: true,
                service: true,
            },
        });
    } catch (error) {
        console.error('Error fetching service partner requests:', error);
        throw new Error('Failed to fetch service partner requests');
    }
}
export async function approveServicePartnerRequest(id: string) {
    try {
        const updatedServicePartner = await db.servicePartnerService.update({
            where: { id },
            data: {
                status: "approved", // Change status to "approved"
            },
        });
        const partner=await db.servicePartnerService.findUnique(
            {
                where: {id},
                include: {
                    servicePartner:true,
                    service:true
                }
            }
        )
        if(partner) {
            const email = getServicePartnerRequestApprovalEmail(partner.servicePartner.fullName, partner.service.name);
            await sendMail(partner.servicePartner.email, email.subject, email.body);
        }
        return updatedServicePartner;
    } catch (error) {
        throw new Error(`Error approving service partner request with ID: ${id}`);
    }
}

// Reject a service partner request
export async function rejectServicePartnerRequest(id: string) {
    try {
        const updatedServicePartner = await db.servicePartnerService.update({
            where: { id },
            data: {
                status: "rejected", // Change status to "rejected"
            },
        });
        const partner=await db.servicePartnerService.findUnique(
            {
                where: {id},
                include: {
                    servicePartner:true,
                    service:true
                }
            }
        )
        if(partner) {
            const email = getServicePartnerRequestRejectionEmail(partner.servicePartner.fullName, partner.service.name);
            await sendMail(partner.servicePartner.email, email.subject, email.body);
        }
        return updatedServicePartner;
    } catch (error) {
        throw new Error(`Error rejecting service partner request with ID: ${id}`);
    }
}

// Remove a service partner request
export async function removeServicePartnerRequest(id: string) {
    try {
        const partner=await db.servicePartnerService.findUnique(
            {
                where: {id},
                include: {
                    servicePartner:true,
                    service:true
                }
            }
        )
        if(partner) {
            const email = getServicePartnerRequestRejectionEmail(partner.servicePartner.fullName, partner.service.name);
            await sendMail(partner.servicePartner.email, email.subject, email.body);
        }
        return await db.servicePartnerService.delete({
            where: {id},
        });
    } catch (error) {
        throw new Error(`Error removing service partner request with ID: ${id}`);
    }
}
function getServicePartnerRequestApprovalEmail(fullName: string, serviceName: string) {
    return {
        subject: `🎉 Your service "${serviceName}" has been approved on Helper Buddy!`,
        body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helper Buddy - Service Approval Notification</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f7fa;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        
        .logo-container {
            background-color: #f8fafc;
            padding: 24px 0;
            text-align: center;
            border-bottom: 1px solid #edf2f7;
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-weight: 700;
            font-size: 20px;
            color: #111827;
        }
        
        .logo svg {
            stroke: #4f46e5;
        }
        
        .content {
            padding: 32px;
        }
        
        .success-banner {
            background-color: #ecfdf5;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            text-align: center;
        }
        
        .success-icon {
            background-color: #10b981;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
        }
        
        .success-icon svg {
            stroke: white;
            width: 28px;
            height: 28px;
        }
        
        .success-title {
            font-weight: 700;
            font-size: 22px;
            color: #047857;
            margin-bottom: 8px;
        }
        
        .success-subtitle {
            color: #059669;
            font-size: 16px;
        }
        
        .greeting {
            font-size: 16px;
            margin-bottom: 16px;
        }
        
        .message {
            font-size: 16px;
            margin-bottom: 24px;
            color: #4b5563;
        }
        
        .service-details {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            border: 1px solid #e5e7eb;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 16px;
        }
        
        .detail-row:last-child {
            margin-bottom: 0;
        }
        
        .detail-label {
            width: 40%;
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            padding-top: 8px;
        }
        
        .detail-value {
            width: 60%;
            font-size: 15px;
            font-weight: 500;
            color: #111827;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 8px 12px;
        }
        
        .recommendations {
            background-color: #eff6ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            border-left: 4px solid #3b82f6;
        }
        
        .recommendations-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .recommendations-title svg {
            stroke: #3b82f6;
        }
        
        .recommendations ul {
            margin-left: 20px;
            color: #1e3a8a;
        }
        
        .recommendations li {
            margin-bottom: 8px;
        }
        
        .recommendations li:last-child {
            margin-bottom: 0;
        }
        
        .cta-button {
            text-align: center;
            margin: 32px 0;
        }
        
        .cta-button a {
            display: inline-block;
            background-color: #4f46e5;
            color: white;
            font-weight: 600;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        }
        
        .contact-info {
            background-color: #fafafa;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 24px;
        }
        
        .contact-info strong {
            color: #4b5563;
        }
        
        .signature {
            margin-top: 32px;
            color: #4b5563;
        }
        
        .signature-name {
            font-weight: 600;
            color: #374151;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
            background-color: #f8fafc;
            border-top: 1px solid #edf2f7;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <div class="logo-container">
            <div class="logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Helper Buddy
            </div>
        </div>
        
        <div class="content">
            <!-- Success Banner -->
            <div class="success-banner">
                <div class="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <div class="success-title">Service Approved!</div>
                <div class="success-subtitle">Your service is now live on Helper Buddy</div>
            </div>
            
            <div class="greeting">Dear ${fullName},</div>
            
            <div class="message">
                We're excited to inform you that your service request has been reviewed and approved. Your services are now visible to customers on the Helper Buddy platform.
            </div>
            
            <!-- Service Details -->
            <div class="service-details">
                <div class="detail-row">
                    <div class="detail-label">Provider Name</div>
                    <div class="detail-value">${fullName}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Service Name</div>
                    <div class="detail-value">${serviceName}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">Approved ✓</div>
                </div>
            </div>
            
            <!-- Recommendations -->
            <div class="recommendations">
                <div class="recommendations-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Steps to Maximize Your Success
                </div>
                <ul>
                    <li><strong>Complete your calendar availability</strong> - This helps customers find time slots that work for them</li>
                    <li><strong>Add high-quality service photos</strong> - Profiles with photos receive 3x more bookings</li>
                    <li><strong>Set up instant booking</strong> - Get more visibility in search results</li>
                    <li><strong>Verify your payment details</strong> - Ensure smooth transactions</li>
                </ul>
            </div>
            
            <div class="cta-button">
                <a href="https://helperbuddy.com/provider/dashboard">Go to Provider Dashboard</a>
            </div>
            
            <div class="contact-info">
                Need help? Our support team is here for you at <strong>support@helperbuddy.com</strong>
            </div>
            
            <div class="signature">
                Thank you for choosing Helper Buddy for your business growth.<br><br>
                Warm regards,<br>
                <span class="signature-name">The Helper Buddy Team</span>
            </div>
        </div>
        
        <div class="footer">
            © 2025 Helper Buddy - All rights reserved
        </div>
    </div>
</body>
</html>`
    };
}
function getServicePartnerRequestRejectionEmail(fullName: string, serviceName: string) {
    return {
        subject: `Important update regarding your service "${serviceName}" on Helper Buddy`,
        body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helper Buddy - Service Request Update</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f7fa;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        
        .logo-container {
            background-color: #f8fafc;
            padding: 24px 0;
            text-align: center;
            border-bottom: 1px solid #edf2f7;
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-weight: 700;
            font-size: 20px;
            color: #111827;
        }
        
        .logo svg {
            stroke: #4f46e5;
        }
        
        .content {
            padding: 32px;
        }
        
        .status-banner {
            background-color: #fef2f2;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            text-align: center;
        }
        
        .status-icon {
            background-color: #ef4444;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
        }
        
        .status-icon svg {
            stroke: white;
            width: 28px;
            height: 28px;
        }
        
        .status-title {
            font-weight: 700;
            font-size: 22px;
            color: #b91c1c;
            margin-bottom: 8px;
        }
        
        .status-subtitle {
            color: #dc2626;
            font-size: 16px;
        }
        
        .greeting {
            font-size: 16px;
            margin-bottom: 16px;
        }
        
        .message {
            font-size: 16px;
            margin-bottom: 24px;
            color: #4b5563;
        }
        
        .service-details {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            border: 1px solid #e5e7eb;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 16px;
        }
        
        .detail-row:last-child {
            margin-bottom: 0;
        }
        
        .detail-label {
            width: 40%;
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            padding-top: 8px;
        }
        
        .detail-value {
            width: 60%;
            font-size: 15px;
            font-weight: 500;
            color: #111827;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 8px 12px;
        }
        
        .feedback-section {
            background-color: #fff8f1;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            border-left: 4px solid #f97316;
        }
        
        .feedback-title {
            font-size: 16px;
            font-weight: 600;
            color: #9a3412;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .feedback-title svg {
            stroke: #f97316;
        }
        
        .feedback-content {
            padding: 16px;
            background-color: white;
            border-radius: 6px;
            border: 1px solid #fdba74;
            font-size: 15px;
            color: #7c2d12;
        }
        
        .recommendations {
            background-color: #f0f9ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            border-left: 4px solid #0ea5e9;
        }
        
        .recommendations-title {
            font-size: 16px;
            font-weight: 600;
            color: #0369a1;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .recommendations-title svg {
            stroke: #0ea5e9;
        }
        
        .recommendations ul {
            margin-left: 20px;
            color: #0c4a6e;
        }
        
        .recommendations li {
            margin-bottom: 8px;
        }
        
        .recommendations li:last-child {
            margin-bottom: 0;
        }
        
        .cta-button {
            text-align: center;
            margin: 32px 0;
        }
        
        .cta-button a {
            display: inline-block;
            background-color: #4f46e5;
            color: white;
            font-weight: 600;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        }
        
        .contact-info {
            background-color: #fafafa;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 24px;
        }
        
        .contact-info strong {
            color: #4b5563;
        }
        
        .signature {
            margin-top: 32px;
            color: #4b5563;
        }
        
        .signature-name {
            font-weight: 600;
            color: #374151;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
            background-color: #f8fafc;
            border-top: 1px solid #edf2f7;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <div class="logo-container">
            <div class="logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Helper Buddy
            </div>
        </div>
        
        <div class="content">
            <!-- Status Banner -->
            <div class="status-banner">
                <div class="status-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
                <div class="status-title">Service Not Approved</div>
                <div class="status-subtitle">Your submission requires changes</div>
            </div>
            
            <div class="greeting">Dear ${fullName},</div>
            
            <div class="message">
                Thank you for submitting your service to Helper Buddy. After careful review, we've determined that your service doesn't currently meet our platform requirements. We're providing specific feedback to help you make the necessary improvements.
            </div>
            
            <!-- Service Details -->
            <div class="service-details">
                <div class="detail-row">
                    <div class="detail-label">Provider Name</div>
                    <div class="detail-value">${fullName}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Service Name</div>
                    <div class="detail-value">${serviceName}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">Not Approved</div>
                </div>
            </div>
            
            <!-- Recommendations -->
            <div class="recommendations">
                <div class="recommendations-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Recommendations for Approval
                </div>
                <ul>
                    <li><strong>Review our service guidelines</strong> to ensure your service meets all requirements</li>
                    <li><strong>Update your service information</strong> based on the feedback provided</li>
                    <li><strong>Provide clearer description</strong> of what customers can expect</li>
                    <li><strong>Add high-quality images</strong> to showcase your service properly</li>
                </ul>
            </div>
            
            <div class="cta-button">
                <a href="https://helperbuddy.com/provider/dashboard">Edit Your Service</a>
            </div>
            
            <div class="contact-info">
                Need help? Our provider support team is here for you at <strong>providers@helperbuddy.com</strong>
            </div>
            
            <div class="signature">
                We look forward to reviewing your updated submission.<br><br>
                Best regards,<br>
                <span class="signature-name">The Helper Buddy Review Team</span>
            </div>
        </div>
        
        <div class="footer">
            © 2025 Helper Buddy - All rights reserved
        </div>
    </div>
</body>
</html>`
    };
}
