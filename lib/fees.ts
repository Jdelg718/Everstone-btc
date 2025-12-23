export interface FeeRates {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
}

export interface EstimatedCosts {
    fastest: number;
    fast: number;
    standard: number;
}

// Fetch fee rates from Mempool.space
export const getNetworkFees = async (): Promise<FeeRates> => {
    try {
        const res = await fetch('https://mempool.space/api/v1/fees/recommended');
        if (!res.ok) throw new Error('Failed to fetch fees');
        return await res.json();
    } catch (e) {
        // Fallback defaults
        console.warn('Fee fetch failed, using defaults', e);
        return {
            fastestFee: 30,
            halfHourFee: 20,
            hourFee: 10,
            economyFee: 5,
            minimumFee: 1
        };
    }
};

// Calculate total cost in sats for a transaction (~250 vBytes for standard OP_RETURN)
export const calculateTxCosts = (rates: FeeRates): EstimatedCosts => {
    const VBYTES = 250;
    return {
        fastest: rates.fastestFee * VBYTES,
        fast: rates.halfHourFee * VBYTES,
        standard: rates.hourFee * VBYTES
    };
};
