
import { prisma } from './lib/prisma';

async function main() {
    try {
        console.log('Attempting to connect to DB...');
        const count = await prisma.memorial.count();
        console.log('Successfully connected. Memorial count:', count);

        const recent = await prisma.memorial.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });
        console.log('Recent memorials:', JSON.stringify(recent, null, 2));
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    }
}

main();
