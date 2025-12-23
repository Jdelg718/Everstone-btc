
import { anchorMemorial } from './lib/anchoring';

async function run() {
    console.log("Testing anchorMemorial...");
    try {
        const txid = await anchorMemorial("test-memorial-id-" + Date.now());
        console.log("SUCCESS: Anchored with TXID:", txid);
    } catch (e) {
        console.error("FAILURE:", e);
    }
}

run();
