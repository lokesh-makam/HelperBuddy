"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587, // Use 465 for SSL
    secure: false, // True if using port 465 (SSL)
    auth: {
        user:process.env.BREVO_SMTP_USER, // Your Brevo email
        pass:process.env.BREVO_SMTP_PASS, // Brevo SMTP password
    },
});

// One-time verification (optional, useful for debugging)
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Transporter Error:", error);
    } else {
        console.log("✅ SMTP Transporter Ready to Send Emails");
    }
});

export async function contactUs({ fullName, email, message }: { fullName: string; email: string; message: string }) {
    if (!fullName || !email || !message) {
        return { error: "All fields are required." };
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.error("❌ ADMIN_EMAIL is not set in environment variables.");
        return { error: "Server error. Please try again later." };
    }

    const mailOptions = {
        from: 'pateltirth27122005@gmail.com', // Must be your verified Brevo email
        replyTo: email,
        to: adminEmail,
        subject: "New Contact Us Message",
        text:"",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #333; text-align: center;">New Contact Request</h2>
                <p style="font-size: 16px;"><strong>Name:</strong> ${fullName}</p>
                <p style="font-size: 16px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
                <p style="font-size: 16px;"><strong>Message:</strong></p>
                <div style="background: #fff; padding: 15px; border-radius: 5px; font-size: 16px; border-left: 5px solid #007bff;">
                    ${message}
                </div>
                <p style="text-align: center; font-size: 14px; color: #888; margin-top: 20px;">This email was sent via the contact form.</p>
            </div>
        `,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", response);
        return { success: "Message sent successfully." };
    } catch (error: any) {
        console.error("❌ Error sending email:", error.message || error);
        return { error: "Failed to send the message. Please try again later." };
    }
}

