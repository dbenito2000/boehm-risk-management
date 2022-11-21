
const { app, BrowserWindow, ipcMain, session, Notification } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');


/* console.log(skins) */


let mainWindow;

// Main Window Creation

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({

        width: 900,
        height: 800,
        show: false,
        webPreferences: {
            devTools: isDev,
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
        frame: false

    });
    mainWindow = win;
    win.loadURL(
        isDev
            ? 'http://localhost:8080'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );
    win.on('ready-to-show', () => win.show())
    ipcMain.on('close-window', (event, arg) => {
        win.close();
    })
    ipcMain.on('minimize-window', (event, arg) => {
        win.minimize();
    });
    ipcMain.on('maximize-window', (event, arg) => {
        win.maximize();
    });
}
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.on('ready', createWindow);
