const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');

// Prevent GPU disk cache lock issues on Windows
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-gpu-disk-cache');

ipcMain.handle('fs:tree', async (_, dir) => {
  return { dir: dir || process.cwd(), tree: [{ name: 'test.ts', path: 'D:/test.ts', type: 'file' }] };
});
ipcMain.handle('fs:read', async (_, filePath) => ({ path: filePath, content: '// test code' }));
ipcMain.handle('sentinel:audit', async () => ({ audit: [] }));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.resolve(__dirname, '..', 'dist', 'main', 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.webContents.on('console-message', (event) => {
    console.log('[RENDERER CONSOLE]', event.level, event.message, event.line, event.sourceId);
  });

  await win.loadFile(path.resolve(__dirname, '..', 'dist', 'renderer', 'index.html'));
  setTimeout(() => {
    app.quit();
    process.exit(0);
  }, 4000);
});
