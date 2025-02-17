import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

export async function sendMail(to: string, subject: string, html: string) {
    try {
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
