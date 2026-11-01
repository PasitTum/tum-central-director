/**
 * TUM Sovereign Agent IDE — Official Automated Visual QA & Evidence Capture Script
 * Standardized Jira Visual QA Capture for Desktop Application par with Orca.
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('docs/qa-evidence');
const BRAIN_DIR = 'C:/Users/USER/.gemini/antigravity-cli/brain/ce4b8fbc-612d-465b-88c2-35e1fbd06650';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function saveSlide(fileName, buffer) {
  fs.writeFileSync(path.join(ARTIFACT_DIR, fileName), buffer);
  fs.writeFileSync(path.join(BRAIN_DIR, fileName), buffer);
  console.log(`[Visual QA] Saved: ${fileName}`);
}

require('../dist/main/electron-main.js');

app.whenReady().then(() => {
  const checkWindow = setInterval(async () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      clearInterval(checkWindow);
      const win = windows[0];

      console.log('[Visual QA] Window detected. Starting rigorous automated evidence capture...');

      // 1. Capture Default Workspace View (Monaco + File Tree loaded)
      await new Promise(r => setTimeout(r, 4000));
      const img1 = await win.webContents.capturePage();
      saveSlide('evidence_1_default_workspace.png', img1.toPNG());

      // 2. Open Folder: Switch to D:/TUM/tum-trust-security (Deep nested skills like Image 3)
      await win.webContents.executeJavaScript(`switchWorkspace('D:/TUM/tum-trust-security');`);
      await new Promise(r => setTimeout(r, 4000));
      const img2 = await win.webContents.capturePage();
      saveSlide('evidence_2_open_folder_switched.png', img2.toPNG());

      // 3. Test Folder Collapse Interaction (Collapse .claude or first folder)
      await win.webContents.executeJavaScript(`
        const folders = Array.from(document.querySelectorAll('.tree-folder'));
        const claudeFolder = folders.find(f => f.textContent.includes('.CLAUDE') || f.textContent.includes('CLAUDE')) || folders[0];
        if (claudeFolder) {
          claudeFolder.click();
        }
      `);
      await new Promise(r => setTimeout(r, 1500));
      const img3 = await win.webContents.capturePage();
      saveSlide('evidence_3_folder_collapsed.png', img3.toPNG());

      // 4. Real Terminal Execution
      await win.webContents.executeJavaScript(`runRealCommand('git status');`);
      await new Promise(r => setTimeout(r, 2500));
      const img4 = await win.webContents.capturePage();
      saveSlide('evidence_4_terminal_executed.png', img4.toPNG());

      // 5. Real Copilot AI Response with "ly;lful" (Detect Thai keyboard typo)
      console.log('[Visual QA] Interrogating real AI Agent Copilot with "ly;lful"...');
      await win.webContents.executeJavaScript(`
        document.getElementById('copilotPrompt').value = 'ly;lful';
        sendCopilotChat();
      `);
      // Wait for real AI response from agy.exe
      let waited = 0;
      while (waited < 35) {
        await new Promise(r => setTimeout(r, 2000));
        waited += 2;
        const hasReplied = await win.webContents.executeJavaScript(`
          !document.querySelector('.copilot-messages').innerHTML.includes('is thinking...')
        `);
        if (hasReplied) break;
      }
      await new Promise(r => setTimeout(r, 1000));
      const img5 = await win.webContents.capturePage();
      saveSlide('evidence_5_copilot_ai_response.png', img5.toPNG());

      console.log('[Visual QA] All 5 high-definition test slides captured successfully.');
      app.quit();
      process.exit(0);
    }
  }, 500);
});
