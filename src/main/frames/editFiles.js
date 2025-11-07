const { BrowserWindow } = require("electron");
const path = require('path');
const { API, userAgent } = require("../main");
let editWindow = null;

module.exports = (fixWindow, url, SWSID) => {
    if (editWindow) {
        editWindow.focus();
        return;
    }
    // Create the browser window.
     editWindow = new BrowserWindow({
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
    editWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['SWSID'] = SWSID;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    editWindow.webContents.userAgent = userAgent;

    // Load the URL or file
    editWindow.loadURL(`${API}/fix/items/${url}`);
    const preventNavigation = (event, url) => {
        if (!url.includes(API)) {
            event.preventDefault();
            editWindow.close();
        }};
    editWindow.webContents.on('will-navigate', preventNavigation);
    editWindow.webContents.on('did-navigate', preventNavigation);
    
    editWindow.on('closed', () => {
        editWindow = null;
        fixWindow.focus();
        fixWindow.webContents.send('app_editFile');
    });
};