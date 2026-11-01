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
  sendCopilotChat: (message: string, persona: string) =>
    ipcRenderer.invoke('copilot:chat', message, persona)
});
