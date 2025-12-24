
import dotenv from 'dotenv';
dotenv.config();

import { sendEmail } from './lib/email.js';

async function main() {
    console.log("Testing Email Sending...");
    console.log("From:", process.env.SMTP_USER);
    console.log("To:", process.env.SMTP_USER); // Send to self

    try {
        const result = await sendEmail({
            to: process.env.SMTP_USER || 'dearff2k@gmail.com',
            subject: 'EverstoneBTC Email Test',
            html: `
                <h1>It Works!</h1>
                <p>This is a test email from your Everstone local environment.</p>
                <p>Time: ${new Date().toLocaleString()}</p>
            `
        });
        console.log("Result:", result);
    } catch (e) {
        console.error("Test Failed:", e);
    }
}

main();
