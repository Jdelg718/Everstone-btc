import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Hal Finney
    const hal = await prisma.memorial.upsert({
        where: { slug: 'hal-finney' },
        update: {},
        create: {
            slug: 'hal-finney',
            fullName: 'Harold Thomas Finney II',
            birthDate: '1956-05-04',
            deathDate: '2014-08-28',
            epitaph: 'Running bitcoin',
            bio: `# Hal Finney\n\nHal Finney was a developer for PGP Corporation, and was the second developer hired after Phil Zimmermann. In his early career, he was a lead developer on several console games. He was an early bitcoin user and received the first bitcoin transaction from bitcoin's creator Satoshi Nakamoto.\n\n> "Computer technology is on the verge of providing the ability for individuals and groups to communicate and interact with each other in a totally anonymous manner."\n\nHal was diagnosed with ALS in August 2009. He continued to program until his death in 2014.`,
            mainImage: 'https://upload.wikimedia.org/wikipedia/en/2/27/Hal_Finney_%28computer_scientist%29.jpg',
            gallery: '[]',
            status: 'ANCHORED',
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16', // Real Hal transaction or significant block
            paymentStatus: 'PAID'
        },
    });

    // 2. Len Sassaman
    const len = await prisma.memorial.upsert({
        where: { slug: 'len-sassaman' },
        update: {},
        create: {
            slug: 'len-sassaman',
            fullName: 'Leonard Harris Sassaman',
            birthDate: '1980-04-09',
            deathDate: '2011-07-03',
            epitaph: 'A cypherpunk who dedicated his life to privacy.',
            bio: `# Len Sassaman\n\nLen was a true cypherpunk, privacy advocate, and maintainer of the Mixmaster anonymous remailer code. He was a PhD student at KU Leuven in Belgium, researching privacy enhancing technologies.\n\nHis memorial is famously embedded in the Bitcoin blockchain transaction 930a2114c972248550c597a37c7d52cc61a8c01e329bbb78c89ce24349479624.`,
            mainImage: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Len_Sassaman.jpg',
            gallery: '[]',
            status: 'ANCHORED',
            txid: '930a2114c972248550c597a37c7d52cc61a8c01e329bbb78c89ce24349479624', // Actual tribute TX
            paymentStatus: 'PAID'
        },
    });

    // 3. Timothy May
    const tim = await prisma.memorial.upsert({
        where: { slug: 'timothy-c-may' },
        update: {},
        create: {
            slug: 'timothy-c-may',
            fullName: 'Timothy C. May',
            birthDate: '1951-12-21',
            deathDate: '2018-12-13',
            epitaph: 'Author of the Crypto Anarchist Manifesto.',
            bio: `# Timothy C. May\n\nTim May was a technical and political writer, an electronic engineer and senior scientist at Intel, and a founder of the Cypherpunk mailing list. His "Crypto Anarchist Manifesto" (1988) predicted much of the crypto-currency revolution.\n\n> "Arise, you have nothing to lose but your barbed wire fences!"`,
            mainImage: 'https://media.coindesk.com/uploads/2018/12/Tim-May.jpg',
            gallery: '[]',
            status: 'ANCHORED',
            paymentStatus: 'PAID'
        },
    });

    console.log({ hal, len, tim });
    console.log('✅ Seed completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
