// Native fetch
// We'll use global fetch if available

async function testProposal() {
    const url = 'http://localhost:3000/api/anchoring/proposal';
    console.log("Testing Proposal API at", url);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userAddress: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
                utxos: [{
                    txid: 'a0c43d384eb8bf66e93100a5d7d52cf36ffbe247002d781088961929e10fcd03',
                    vout: 0,
                    value: 200000
                }],
                memorialId: 'test-api-mem-1'
            })
        });

        if (!res.ok) {
            console.error("API Error:", res.status, await res.text());
        } else {
            console.log("API Success:", await res.json());
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testProposal();
