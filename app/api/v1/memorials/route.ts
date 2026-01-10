import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, sanitizeMemorial, corsHeaders } from '@/lib/api-utils';

/**
 * GET /api/v1/memorials
 * List all public, anchored memorials with pagination
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - order: Sort order by createdAt (default: desc)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse pagination params
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
        const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

        const skip = (page - 1) * limit;

        // Get total count
        const total = await prisma.memorial.count({
            where: {
                isPublic: true,
                status: 'ANCHORED',
            },
        });

        // Get paginated memorials
        const memorials = await prisma.memorial.findMany({
            where: {
                isPublic: true,
                status: 'ANCHORED',
            },
            orderBy: { createdAt: order },
            skip,
            take: limit,
        });

        const sanitizedMemorials = memorials.map(sanitizeMemorial);

        return apiResponse({
            data: sanitizedMemorials,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        });
    } catch (error) {
        console.error('API v1 memorials list error:', error);
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
