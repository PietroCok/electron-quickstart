const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { session } = require('electron')

try {
    require('electron-reloader')(module)
} catch (_) { }

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('./src/front-end/index.html')
    win.webContents.openDevTools();
}

// MUST wait ready event before creating window
app.on('ready', () => {
    ipcMain.handle('ping', () => 'pong');

    createWindow();

    // MacOS needs this since it wont stop running on window close
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['default-src \'self\'']
            }
        })
    })
})

// listening for window close
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})











