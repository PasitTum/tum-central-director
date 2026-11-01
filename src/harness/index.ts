/**
 * TUM Sovereign Harness — Main Entrypoint
 * Provides structured agent lifecycle runners with ECC deterministic gates.
 */

export * from './hooks.js';
export { SentinelInterceptor } from '../main/sentinel.js';
export { AgentGateEngine } from '../main/agentgate.js';
export { WorktreeManager } from '../main/worktree-manager.js';
export { ProcessRunner } from '../main/process-runner.js';
