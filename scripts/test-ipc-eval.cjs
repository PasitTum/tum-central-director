const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');

app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-gpu-disk-cache');

async function scanDirectory(dir, depth = 3) {
  if (depth < 0) return [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const result = [];
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'obj' || entry.name === 'bin') {
        continue;
      }
      const fullPath = path.join(dir, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        result.push({
          name: entry.name,
          path: fullPath,
          type: 'directory',
          children: await scanDirectory(fullPath, depth - 1)
        });
      } else {
        result.push({
          name: entry.name,
          path: fullPath,
          type: 'file',
          size: (await fs.stat(fullPath)).size
        });
      }
    }
    return result;
  } catch (err) {
    return [];
  }
}

ipcMain.handle('fs:tree', async (_, dir) => {
  const tree = await scanDirectory(dir || 'D:/TUM/tum-central-director', 3);
  return { dir, tree };
});

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.resolve(__dirname, '..', 'dist', 'main', 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.webContents.on('console-message', (e, level, msg, line, src) => {
    console.log('[RENDERER LOG]', msg);
  });

  await win.loadFile(path.resolve(__dirname, '..', 'dist', 'renderer', 'index.html'));

  const result = await win.webContents.executeJavaScript(`
    (async () => {
      const isNative = typeof window.tumAPI !== 'undefined';
      const treeData = isNative ? await window.tumAPI.getFileTree('D:/TUM/tum-central-director') : null;
      const sidebarHtml = document.getElementById('sidebarContent')?.innerHTML;
      const monacoExists = typeof monaco !== 'undefined';
      return { isNative, treeCount: treeData?.tree?.length, sidebarHtml, monacoExists };
    })()
  `);

  console.log('[EVAL RESULT]', JSON.stringify(result, null, 2));
  app.quit();
  process.exit(0);
});
