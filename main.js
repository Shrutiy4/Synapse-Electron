const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("fs");
const dotenv = require("dotenv");
const { customAlphabet } = require("nanoid");
const si = require("systeminformation");
const fkill = require("fkill").default;
const fetchFn = global.fetch || require("node-fetch");

// Load .env config
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Setup USER_ID
const generateUserId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 8);
const dataDir = path.resolve(__dirname, "data");
const userIdFile = path.join(dataDir, "user_id.txt");

let USER_ID;
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(userIdFile)) {
    USER_ID = generateUserId();
    fs.writeFileSync(userIdFile, USER_ID, "utf-8");
} else {
    USER_ID = fs.readFileSync(userIdFile, "utf-8").trim();
}

// Firebase setup
const FIREBASE_URL = process.env.FIREBASE_URL;
const API_KEY = process.env.API_KEY;
const focusModeURL = `${FIREBASE_URL}/users/${USER_ID}/settings/focusMode.json?auth=${API_KEY}`;

// Firebase functions
async function setFocusMode(value) {
    const response = await fetchFn(focusModeURL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

async function getFocusMode() {
    const response = await fetchFn(focusModeURL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

// Process filters
const WHITELIST = [
    "notion.exe", "word.exe", "excel.exe", "powerpoint.exe", "onenote.exe",
    "outlook.exe", "teams.exe", "zoom.exe", "slack.exe", "acrobat.exe",
    "notepad.exe", "figma.exe"
];

let BLACKLIST = [
    "spotify.exe", "discord.exe", "instagram.exe", "facebook.exe", "telegram.exe",
    "messenger.exe", "tiktok.exe", "netflix.exe", "primevideo.exe", "youtube.exe",
    "vlc.exe", "reddit.exe", "pinterest.exe", "games.exe", "epicgameslauncher.exe",
    "steam.exe", "battlenet.exe"
];

let focusModeActive = false;
let isRunning = false;
const INTERVAL = 1000;

async function killBlackListProcess(killList) {
    for (const proc of killList) {
        try {
            await fkill(proc.pid, { force: true, tree: true });
        } catch (err) {
            console.error(`Error killing ${proc.name}:`, err);
        }
    }
}

async function detectWhiteListProcess() {
    const data = await si.processes();
    const procList = data.list;
    const whiteListActive = procList.some(proc => WHITELIST.includes(proc.name.toLowerCase()));

    if (whiteListActive) {
        if (!focusModeActive) {
            await setFocusMode(true);
            focusModeActive = true;
        }

        const killList = procList.filter(proc => BLACKLIST.includes(proc.name.toLowerCase()));
        if (killList.length && focusModeActive) {
            if (!popupWindow){
                createPopupWindow();
            }
            await killBlackListProcess(killList);
        }
    } else if (focusModeActive) {
        await setFocusMode(false);
        focusModeActive = false;
    }
}

// Background interval loop
setInterval(async () => {
    if (isRunning) return;
    isRunning = true;
    try {
        await detectWhiteListProcess();
    } catch (e) {
        console.error("Error in process detection:", e);
    }
    isRunning = false;
}, INTERVAL);

// IPC handlers
ipcMain.handle("get-username", () => USER_ID);
ipcMain.handle("set-focus-mode", async (_, value) => await setFocusMode(value));
ipcMain.handle("get-focus-mode", async () => await getFocusMode());
ipcMain.handle("reset-focus-mode", async () => await setFocusMode(false));

ipcMain.on("terminate-popup", () => {
    if (popupWindow) popupWindow.close();
});

function createMenuTemplate() {
    return [
        {
            label: "File",
            submenu: [{ role: "quit" }],
        },
        {
            label: "View",
            submenu: [
                { label: "Reload", accelerator: "CmdOrCtrl+R", click: (_, win) => win?.reload() },
                { type: "separator" },
                { role: "zoomIn" }, { role: "zoomOut" }, { role: "resetZoom" },
                { type: "separator" },
                { role: "togglefullscreen" },
            ],
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "Learn More",
                    click: async () => {
                        const { shell } = require("electron");
                        await shell.openExternal("https://electronjs.org");
                    },
                },
            ],
        },
    ];
}

// Window creation
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        icon: path.join(__dirname, "assets", "logosynapse.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            devTools: false
        }
    });

    mainWindow.maximize();
    mainWindow.show();
    mainWindow.loadFile("index.html");

    const menu = Menu.buildFromTemplate(createMenuTemplate());
    Menu.setApplicationMenu(menu);
}

let popupWindow;
function createPopupWindow() {
    popupWindow = new BrowserWindow({
        width: 350,
        height: 345,
        alwaysOnTop: true,
        frame: false,
        modal: false,
        resizable: false,
        parent: mainWindow,
        backgroundColor: "#201E40",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            devTools: false
        }
    });

    popupWindow.loadFile("popup.html");

    popupWindow.on("closed", () => {
        popupWindow = null;
    });
}

// App lifecycle
app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
