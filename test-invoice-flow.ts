
import * as fs from 'fs';
import * as path from 'path';

// Late import types to avoid hoisting execution
let createInvoice: any;
let checkPaymentStatus: any;
let prisma: any;

// Simple .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.warn('⚠️ No .env file found.');
            return;
        }
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                const [key, ...values] = trimmed.split('=');
                const value = values.join('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
                }
            }
        });
        console.log('✅ Loaded .env file');
        const key = process.env.BTCPAY_API_KEY || '';
        console.log('🔑 Loaded Key:', key.substring(0, 4) + '...' + key.substring(key.length - 4));
    } catch (e) {
        console.error('Error loading .env:', e);
    }
}

loadEnv();

async function run() {
    console.log("🚀 Testing Service Model Flow...");

    // Dynamic import after env is loaded
    const paymentLib = await import('./lib/payment');
    createInvoice = paymentLib.createInvoice;
    checkPaymentStatus = paymentLib.checkPaymentStatus;
    const prismaLib = await import('./lib/prisma');
    prisma = prismaLib.prisma;

    console.log("Database URL:", process.env.DATABASE_URL);

    try {
        // 1. Create a dummy memorial or use latest
        console.log("Getting memorial...");
        let memorial;
        try {
            memorial = await prisma.memorial.create({
                data: {
                    slug: `test-mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    fullName: "Test Subject",
                    birthDate: "1900-01-01",
                    deathDate: "2000-01-01",
                    epitaph: "Testing Service Model",
                    bio: "Bio...",
                    status: "DRAFT",
                    anchoringPriority: "standard"
                }
            });
            console.log("Memorial Created:", memorial.id);
        } catch (e) {
            console.warn("Creation failed, fetching existing...");
            memorial = await prisma.memorial.findFirst({ orderBy: { createdAt: 'desc' } });
        }

        if (!memorial) throw new Error("No memorial found or created.");

        // 2. Create Invoice
        console.log("Creating Invoice...");
        const invoice = await createInvoice({
            memorialId: memorial.id,
            amount: 100 // $1.00
        });
        console.log("✅ Invoice Created:", invoice);

        // 3. Check Status
        console.log("Checking Status...");
        const status = await checkPaymentStatus(invoice.invoiceId);
        console.log("Current Status:", status);

        // 4. (Optional) If it was a mock, maybe we can pay it?
        // But assuming real BTCPay, we stop here.

    } catch (e: any) {
        console.error("❌ Test Failed (Detailed):");
        console.error("Message:", e.message);
        console.error("Code:", e.code);
        console.error("Meta:", e.meta);
        console.error("Stack:", e.stack);
    } finally {
        await prisma.$disconnect();
    }
}

run();
