// "use strict"

const isDev = require('electron-is-dev');

const DOMAIN = "https://yourdomain.com";
const API = "https://api.yourdomain.com";
const userAgent = 'YOUR_CUSTOM_AGENT';
let mainWindow = null;

function getMainWindow() {
  return mainWindow;
}

module.exports = {
  DOMAIN,
  getMainWindow,
  userAgent, API
}

const load = async () => {
  const { app, dialog } = require("electron");


  try {
   
    require('./tools/storage')();
    require('./tools/rpc')();
    require('./tools/updater')();
    require('./tools/flash')();
    await app.whenReady();
    require('./tools/userAgent')();

    mainWindow = require('./frames/main')();



    // require('./tools/smi')();

  } catch (ex) {
    const options = {
      type: "error",
      title: "Fatal Error occurred",
      message: String(ex),
    };

    console.error(ex)

    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      app.quit();
    });
  }
};

load();
