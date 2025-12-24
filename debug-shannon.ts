
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';

const prisma = new PrismaClient();

// Inlined from lib/packaging.ts to avoid ts-node import issues
async function generateMemorialPackage(memorial: any) {
    const zip = new JSZip();

    // 1. Add Data (Formatted for Viewer)
    const data = {
        subject: {
            fullName: memorial.fullName,
            birthDate: memorial.birthDate,
            deathDate: memorial.deathDate,
            epitaph: memorial.epitaph
        },
        content: {
            bioMarkdown: memorial.bio,
            mainImage: memorial.mainImage,
            gallery: typeof memorial.gallery === 'string' ? JSON.parse(memorial.gallery || '[]') : memorial.gallery
        },
        provenance: {
            version: "1.0.0",
            exportedAt: new Date().toISOString(),
            txid: memorial.txid,
            explorer: memorial.txid ? `https://mempool.space/tx/${memorial.txid}` : null
        }
    };
    zip.file('metadata.json', JSON.stringify(data, null, 2));

    // Skiping README and HTML for this debug script as we only care about metadata.json

    return await zip.generateAsync({ type: 'nodebuffer' });
}

async function main() {
    const id = 'cmjjb9d1e0000zwsyrnp5fxkv'; // Claude Shannon
    console.log(`Checking Memorial ID: ${id}`);

    const memorial = await prisma.memorial.findUnique({ where: { id } });

    if (!memorial) {
        console.error("Memorial not found in DB!");
        return;
    }

    console.log("DB Data:");
    console.log("mainImage:", memorial.mainImage);
    console.log("gallery:", memorial.gallery);

    // Simulate Hotfix Logic from route.ts explicitly
    // This is what the route does:
    if (memorial.id === 'cmjjb9d1e0000zwsyrnp5fxkv') {
        console.log("Applying Route Hotfix logic locally to test...");
        memorial.gallery = JSON.stringify([
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Claude_Shannon_1.jpg/440px-Claude_Shannon_1.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Claude_Shannon_statue.jpg/440px-Claude_Shannon_statue.jpg"
        ]);
        // Note: mainImage is NOT touched by hotfix
    }

    console.log("\nGenerating Package...");
    const zipBuffer = await generateMemorialPackage(memorial);

    const zip = await JSZip.loadAsync(zipBuffer);
    const metadataFile = zip.file('metadata.json');

    if (metadataFile) {
        const text = await metadataFile.async('string');
        console.log("\nGenerated metadata.json content:");
        console.log(text);
    } else {
        console.error("metadata.json missing in ZIP!");
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
