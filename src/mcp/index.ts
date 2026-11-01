#!/usr/bin/env node
/**
 * TUM Sovereign MCP Server
 * Standard Model Context Protocol (MCP) server exposing TUM's Git Worktree fleet orchestrator,
 * Sentinel eBPF/AST threat interceptor, and AgentGate NIST ML-DSA-65 cryptographic credentials
 * to any MCP-compatible client (Cursor, Claude Code, Orca, Antigravity, Windsurf).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';

import { WorktreeManager } from '../main/worktree-manager.js';
import { ProcessRunner } from '../main/process-runner.js';
import { SentinelInterceptor } from '../main/sentinel.js';
import { AgentGateEngine } from '../main/agentgate.js';
import { PlatformAdapter } from '../main/platform.js';

const DEFAULT_REPOS = [
  { id: 'director', name: 'tum-central-director', path: 'D:/TUM/tum-central-director' },
  { id: 'trust', name: 'tum-trust-security', path: 'D:/TUM/tum-trust-security' },
  { id: 'socs', name: 'tum-socs', path: 'D:/TUM/tum-socs' },
  { id: 'quantum', name: 'tum-quantum', path: 'D:/TUM/tum-quantum' },
  { id: 'holdings', name: 'tum-group-holdings', path: 'D:/TUM/tum-group-holdings' }
];

export function createTumMcpServer(): Server {
  const server = new Server(
    {
      name: 'tum-sovereign-mcp',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  const TOOLS: Tool[] = [
    {
      name: 'tum_fleet_status',
      description: 'Scan and report active Git branches, latest commits, uncommitted change flags, and active worktrees across all 5 TUM repositories.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'tum_worktree_list',
      description: 'List all Git worktrees for a target repository (defaults to current working directory).',
      inputSchema: {
        type: 'object',
        properties: {
          repoPath: { type: 'string', description: 'Absolute or relative path to the Git repository' }
        }
      }
    },
    {
      name: 'tum_worktree_create',
      description: 'Create an isolated parallel Git worktree for an agent or feature branch, preventing Git collisions.',
      inputSchema: {
        type: 'object',
        properties: {
          repoPath: { type: 'string', description: 'Path to root repository' },
          branchName: { type: 'string', description: 'Name of the branch to checkout or create' },
          targetPath: { type: 'string', description: 'Target directory for the isolated worktree' }
        },
        required: ['repoPath', 'branchName']
      }
    },
    {
      name: 'tum_worktree_remove',
      description: 'Remove a worktree and prune dangling Git administrative metadata.',
      inputSchema: {
        type: 'object',
        properties: {
          repoPath: { type: 'string', description: 'Path to root repository' },
          targetPath: { type: 'string', description: 'Path to worktree directory to remove' },
          force: { type: 'boolean', description: 'Force removal even if untracked files exist' }
        },
        required: ['repoPath', 'targetPath']
      }
    },
    {
      name: 'tum_sentinel_guard',
      description: 'Inspect and execute a shell command inside a worktree guarded by Sentinel eBPF/AST threat interceptor. Blocks malicious pipes, reverse shells, credential exfiltration, and prompt injections.',
      inputSchema: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'The shell command to inspect and execute' },
          worktreePath: { type: 'string', description: 'The working directory in which to execute' },
          agentId: { type: 'string', description: 'Identifier of the agent executing the command' }
        },
        required: ['command']
      }
    },
    {
      name: 'tum_agentgate_mint',
      description: 'Mint a Delegated Agent Credential (DAC) anchored to a human sponsor and signed with NIST FIPS 204 ML-DSA-65 post-quantum signature.',
      inputSchema: {
        type: 'object',
        properties: {
          humanSponsor: { type: 'string', description: 'Name of the human sponsor authorizing the agent' },
          agentId: { type: 'string', description: 'Unique agent identifier' },
          role: { type: 'string', description: 'Assigned role or task domain' },
          maxTokenBudgetUsd: { type: 'number', description: 'Maximum allowed USD budget for LLM tokens' }
        },
        required: ['humanSponsor', 'agentId', 'role']
      }
    },
    {
      name: 'tum_agentgate_verify',
      description: 'Verify the cryptographic validity and revocation status of a Delegated Agent Credential token.',
      inputSchema: {
        type: 'object',
        properties: {
          tokenId: { type: 'string', description: 'The DAC token identifier (e.g. dac_...)' }
        },
        required: ['tokenId']
      }
    },
    {
      name: 'tum_sentinel_audit',
      description: 'Retrieve the latest circular ring-buffer security audit events with risk scores and tamper-evident hashes.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Maximum number of audit events to return (default: 20)' }
        }
      }
    }
  ];

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    try {
      if (name === 'tum_fleet_status') {
        const fleet = await WorktreeManager.scanFleet(DEFAULT_REPOS);
        return {
          content: [{ type: 'text', text: JSON.stringify(fleet, null, 2) }]
        };
      }

      if (name === 'tum_worktree_list') {
        const repoPath = (args.repoPath as string) || process.cwd();
        const list = await WorktreeManager.listWorktrees(repoPath);
        return {
          content: [{ type: 'text', text: JSON.stringify(list, null, 2) }]
        };
      }

      if (name === 'tum_worktree_create') {
        const repoPath = args.repoPath as string;
        const branchName = args.branchName as string;
        const targetPath = (args.targetPath as string) || `${repoPath}_wt_${branchName.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
        const res = await WorktreeManager.createWorktree(repoPath, branchName, targetPath, true);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }

      if (name === 'tum_worktree_remove') {
        const repoPath = args.repoPath as string;
        const targetPath = args.targetPath as string;
        const force = !!args.force;
        const res = await WorktreeManager.removeWorktree(repoPath, targetPath, force);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }

      if (name === 'tum_sentinel_guard') {
        const command = args.command as string;
        const worktreePath = (args.worktreePath as string) || process.cwd();
        const agentId = (args.agentId as string) || 'agent_mcp';

        const verdict = SentinelInterceptor.inspect(command, agentId, worktreePath);
        if (!verdict.allowed) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `[SENTINEL_BLOCKED]: Action: ${verdict.action} | Threat: ${verdict.threatCategory} | Risk Score: ${verdict.riskScore}/100\nReason: ${verdict.attribution.reason}`
              }
            ]
          };
        }

        const execRes = await ProcessRunner.execute(command, worktreePath);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  verdict,
                  execution: execRes
                },
                null,
                2
              )
            }
          ]
        };
      }

      if (name === 'tum_agentgate_mint') {
        const cred = AgentGateEngine.mintCredential({
          humanSponsor: args.humanSponsor as string,
          agentId: args.agentId as string,
          role: args.role as string,
          maxTokenBudgetUsd: args.maxTokenBudgetUsd as number
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(cred, null, 2) }]
        };
      }

      if (name === 'tum_agentgate_verify') {
        const res = AgentGateEngine.verifyCredential(args.tokenId as string);
        return {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }]
        };
      }

      if (name === 'tum_sentinel_audit') {
        const limit = (args.limit as number) || 20;
        const audit = SentinelInterceptor.getAuditLog(limit);
        return {
          content: [{ type: 'text', text: JSON.stringify(audit, null, 2) }]
        };
      }

      return {
        isError: true,
        content: [{ type: 'text', text: `Unknown tool: ${name}` }]
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error executing ${name}: ${err?.message || err}` }]
      };
    }
  });

  return server;
}

export async function runStdioServer() {
  const server = createTumMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// When invoked directly via CLI (`tum-mcp` or `node dist/mcp/index.js`)
if (process.argv[1]?.endsWith('mcp/index.js') || process.argv[1]?.endsWith('mcp/index.ts')) {
  runStdioServer().catch((err) => {
    process.stderr.write(`Fatal MCP Error: ${err}\n`);
    process.exit(1);
  });
}
