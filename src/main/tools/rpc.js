const {Client} = require('discord-rpc-revamp');

const clientId = 'generic-client-id';

const start = Date.now();

const client = new Client({
    clientId
});

const { app, ipcMain } = require('electron');
const { getMainWindow } = require('../main');

let intervalReconnect;

function createClientEvents() {
    client.on('ready', () => {
        setupActivity();
    });


    client.on("ready", () => {
        if(intervalReconnect) clearInterval(intervalReconnect)
    
        console.log("connected")

        client.subscribe('ACTIVITY_JOIN');

        client.on("ACTIVITY_JOIN", (e) => {
            const {secret} = e;
            const mainWindow = getMainWindow();
    
            if(mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.maximize();
                mainWindow.focus();
    
                const args = secret.split("_");
    
                switch(args[1]) {
                    case "join":
    
                    return mainWindow.webContents.send("setProtocolRedirect", `/space/${args[0]}`);
                }
            }
    
        })

        client.once("disconnected", () => {
            client.unsubscribe("ACTIVITY_JOIN")
        })

        setupActivity(savedActivity);
    })

    client.on("RPC_CONNECTION_TIMEOUT", () => {
        console.log("TIMEOUT")
    })
    
    client.on("disconnected", () => {
        console.log("lost connection");
    
        intervalReconnect = setInterval(() => {
            console.log("Trying to reconnect to IPC")
            client = new RPC.Client({ transport: 'ipc' });
            createClientEvents();
            try {
                client.connect(clientId).catch((err) => {
                    console.error(err)
                });
            }catch(e) {
                console.error("Couldnt connect");
            }
        }, 2000);
    })
}

const defaultActivity = {
    startTimestamp: start,
    state: 'Starting up',
    largeImageKey: 'logo',
    largeImageText: 'SWX App ' + app.getVersion(),
}

let savedActivity = {};

const setupActivity = (extra = {}) => {
    const finalData = {
        ...defaultActivity,
        ...savedActivity,
        ...extra,
    }

    let activityData = {
        details: finalData.details,
        state: finalData.state,
        joinSecret: finalData.secrets?.join,
        matchSecret: finalData.secrets?.match,
        largeImageKey: finalData.largeImageKey,
        largeImageText: finalData.largeImageText,
        instance: true,
        startTimestamp: finalData.startTimestamp,
    }

    if(finalData.party) {
        if(finalData.party.size[0] > 0) {
            activityData['partySize'] = finalData['party'].size[0];
            activityData['partyMax'] = finalData['party'].size[1];
            activityData['partyId'] = finalData['party'].id;
            console.log(finalData.party);
        }
    }

    savedActivity = activityData;

    try {
        client.setActivity(
            {
                ...activityData,
                
            }
        )
    } catch(e) {

    }
}

ipcMain.handle("set_rpc", (e, data) => {
    setupActivity(data);
})

module.exports = () => {
    createClientEvents();
    client.connect({ clientId }).then(() => {
        console.log("Connected to Discord RPC")
    }).catch((err) => {
        console.error(err)
    })
}