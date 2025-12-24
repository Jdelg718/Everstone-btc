import JSZip from 'jszip';
import { Memorial } from '@prisma/client';

export async function generateMemorialPackage(memorial: Memorial) {
    const zip = new JSZip();

    // 1. Add Data
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

    // 2. Add Readme
    zip.file('README.txt', `EverstoneBTC - Digital Memorial
============================
Subject: ${memorial.fullName}
Born: ${memorial.birthDate}
Died: ${memorial.deathDate}

This package contains the permanent digital record of this memorial.
To view it, simply open the 'index.html' file in any web browser.

No internet connection is required to view the text content.
Images may require internet if they are hosted externally,
unless this is a full archive package.

Proof of Existence:
TXID: ${memorial.txid || 'Pending Anchor'}
`);

    // 3. Add Viewer (HTML/CSS/JS in one file)
    const viewerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memorial - ${memorial.fullName}</title>
    <style>
        :root { --bg: #0c0a09; --text: #f5f5f4; --accent: #f59e0b; --card: #1c1917; }
        body { background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; margin: 0; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        header { text-align: center; margin-bottom: 3rem; border-bottom: 1px solid #333; padding-bottom: 2rem; }
        h1 { font-family: serif; font-size: 3rem; margin: 0; }
        .dates { color: var(--accent); font-weight: bold; margin-top: 1rem; }
        .epitaph { font-style: italic; font-size: 1.25rem; color: #a8a29e; margin: 2rem 0; text-align: center; }
        .bio { white-space: pre-wrap; font-size: 1.1rem; }
        .tx-proof { margin-top: 4rem; padding: 1.5rem; background: var(--card); border: 1px solid #333; border-radius: 8px; font-family: monospace; font-size: 0.9rem; word-break: break-all; }
        .tx-label { color: var(--accent); display: block; margin-bottom: 0.5rem; font-weight: bold; }
        img.main-img { max-width: 100%; border-radius: 8px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${memorial.fullName}</h1>
            <div class="dates">${memorial.birthDate} — ${memorial.deathDate}</div>
        </header>
        
        ${memorial.mainImage ? `<img src="${memorial.mainImage}" class="main-img" alt="Main Photo" onerror="this.style.display='none'"/>` : ''}

        <div class="epitaph">"${memorial.epitaph}"</div>
        
        <div class="bio">${memorial.bio}</div>

        <div class="tx-proof">
            <span class="tx-label">BITCOIN ANCHOR PROOF</span>
            ${memorial.txid || 'Pending Anchor'}
            <br/><br/>
            This memorial is cryptographically signed and anchored to the Bitcoin blockchain.
            <br/>
            Exported: ${new Date().toISOString()}
        </div>
    </div>
</body>
</html>`;

    zip.file('index.html', viewerHtml);

    return await zip.generateAsync({ type: 'nodebuffer' });
}
