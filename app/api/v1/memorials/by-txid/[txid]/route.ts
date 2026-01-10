import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, sanitizeMemorial, corsHeaders } from '@/lib/api-utils';

interface RouteParams {
    params: Promise<{ txid: string }>;
}

/**
 * GET /api/v1/memorials/by-txid/[txid]
 * Lookup a memorial by its Bitcoin transaction ID
 */
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { txid } = await params;

        // Validate txid format (64 hex characters)
        if (!/^[a-fA-F0-9]{64}$/.test(txid)) {
            return apiError('Invalid transaction ID format', 400);
        }

        const memorial = await prisma.memorial.findUnique({
            where: { txid },
        });

        // Not found or not public
        if (!memorial) {
            return apiError('Memorial not found for this transaction', 404);
        }

        if (!memorial.isPublic || memorial.status !== 'ANCHORED') {
            return apiError('Memorial not found for this transaction', 404);
        }

        return apiResponse({
            data: sanitizeMemorial(memorial),
        });
    } catch (error) {
        console.error('API v1 memorial by-txid error:', error);
        return apiError('Internal Server Error', 500);
    }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders(),
    });
}
