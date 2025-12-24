
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

// Configuration
const PORT = 34567;
const IS_DEV = process.env.NODE_ENV === 'development';

let mainWindow;
let serverProcess;

// 1. Start Next.js Standalone Server
function startServer() {
    if (IS_DEV) return; // In dev, we use the external "npm run dev" server

    // Use __dirname to find server.js relative to electron/main.js (which is at root/electron/main.js)
    // So server.js is at root/server.js => ../server.js
    const serverPath = path.join(__dirname, '..', 'server.js');
    console.log("Starting Next.js Server at:", serverPath);

    if (!require('fs').existsSync(serverPath)) {
        require('electron').dialog.showErrorBox('Error', 'Internal Server File Not Found: ' + serverPath);
        return;
    }

    serverProcess = spawn('node', [serverPath], {
        env: {
            ...process.env,
            PORT: PORT,
            HOSTNAME: 'localhost',
            NODE_ENV: 'production'
        },
        cwd: path.dirname(serverPath)
    });

    serverProcess.stdout.on('data', (data) => console.log(`[Next]: ${data}`));
    serverProcess.stderr.on('data', (data) => console.error(`[Next Err]: ${data}`));

    serverProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
            console.error(`Next.js server exited with code ${code}`);
            // Only show if it crashes immediately
        }
    });
}

function checkServerOnline(retries = 20) {
    return new Promise((resolve, reject) => {
        if (retries < 0) return reject(new Error('Server timeout'));

        http.get(`http://localhost:${PORT}`, (res) => {
            if (res.statusCode === 200) resolve();
            else setTimeout(() => checkServerOnline(retries - 1).then(resolve).catch(reject), 500);
        }).on('error', () => {
            setTimeout(() => checkServerOnline(retries - 1).then(resolve).catch(reject), 500);
        });
    });
}

async function createWindow() {
    // Wait for server to be ready in prod
    if (!IS_DEV) {
        try {
            await checkServerOnline();
        } catch (e) {
            console.error("Failed to start internal server:", e);
        }
    }

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Everstone Viewer",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true
    });

    const startUrl = IS_DEV
        ? 'http://localhost:3000'
        : `http://localhost:${PORT}`;

    mainWindow.loadURL(startUrl);

    if (IS_DEV) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    startServer();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (serverProcess) serverProcess.kill();
    if (process.platform !== 'darwin') app.quit();
});
