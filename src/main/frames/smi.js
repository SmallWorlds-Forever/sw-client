const { BrowserWindow } = require("electron");
const path = require('path');
const { DOMAIN, userAgent } = require("../main");
let smiWindow = null;

module.exports = (mainWindow, SWSID) => 
{
    if (smiWindow) 
    {
        smiWindow.focus();
        return;
    }
    // Create the browser window.
    smiWindow = new BrowserWindow({
        width: 800,
        height: 750,
        minWidth: 1024,
        minHeight: 768,
        icon: path.join(__dirname, "../icon.png"),
        center: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, "../preload/app.js"),
            plugins: false,
            webviewTag: true,
        },
        show: true,
        autoHideMenuBar: true
    });

    // Set custom headers
    smiWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['SWSID'] = SWSID;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    smiWindow.webContents.userAgent = userAgent;

    // Load the URL or file
    smiWindow.loadURL(`${DOMAIN}/swmod`);
    const preventNavigation = (event, url) => {
        if (!url.includes(DOMAIN)) {
            event.preventDefault();
            smiWindow.close();
        }
    };
    smiWindow.webContents.on('will-navigate', preventNavigation);
    smiWindow.webContents.on('did-navigate', preventNavigation);

    smiWindow.on('closed', () => {
        smiWindow = null;
        mainWindow.focus();
        mainWindow.webContents.send('app_smi');
    });
};