const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bitcoin = require('bitcoinjs-lib');

const bip32 = BIP32Factory(ecc);

const mnemonic = process.argv[2];

if (!mnemonic) {
    console.error("Please provide your 12 words as a single quoted string.");
    console.error("Usage: node get-key.js \"word1 word2 ... word12\"");
    process.exit(1);
}

async function main() {
    // 1. Convert Mnemonic to Seed
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // 2. Create Root Key (Mainnet)
    const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);

    // 3. Derive Logic
    // Purpose 84' = Native Segwit (P2WPKH)
    // Coin 0' = Bitcoin Mainnet
    // Account 0' = First Account
    // Change 0 = External Chain (Receive)
    // Index 0 = First Address
    const path = "m/84'/0'/0'/0/0";

    const child = root.derivePath(path);

    // 4. Get Address and WIF
    const { address } = bitcoin.payments.p2wpkh({
        pubkey: child.publicKey,
        network: bitcoin.networks.bitcoin
    });

    console.log("\n--- YOUR TREASURY WALLET ---");
    console.log("Path:", path);
    console.log("Address:", address);
    console.log("WIF Private Key:", child.toWIF());
    console.log("\nCopy the WIF Key to your .env file as TREASURY_WIF");
}

main();
