import { NextResponse } from 'next/server';

/**
 * Standard CORS headers for public API access
 */
export function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

/**
 * Rate limiting headers (placeholder - actual limiting would need middleware)
 */
export function rateLimitHeaders(remaining: number = 100, limit: number = 100) {
    return {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.floor(Date.now() / 1000 + 60).toString(),
    };
}

/**
 * Sanitize memorial data for public API response
 * Removes sensitive fields and adds computed fields
 */
export function sanitizeMemorial(memorial: {
    id: string;
    slug: string;
    fullName: string;
    birthDate: string;
    deathDate: string;
    epitaph: string;
    bio: string;
    mainImage: string;
    gallery: string;
    email?: string | null;
    txid?: string | null;
    blockHeight?: number | null;
    status: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}) {
    return {
        slug: memorial.slug,
        fullName: memorial.fullName,
        birthDate: memorial.birthDate,
        deathDate: memorial.deathDate,
        epitaph: memorial.epitaph,
        bio: memorial.bio,
        mainImage: memorial.mainImage,
        gallery: JSON.parse(memorial.gallery || '[]'),
        txid: memorial.txid,
        blockHeight: memorial.blockHeight,
        status: memorial.status,
        createdAt: memorial.createdAt.toISOString(),
        url: `https://everstonebtc.com/m/${memorial.slug}`,
    };
}

/**
 * Create a JSON response with CORS and rate limit headers
 */
export function apiResponse(data: unknown, status: number = 200) {
    return NextResponse.json(data, {
        status,
        headers: {
            ...corsHeaders(),
            ...rateLimitHeaders(),
        },
    });
}

/**
 * Create an error response
 */
export function apiError(message: string, status: number = 400) {
    return NextResponse.json(
        { error: message },
        {
            status,
            headers: {
                ...corsHeaders(),
                ...rateLimitHeaders(),
            },
        }
    );
}
