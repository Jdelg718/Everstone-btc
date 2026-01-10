import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, sanitizeMemorial, corsHeaders } from '@/lib/api-utils';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

/**
 * GET /api/v1/memorials/[slug]
 * Get a single public memorial by slug
 */
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { slug } = await params;

        const memorial = await prisma.memorial.findUnique({
            where: { slug },
        });

        // Not found or not public
        if (!memorial) {
            return apiError('Memorial not found', 404);
        }

        if (!memorial.isPublic || memorial.status !== 'ANCHORED') {
            return apiError('Memorial not found', 404);
        }

        return apiResponse({
            data: sanitizeMemorial(memorial),
        });
    } catch (error) {
        console.error('API v1 memorial detail error:', error);
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
