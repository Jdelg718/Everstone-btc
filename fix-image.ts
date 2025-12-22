import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Hal_Finney_doing_math.jpg/1018px-Hal_Finney_doing_math.jpg';

    console.log('Updating Hal Finney image...');

    const result = await prisma.memorial.updateMany({
        where: {
            fullName: 'Hal Finney'
        },
        data: {
            mainImage: imageUrl
        }
    });

    console.log(`Updated ${result.count} record(s).`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
