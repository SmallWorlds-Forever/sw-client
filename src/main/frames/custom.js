const { BrowserWindow, dialog, ipcMain } = require("electron");
const path = require('path');
const { API, userAgent } = require("../main");

// let customWindow;
let openWindows = [];

module.exports = (mainWindow, SWSID, url, width, height) => {
    // Check if the window is already open
    const existingWindow = openWindows.find(window => window.url === `${API}${url}`);
    if (existingWindow) {
        existingWindow.window.focus();
        return;
    }
    // Create the browser window.
    const customWindow = new BrowserWindow({
        width: width || 950,
        height: height || 750,
        minWidth: 1024,
        minHeight: 768,
        icon: path.join(__dirname, "../icon.png"),
        center: true,
        frame: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, "../preload/app.js"),
            plugins: true,
            webviewTag: true,
        },
        show: true,
        autoHideMenuBar: true
    });
    // if (customWindow) {
    //     customWindow.focus();
    //     return;
    // }
    // Set custom headers
    customWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['SWSID'] = SWSID;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    customWindow.webContents.userAgent = userAgent;

    // Load the URL or file
    
    customWindow.loadURL(`${API}${url}`);
    
    const preventNavigation = (event, url) => {
        if (!url.includes(API)) {
            event.preventDefault();
            customWindow.close();
            // let the user know that the navigation was blocked in the main window
            dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'Navigation Blocked',
                message: 'Navigation to external pages is not allowed.',
                detail: 'Please use the application as intended.'
            });
        }
            
    }
    customWindow.webContents.on('will-navigate', preventNavigation);
    customWindow.webContents.on('did-navigate', preventNavigation);

    openWindows.push({ window: customWindow, url: `${API}${url}` });

    customWindow.on('closed', () => {
        // customWindow = null;
        openWindows = openWindows.filter(win => win.window !== customWindow);
        mainWindow.focus();
        mainWindow.webContents.send('app_custom');
    });
    // special Case
 if (url == "/fix/items") {
        ipcMain.handle("app_editFile", (e, editUrl, SWSID) => {
            require('./editFiles')(customWindow, editUrl, SWSID);
            // create a new custom window with the url
            // require('./custom')(customWindow, SWSID, `/fix/items/${url}`, 950, 750, editWindow);
        });
    }
    
};