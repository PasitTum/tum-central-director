/**
 * TUM Sovereign Agent IDE — Native Electron Preload Script (CommonJS)
 * Secure IPC bridge between Native OS Electron Main Process and Renderer UI.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tumAPI', {
  isElectron: true,

  // File System Operations
  getFileTree: (dir) => ipcRenderer.invoke('fs:tree', dir),
  readFile: (filePath) => ipcRenderer.invoke('fs:read', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('fs:write', filePath, content),
  openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),
  onWorkspaceOpened: (callback) => {
    ipcRenderer.on('workspace:opened', (_, dir) => callback(dir));
  },

  // Real Terminal Execution (Guarded by Sentinel)
  runCommand: (command, cwd) => ipcRenderer.invoke('terminal:exec', command, cwd),

  // Fleet & Worktrees
  getFleetStatus: () => ipcRenderer.invoke('fleet:status'),
  createWorktree: (repoPath, branchName, targetPath) =>
    ipcRenderer.invoke('worktree:create', repoPath, branchName, targetPath),
  removeWorktree: (repoPath, targetPath, force) =>
    ipcRenderer.invoke('worktree:remove', repoPath, targetPath, force),

  // AgentGate DAC
  mintDac: (sponsor, agent, role, budget) =>
    ipcRenderer.invoke('agentgate:mint', sponsor, agent, role, budget),

  // Sentinel Audit Stream
  getAuditLog: (limit) => ipcRenderer.invoke('sentinel:audit', limit),

  // Real System-Level AI Copilot
  sendCopilotChat: (message, persona, workspace) =>
    ipcRenderer.invoke('copilot:chat', message, persona, workspace),

  // Multi-Tenant RBAC
  listTenants: () => ipcRenderer.invoke('tenants:list'),

  // One-Click Executive Audit Report
  generateReport: (options) => ipcRenderer.invoke('reports:generate', options),

  // Real-Time Alert Thresholds & Webhooks
  configureAlerts: (tenantId, config) => ipcRenderer.invoke('alerts:configure', tenantId, config),
  testAlert: (tenantId, channel) => ipcRenderer.invoke('alerts:test', tenantId, channel),
  getAlertHistory: (limit) => ipcRenderer.invoke('alerts:history', limit),
  getAlertConfig: (tenantId) => ipcRenderer.invoke('alerts:config', tenantId)
});
