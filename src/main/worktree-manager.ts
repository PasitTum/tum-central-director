/**
 * TUM Sovereign Agent IDE — Git Worktree Lifecycle Manager
 * Handles true parallel worktree operations modeled after modern Agent Development Environments (Orca).
 */

import path from 'path';
import fs from 'fs/promises';
import { ProcessRunner } from './process-runner.js';
import { PlatformAdapter } from './platform.js';
import { WorktreeInfo, RepoFleetInfo } from '../shared/types.js';

export class WorktreeManager {
  /**
   * Parse `git worktree list --porcelain` output into structured WorktreeInfo
   */
  public static async listWorktrees(repoPath: string): Promise<WorktreeInfo[]> {
    const res = await ProcessRunner.execute('git worktree list --porcelain', repoPath);
    if (!res.success) {
      return [];
    }

    const worktrees: WorktreeInfo[] = [];
    const lines = res.stdout.split('\n');
    let current: Partial<WorktreeInfo> = {};

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        if (current.path) {
          worktrees.push({
            path: PlatformAdapter.normalizePath(current.path),
            head: current.head || 'unknown',
            branch: current.branch || 'detached',
            isBare: !!current.isBare,
            isLocked: !!current.isLocked,
            isPrunable: !!current.isPrunable
          });
        }
        current = {};
        continue;
      }

      if (line.startsWith('worktree ')) {
        current.path = line.substring(9).trim();
      } else if (line.startsWith('HEAD ')) {
        current.head = line.substring(5).trim();
      } else if (line.startsWith('branch ')) {
        const fullBranch = line.substring(7).trim();
        current.branch = fullBranch.replace('refs/heads/', '');
      } else if (line === 'bare') {
        current.isBare = true;
      } else if (line.startsWith('locked')) {
        current.isLocked = true;
      } else if (line.startsWith('prunable')) {
        current.isPrunable = true;
      }
    }

    if (current.path) {
      worktrees.push({
        path: PlatformAdapter.normalizePath(current.path),
        head: current.head || 'unknown',
        branch: current.branch || 'detached',
        isBare: !!current.isBare,
        isLocked: !!current.isLocked,
        isPrunable: !!current.isPrunable
      });
    }

    return worktrees;
  }

  /**
   * Add a new worktree isolated for an agent or feature
   */
  public static async createWorktree(
    repoPath: string,
    branchName: string,
    targetPath: string,
    createBranch: boolean = true
  ): Promise<{ success: boolean; message: string }> {
    const normTarget = PlatformAdapter.normalizePath(path.resolve(targetPath));

    // Ensure parent directory exists
    const parentDir = path.dirname(normTarget);
    try {
      await fs.mkdir(parentDir, { recursive: true });
    } catch {
      // Ignore if exists
    }

    const branchFlag = createBranch ? `-b "${branchName}"` : `"${branchName}"`;
    const cmd = `git worktree add ${branchFlag} "${normTarget}"`;
    const res = await ProcessRunner.execute(cmd, repoPath);

    if (!res.success) {
      return { success: false, message: res.stderr || res.stdout || 'Failed to create worktree' };
    }

    return {
      success: true,
      message: `Worktree created at ${normTarget} on branch ${branchName}`
    };
  }

  /**
   * Remove a worktree safely
   */
  public static async removeWorktree(
    repoPath: string,
    targetPath: string,
    force: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    const normTarget = PlatformAdapter.normalizePath(targetPath);
    const forceFlag = force ? '--force' : '';
    const cmd = `git worktree remove ${forceFlag} "${normTarget}"`;
    const res = await ProcessRunner.execute(cmd, repoPath);

    if (!res.success) {
      return { success: false, message: res.stderr || res.stdout || 'Failed to remove worktree' };
    }

    await this.pruneWorktrees(repoPath);
    return { success: true, message: `Worktree ${normTarget} removed successfully` };
  }

  /**
   * Prune dangling worktree administrative records
   */
  public static async pruneWorktrees(repoPath: string): Promise<boolean> {
    const res = await ProcessRunner.execute('git worktree prune', repoPath);
    return res.success;
  }

  /**
   * Get single repository status summary
   */
  public static async getRepoStatus(repoPath: string): Promise<{
    currentBranch: string;
    latestCommit: string;
    hasUncommittedChanges: boolean;
  }> {
    const branchRes = await ProcessRunner.execute('git rev-parse --abbrev-ref HEAD', repoPath);
    const logRes = await ProcessRunner.execute('git log -n 1 --oneline', repoPath);
    const statusRes = await ProcessRunner.execute('git status --short', repoPath);

    return {
      currentBranch: branchRes.stdout.trim() || 'unknown',
      latestCommit: logRes.stdout.trim() || 'No commits found',
      hasUncommittedChanges: statusRes.stdout.trim().length > 0
    };
  }

  /**
   * Scan multiple repos (e.g. TUM Fleet)
   */
  public static async scanFleet(
    repos: { id: string; name: string; path: string }[]
  ): Promise<RepoFleetInfo[]> {
    const fleet: RepoFleetInfo[] = [];

    for (const r of repos) {
      const status = await this.getRepoStatus(r.path);
      const worktrees = await this.listWorktrees(r.path);
      fleet.push({
        id: r.id,
        name: r.name,
        path: PlatformAdapter.normalizePath(r.path),
        currentBranch: status.currentBranch,
        latestCommit: status.latestCommit,
        hasUncommittedChanges: status.hasUncommittedChanges,
        worktrees
      });
    }

    return fleet;
  }
}
