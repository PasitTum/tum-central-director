import test from 'node:test';
import assert from 'node:assert';
import { WorktreeManager } from '../src/main/worktree-manager.js';
import { PlatformAdapter } from '../src/main/platform.js';

test('PlatformAdapter: Cross-platform path normalization produces consistent POSIX slashes', () => {
  const winPath = 'D:\\TUM\\tum-central-director\\src';
  const normalized = PlatformAdapter.normalizePath(winPath);
  assert.strictEqual(normalized, 'D:/TUM/tum-central-director/src');
});

test('WorktreeManager: Real Git repository status inspection succeeds', async () => {
  const status = await WorktreeManager.getRepoStatus(process.cwd());
  assert.ok(status.currentBranch.length > 0);
  assert.ok(typeof status.hasUncommittedChanges === 'boolean');
});

test('WorktreeManager: Real Git worktree porcelain list succeeds on current repo', async () => {
  const worktrees = await WorktreeManager.listWorktrees(process.cwd());
  assert.ok(Array.isArray(worktrees));
  assert.ok(worktrees.length >= 1);
  assert.ok(worktrees[0].path.length > 0);
});

test('WorktreeManager: Scan fleet handles multi-repository status lookup', async () => {
  const fleet = await WorktreeManager.scanFleet([
    { id: 'director', name: 'tum-central-director', path: process.cwd() }
  ]);

  assert.strictEqual(fleet.length, 1);
  assert.strictEqual(fleet[0].id, 'director');
  assert.ok(fleet[0].worktrees.length >= 1);
});
