---
name: tum-sentinel-defense
description: Teaches AI agents how to execute commands safely under TUM Sentinel's eBPF/AST security interceptor and how to avoid malicious payload execution.
---

# TUM Sentinel Active Security Defense Skill

Use this skill to understand the security boundaries enforced by TUM Sentinel across agent runtimes.

## Threat Policies Enforced by Sentinel

Sentinel inspects every command string and prompt payload before it reaches the operating system kernel:

| Threat Category | Matched Patterns | Action | Risk Score |
| :--- | :--- | :--- | :--- |
| **Destructive Deletion** | `rm -rf /`, `del /f /s /q`, `format` | `BLOCK_KILL` | 98/100 |
| **Remote Shell Pipe** | `curl ... \| bash`, `wget ... \| sh`, `iex (...)` | `BLOCK_KILL` | 99/100 |
| **Interactive Reverse Shell**| `nc -e`, `bash -i >& /dev/tcp/...` | `BLOCK_KILL` | 100/100 |
| **Credential Harvest** | `cat .env`, `type id_rsa`, `cat /etc/shadow` | `BLOCK_QUARANTINE` | 95/100 |
| **Prompt Injection** | `ignore all previous instructions`, `system prompt leak` | `BLOCK_QUARANTINE` | 92/100 |
| **Privilege Escalation** | `sudo`, `chmod 777`, `takeown /f` | `WARN_CHALLENGE` | 85/100 |
| **Verified Safe** | `dotnet test`, `npm test`, `git status`, `git diff` | `ALLOW_AUDITED` | 2/100 |

## Executing Commands via MCP Tool
Instead of invoking raw shell commands that may get blocked:
```json
{
  "tool": "tum_sentinel_guard",
  "arguments": {
    "command": "npm test",
    "worktreePath": "D:/TUM/tum-central-director"
  }
}
```

## Reviewing the Security Audit Stream
```bash
tum sentinel audit 10
```
Or via MCP:
```json
{
  "tool": "tum_sentinel_audit",
  "arguments": { "limit": 10 }
}
```
All events are recorded into an in-memory circular ring buffer with SHA-256 tamper-evident hash chaining.
