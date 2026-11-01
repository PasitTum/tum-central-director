---
name: tum-worktree-orchestrator
description: Teaches AI agents how to manage parallel Git Worktrees across repositories without branch collision or merge conflicts.
---

# TUM Parallel Worktree Orchestration Skill

Use this skill when coordinating multi-agent development across one or more Git repositories.

## Overview
Git worktrees allow multiple working directories attached to the same repository. Instead of switching branches in a single directory (which causes build lockups and file collisions when multiple agents work simultaneously), each agent works in its own isolated worktree.

## Core Commands & MCP Tools

### 1. Inspect Active Worktrees
Via MCP:
```json
{
  "tool": "tum_worktree_list",
  "arguments": { "repoPath": "D:/TUM/tum-central-director" }
}
```
Via CLI:
```bash
tum worktree list D:/TUM/tum-central-director
```

### 2. Spawn Isolated Agent Worktree
Before writing code for an assigned feature or issue (e.g. `feature/SCRUM-26-oauth`):
Via MCP:
```json
{
  "tool": "tum_worktree_create",
  "arguments": {
    "repoPath": "D:/TUM/tum-central-director",
    "branchName": "feature/SCRUM-26-oauth",
    "targetPath": "D:/TUM/wt_scrum_26_oauth"
  }
}
```

### 3. Cleanup & Pruning
When an agent finishes its work and the pull request is merged:
```bash
tum worktree remove D:/TUM/tum-central-director D:/TUM/wt_scrum_26_oauth
tum worktree prune D:/TUM/tum-central-director
```

## Best Practices
1. Never edit code in the root directory while another agent is working on a feature.
2. Always execute unit tests (`npm test` or `dotnet test`) inside the isolated worktree directory.
3. Ensure worktree directory paths do not contain special characters.
