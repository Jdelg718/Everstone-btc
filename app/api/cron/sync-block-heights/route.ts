import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getBlockHeight } from '../../../../lib/mempool';

/**
 * Cron endpoint to sync block heights for anchored memorials
 *
 * This endpoint should be called periodically (e.g., every 10 minutes) by a cron service
 * to update block heights for memorials that have been anchored but don't have a block height yet.
 *
 * Security: Uses CRON_SECRET environment variable for authentication
 *
 * Example usage with cron-job.org or similar:
 * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yoursite.com/api/cron/sync-block-heights
 */
export async function GET(request: Request) {
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Find all memorials that have a txid but no blockHeight
        const memorialsToSync = await prisma.memorial.findMany({
            where: {
                txid: { not: null },
                blockHeight: null,
                status: 'ANCHORED'
            },
            select: {
                id: true,
                slug: true,
                txid: true,
                blockHeight: true
            }
        });

        if (memorialsToSync.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No memorials to sync',
                synced: 0
            });
        }

        const results = {
            total: memorialsToSync.length,
            synced: 0,
            failed: 0,
            errors: [] as string[]
        };

        // Process each memorial
        for (const memorial of memorialsToSync) {
            if (!memorial.txid) continue;

            try {
                const blockHeight = await getBlockHeight(memorial.txid);

                if (blockHeight !== null) {
                    // Update the memorial with the block height
                    await prisma.memorial.update({
                        where: { id: memorial.id },
                        data: { blockHeight }
                    });

                    results.synced++;
                    console.log(`✓ Synced block height ${blockHeight} for memorial ${memorial.slug} (${memorial.txid})`);
                } else {
                    // Transaction might still be unconfirmed
                    console.log(`⏳ Transaction ${memorial.txid} not yet confirmed for memorial ${memorial.slug}`);
                }
            } catch (error) {
                results.failed++;
                const errorMsg = `Failed to sync ${memorial.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`;
                results.errors.push(errorMsg);
                console.error(`✗ ${errorMsg}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${results.synced} of ${results.total} memorials`,
            ...results
        });

    } catch (error) {
        console.error('Error syncing block heights:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * POST endpoint for manual triggering (same as GET)
 */
export async function POST(request: Request) {
    return GET(request);
}
