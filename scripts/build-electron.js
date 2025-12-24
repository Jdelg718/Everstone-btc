
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiDir = path.join(__dirname, '../app/api');
const tempApiDir = path.join(__dirname, '../app/_api_hidden_for_build');

function moveDir(src, dest) {
    if (fs.existsSync(src)) {
        try {
            fs.renameSync(src, dest);
            console.log(`Moved ${src} -> ${dest}`);
        } catch (e) {
            // If rename fails (e.g. locked), try copy/delete? No, rename should work on same drive.
            // On Windows, sometimes file locks happen. 
            // Fallback: Copy and Delete
            // For now assume rename works or fail.
            console.error(`Failed to move ${src}:`, e);
            throw e;
        }
    }
}

async function main() {
    console.log("Starting Electron Build Process...");

    // 1. Hide API Routes (incompatible with 'output: export')
    // Check if api exists
    let hidApi = false;
    if (fs.existsSync(apiDir)) {
        console.log("Hiding API directory for static export...");
        moveDir(apiDir, tempApiDir);
        hidApi = true;
    }

    try {
        // 2. Run Next.js Build
        console.log("Running Next.js Build...");
        // Use env option for cross-platform support without 'cross-env' command dependency issues in execSync
        execSync('next build --webpack', {
            stdio: 'inherit',
            env: { ...process.env, ELECTRON_BUILD: 'true' }
        });

        // 3. Restore API Routes (BEFORE electron-builder, just in case, though not needed for packaging 'out')
        if (hidApi) {
            console.log("Restoring API directory...");
            moveDir(tempApiDir, apiDir);
            hidApi = false;
        }

        // 4. Run Electron Builder
        console.log("Running Electron Builder...");
        execSync('electron-builder', { stdio: 'inherit' });

        console.log("Build Complete!");

    } catch (e) {
        console.error("Build Failed!", e);
        // Ensure restoration
        if (hidApi) {
            console.log("Restoring API directory after failure...");
            moveDir(tempApiDir, apiDir);
        }
        process.exit(1);
    }
}

main();
