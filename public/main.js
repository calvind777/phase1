// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
console.log(fs);
// const authentication = require('@cardstack/authentication');
// const hub = require('@cardstack/hub');
// const jsonapi = require('@cardstack/jsonapi');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();


});

ipcMain.on('download', (event, arg1, arg2) => {
  console.log(arg1); // prints "ping"
  if (arg1 === 'approved'){
    exec('git clone ' + arg2, (err, stdout, stderr) => {

      console.log(stderr);
      console.log('yo')
      if (err) {
        console.log("failed");
        event.sender.send('download-status', 'failed', arg2);
      }
      else {
        console.log('success');
        reponame = stderr.substring(14, stderr.indexOf("'", 14));
        event.sender.send('download-status', 'success', reponame);
      }


    })
  } else if (arg1 === 'success') { //boot up the app 
    const existsnpm = fs.existsSync('./' + arg2 + '/package.json');
    const existsyarn = fs.existsSync('./' + arg2 + '/yarn.lock');
    console.log('./'+arg2+'/package.json');
    console.log("does package exist");
    console.log(exists);
    if (existsnpm) { //assuming either npm or yarn exists
      exec('npm install', (err, stdout, stderr) => {
        console.log('attempted npm install');
        console.log(stderr);
        if (err) {
          console.log("error occ");
        } else {
          exec('ember serve', (err, stdout, std) => {
            if (err) {
              console.log("error occ");
            } else {
              console.log("ember serve has succeeded")
            }
          })
        }
      })
    }
    if (existsyarn) {
      exec('yarn install', (err, stdout, stderr) => {
        console.log('attempted yarn install');
        console.log(stderr);
        if (err) {
          console.log("error occ");
        } else {
          exec('ember serve', (err, stdout, std) => {
            if (err) {
              console.log("error occ");
            } else {
              console.log("ember serve has succeeded");

            }
          })
        }
      })
    }


  }

});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
