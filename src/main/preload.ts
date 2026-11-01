/**
 * TUM Sovereign Agent IDE — Native Electron Preload Script
 * Secure IPC bridge between Native OS Electron Main Process and Renderer UI.
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('tumAPI', {
  isElectron: true,

  // File System Operations
  getFileTree: (dir?: string) => ipcRenderer.invoke('fs:tree', dir),
  readFile: (filePath: string) => ipcRenderer.invoke('fs:read', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs:write', filePath, content),
  openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),
  onWorkspaceOpened: (callback: (dir: string) => void) => {
    ipcRenderer.on('workspace:opened', (_, dir) => callback(dir));
  },

  // Real Terminal Execution (Guarded by Sentinel)
  runCommand: (command: string, cwd?: string) => ipcRenderer.invoke('terminal:exec', command, cwd),

  // Fleet & Worktrees
  getFleetStatus: () => ipcRenderer.invoke('fleet:status'),
  createWorktree: (repoPath: string, branchName: string, targetPath?: string) =>
    ipcRenderer.invoke('worktree:create', repoPath, branchName, targetPath),
  removeWorktree: (repoPath: string, targetPath: string, force?: boolean) =>
    ipcRenderer.invoke('worktree:remove', repoPath, targetPath, force),

  // AgentGate DAC
  mintDac: (sponsor: string, agent: string, role: string, budget?: number) =>
    ipcRenderer.invoke('agentgate:mint', sponsor, agent, role, budget),

  // Sentinel Audit Stream
  getAuditLog: (limit?: number) => ipcRenderer.invoke('sentinel:audit', limit),

  // Real System-Level AI Copilot
  sendCopilotChat: (message: string, persona: string, workspace?: string) =>
    ipcRenderer.invoke('copilot:chat', message, persona, workspace),

  // Multi-Tenant RBAC
  listTenants: () => ipcRenderer.invoke('tenants:list'),

  // One-Click Executive Audit Report
  generateReport: (options: any) => ipcRenderer.invoke('reports:generate', options),

  // Real-Time Alert Thresholds & Webhooks
  configureAlerts: (tenantId: string, config: any) => ipcRenderer.invoke('alerts:configure', tenantId, config),
  testAlert: (tenantId: string, channel: string) => ipcRenderer.invoke('alerts:test', tenantId, channel),
  getAlertHistory: (limit?: number) => ipcRenderer.invoke('alerts:history', limit),
  getAlertConfig: (tenantId: string) => ipcRenderer.invoke('alerts:config', tenantId)
});
