import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

// Use Testnet for development, Mainnet for production
const NETWORK = bitcoin.networks.testnet;

export interface PaymentIntent {
    address: string;
    amountSats: number;
    anchorData: string; // The SHA256 hash or data to adhere to OP_RETURN
}

export const constructAnchorTransaction = async (
    intent: PaymentIntent,
    userUtxos: any[],
    userPublicKey: string
) => {
    // 1. Setup PSBT
    const psbt = new bitcoin.Psbt({ network: NETWORK });

    // 2. Add Inputs (From User Wallet)
    // NOTE: In a real implementation with UniSat/Xverse, we might just pass the requested outputs
    // and let the wallet handle input selection. 
    // However, if we construct the full PSBT, we need UTXOs.
    // For this prototype, we'll assume the wallet handles input selection if we use `sendBitcoin` API,
    // OR we ask the wallet for UTXOs first.

    // Let's implement the logic for "Wallet handles inputs" (Standard for UniSat/Xverse)
    // actually, most dApps requesting specific outputs (OP_RETURN + Payment) use the wallet's "send" API 
    // taking multiple outputs.

    // BUT, if we want to ensure *we* construct it (for precise OP_RETURN format), we do:

    // OUTPUT 1: Payment to Everstone
    psbt.addOutput({
        address: intent.address,
        value: BigInt(intent.amountSats)
    });

    // OUTPUT 2: Anchor (OP_RETURN)
    const dataBuffer = Buffer.from(intent.anchorData, 'utf-8');
    const embed = bitcoin.payments.embed({ data: [dataBuffer] });

    psbt.addOutput({
        script: embed.output!,
        value: BigInt(0)
    });

    return psbt;
};

// Helper to hash data for anchoring
export const hashForAnchor = async (data: string) => {
    const encoder = new TextEncoder();
    const dataBuf = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuf);
    return Buffer.from(hashBuffer).toString('hex');
};

export interface FeeRates {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
}

export interface EstimatedCosts {
    fastest: number;
    fast: number;
    standard: number;
}

// Fetch fee rates from Mempool.space
export const getNetworkFees = async (): Promise<FeeRates> => {
    try {
        const res = await fetch('https://mempool.space/api/v1/fees/recommended');
        if (!res.ok) throw new Error('Failed to fetch fees');
        return await res.json();
    } catch (e) {
        // Fallback defaults
        console.warn('Fee fetch failed, using defaults', e);
        return {
            fastestFee: 30,
            halfHourFee: 20,
            hourFee: 10,
            economyFee: 5,
            minimumFee: 1
        };
    }
};

// Calculate total cost in sats for a transaction (~250 vBytes for standard OP_RETURN)
export const calculateTxCosts = (rates: FeeRates): EstimatedCosts => {
    const VBYTES = 250;
    return {
        fastest: rates.fastestFee * VBYTES,
        fast: rates.halfHourFee * VBYTES,
        standard: rates.hourFee * VBYTES
    };
};
