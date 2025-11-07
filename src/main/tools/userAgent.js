const { session } = require('electron');
module.exports = function () {
    // Set User-Agent based on the operating system
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => 
    {
        // Check OS and set User-Agent accordingly
        // TODO: Replace YOUR_CUSTOM_AGENT with your custom user agent string
        if (process.platform === 'darwin') {
            details.requestHeaders['User-Agent'] = 'YOUR_CUSTOM_AGENT-Mac-x64';
        } else if (process.platform === 'win32') {
            details.requestHeaders['User-Agent'] = 'YOUR_CUSTOM_AGENT-Windows-x64';
        } else if (process.platform === 'linux') {
            details.requestHeaders['User-Agent'] = 'YOUR_CUSTOM_AGENT-Linux-x64';
        }
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
  
}