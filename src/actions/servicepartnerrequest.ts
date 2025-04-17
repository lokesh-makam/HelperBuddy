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
        const deletedServicePartner = await db.servicePartnerService.delete({
            where: { id },
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
        return deletedServicePartner;
    } catch (error) {
        throw new Error(`Error removing service partner request with ID: ${id}`);
    }
}
function getServicePartnerRequestApprovalEmail(fullName: string, serviceName: string) {
    return {
        subject: `🎉 Your service request "${serviceName}" has been approved!`,
        body: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helper Buddy - Service Approval Notification</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            padding: 20px;
        }
        
        .container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 24px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .logo h1 {
            color: #4361ee;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo h1 svg {
            margin-right: 10px;
        }
        
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            background-color: #ecfdf5;
            padding: 16px;
            border-radius: 8px;
        }
        
        .check-icon {
            background-color: #10b981;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
        }
        
        h2 {
            font-size: 22px;
            color: #2d3748;
            margin-bottom: 4px;
        }
        
        .subtitle {
            color: #718096;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #4a5568;
            margin-bottom: 4px;
        }
        
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 16px;
        }
        
        .next-steps {
            background-color: #eff6ff;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        
        .next-steps h3 {
            color: #3b82f6;
            margin-bottom: 12px;
        }
        
        .steps-list {
            list-style: none;
        }
        
        .step-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .step-icon {
            color: #3b82f6;
            margin-right: 10px;
        }
        
        .email-preview {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        
        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            cursor: pointer;
        }
        
        .preview-content {
            border-top: 1px solid #e2e8f0;
            padding: 16px;
        }
        
        .preview-subject {
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .email-body {
            white-space: pre-wrap;
            background-color: #f7fafc;
            padding: 12px;
            border-radius: 6px;
            color: #4a5568;
            font-size: 15px;
        }
        
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #718096;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <div class="logo">
            <h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Helper Buddy
            </h1>
        </div>
        
        <!-- Header -->
        <div class="header">
            <div class="check-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div>
                <h2>Service Approved!</h2>
                <p class="subtitle">Your service has been approved and is now live</p>
            </div>
        </div>

        <!-- Provider and Service Information -->
        <div>
            <div class="form-group">
                <label for="fullName">Provider Name</label>
                <input type="text" id="fullName" value="Jane Smith">
            </div>
            <div class="form-group">
                <label for="serviceName">Service Name</label>
                <input type="text" id="serviceName" value="Professional Photography">
            </div>
        </div>

        <!-- Next Steps Card -->
        <div class="next-steps">
            <h3>Next Steps for Success</h3>
            <ul class="steps-list">
                <li class="step-item">
                    <svg class="step-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Complete your availability calendar
                </li>
                <li class="step-item">
                    <svg class="step-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Add high-quality photos of your service
                </li>
                <li class="step-item">
                    <svg class="step-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Check your notification settings
                </li>
            </ul>
        </div>

        <!-- Email Preview Section -->
        <div class="email-preview">
            <div class="preview-header" id="togglePreview">
                <h3>Email Preview</h3>
                <svg id="chevronIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            </div>
            
            <div class="preview-content" id="previewContent">
                <div class="preview-subject">
                    <span>Subject:</span> 🎉 Congratulations! "Professional Photography" is now live on Helper Buddy
                </div>
                <div class="email-body">
Dear Jane Smith,

Great news! We're excited to inform you that your service "Professional Photography" has been reviewed and approved.

What this means:
- Your service is now visible to customers on Helper Buddy
- You can begin accepting bookings immediately
- Your provider profile is fully activated

Our data shows that providers who complete their calendar availability and add service photos in the first week receive 3x more bookings. Please ensure your profile is fully optimized!

If you need any assistance getting started or have questions, our Helper Buddy Success team is here to help at support@helperbuddy.com.

Thank you for choosing Helper Buddy for your business growth.

Warm regards,
The Helper Buddy Team
                </div>
            </div>
        </div>
        
        <div class="footer">
            © 2025 Helper Buddy - Provider Admin Portal
        </div>
    </div>

    <script>
        // Toggle email preview
        const togglePreview = document.getElementById('togglePreview');
        const previewContent = document.getElementById('previewContent');
        const chevronIcon = document.getElementById('chevronIcon');
        
        togglePreview.addEventListener('click', () => {
            if (previewContent.style.display === 'none') {
                previewContent.style.display = 'block';
                chevronIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
            } else {
                previewContent.style.display = 'none';
                chevronIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
            }
        });
        
        // Update email preview when input changes
        const fullNameInput = document.getElementById('fullName');
        const serviceNameInput = document.getElementById('serviceName');
        const emailBody = document.querySelector('.email-body');
        const previewSubject = document.querySelector('.preview-subject');
        
        function updateEmailContent() {
            const fullName = fullNameInput.value;
            const serviceName = serviceNameInput.value;
            
            previewSubject.innerHTML = \`<span>Subject:</span> 🎉 Congratulations! "${serviceName}" is now live on Helper Buddy\`;
            
            emailBody.textContent = \`Dear ${fullName},

Great news! We're excited to inform you that your service "${serviceName}" has been reviewed and approved.

What this means:
- Your service is now visible to customers on Helper Buddy
- You can begin accepting bookings immediately
- Your provider profile is fully activated

Our data shows that providers who complete their calendar availability and add service photos in the first week receive 3x more bookings. Please ensure your profile is fully optimized!

If you need any assistance getting started or have questions, our Helper Buddy Success team is here to help at support@helperbuddy.com.

Thank you for choosing Helper Buddy for your business growth.

Warm regards,
The Helper Buddy Team\`;
        }
        
        fullNameInput.addEventListener('input', updateEmailContent);
        serviceNameInput.addEventListener('input', updateEmailContent);
    </script>
</body>
</html>`
    };
}
function getServicePartnerRequestRejectionEmail(fullName: string, serviceName: string) {
    return {
        subject: `⚠️ Your service request "${serviceName}" was not approved`,
        body:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helper Buddy - Service Rejection Notification</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            padding: 20px;
        }
        
        .container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 24px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .logo h1 {
            color: #4361ee;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo h1 svg {
            margin-right: 10px;
        }
        
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            background-color: #fee2e2;
            padding: 16px;
            border-radius: 8px;
        }
        
        .x-icon {
            background-color: #ef4444;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
        }
        
        h2 {
            font-size: 22px;
            color: #2d3748;
            margin-bottom: 4px;
        }
        
        .subtitle {
            color: #718096;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #4a5568;
            margin-bottom: 4px;
        }
        
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 16px;
        }

        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 16px;
            min-height: 100px;
            resize: vertical;
        }
        
        .revision-steps {
            background-color: #fff7ed;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        
        .revision-steps h3 {
            color: #f97316;
            margin-bottom: 12px;
        }
        
        .steps-list {
            list-style: none;
        }
        
        .step-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .step-icon {
            color: #f97316;
            margin-right: 10px;
        }
        
        .email-preview {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        
        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            cursor: pointer;
        }
        
        .preview-content {
            border-top: 1px solid #e2e8f0;
            padding: 16px;
        }
        
        .preview-subject {
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .email-body {
            white-space: pre-wrap;
            background-color: #f7fafc;
            padding: 12px;
            border-radius: 6px;
            color: #4a5568;
            font-size: 15px;
        }
        
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #718096;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <div class="logo">
            <h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Helper Buddy
            </h1>
        </div>
        
        <!-- Header -->
        <div class="header">
            <div class="x-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
            <div>
                <h2>Service Needs Revision</h2>
                <p class="subtitle">Your service requires changes before it can be approved</p>
            </div>
        </div>

        <!-- Provider and Service Information -->
        <div>
            <div class="form-group">
                <label for="fullName">Provider Name</label>
                <input type="text" id="fullName" value="Jane Smith">
            </div>
            <div class="form-group">
                <label for="serviceName">Service Name</label>
                <input type="text" id="serviceName" value="Professional Photography">
            </div>
            <div class="form-group">
                <label for="rejectionReason">Rejection Reasons</label>
                <textarea id="rejectionReason">- Service description doesn't meet our minimum length requirements
- Service pricing information is missing
- At least 3 high-quality photos are required</textarea>
            </div>
        </div>

        <!-- Revision Steps Card -->
        <div class="revision-steps">
            <h3>Revision Guidance</h3>
            <ul class="steps-list">
                <li class="step-item">
                    <svg class="step-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Review the feedback carefully and make all requested changes
                </li>
                <li class="step-item">
                    <svg class="step-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v4l3 3"></path>
                    </svg>
                    Submit your revised service within 7 days
                </li>
                <li class="step-item">
                    <svg class="step-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="17" x2="12" y2="17"></line>
                    </svg>
                    Need help? Contact our Support team at support@helperbuddy.com
                </li>
            </ul>
        </div>

        <!-- Email Preview Section -->
        <div class="email-preview">
            <div class="preview-header" id="togglePreview">
                <h3>Email Preview</h3>
                <svg id="chevronIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            </div>
            
            <div class="preview-content" id="previewContent">
                <div class="preview-subject">
                    <span>Subject:</span> Your service "Professional Photography" needs revision
                </div>
                <div class="email-body">
Dear Jane Smith,

Thank you for submitting your service "Professional Photography" to Helper Buddy.

After reviewing your submission, we found that some changes are needed before we can approve your service. Here's what needs to be addressed:

- Service description doesn't meet our minimum length requirements
- Service pricing information is missing
- At least 3 high-quality photos are required

Please log in to your Helper Buddy provider dashboard and make these updates. Once you've made the necessary changes, your service will be reviewed again.

For guidance on creating a high-quality service listing, please refer to our Provider Guidelines in the Help Center.

If you have any questions or need assistance with the revision process, please contact our Support team at support@helperbuddy.com.

Thank you for your understanding.

Best regards,
The Helper Buddy Review Team
                </div>
            </div>
        </div>
        
        <div class="footer">
            © 2025 Helper Buddy - Provider Admin Portal
        </div>
    </div>

    <script>
        // Toggle email preview
        const togglePreview = document.getElementById('togglePreview');
        const previewContent = document.getElementById('previewContent');
        const chevronIcon = document.getElementById('chevronIcon');
        
        togglePreview.addEventListener('click', () => {
            if (previewContent.style.display === 'none') {
                previewContent.style.display = 'block';
                chevronIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
            } else {
                previewContent.style.display = 'none';
                chevronIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
            }
        });
        
        // Update email preview when input changes
        const fullNameInput = document.getElementById('fullName');
        const serviceNameInput = document.getElementById('serviceName');
        const rejectionReasonInput = document.getElementById('rejectionReason');
        const emailBody = document.querySelector('.email-body');
        const previewSubject = document.querySelector('.preview-subject');
        
        function updateEmailContent() {
            const fullName = fullNameInput.value;
            const serviceName = serviceNameInput.value;
            const rejectionReason = rejectionReasonInput.value;
            
            previewSubject.innerHTML = \`<span>Subject:</span> Your service "${serviceName}" needs revision\`;
            
            emailBody.textContent = \`Dear ${fullName},

Thank you for submitting your service "${serviceName}" to Helper Buddy.

After reviewing your submission, we found that some changes are needed before we can approve your service. 

Please log in to your Helper Buddy provider dashboard and make these updates. Once you've made the necessary changes, your service will be reviewed again.

For guidance on creating a high-quality service listing, please refer to our Provider Guidelines in the Help Center.

If you have any questions or need assistance with the revision process, please contact our Support team at support@helperbuddy.com.

Thank you for your understanding.

Best regards,
The Helper Buddy Review Team\`;
        }
        
        fullNameInput.addEventListener('input', updateEmailContent);
        serviceNameInput.addEventListener('input', updateEmailContent);
        rejectionReasonInput.addEventListener('input', updateEmailContent);
    </script>
</body>
</html>`
    };
}
