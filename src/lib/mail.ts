import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,  // Use 465 for SSL
    secure: false, // Set to true if using port 465
    auth: {
        user: process.env.BREVO_SMTP_USER, // Your Brevo email
        pass: process.env.BREVO_SMTP_PASS, // Brevo SMTP password
    },
});


export async function sendMail(to: string, subject: string, html: string) {
    try {
        console.log("Sending email...");
        transporter.verify((error) => {
            if (error) {
                console.error("❌ Error verifying transporter:", error);
            } else {
                console.log("✅ Server is ready to send emails.");
            }
        });
        const info = await transporter.sendMail({
            from: `"Helper Buddy" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text:"",
            html: html,
        });

        console.log(`📧 Email sent to ${to}: ${info.messageId}`);
        return { success: true };
    } catch (error) {
        console.error("Email Error:", error);
        return { success: false, error };
    }
}
