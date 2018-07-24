// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, BrowserView} = require('electron');
const { exec, spawn } = require('child_process');
const fs = require('fs');
console.log(fs);
console.log()
// const authentication = require('@cardstack/authentication');
// const hub = require('@cardstack/hub');
// const jsonapi = require('@cardstack/jsonapi');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow (url) {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL(url);

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
  createWindow('http://localhost:3000');


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
    let type = null;
    const existsnpm = fs.existsSync('./' + arg2 + '/package.json');
    const existsyarn = fs.existsSync('./' + arg2 + '/yarn.lock');
    console.log('./'+arg2+'/package.json');
    console.log("does package exist");
    
    if (existsnpm) {
      type = 'npm';
    }
    if (existsyarn) {
      type = 'yarn';
    }
    if (type !== null) { //assuming either npm or yarn exists
      
        let npminstall = exec(type + ' install', {cwd: arg2});

        npminstall.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });

        npminstall.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        npminstall.on('close', (err, stdout, stderr) => {
          console.log('we doneon');

          const ember_serve = spawn('ember', ['serve', '--port', '4203'], {cwd: arg2});
          ember_serve.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            data = String(data);
            console.log(typeof data);
            console.log(data.substring(1, 17));
            console.log(data.substring(1, 17) === "Build successful");
            if (data.substring(1, 17) === "Build successful") {
              console.log('entered');
              const urlStart = data.indexOf('http');
              const fullUrl = data.substring(urlStart);
              
              let win = new BrowserWindow({width: 800, height: 600})
              win.on('closed', () => {
                win = null
              })
              let view = new BrowserView({
                webPreferences: {
                  nodeIntegration: false
                }
              })
              win.setBrowserView(view)
              view.setBounds({ x: 0, y: 0, width: 800, height: 600 })
              view.webContents.loadURL(fullUrl)
            }
          });

          ember_serve.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);

          });

          ember_serve.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
          });
             
        
        });


      
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
