
require('dotenv').config();
const { createTransport } = require('nodemailer');

const transporter = createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function main() {
    console.log("Testing Email Sending (CommonJS)...");
    console.log("From/To:", process.env.SMTP_USER);

    if (!process.env.SMTP_PASS) {
        console.error("Missing SMTP_PASS in .env");
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"EverstoneBTC" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'EverstoneBTC Email Test (CommonJS)',
            html: `
                <h1>It Works!</h1>
                <p>This is a test email from your Everstone local environment.</p>
                <p>Time: ${new Date().toLocaleString()}</p>
            `
        });
        console.log("✅ Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ Email failed:", error);
    }
}

main();
