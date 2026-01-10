# EVERSTONE
## Eternal Digital Memorials on Bitcoin

---

**Website:** everstone.io  
**Contact:** press@everstone.io  
**Press Kit Date:** January 2026

---

## THE ELEVATOR PITCH

> "What if you could create a digital memorial that literally *cannot be deleted*—not by us, not by any corporation, not by any government?"

Everstone takes the photos, stories, and tributes you create for a loved one and anchors a cryptographic proof directly into the **Bitcoin blockchain**—the most secure, decentralized network humans have ever created.

Once anchored, that proof exists on *thousands of computers worldwide*. No single point of failure. No subscription fees. No company that can go bankrupt and take your memories with it.

**As long as Bitcoin exists, the proof of your loved one's memorial exists.**

---

## HOW WE'RE STEWARDS OF THE BLOCKCHAIN

We believe in using Bitcoin *responsibly*. Here's how we honor the network:

### 🔹 Minimal Footprint: ~40 Bytes

We don't store photos on the blockchain. We embed only a tiny cryptographic fingerprint (hash) using **OP_RETURN**—the designated, non-bloating method for timestamping data. That's smaller than a single tweet.

### 🔹 Anti-Spam Protection: $100 Commitment

Every memorial requires a **$100 transaction**. This isn't just a fee—it's a commitment that ensures only genuine, meaningful memorials are anchored. It prevents spam while covering real Bitcoin network fees.

### 🔹 Real Financial Transaction

Unlike pure data embedding, Everstone anchors proofs within actual financial transactions. This is how Bitcoin was designed—moving real value while carrying metadata.

### 🔹 Node Operator Friendly

We stay well within OP_RETURN limits (80 bytes max). Node operators don't store megabytes for our service—just a fingerprint smaller than this sentence.

---

## THE TECHNICAL FLOW

```
1. MEMORIAL CREATED
   SHA-256(memorial_content) → 32-byte hash

2. TRANSACTION BUILT
   OP_RETURN EVERSTONE:<hash_prefix>

3. BROADCAST TO NETWORK
   btc_tx → mempool → confirmation

4. FOREVER ANCHORED
   Block #XXX,XXX → immutable proof
```

**Key Point:** The memorial content (photos, text) lives in a downloadable bundle and optionally IPFS. Only the tiny proof hash touches Bitcoin.

---

## TALKING POINTS FOR YOUR SHOW

Copy-paste ready sound bites:

- ✓ *"Everstone is for people who want their loved one's memory to outlast any company, any server, any website."*

- ✓ *"The $100 commitment isn't just a fee—it's anti-spam protection that ensures only meaningful memorials are anchored."*

- ✓ *"We only embed about 40 bytes of data using OP_RETURN—smaller than a single tweet. We're stewards of the blockchain, not bloaters."*

- ✓ *"Even if Everstone the company disappears tomorrow, your memorial proof lives on across thousands of Bitcoin nodes worldwide."*

- ✓ *"Every user gets a downloadable offline bundle with an open-source viewer. True digital sovereignty."*

- ✓ *"We use real Bitcoin transactions—not just data dumps. Our anchoring happens within actual financial movements on the network."*

---

## HANDLING SKEPTICS

### "Isn't putting data on Bitcoin wasteful?"

Great question! We use OP_RETURN, specifically designed for small data payloads that don't bloat the UTXO set. We embed roughly 40 bytes—less than a tweet. And our $100 minimum ensures only genuine memorials, not spam. We're stewards of the chain, not abusers.

### "What if Bitcoin goes away?"

Bitcoin has been running since 2009 without a single hour of downtime. It's secured by more computing power than all the world's supercomputers combined. If Bitcoin fails, we have bigger problems—but in that scenario, users still have their offline bundles.

### "Why $100? That seems expensive."

The $100 serves two purposes: it covers real Bitcoin network fees for anchoring, and more importantly, it acts as anti-spam protection. This ensures every memorial is meaningful, not a test or joke. It's a one-time payment—no subscriptions, ever.

### "Can I verify this actually works?"

Absolutely! Every Everstone memorial includes a link to the actual Bitcoin transaction on public explorers like mempool.space. Anyone can independently verify the proof exists in the blockchain. *Verify, don't trust.*

### "What data actually goes on-chain?"

Only a cryptographic hash (fingerprint) of your memorial—about 40 bytes. Actual photos, text, and videos never touch the blockchain. They're stored in a downloadable bundle and optionally on IPFS.

---

## THE HUMAN STORY

> *"I lost someone I loved, and when I looked at the memorial website we'd created, I realized something terrifying: that site could disappear any time the hosting company decided to shut down, or when I forgot to pay a bill, or when the company went bankrupt."*

Everstone was born from that fear—and the realization that Bitcoin, this unstoppable, censorship-resistant network, could solve it permanently. Not through promises, but through mathematics and decentralization.

---

## KEY FACTS

| Item | Detail |
|------|--------|
| **Founded** | 2026 |
| **Technology** | Bitcoin OP_RETURN + IPFS |
| **On-chain footprint** | ~40 bytes per memorial |
| **Pricing** | $100 one-time (no subscriptions) |
| **Data bundle** | Downloadable, self-hostable |
| **Viewer** | Open-source, works offline |

---

## CONTACT US

**For interviews or follow-up questions:**

📧 press@everstone.io  
🌐 everstone.io  
🐦 @EverstoneBTC

---

*"Some memories deserve to last forever. Anchor your loved one's legacy to the Bitcoin blockchain—beyond servers, beyond time."*

---

© 2026 Everstone. All rights reserved.
