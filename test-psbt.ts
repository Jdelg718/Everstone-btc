
const { createMemorialPsbt } = require('./lib/anchoring');

async function test() {
    console.log("Testing PSBT Creation...");
    try {
        const userAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';
        const utxos = [{
            txid: 'a0c43d384eb8bf66e93100a5d7d52cf36ffbe247002d781088961929e10fcd03',
            vout: 0,
            value: 200000
        }];
        const memorialId = 'test-memorial-123';
        const feeSats = 100000;
        const treasury = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';

        const psbt = await createMemorialPsbt(userAddress, utxos, memorialId, feeSats, treasury);
        console.log("PSBT Generated Successfully!");
        console.log(psbt.substring(0, 50) + "...");
    } catch (e) {
        console.error("PSBT Failed:", e);
    }
}

test();
