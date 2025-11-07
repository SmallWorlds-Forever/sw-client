module.exports = () => {
    const {ipcMain} = require('electron');
    const Store = require('electron-store');

    const schema = {
        SWSID: {
            type: 'string'
        }
    };
    
    const store = new Store({schema});

    ipcMain.handle("storage.delete", (e, key) => store.delete(key));
    ipcMain.handle("storage.get", (e, key) => store.get(key));
    ipcMain.handle("storage.save", (e, key, value) => store.set(key, value));
}