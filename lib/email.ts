import nodemailer from 'nodemailer';

// Email Provider Options:
// 1. Resend (Professional, Recommended) - Host: smtp.resend.com, Port: 465, Secure: true
// 2. Gmail (Personal, Quick) - Host: smtp.gmail.com, Port: 465, Secure: true (Requires App Password)

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("⚠️ SMTP credentials not found. Email simulation:");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.warn("Skipping actual send.");
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"EverstoneBTC" <support@everstonebtc.com>', // Sender address
            to,
            subject,
            html,
        });
        console.log(`📧 Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ Email failed:", error);
        throw error;
    }
}

export async function sendReceiptEmail({
    email,
    fullName,
    txid,
    memorialSlug,
    bundleUrl
}: {
    email: string;
    fullName: string;
    txid: string;
    memorialSlug: string;
    bundleUrl: string;
}) {
    const subject = `Memorial Anchored: ${fullName}`;
    const html = `
        <div style="font-family: serif; color: #1c1917; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4;">
            <h1 style="color: #b45309; text-align: center;">Memorial Anchored</h1>
            <p>The memorial for <strong>${fullName}</strong> has been successfully anchored to the Bitcoin blockchain.</p>
            
            <div style="background: #f5f5f4; padding: 15px; margin: 20px 0; font-family: monospace;">
                <strong>TXID:</strong> ${txid}
            </div>

            <p>It is now immutable and permanent.</p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${bundleUrl}" style="background: #b45309; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Bundle</a>
            </div>

            <p style="font-size: 0.9em; color: #78716c; text-align: center;">
                View on Everstone: <a href="https://everstonebtc.com/view/${txid}">https://everstonebtc.com/view/${txid}</a>
            </p>
        </div>
    `;

    return sendEmail({ to: email, subject, html });
}
