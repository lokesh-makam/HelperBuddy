"use server";
import { db } from "@/src/lib/db";
import {sendMail} from "@/src/lib/mail";

// Fetch all service partners
export async function getAllServicePartners() {
    return db.servicePartner.findMany({
        orderBy: {createdAt: "desc"},
    });
}

// Approve service partner
export async function approveServicePartner(id: string) {
    const data=await db.servicePartner.update({
        where: {id},
        data: {status: "approved"},
    });
    const email = getApprovalEmail(data.fullName);
    await sendMail(data.email, email.subject, email.body);
    return data;
}

// Remove service partner
export async function removeServicePartner(id: string) {
    const data=await db.servicePartner.delete({
        where: {id},
    });
    const email = getRejectionEmail(data.fullName);
    await sendMail(data.email, email.subject, email.body);
    return data;
}

// Reject service partner
export async function rejectServicePartner(id: string) {
    const data=await db.servicePartner.update({
        where: {id},
        data: {status: "rejected"},
    });
    const email = getRejectionEmail(data.fullName);
    await sendMail(data.email, email.subject, email.body);
    return data;
}
const getApprovalEmail = (name: string) => ({
    subject: "Your Service Partner Application is Approved! 🎉",
    body: `
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
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 15px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .logo {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .content {
      padding: 20px;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 0 0 8px 8px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .button {
      display: inline-block;
      background: #4CAF50;
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
    }
    .highlight {
      background-color: #e8f5e9;
      border-left: 4px solid #4CAF50;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .steps {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .step {
      margin-bottom: 10px;
      display: flex;
    }
    .step-number {
      background-color: #4CAF50;
      color: white;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      font-weight: bold;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Helper Buddy</div>
      <h1 style="margin: 0; font-size: 24px;">Application Approved! 🎉</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px;">Hi <strong>${name}</strong>,</p>
      
      <p>We're excited to let you know that your application to become a service partner on our platform has been <strong style="color: #4CAF50;">approved</strong>!</p>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>Welcome to the Helper Buddy family!</strong> You are now officially part of our growing network of trusted service professionals.</p>
      </div>
      
      <h3>Getting Started</h3>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div>Log in to your service partner dashboard</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div>Complete your profile and service offerings</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div>Set your availability and service areas</div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div>Start receiving service requests from customers</div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="#" class="button">Go to Dashboard</a>
      </div>
      
      <p>If you have any questions or need help getting started, our support team is always ready to assist you.</p>
      
      <p>We're thrilled to have you on board and look forward to a successful partnership!</p>
      
      <p>Best regards,<br><strong>The Helper Buddy Team</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 Helper Buddy. All rights reserved.</p>
      <p>
        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Help Center</a> | 
        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Contact Us</a> | 
        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `
});
const getRejectionEmail = (name: string) => ({
    subject: "Update on Your Service Partner Application",
    body: `
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
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 15px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .logo {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .content {
      padding: 20px;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 0 0 8px 8px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .button {
      display: inline-block;
      background: #607D8B;
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
    }
    .info-box {
      background-color: #ECEFF1;
      border-left: 4px solid #607D8B;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .reapply-section {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    h3 {
      color: #455A64;
      border-bottom: 1px solid #e1e1e1;
      padding-bottom: 10px;
    }
    .tip {
      display: flex;
      margin-bottom: 10px;
      align-items: flex-start;
    }
    .tip-icon {
      background-color: #607D8B;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      font-weight: bold;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Helper Buddy</div>
      <h1 style="margin: 0; font-size: 24px;">Application Status Update</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px;">Hi <strong>${name}</strong>,</p>
      
      <p>Thank you for your interest in becoming a service partner on our platform. We sincerely appreciate the time you took to submit your application.</p>
      
      <div class="info-box">
        <p style="margin: 0;">After careful review of your application, we regret to inform you that it has not been approved at this time.</p>
      </div>
      
      <p>This decision could be due to one or more of the following factors:</p>
      <ul>
        <li>Incomplete profile information</li>
        <li>Insufficient experience documentation</li>
        <li>Service area limitations</li>
        <li>Current capacity in your service category</li>
      </ul>
      
      <div class="reapply-section">
        <h3>Would You Like to Reapply?</h3>
        <p>We welcome you to reapply in the future with updated information. Here are some tips for a successful application:</p>
        
        <div class="tip">
          <div class="tip-icon">✓</div>
          <div>Ensure all required fields are completed with detailed information</div>
        </div>
        <div class="tip">
          <div class="tip-icon">✓</div>
          <div>Include relevant experience and qualifications</div>
        </div>
        <div class="tip">
          <div class="tip-icon">✓</div>
          <div>Provide clear service descriptions and pricing structure</div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="#" class="button">Contact Support</a>
      </div>
      
      <p>If you have any questions about your application or need clarification on our partner requirements, our support team is available to assist you.</p>
      
      <p>We appreciate your interest in Helper Buddy and wish you success in your professional endeavors.</p>
      
      <p>Warm regards,<br><strong>The Helper Buddy Team</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 Helper Buddy. All rights reserved.</p>
      <p>
        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Help Center</a> | 
        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Contact Us</a> | 
        <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Partner Guidelines</a>
      </p>
    </div>
  </div>
</body>
</html>
  `
});