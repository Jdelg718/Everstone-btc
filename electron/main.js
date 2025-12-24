const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

// Log file in executable directory
const logPath = path.join(process.cwd(), 'app.log');

function logToFile(msg) {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
}

// Configuration
const PORT = 34567;
const IS_DEV = process.env.NODE_ENV === 'development';

let mainWindow;
let serverProcess;

// 1. Start Next.js Standalone Server
function startServer() {
    logToFile("startServer called");
    if (IS_DEV) {
        logToFile("In DEV mode, skipping server spawn");
        return;
    }

    // Use __dirname to find server.js relative to electron/main.js (which is at root/electron/main.js)
    // So server.js is at root/server.js => ../server.js
    const serverPath = path.join(__dirname, '..', 'server.js');
    logToFile(`Target Server Path: ${serverPath}`);

    if (!fs.existsSync(serverPath)) {
        const errorMsg = 'Internal Server File Not Found: ' + serverPath;
        logToFile(errorMsg);
        require('electron').dialog.showErrorBox('Error', errorMsg);
        return;
    }

    logToFile("Spawning node process...");
    try {
        serverProcess = spawn('node', [serverPath], {
            env: {
                ...process.env,
                PORT: PORT,
                HOSTNAME: 'localhost',
                NODE_ENV: 'production'
            },
            cwd: path.dirname(serverPath)
        });

        serverProcess.stdout.on('data', (data) => logToFile(`[Next stdout]: ${data}`));
        serverProcess.stderr.on('data', (data) => logToFile(`[Next stderr]: ${data}`));

        serverProcess.on('error', (err) => {
            logToFile(`Failed to spawn server: ${err.message}`);
            require('electron').dialog.showErrorBox('Server Error', `Failed to spawn: ${err.message}`);
        });

        serverProcess.on('exit', (code) => {
            logToFile(`Next.js server exited with code ${code}`);
        });
    } catch (e) {
        logToFile(`Exception spawning server: ${e.message}`);
    }
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
    logToFile("App Ready");
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
