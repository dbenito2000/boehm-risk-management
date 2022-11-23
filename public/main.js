
const { app, BrowserWindow, ipcMain, session, Notification } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const Store = require('electron-store');
const store = new Store();
function debug(str) {
    console.log('[ELECTRON RISK MANAGEMENT] ' + str);
}
const {getDesktopFolder} = require('platform-folders');

var pdf = require("pdf-creator-node");
var fs = require("fs");
var html = fs.readFileSync(path.join(__dirname,"./template.html"), "utf8");

let mainWindow;

// Main Window Creation

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({

        width: 1200,
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



ipcMain.handle('save', (event, projects) => {
    store.set('projects', projects);
})

ipcMain.handle('load', (event) => {
    return store.get('projects') ?? [];
})

ipcMain.handle("export", async (event, project, type) => {
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",

    };

    // probabilidad e impacto

    
    project.factors.forEach(factor => {
        if (factor.probabilidad >= 80) {
            // Tres partes de la ultima fila
            if (factor.impacto > 2) {
                factor.color = "red";
            } else {
                factor.color = "orange";
            }
        }

        if (factor.probabilidad >= 60 && factor.probabilidad < 80) {
            if (factor.impacto > 3) {
                factor.color = "red";
            }
            if (factor.impacto > 1 && factor.impacto <= 3) {
                factor.color = "darkorange";
            }
            if (factor.impacto <= 1) {
                factor.color = "orange";
            }
        }

        if (factor.probabilidad >= 40 && factor.probabilidad < 60) {
            if (factor.impacto > 3) {
                factor.color = "red";
            }
            if (factor.impacto == 3) {
                factor.color = "darkorange";
            }
            if (factor.impacto == 2) {
                factor.color = "orange";
            }
            if (factor.impacto == 1) {
                factor.color = "green";
            }
        }

        if (factor.probabilidad >= 20 && factor.probabilidad < 40) {
            if (factor.impacto == 5) {
                factor.color = "red";
            }
            if (factor.impacto == 4) {
                factor.color = "darkorange";
            }
            if (factor.impacto == 3) {
                factor.color = "orange";
            }
            if (factor.impacto <= 2) {
                factor.color = "green";
            }
        }

        if (factor.probabilidad >= 0 && factor.probabilidad < 20) {
            if (factor.impacto >= 4) {
                factor.color = "darkorange";
            }
            if (factor.impacto == 3) {
                factor.color = "orange";
            }
            if (factor.impacto <= 2) {
                factor.color = "green";
            }
        }

    })

    var document = {
        html: html,
        data: {
            project: project,
            factors: project.factors,
        },
        path: getDesktopFolder()+"/"+project.name+".pdf",
    };

    await pdf
    .create(document, options)
    .then((res) => {
        console.log(res);
    }
    )
    .catch((error) => {
        event.sender.send("error", error);
        
    }
    );
    return "done";
})