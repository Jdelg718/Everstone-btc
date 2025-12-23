// Disable SSL verification for local testing (MyNode uses self-signed certs)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import * as fs from 'fs';
import * as path from 'path';
import { createInvoice, getInvoiceStatus } from './lib/btcpay';

// Simple .env parser since we can't rely on dotenv being installed/configured for standalone scripts
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.warn('⚠️ No .env file found via standalone script loader.');
            return;
        }
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                const [key, ...values] = trimmed.split('=');
                const value = values.join('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
                }
            }
        });
        console.log('✅ Loaded .env file');
    } catch (e) {
        console.error('Error loading .env:', e);
    }
}

// Load env vars first
loadEnv();

async function runTest() {
    console.log('🚀 Starting BTCPay Connection Test...');

    const url = process.env.BTCPAY_URL;
    const storeId = process.env.BTCPAY_STORE_ID;
    const apiKey = process.env.BTCPAY_API_KEY;

    console.log(`Debug Info:`);
    console.log(`- URL: ${url ? url : 'MISSING'}`);
    console.log(`- Store ID: ${storeId ? storeId : 'MISSING'}`);
    console.log(`- API Key: ${apiKey ? apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4) : 'MISSING'}`);

    if (!url || !storeId || !apiKey) {
        console.error('❌ Missing configuration. Please check your .env file.');
        return;
    }

    try {
        console.log('\nAttempting to create a test invoice...');
        const invoice = await createInvoice(1.00, 'USD', 'test-order-' + Date.now());

        console.log('✅ Invoice Created Successfully!');
        console.log(JSON.stringify(invoice, null, 2));

        if (invoice.id.startsWith('mock_')) {
            console.warn('⚠️ WARNING: Returned a MOCK invoice. Connection might have failed silently or config is ignored.');
        } else {
            console.log('\nChecking status...');
            const status = await getInvoiceStatus(invoice.id);
            console.log(`Current Status: ${status}`);
        }

    } catch (error: any) {
        if (error.toString().includes('401')) {
            console.error('\n❌ AUTHENTICATION FAILED (401)');
            console.error('The server rejected your API Key.');
            console.error('1. Double check that you copied the ENTIRE key from the green bar.');
            console.error('2. Make sure there are no spaces in the key in your .env file.');
            console.error('3. Ensure the key has "View invoices" and "Create an invoice" permissions.');
        } else {
            console.error('❌ Test Failed:', error);
        }
    }
}

runTest();
