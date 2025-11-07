const { DOMAIN } = require("../main");

module.exports = () => {
    const { globalShortcut, ipcMain, BrowserWindow } = require("electron");
    const isDev = require('electron-is-dev');
    const path = require('path');
    let hasSWMODPermission = false;
    let modWindow = null;

    ipcMain.handle("can_access", (e, value) => {
        hasSWMODPermission = value;
    })

    const createModeratorWindow = () => {
        if(modWindow) return;

        modWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            icon: "icon.png",
            title: "SmallWorlds Mod Interface",
            center: true,
            resizable: true,
            frame: false,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: false, // is default value after Electron v5
                contextIsolation: true, // protect against prototype pollution
                enableRemoteModule: false, // turn off remote
                preload: path.join(__dirname, "../preload/app.js"), // use a preload script
                plugins: true,
            },
        });

        modWindow.once("closed", () => {
            modWindow = null;
        })

        modWindow.loadURL(`${DOMAIN}/swmod`);
    }
    if (!isDev) {
        globalShortcut.register('Control+Shift+I', () => {
            return false;
        });
    }

    globalShortcut.register('Control+Shift+M', () => {
        if(hasSWMODPermission) {
            createModeratorWindow();
        }
    });
}