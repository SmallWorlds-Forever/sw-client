const {
    contextBridge,
    ipcRenderer,
    shell
  } = require("electron");
  
  ipcRenderer.setMaxListeners(Infinity);
  
  contextBridge.exposeInMainWorld("app", {
    appPath: () => 
    {
        //open where the app is installed out one directory
        shell.openPath(__dirname + '/../');
    },
    /* Special Functions */
    smi: (session) => 
    {
        return ipcRenderer.invoke('app_smi', session);
    },
  

  

    custom : (session, url, width, height) =>
    {
        return ipcRenderer.invoke('app_custom', session, url, width, height);
    },

    /* General Functions */
    close : () =>
    {
        return ipcRenderer.invoke('app_close');
    },
    
    minimize: () => 
    {
        return ipcRenderer.invoke('app_minimize');
    },
    maximize: () => 
    {
        return ipcRenderer.invoke('app_maximize');
    },
    register: (code) => 
    {
        // open a new window
        ipcRenderer.invoke('app_register', code);
        ipcRenderer.on('app_register', (event, arg) => {
          console.log(arg);
        });
    },
    openUrl: (url) => 
    {
        return ipcRenderer.invoke("openUrl", url);
    },
    version: () => 
    {
        ipcRenderer.send('app_version');
        ipcRenderer.on('app_version', (event, arg) => {
          ipcRenderer.removeAllListeners('app_version');
          console.log(arg.version);
        });
    },

})

contextBridge.exposeInMainWorld(
    "updater", {
    getVersion: () => ipcRenderer.invoke("get_version"),
    getBuild: () => ipcRenderer.invoke("get_build"),
    getPlatform: () => {
      return process.platform;
    },
    getArch: () => {
      return process.arch;
    },
  }
  );
  
  contextBridge.exposeInMainWorld(
    "storage", {
      setItem: (key, value) => ipcRenderer.invoke("storage.save", key, value),
      getItem: (key) => ipcRenderer.invoke("storage.get", key),
      removeItem: (key) => ipcRenderer.invoke("storage.delete", key)
    }
  )

  contextBridge.exposeInMainWorld(
    "rpc", {
      "setRPC": (data) => {
        ipcRenderer.invoke("set_rpc", data);
      },
    }
  )