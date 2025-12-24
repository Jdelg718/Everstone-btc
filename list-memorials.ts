
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const memorials = await prisma.memorial.findMany();
    console.log("Total Memorials:", memorials.length);
    memorials.forEach(m => {
        console.log(`- [${m.id}] ${m.fullName} (Slug: ${m.slug})`);
    });
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
