
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const updated = await prisma.memorial.update({
            where: { id: 'cmjgqbk7i0006p415e0uj26b5' },
            data: {
                status: 'ANCHORED',
                paymentStatus: 'PAID',
                txid: 'mock-txid-' + Date.now()
            }
        });
        console.log('Updated memorial:', updated);
    } catch (e) {
        console.error('Error updating:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
