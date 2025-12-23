const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Hal Finney
    const hal = await prisma.memorial.upsert({
        where: { slug: 'hal-finney' },
        update: {},
        create: {
            slug: 'hal-finney',
            fullName: 'Hal Finney',
            birthDate: '1956-05-04',
            deathDate: '2014-08-28',
            epitaph: 'Running bitcoin',
            bio: `# Hal Finney\n\nHal Finney was a developer for PGP Corporation, and was the second developer hired after Phil Zimmermann. In his early career, he was a lead developer on several console games. He was an early bitcoin user and received the first bitcoin transaction from bitcoin's creator Satoshi Nakamoto.\n\n> "Computer technology is on the verge of providing the ability for individuals and groups to communicate and interact with each other in a totally anonymous manner."\n\nHal was diagnosed with ALS in August 2009. He continued to program until his death in 2014.`,
            mainImage: '/images/hal.jpg',
            gallery: '[]',
            status: 'ANCHORED',
            txid: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
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
            mainImage: '/images/bitcoin.svg',
            gallery: '[]',
            status: 'ANCHORED',
            txid: '930a2114c972248550c597a37c7d52cc61a8c01e329bbb78c89ce24349479624',
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
            mainImage: '/images/bitcoin.svg',
            gallery: '[]',
            status: 'ANCHORED',
            paymentStatus: 'PAID'
        },
    });

    // 4. Satoshi Nakamoto
    const satoshi = await prisma.memorial.upsert({
        where: { slug: 'satoshi-nakamoto' },
        update: {
            fullName: 'Satoshi Nakamoto',
            bio: `# Satoshi Nakamoto\n\nThe pseudonymous creator of Bitcoin and author of the Bitcoin Whitepaper. Satoshi solved the double-spending problem for digital currency using a Peer-to-Peer network.\n\n> "If you don't believe me or don't get it, I don't have time to try to convince you, sorry."\n\nSatoshi was active in the development of Bitcoin until December 2010.`,
            mainImage: '/images/bitcoin.svg',
            status: 'ANCHORED',
            txid: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
            paymentStatus: 'PAID',
            epitaph: 'I\'ve moved on to other things.',
            deathDate: '2011-04-26',
            birthDate: '1975-04-05'
        },
        create: {
            slug: 'satoshi-nakamoto',
            fullName: 'Satoshi Nakamoto',
            birthDate: '1975-04-05',
            deathDate: '2011-04-26',
            epitaph: 'I\'ve moved on to other things.',
            bio: `# Satoshi Nakamoto\n\nThe pseudonymous creator of Bitcoin and author of the Bitcoin Whitepaper. Satoshi solved the double-spending problem for digital currency using a Peer-to-Peer network.\n\n> "If you don't believe me or don't get it, I don't have time to try to convince you, sorry."\n\nSatoshi was active in the development of Bitcoin until December 2010.`,
            mainImage: '/images/bitcoin.svg',
            gallery: '[]',
            status: 'ANCHORED',
            txid: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
            paymentStatus: 'PAID'
        },
    });

    console.log({ hal, len, tim, satoshi });
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
