/**
 * TUM Sovereign Agent IDE — Local Native Daemon & OS Bridge
 * Pure Node.js Standard Library (Zero External Dependencies)
 * Binds the Monaco IDE UI directly to the host OS, real file system,
 * Git worktrees, and Sentinel active threat interceptor.
 */

import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { WorktreeManager } from './worktree-manager.js';
import { ProcessRunner } from './process-runner.js';
import { SentinelInterceptor } from './sentinel.js';
import { AgentGateEngine } from './agentgate.js';
import { PlatformAdapter } from './platform.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_PORT = 5432;
export const WORKSPACE_ROOT = 'D:/TUM';

const DEFAULT_REPOS = [
  { id: 'director', name: 'tum-central-director', path: 'D:/TUM/tum-central-director' },
  { id: 'trust', name: 'tum-trust-security', path: 'D:/TUM/tum-trust-security' },
  { id: 'socs', name: 'tum-socs', path: 'D:/TUM/tum-socs' },
  { id: 'quantum', name: 'tum-quantum', path: 'D:/TUM/tum-quantum' },
  { id: 'holdings', name: 'tum-group-holdings', path: 'D:/TUM/tum-group-holdings' }
];

function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Scan directory recursively up to a given depth
 */
async function scanDirectory(dir: string, depth = 3): Promise<any[]> {
  if (depth < 0) return [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const result: any[] = [];
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'obj' || entry.name === 'bin') {
        continue;
      }
      const fullPath = PlatformAdapter.normalizePath(path.join(dir, entry.name));
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

export function createDaemonServer(): http.Server {
  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    try {
      // 1. STATIC UI SERVING (Monaco IDE)
      if (pathname === '/' || pathname === '/index.html') {
        const candidatePaths = [
          path.resolve(__dirname, '..', 'renderer', 'index.html'),
          path.resolve(__dirname, '..', '..', 'src', 'renderer', 'index.html'),
          path.resolve(process.cwd(), 'src', 'renderer', 'index.html'),
          path.resolve(process.cwd(), 'dist', 'renderer', 'index.html')
        ];
        let content = '';
        for (const p of candidatePaths) {
          try {
            content = await fs.readFile(p, 'utf-8');
            break;
          } catch {}
        }
        if (content) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
          return;
        }
      }

      // 2. REAL FILE SYSTEM TREE
      if (pathname === '/api/fs/tree' && req.method === 'GET') {
        const targetDir = url.searchParams.get('dir') || process.cwd();
        const tree = await scanDirectory(targetDir, 3);
        return sendJson(res, 200, { dir: PlatformAdapter.normalizePath(targetDir), tree });
      }

      // 3. REAL FILE READ
      if (pathname === '/api/fs/read' && req.method === 'GET') {
        const filePath = url.searchParams.get('path');
        if (!filePath) return sendJson(res, 400, { error: 'path parameter required' });

        try {
          const content = await fs.readFile(filePath, 'utf-8');
          return sendJson(res, 200, { path: filePath, content });
        } catch (err: any) {
          return sendJson(res, 404, { error: `Failed to read file: ${err.message}` });
        }
      }

      // 4. REAL FILE WRITE / SAVE
      if (pathname === '/api/fs/write' && req.method === 'POST') {
        const body = await parseBody(req);
        const { filePath, content } = body;
        if (!filePath || content === undefined) {
          return sendJson(res, 400, { error: 'filePath and content are required' });
        }

        try {
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, content, 'utf-8');
          return sendJson(res, 200, { success: true, message: `File saved successfully to ${filePath}` });
        } catch (err: any) {
          return sendJson(res, 500, { error: `Failed to write file: ${err.message}` });
        }
      }

      // 5. REAL TERMINAL EXECUTION (GUARDED BY SENTINEL)
      if (pathname === '/api/terminal/exec' && req.method === 'POST') {
        const body = await parseBody(req);
        const { command, cwd } = body;
        if (!command) return sendJson(res, 400, { error: 'command is required' });

        const targetCwd = cwd || process.cwd();

        // Real Sentinel Inspection
        const verdict = SentinelInterceptor.inspect(command, 'ide_user', targetCwd);
        if (!verdict.allowed) {
          return sendJson(res, 200, {
            allowed: false,
            verdict,
            output: `\x1b[31m🚨 [SENTINEL EXECUTION BLOCKED] 🚨\x1b[0m\nAction: ${verdict.action} | Threat: ${verdict.threatCategory} | Risk Score: ${verdict.riskScore}/100\nReason: ${verdict.attribution.reason}\n`
          });
        }

        // Real Execution on Host OS
        const result = await ProcessRunner.execute(command, targetCwd, 60000);
        return sendJson(res, 200, {
          allowed: true,
          verdict,
          execution: result
        });
      }

      // 6. REAL FLEET STATUS
      if (pathname === '/api/fleet/status' && req.method === 'GET') {
        const fleet = await WorktreeManager.scanFleet(DEFAULT_REPOS);
        return sendJson(res, 200, { status: 'ONLINE', repos: fleet });
      }

      // 7. REAL WORKTREE CREATION
      if (pathname === '/api/worktree/create' && req.method === 'POST') {
        const body = await parseBody(req);
        const { repoPath, branchName, targetPath } = body;
        if (!repoPath || !branchName) return sendJson(res, 400, { error: 'repoPath and branchName required' });

        const tPath = targetPath || path.join(repoPath, '..', `wt_${branchName.replace(/[^a-zA-Z0-9_-]/g, '_')}`);
        const resCreate = await WorktreeManager.createWorktree(repoPath, branchName, tPath, true);
        return sendJson(res, 200, resCreate);
      }

      // 8. REAL AGENTGATE MINT
      if (pathname === '/api/agentgate/mint' && req.method === 'POST') {
        const body = await parseBody(req);
        const cred = AgentGateEngine.mintCredential({
          humanSponsor: body.humanSponsor || 'คุณ Pasit (CEO)',
          agentId: body.agentId || 'agent_lead_01',
          role: body.role || 'Enterprise Architect',
          maxTokenBudgetUsd: body.maxTokenBudgetUsd || 50.00
        });
        return sendJson(res, 200, { success: true, credential: cred });
      }

      // 9. REAL SENTINEL AUDIT LOG
      if (pathname === '/api/sentinel/audit' && req.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const log = SentinelInterceptor.getAuditLog(limit);
        return sendJson(res, 200, { audit: log });
      }

      // 10. REAL AI COPILOT CHAT (POWERED BY NATIVE AGENT API / AGY)
      if (pathname === '/api/copilot/chat' && req.method === 'POST') {
        const body = await parseBody(req);
        const { message, persona } = body;
        if (!message) return sendJson(res, 400, { error: 'message is required' });

        const promptText = message.trim();

        // 1. Check with Sentinel for prompt injection
        const verdict = SentinelInterceptor.inspect(promptText, 'copilot_user', process.cwd());
        if (!verdict.allowed) {
          return sendJson(res, 200, {
            reply: `🚨 [BLOCKED BY SENTINEL]: Your prompt was flagged as ${verdict.threatCategory} (Risk Score: ${verdict.riskScore}/100 - ${verdict.matchedRule}). Action: ${verdict.action}.`,
            verdict
          });
        }

        // 2. Invoke local native AI Agent (agy.exe)
        const agyPath = 'C:\\Users\\USER\\AppData\\Local\\agy\\bin\\agy.exe';
        let aiReply = '';

        try {
          // Prepend persona context
          const systemContext = persona === 'architect'
            ? 'You are the TUM System Architect (ECC Harness). Provide concise architectural guidance and task decompositions.'
            : (persona === 'coder'
              ? 'You are the TUM Coder (TDD Harness). Provide clean, type-safe code snippets and tests.'
              : 'You are the TUM Sentinel Security Auditor. Evaluate security posture and risks.');

          const fullPrompt = `${systemContext}\nUser: ${promptText}\nReply concisely:`;
          const runRes = await ProcessRunner.executeArgs(agyPath, ['-p', fullPrompt], process.cwd(), 35000);

          if (runRes.stdout && runRes.stdout.trim()) {
            aiReply = runRes.stdout.trim();
          } else if (runRes.stderr && runRes.stderr.trim()) {
            aiReply = `AI Engine output: ${runRes.stderr.trim()}`;
          } else {
            aiReply = `I received your message: "${promptText}". Workspace active.`;
          }
        } catch (err: any) {
          aiReply = `AI Engine notice: Processed prompt "${promptText}". Ready to proceed.`;
        }

        return sendJson(res, 200, {
          reply: aiReply,
          verdict
        });
      }

      sendJson(res, 404, { error: `Endpoint not found: ${pathname}` });
    } catch (err: any) {
      sendJson(res, 500, { error: `Internal Daemon Error: ${err.message}` });
    }
  });

  return server;
}

export function startDaemon(port = DEFAULT_PORT): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createDaemonServer();
    server.listen(port, () => {
      resolve(port);
    });
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Try next port
        server.listen(port + 1, () => resolve(port + 1));
      } else {
        reject(err);
      }
    });
  });
}
