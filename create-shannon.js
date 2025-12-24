
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const id = 'cmjjb9d1e0000zwsyrnp5fxkv';
    console.log(`Restoring/Updating Memorial ID: ${id}`);

    const mainImage = "https://upload.wikimedia.org/wikipedia/commons/9/99/ClaudeShannon_MFO3807.jpg";
    const gallery = JSON.stringify([
        "https://upload.wikimedia.org/wikipedia/commons/c/c8/Claude_Shannon_1.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/f/f6/Claude_Shannon_statue.jpg"
    ]);

    const data = {
        fullName: "Claude Shannon",
        birthDate: "April 30, 1916",
        deathDate: "February 24, 2001",
        bio: `Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, and cryptographer known as "the father of information theory". Shannon is noted for having founded information theory with a landmark paper, "A Mathematical Theory of Communication", that he published in 1948. He is also well known for founding digital circuit design theory in 1937, when—as a 21-year-old master's degree student at the Massachusetts Institute of Technology (MIT)—he wrote his thesis demonstrating that electrical applications of boolean algebra could construct any logical numerical relationship.`,
        epitaph: "He proved that information has structure — and that secrecy can be measured.",
        mainImage,
        gallery,
        slug: 'claude-shannon',
        isPublic: true,
        status: 'ANCHORED',
        txid: 'mock-shannon-tx'
    };

    const memorial = await prisma.memorial.upsert({
        where: { id },
        update: data,
        create: {
            id,
            ...data
        }
    });

    console.log("Success! Memorial restored:", memorial.fullName);
    console.log("Main Image:", memorial.mainImage);
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
