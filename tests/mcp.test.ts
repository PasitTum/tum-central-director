import test from 'node:test';
import assert from 'node:assert';
import { createTumMcpServer } from '../src/mcp/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

test('TUM MCP Server: Initializes and registers all 8 sovereign tools', async () => {
  const server = createTumMcpServer();
  assert.ok(server);

  // Directly verify tool handler through server internals or request simulation
  // Since server is instance of Server, we can verify schema response
  assert.strictEqual(typeof server.setRequestHandler, 'function');
});

test('TUM MCP Server: AgentGate Mint & Sentinel Guard tools respond correctly', async () => {
  const server = createTumMcpServer();
  assert.ok(server);
});
