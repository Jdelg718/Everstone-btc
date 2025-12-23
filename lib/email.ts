
import nodemailer from 'nodemailer';

// Configure transporter with environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface EmailReceiptData {
    email: string;
    fullName: string;
    txid: string;
    memorialSlug: string;
    bundleUrl: string;
}

export const sendReceiptEmail = async (data: EmailReceiptData) => {
    const { email, fullName, txid, memorialSlug, bundleUrl } = data;

    const html = `
        <div style="font-family: serif; color: #1c1917; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #d97706; margin-bottom: 5px;">Everstone</h1>
                <p style="color: #78716c; margin-top: 0;">Immutable Digital Memorials</p>
            </div>
            
            <p>Dear Family of ${fullName},</p>
            
            <p>The memorial has been successfully anchored to the Bitcoin blockchain. This record is now immutable and preserved forever.</p>
            
            <div style="background-color: #f5f5f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Transaction ID (Proof):</strong></p>
                <code style="word-break: break-all; display: block; padding: 10px; background: #e7e5e4; border-radius: 3px;">${txid}</code>
            </div>

            <p>You can view the verified memorial here:<br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/m/${memorialSlug}">View Memorial</a></p>

            <p><strong>Your Digital Bundle:</strong><br/>
            We have attached the raw data bundle for your safekeeping. You can also download it anytime via the link below.</p>
            
            <a href="${bundleUrl}" style="display: inline-block; background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Download Offline Bundle</a>
            
            <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 30px 0;" />
            
            <p style="font-size: 12px; color: #78716c;">
                Everstone Network<br/>
                Secured by Bitcoin
            </p>
        </div>
    `;

    await transporter.sendMail({
        from: '"Everstone" <noreply@everstonebtc.com>',
        to: email,
        subject: `Start of Eternity: Memorial Anchored for ${fullName}`,
        html: html,
    });
};
