
import { prisma } from './lib/prisma';

async function main() {
    try {
        console.log('Attempting to connect to DB...');
        const count = await prisma.memorial.count();
        console.log('Successfully connected. Memorial count:', count);
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    }
}

main();
