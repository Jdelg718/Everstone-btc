'use client';

import { useState, useEffect } from 'react';
import { Loader2, Wallet } from 'lucide-react';

// Define window interface for wallet detection
declare global {
    interface Window {
        unisat: any;
    }
}

export default function ConnectWallet({ onConnect }: { onConnect: (address: string, publicKey: string) => void }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    const connectUnisat = async () => {
        if (typeof window.unisat === 'undefined') {
            alert('UniSat Wallet is not installed!');
            return;
        }

        setIsConnecting(true);
        try {
            const accounts = await window.unisat.requestAccounts();
            if (accounts.length > 0) {
                setAddress(accounts[0]);
                const pubkey = await window.unisat.getPublicKey();
                onConnect(accounts[0], pubkey);
            }
        } catch (e: any) {
            alert('Connection Failed: ' + e.message);
        } finally {
            setIsConnecting(false);
        }
    };

    if (address) {
        return (
            <div className="flex items-center gap-2 bg-stone-800 px-4 py-2 rounded-lg text-amber-500 font-mono text-sm border border-stone-700">
                <Wallet className="w-4 h-4" />
                {address.slice(0, 6)}...{address.slice(-6)}
            </div>
        );
    }

    return (
        <button
            onClick={connectUnisat}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold py-3 px-6 rounded-xl transition-all border border-stone-700"
        >
            {isConnecting ? <Loader2 className="animate-spin w-4 h-4" /> : <Wallet className="w-4 h-4" />}
            Connect Wallet
        </button>
    );
}
