import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Use `true` for port 465, `false` for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendMail(to: string, subject: string, text: string, html?: string) {
    try {
        const info = await transporter.sendMail({
            from: `"Helper Buddy" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html: html || text,
        });

        console.log(`📧 Email sent to ${to}: ${info.messageId}`);
        return { success: true };
    } catch (error) {
        console.error("Email Error:", error);
        return { success: false, error };
    }
}
