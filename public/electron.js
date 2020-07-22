const electron = require("electron");
const {ipcMain} = require("electron");
const { autoUpdater } = require('electron-updater');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require('url')
const isDev = require("electron-is-dev");
let mainWindow;
function createWindow() {
mainWindow = new BrowserWindow({ width: 900, height: 680 ,

    webPreferences: {
        nodeIntegration: true,
        }

});

mainWindow.once('ready-to-show', () => {
    console.log("checking for updates");
    autoUpdater.checkForUpdatesAndNotify();
  });

mainWindow.loadURL(isDev? "http://localhost:3000": `file://${path.join(__dirname, "../build/index.html")}`);


mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        }
    });
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});



ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


autoUpdater.on('update-available', () => {
    console.log("update-available");
    mainWindow.webContents.send('update_available');
  });
  autoUpdater.on('update-downloaded', () => {
      console.log("update-downloaded");
    mainWindow.webContents.send('update_downloaded');
  });




  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });