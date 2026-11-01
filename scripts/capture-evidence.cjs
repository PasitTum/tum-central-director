const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/USER/.gemini/antigravity-cli/brain/ce4b8fbc-612d-465b-88c2-35e1fbd06650';

require('../dist/main/electron-main.js');

app.whenReady().then(() => {
  const checkWindow = setInterval(async () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      clearInterval(checkWindow);
      const win = windows[0];

      console.log('[QA Automation] Testing live Copilot AI chat in workspace...');
      await new Promise(r => setTimeout(r, 3000));

      // Trigger chat
      await win.webContents.executeJavaScript(`
        document.getElementById('copilotPrompt').value = 'สวัสดีครับ ขอวิเคราะห์โครงสร้างความปลอดภัยของ workspace นี้หน่อยครับ';
        sendCopilotChat();
      `);

      // Wait 10 seconds for agy.exe AI engine to finish thinking and render response
      console.log('[QA Automation] Waiting for AI engine response...');
      await new Promise(r => setTimeout(r, 11000));

      const img4 = await win.webContents.capturePage();
      const p4 = path.join(ARTIFACT_DIR, 'evidence_4_copilot_ai_response.png');
      fs.writeFileSync(p4, img4.toPNG());
      console.log(`[QA Automation] Captured: ${p4}`);

      app.quit();
    }
  }, 500);
});
