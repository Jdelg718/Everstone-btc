/**
 * Mempool.space API helper
 * Fetches Bitcoin transaction and block data from mempool.space
 */

const MEMPOOL_API_BASE = process.env.MEMPOOL_API_URL || 'https://mempool.space/api';

export interface MempoolTransaction {
  txid: string;
  version: number;
  locktime: number;
  vin: any[];
  vout: any[];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

export interface BlockInfo {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash: string;
  mediantime: number;
  nonce: number;
  bits: number;
  difficulty: number;
}

/**
 * Fetch transaction details from mempool.space
 * @param txid - Transaction ID to look up
 * @returns Transaction details including confirmation status and block height
 */
export async function getTransaction(txid: string): Promise<MempoolTransaction> {
  const response = await fetch(`${MEMPOOL_API_BASE}/tx/${txid}`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction ${txid}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the block height for a confirmed transaction
 * @param txid - Transaction ID to look up
 * @returns Block height if confirmed, null if unconfirmed
 */
export async function getBlockHeight(txid: string): Promise<number | null> {
  try {
    const tx = await getTransaction(txid);
    return tx.status.confirmed && tx.status.block_height ? tx.status.block_height : null;
  } catch (error) {
    console.error(`Error fetching block height for ${txid}:`, error);
    return null;
  }
}

/**
 * Get block information by block hash
 * @param blockHash - Block hash to look up
 * @returns Block information
 */
export async function getBlock(blockHash: string): Promise<BlockInfo> {
  const response = await fetch(`${MEMPOOL_API_BASE}/block/${blockHash}`, {
    next: { revalidate: 3600 } // Cache for 1 hour (blocks don't change)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch block ${blockHash}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if a transaction is confirmed
 * @param txid - Transaction ID to check
 * @returns True if confirmed, false otherwise
 */
export async function isTransactionConfirmed(txid: string): Promise<boolean> {
  try {
    const tx = await getTransaction(txid);
    return tx.status.confirmed;
  } catch (error) {
    console.error(`Error checking confirmation status for ${txid}:`, error);
    return false;
  }
}

/**
 * Format a transaction ID for display (abbreviated with ellipsis)
 * @param txid - Full transaction ID
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 6)
 * @returns Abbreviated transaction ID (e.g., "abc123...xyz789")
 */
export function abbreviateTxid(txid: string, startChars: number = 6, endChars: number = 6): string {
  if (txid.length <= startChars + endChars) {
    return txid;
  }
  return `${txid.slice(0, startChars)}...${txid.slice(-endChars)}`;
}

/**
 * Get mempool.space URL for a transaction
 * @param txid - Transaction ID
 * @returns Full URL to view transaction on mempool.space
 */
export function getTxUrl(txid: string): string {
  return `https://mempool.space/tx/${txid}`;
}

/**
 * Get mempool.space URL for a block
 * @param blockHash - Block hash or block height
 * @returns Full URL to view block on mempool.space
 */
export function getBlockUrl(blockHash: string | number): string {
  return `https://mempool.space/block/${blockHash}`;
}
