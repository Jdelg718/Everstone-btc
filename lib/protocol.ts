import { CID } from 'multiformats/cid';
import { Buffer } from 'buffer';

const PREFIX = 'EVST1'; // 0x4556535431

export const STORAGE_TYPES = {
    IPFS: 0x00,
    ARWEAVE: 0x01
};

export interface ProtocolPayload {
    storageType: number;
    privacy: number;
    contentHash: string;
    storagePointer: string;
}

/**
 * Decodes the EVST1 payload from a hex string or buffer.
 */
export function decodePayload(input: Buffer | string): ProtocolPayload {
    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input as string, 'hex');

    if (!buffer.toString('ascii').startsWith(PREFIX)) {
        throw new Error('Invalid Protocol Prefix');
    }

    let offset = 5; // Skip EVST1

    // Flags
    const flagByte = buffer[offset];
    const storageType = (flagByte >> 4) & 0x0F;
    const privacy = flagByte & 0x03;
    offset += 1;

    // Content Hash (32 bytes)
    const contentHash = buffer.subarray(offset, offset + 32).toString('hex');
    offset += 32;

    // Storage Pointer (Rest)
    const pointerBytes = buffer.subarray(offset);
    let storagePointer = '';

    if (storageType === STORAGE_TYPES.IPFS) {
        try {
            // We start by assuming it's just the bytes of a CID
            const cid = CID.decode(new Uint8Array(pointerBytes));
            storagePointer = cid.toString();
        } catch (e) {
            console.error("CID Decode Error", e);
            throw new Error('Invalid IPFS CID bytes in payload');
        }
    } else if (storageType === STORAGE_TYPES.ARWEAVE) {
        // Arweave ID is base64url encoded.
        storagePointer = pointerBytes.toString('base64url');
    } else {
        // Fallback
        storagePointer = pointerBytes.toString('hex');
    }

    return {
        storageType,
        privacy,
        contentHash,
        storagePointer
    };
}
