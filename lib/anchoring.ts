import * as bitcoin from 'bitcoinjs-lib';
// We avoid top-level ECC init if possible to prevent WASM load on import.
// However, address validation needs it.
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

// Try to init safely
try {
    bitcoin.initEccLib(ecc);
} catch (e) {
    // It might be already initialized or fail. 
    // If it fails due to WASM, we catch it.
    console.warn('Failed to init ECC lib:', e);
}

const NETWORK = bitcoin.networks.bitcoin; // Mainnet

export interface Utxo {
    txid: string;
    vout: number;
    value: number; // sats
    scriptPubKey?: string;
}

/**
 * Encodes the memorial data into an OP_RETURN script.
 */
export function encodeMemorialData(memorialId: string): Buffer {
    const PROTOCOL_PREFIX = 'EVST1';
    const dataString = `${PROTOCOL_PREFIX}:${memorialId}`;
    return Buffer.from(dataString, 'utf-8');
}

/**
 * Creates a PSBT for the user to sign.
 */
export async function createMemorialPsbt(
    userAddress: string,
    utxos: Utxo[],
    memorialId: string,
    feeSats: number,
    treasuryAddress: string
): Promise<string> {
    const psbt = new bitcoin.Psbt({ network: NETWORK });

    // 1. Inputs
    let totalInput = 0;
    // Simple coin selection: valid UTXOs until we cover amount
    // Target = FeeSats + 0 (Anchor) + Mining Fees
    // But wait, the feeSats passed is just the Service Fee ($100).
    // The mining fee needs to be added.
    // For now, let's assume the wallet/frontend might strictly select inputs or we take all passed.
    // We'll take all passed UTXOs for now (assuming frontend filtered).

    for (const utxo of utxos) {
        const input: any = {
            hash: utxo.txid,
            index: utxo.vout,
            // For Segwit/Taproot, we need witnessUtxo
            witnessUtxo: {
                script: utxo.scriptPubKey
                    ? Buffer.from(utxo.scriptPubKey, 'hex')
                    : bitcoin.address.toOutputScript(userAddress, NETWORK),
                value: BigInt(utxo.value)
            }
        };

        // If Taproot, might need tapInternalKey etc. 
        // But for unsigned PSBT, witnessUtxo is often enough for the signer (wallet) to add partial data.
        psbt.addInput(input);
        totalInput += utxo.value;
    }

    // 2. Outputs

    // A. Treasury Output (Service Fee)
    psbt.addOutput({
        address: treasuryAddress,
        value: BigInt(feeSats)
    });

    // B. Anchor Output (OP_RETURN)
    const data = encodeMemorialData(memorialId);
    const embed = bitcoin.payments.embed({ data: [data], network: NETWORK });
    psbt.addOutput({
        script: embed.output!,
        value: BigInt(0)
    });

    // C. Change Output
    // Estimate Mining Fee (vBytes)
    // 2 Inputs (approx) + 3 Outputs = ~300-400 vBytes
    // Let's safe estimate 500 vbytes * 10 sats/vbyte = 5000 sats? 
    // Better to have a miningFee param.
    // For MVP, hardcode a reasonable mining buffer or calculate.
    const ESTIMATED_MINING_FEE = 3000; // 300 vbytes * 10 sats/vbyte

    const change = totalInput - feeSats - ESTIMATED_MINING_FEE;

    if (change > 546) { // Dust limit
        psbt.addOutput({
            address: userAddress,
            value: BigInt(change)
        });
    }

    return psbt.toBase64();
}

/**
 * Server-side function to anchor a memorial (Service Model).
 * Uses the server's treasury wallet to pay network fees.
 */
export async function anchorMemorial(memorialId: string): Promise<string> {
    const TREASURY_WIF = process.env.TREASURY_WIF;

    // For MVP/Dev, if no key, we mock the success
    if (!TREASURY_WIF) {
        console.warn("No TREASURY_WIF configured. Mocking anchoring.");
        return "mock_txid_" + Date.now();
    }

    try {
        const keyPair = ECPairFactory(ecc).fromWIF(TREASURY_WIF, NETWORK);
        const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: NETWORK });

        console.log(`Anchoring using Treasury: ${address}`);

        // 1. Fetch UTXOs from Mempool.space (Mainnet)
        // Ensure your TREASURY_WIF corresponds to a Segwit address (Bech32)
        const utxoRes = await fetch(`https://mempool.space/api/address/${address}/utxo`);
        if (!utxoRes.ok) throw new Error("Failed to fetch UTXOs for treasury.");
        const utxos: Utxo[] = await utxoRes.json();

        if (utxos.length === 0) throw new Error("Treasury wallet has no funds.");

        console.log(`Found ${utxos.length} UTXOs`);

        // 2. Network Fee (approx)
        // We pay a small fee for the anchor TX
        const MINING_FEE = 2000; // Sats

        // 3. Construct PSBT
        const psbt = new bitcoin.Psbt({ network: NETWORK });

        let totalInput = 0;

        // Add Inputs
        for (const utxo of utxos) {
            const txHexRes = await fetch(`https://mempool.space/api/tx/${utxo.txid}/hex`);
            const txHex = await txHexRes.text();

            psbt.addInput({
                hash: utxo.txid,
                index: utxo.vout,
                witnessUtxo: {
                    script: bitcoin.address.toOutputScript(address!, NETWORK),
                    value: BigInt(utxo.value)
                }
            });
            totalInput += utxo.value;
            if (totalInput > MINING_FEE + 546) break; // Stop if we have enough
        }

        if (totalInput < MINING_FEE) throw new Error("Insufficient funds in treasury.");

        // Add Outputs
        // A. OP_RETURN Anchor
        const data = encodeMemorialData(memorialId);
        const embed = bitcoin.payments.embed({ data: [data], network: NETWORK });
        psbt.addOutput({
            script: embed.output!,
            value: BigInt(0)
        });

        // B. Change
        const change = totalInput - MINING_FEE;
        if (change > 546) {
            psbt.addOutput({
                address: address!,
                value: BigInt(change)
            });
        }

        // 4. Sign
        psbt.signAllInputs(keyPair);
        psbt.finalizeAllInputs();
        const tx = psbt.extractTransaction();
        const txHex = tx.toHex();

        console.log("Broadcasting Anchor TX...");

        // 5. Broadcast (using our helper which tries multiple nodes)
        // Make sure to import broadcastTx from ./btcpay or implement here
        // We will just use mempool.space directly here for simplicity since we fetched from it
        const broadcastRes = await fetch('https://mempool.space/api/tx', {
            method: 'POST',
            body: txHex
        });

        if (!broadcastRes.ok) {
            throw new Error(`Broadcast failed: ${await broadcastRes.text()}`);
        }

        const txid = await broadcastRes.text();
        console.log("Anchored successfully:", txid);

        return txid;

    } catch (e) {
        console.error("Anchoring failed:", e);
        throw e;
    }
}
