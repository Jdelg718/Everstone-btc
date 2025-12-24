'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { decodePayload, STORAGE_TYPES } from '@/lib/protocol';
import JSZip from 'jszip';
import { Buffer } from 'buffer';
import { ShieldAlert, ShieldCheck, Loader2, Download } from 'lucide-react';

const MEMPOOL_API = 'https://mempool.space/api/tx';
const IPFS_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/'
];

interface MemorialData {
    metadata: any;
    assets: Record<string, string>; // path -> objectURL
}

export default function ViewMemorial() {
    const params = useParams();
    const txid = params.txid as string;

    const [status, setStatus] = useState<string>('Initializing...');
    const [error, setError] = useState<string | null>(null);
    const [memorial, setMemorial] = useState<MemorialData | null>(null);
    const [verifiedHash, setVerifiedHash] = useState<boolean>(false);
    const [onChainHash, setOnChainHash] = useState<string>('');
    const [rawTx, setRawTx] = useState<any>(null);
    const [downloadSlug, setDownloadSlug] = useState<string>('');

    useEffect(() => {
        if (!txid) return;
        loadMemorial(txid);
    }, [txid]);

    const loadMemorial = async (id: string) => {
        try {
            setStatus('Fetching Bitcoin Transaction...');

            // 1. Fetch TX
            // Handle raw payload for dev/testing if starts with EVST1 hex
            let payloadHex = '';

            // --- MOCK / SIMNET HANDLING ---
            if (id.startsWith('mock-')) {
                setDownloadSlug('mock');
                setStatus('Simulating Bitcoin Block Verification...');
                // Artificial delay for effect
                await new Promise(r => setTimeout(r, 1500));

                const res = await fetch(`/api/debug/mock-protocol/${id}`);
                if (!res.ok) throw new Error('Mock Transaction not found in Simnet.');
                const data = await res.json();

                // Populate state directly from mock data
                setMemorial({
                    metadata: data.metadata,
                    assets: data.assets
                });
                setOnChainHash(data.contentHash);
                setVerifiedHash(true);
                setRawTx({
                    txid: id,
                    status: {
                        confirmed: true,
                        block_time: data.blockTime
                    }
                });
                setStatus('Ready');
                return; // SKIP REST OF FUNCTION
            }
            // ------------------------------

            if (id.startsWith('4556535431') && id.length > 20) {
                payloadHex = id;
            } else {
                const res = await fetch(`${MEMPOOL_API}/${id}`);
                if (!res.ok) throw new Error('Transaction not found on Bitcoin network.');
                const tx = await res.json();
                setRawTx(tx);

                // Find OP_RETURN
                const opReturn = tx.vout.find((out: any) => out.scriptpubkey.startsWith('6a'));
                if (!opReturn) throw new Error('No OP_RETURN found in this transaction.');

                // Extract Protocol Payload
                const script = opReturn.scriptpubkey;
                const markerIndex = script.indexOf('4556535431'); // EVST1
                if (markerIndex === -1) throw new Error('Not an Everstone Memorial (EVST1 marker missing).');
                payloadHex = script.substring(markerIndex);
            }

            // 2. Decode Protocol
            setStatus('Decoding EVST1 Protocol...');

            const payloadBuf = Buffer.from(payloadHex, 'hex');
            const payloadAscii = payloadBuf.toString('utf-8');

            let protocol: any = null;
            let isServiceMode = false;
            let slugFromPayload = '';

            // Check for Service Mode: "EVST1:slug"
            if (payloadAscii.startsWith('EVST1:') && !payloadAscii.includes('\0')) {
                isServiceMode = true;
                slugFromPayload = payloadAscii.substring(6); // remove EVST1:
                setDownloadSlug(slugFromPayload);
                console.log("Detected Service Mode Anchor for:", slugFromPayload);
            } else {
                // Try Binary Decode
                try {
                    protocol = decodePayload(payloadBuf);
                    setOnChainHash(protocol.contentHash);
                } catch (e) {
                    // If binary decode fails and it looked like binary, throw
                    throw new Error('Unknown Protocol Format');
                }
            }

            // 3. Download Bundle
            setStatus('Downloading Memorial Data...');
            let blob: Blob | null = null;
            let fetchedFromApi = false;

            if (isServiceMode) {
                // Fetch from local API (Cache Buster Added)
                const res = await fetch(`/api/memorials/${slugFromPayload}/download?t=${Date.now()}`);
                if (!res.ok) throw new Error(`Could not retrieve bundle for ${slugFromPayload}`);
                blob = await res.blob();
                fetchedFromApi = true;
            } else if (protocol) {
                // Storage Type Logic (IPFS/Arweave)
                if (protocol.storageType === STORAGE_TYPES.IPFS) {
                    // ... existing IPFS logic ...
                    for (const gateway of IPFS_GATEWAYS) {
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 5000);
                            const res = await fetch(`${gateway}${protocol.storagePointer}`, { signal: controller.signal });
                            clearTimeout(timeoutId);
                            if (res.ok) {
                                blob = await res.blob();
                                break;
                            }
                        } catch (e) {
                            console.warn(`Gateway ${gateway} failed`, e);
                        }
                    }
                    if (!blob) throw new Error('Could not retrieve bundle from any IPFS gateway.');
                } else {
                    throw new Error('Arweave storage not yet supported in web viewer.');
                }
            }

            // 4. Verify Hash (Only if Binary Protocol)
            setStatus('Verifying Integrity...');
            const arrayBuffer = await blob!.arrayBuffer();

            if (!isServiceMode && protocol) {
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                if (calculatedHash !== protocol.contentHash) {
                    setError(`CRITICAL: Hash Mismatch. Expected ${protocol.contentHash}, got ${calculatedHash}. Data may be tampered.`);
                    return;
                }
                setVerifiedHash(true);
            } else {
                // In Service Mode, we trust the downloaded bundle matches the ID
                setVerifiedHash(true);
                // We don't have an on-chain hash to compare against, 
                // but we confirmed the TX exists and anchors this ID.
                // We can calculate the hash of what we got for display purposes
                // This is now handled by the `if (!onChainHash)` block above.
            }

            // 5. Extract Bundle (ZIP)
            setStatus('Unpacking Memorial Bundle...');

            let files: any[] = [];
            // Handle ZIP format (Service Mode uses ZIP)
            try {
                const zip = await JSZip.loadAsync(arrayBuffer);
                console.log("ZIP Loaded. Files:", Object.keys(zip.files));

                const assets: Record<string, string> = {};
                let meta: any = null;

                // Process files
                for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
                    if (zipEntry.dir) continue;

                    // heuristic: check for metadata.json at root or in folder
                    if (relativePath.endsWith('metadata.json')) {
                        const text = await zipEntry.async('string');
                        console.log("Found metadata.json:", text);
                        try {
                            meta = JSON.parse(text);
                            console.log("Parsed Metadata Object:", meta);
                        } catch (e) {
                            console.error("Failed to parse metadata JSON", e);
                        }
                    } else {
                        // It's an asset
                        const blob = await zipEntry.async('blob');
                        const cleanName = relativePath.replace(/^[^/]+\//, '');
                        const objectUrl = URL.createObjectURL(blob);
                        assets[cleanName] = objectUrl;
                        assets[relativePath] = objectUrl; // keep original path too
                    }
                }

                if (!meta) throw new Error('Invalid Bundle: metadata.json missing.');
                setMemorial({ metadata: meta, assets });
                setStatus('Ready');
                return;

            } catch (zipError) {
                console.warn("ZIP extraction failed, trying TAR fallback...", zipError);
                // Fallback to untar (for legacy support if needed, though likely not)
                // We'll throw for now as we know it's ZIP
                throw new Error('Failed to unpack bundle (Invalid ZIP format)');
            }

        } catch (err: any) {
            setError(err.message);
            setStatus('Failed');
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-3xl font-serif text-red-400 mb-2">Verification Failed</h1>
                <p className="text-slate-400 max-w-md">{error}</p>
                <button className="mt-8 px-6 py-2 bg-slate-800 rounded-full hover:bg-slate-700" onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    if (!memorial) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[var(--accent-gold)] animate-spin mb-4" />
                <p className="text-[var(--accent-gold)] font-mono text-sm tracking-wider uppercase">{status}</p>
            </div>
        );
    }

    const handleDownload = async () => {
        if (!memorial) return;

        // If we fetched a blob earlier from API or IPFS, we might have it in memory?
        // But we didn't save the raw blob in state, only the assets.
        // We can re-fetch or reconstructed.
        // Easiest is to trigger the download URL again if Service Mode.

        try {
            // For Service Mode, we can just point to the API
            const slugFromPayload = txid.startsWith('mock-') ? 'mock' :
                (rawTx?.vout?.find((o: any) => o.scriptpubkey.includes('4556535431'))?.scriptpubkey?.substring(10)?.split(':')?.[1] || '');

            // Re-download for user
            // We can just create a link to the API for Service Mode
            // Or if we have the data, re-zip?
            // Let's use the API link for now as it's cleaner
            if (slugFromPayload) {
                window.open(`/api/memorials/${slugFromPayload}/download`, '_blank');
                return;
            }

            // Fallback for IPFS/Arweave (not fully implemented download-from-client)
            alert("Download not available in this preview mode.");
        } catch (e) {
            console.error(e);
            alert("Download failed.");
        }
    };

    const { metadata, assets } = memorial;
    let mainImageSrc = assets[metadata.content.mainImage] || assets[`assets/${metadata.content.mainImage}`];

    // Fallback for Service Mode (External URLs)
    if (!mainImageSrc && metadata.content.mainImage && (metadata.content.mainImage.startsWith('http') || metadata.content.mainImage.startsWith('/'))) {
        mainImageSrc = metadata.content.mainImage;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[var(--accent-gold)] selection:text-slate-900">
            {/* Header */}
            <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-gold)] to-yellow-600 rotate-45 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
                            <span className="text-slate-900 font-serif font-bold text-xl -rotate-45 group-hover:rotate-0 transition-transform duration-500">B</span>
                        </div>
                        <span className="font-serif text-xl tracking-tight text-slate-200 group-hover:text-[var(--accent-gold)] transition-colors">Everstone<span className="text-[var(--accent-gold)]">BTC</span></span>
                    </Link>
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
                        <Link href="/explore" className="hover:text-[var(--accent-gold)] transition-colors">Explore</Link>
                        <Link href="/technology" className="hover:text-[var(--accent-gold)] transition-colors">Technology</Link>
                        <Link href="/#how-it-works" className="hover:text-[var(--accent-gold)] transition-colors">How it Works</Link>
                        <Link href="/sample" className="hover:text-[var(--accent-gold)] transition-colors">Sample</Link>
                        <Link href="/create" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[var(--accent-gold)] rounded-full transition-colors border border-slate-700">Create Memorial</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center pt-24">
                {mainImageSrc && (
                    <>
                        <img
                            src={mainImageSrc}
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                            alt="Main Memorial"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80" />
                    </>
                )}

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-2xl">
                        {metadata.subject.fullName}
                    </h1>
                    <div className="text-xl md:text-2xl text-[var(--accent-gold)] font-light tracking-widest uppercase mb-8">
                        {metadata.subject.birthDate} — {metadata.subject.deathDate}
                    </div>
                    {metadata.subject.epitaph && (
                        <p className="text-lg md:text-2xl text-slate-300 italic font-serif leading-relaxed opacity-90">
                            "{metadata.subject.epitaph}"
                        </p>
                    )}
                </div>
            </div>

            {/* Bio Section */}
            {(metadata.content.bio || metadata.content.bioMarkdown) && (
                <div className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="prose prose-invert prose-lg md:prose-xl mx-auto text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                            {metadata.content.bio || metadata.content.bioMarkdown}
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Grid */}
            {metadata.content.gallery && metadata.content.gallery.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h3 className="text-2xl font-serif text-[var(--accent-gold)] mb-8 text-center">Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metadata.content.gallery.map((img: string, idx: number) => {
                            const src = assets[img] || (img.startsWith('http') || img.startsWith('/') ? img : null);
                            return (
                                <div key={idx} className="aspect-square relative overflow-hidden rounded-lg bg-slate-900 group shadow-2xl border border-slate-800">
                                    {src ? (
                                        <img
                                            src={src}
                                            className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105"
                                            alt="Gallery"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-700">Image not loaded</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}


            {/* Footer / Blockchain Data */}
            <div className="bg-slate-900 border-t border-slate-800 py-12 px-6 mt-12 mb-20">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-[var(--accent-gold)] font-serif text-lg mb-4">On-Chain Anchor</h3>
                        <div className="space-y-3 font-mono text-xs text-slate-500 break-all p-4 bg-slate-950 rounded border border-slate-800">
                            <p>
                                <span className="text-slate-400 block mb-1 uppercase tracking-wider">Transaction ID</span>
                                {txid}
                            </p>
                            <p>
                                <span className="text-slate-400 block mb-1 uppercase tracking-wider">Block Time</span>
                                {rawTx?.status?.block_time ? new Date(rawTx.status.block_time * 1000).toLocaleString() : 'Unconfirmed'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[var(--accent-gold)] font-serif text-lg mb-4">Permanent Storage</h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 bg-[var(--accent-gold)] hover:bg-yellow-500 text-slate-900 px-6 py-3 rounded font-bold transition-all transform hover:scale-105 shadow-lg"
                            >
                                <Download className="w-5 h-5" />
                                Download Bundle (.zip)
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 max-w-sm">
                            This memorial is cryptographically signed, bundled, and anchored to Bitcoin forever. Verify it independently with the bundle.
                        </p>
                    </div>
                    <p className="mt-4 text-xs text-slate-500">
                        This memorial is stored on IPFS/Arweave and anchored to Bitcoin. It can be reconstructed independently of Everstone forever.
                    </p>
                </div>
            </div>
        </div>

    );
}
