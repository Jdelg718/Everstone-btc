
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const recent = await prisma.memorial.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                slug: true,
                status: true,
                paymentStatus: true,
                createdAt: true,
                txid: true
            }
        });
        console.log('Recent memorials:', JSON.stringify(recent, null, 2));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
