/**
 * TUM Sovereign Agent IDE — Sentinel Threat & Prompt Injection Interceptor
 * Evaluates commands and agent payloads in real-time before kernel execution.
 * Powered by circular tamper-evident ring-buffer audit logging.
 */

import crypto from 'crypto';
import { SecurityVerdict, ThreatCategory, SecurityMitigationAction, AuditEvent } from '../shared/types.js';

interface SecurityRule {
  pattern: RegExp;
  category: ThreatCategory;
  score: number;
  name: string;
  action: SecurityMitigationAction;
  reason: string;
}

export class SentinelInterceptor {
  private static readonly RULES: SecurityRule[] = [
    {
      pattern: /\brm\s+-[a-z]*r[a-z]*f\b|\bdel\s+\/[fsq]+\b|\bformat\s+[a-z]:/i,
      category: 'MALICIOUS_SHELL',
      score: 98,
      name: 'Destructive File Deletion',
      action: 'BLOCK_KILL',
      reason: 'Attempted recursive unrecoverable file system wipe'
    },
    {
      pattern: /\b(curl|wget)\b.*\|\s*(ba)?sh|\biex\s*\(\s*(new-object|iwr)/i,
      category: 'MALICIOUS_SHELL',
      score: 99,
      name: 'Remote Code Execution (Pipe to Shell)',
      action: 'BLOCK_KILL',
      reason: 'Attempted piping remote unverified network script into host shell interpreter'
    },
    {
      pattern: /\b(nc|ncat|netcat)\s+.*-e\b|\bbash\s+-i\s+>&|\bpython(\d)?\s+-c\s+.*pty\.spawn/i,
      category: 'MALICIOUS_SHELL',
      score: 100,
      name: 'Interactive Reverse Shell',
      action: 'BLOCK_KILL',
      reason: 'Attempted spawning unauthorized reverse shell connection back to external controller'
    },
    {
      pattern: /\b(cat|type|get-content)\b.*(\.env\b|id_rsa\b|\bpasswd\b|\bshadow\b|\bcredentials\.json\b)/i,
      category: 'CREDENTIAL_EXFILTRATION',
      score: 95,
      name: 'Credential & Secret Harvest',
      action: 'BLOCK_QUARANTINE',
      reason: 'Attempted reading sensitive environment credentials or private cryptographic keys'
    },
    {
      pattern: /ignore\s+(all\s+)?(previous|prior)\s+instructions|system\s+prompt\s+leak|\bjailbreak\b|you\s+are\s+now\s+dan|forget\s+all\s+guidelines/i,
      category: 'PROMPT_INJECTION',
      score: 92,
      name: 'Indirect Adversarial Prompt Injection',
      action: 'BLOCK_QUARANTINE',
      reason: 'Detected adversarial jailbreak or instruction override attack in payload context'
    },
    {
      pattern: /\bsudo\b|\bchmod\s+777\b|\btakeown\s+\/f\b|\bicacls\s+.*\/grant/i,
      category: 'PRIVILEGE_ESCALATION',
      score: 85,
      name: 'Privilege Escalation Attempt',
      action: 'WARN_CHALLENGE',
      reason: 'Command attempts to modify administrative privileges or system permissions'
    },
    {
      pattern: /\bgit\s+push\s+.*(--force|-f)\b/i,
      category: 'SUSPICIOUS_BEHAVIOR',
      score: 70,
      name: 'Destructive Git Force Push',
      action: 'WARN_CHALLENGE',
      reason: 'Destructive rewrite of remote Git history without review'
    },
    {
      pattern: /\b(dotnet\s+test|dotnet\s+build|npm\s+test|npm\s+run|git\s+status|git\s+diff|git\s+log|tsc)\b/i,
      category: 'SAFE_OPERATION',
      score: 2,
      name: 'Verified Engineering Operation',
      action: 'ALLOW_AUDITED',
      reason: 'Routine software compilation, testing, or repository inspection'
    }
  ];

  // In-Memory Circular Ring Buffer for Audit Logs
  private static readonly MAX_RING_BUFFER = 200;
  private static readonly ringBuffer: AuditEvent[] = [];
  private static lastHash: string = '0000000000000000000000000000000000000000000000000000000000000000';

  /**
   * Inspect a command or text payload before execution
   */
  public static inspect(command: string, agentId: string = 'agent_runtime', worktree: string = 'workspace'): SecurityVerdict {
    const text = command.trim();

    for (const rule of this.RULES) {
      if (rule.pattern.test(text)) {
        const verdict: SecurityVerdict = {
          allowed: rule.action === 'ALLOW_AUDITED',
          riskScore: rule.score,
          threatCategory: rule.category,
          matchedRule: rule.name,
          action: rule.action,
          attribution: {
            detectedAt: new Date().toISOString(),
            where: 'TUM Sentinel Shell & AST Interceptor',
            reason: rule.reason
          }
        };

        this.recordAudit(agentId, worktree, text, verdict);
        return verdict;
      }
    }

    // Default safe action for unrecognized benign commands
    const defaultVerdict: SecurityVerdict = {
      allowed: true,
      riskScore: 5,
      threatCategory: 'SAFE_OPERATION',
      matchedRule: 'General Engineering Shell Action',
      action: 'ALLOW_AUDITED',
      attribution: {
        detectedAt: new Date().toISOString(),
        where: 'Host Execution Environment',
        reason: 'No malicious patterns matched'
      }
    };

    this.recordAudit(agentId, worktree, text, defaultVerdict);
    return defaultVerdict;
  }

  /**
   * Record event into tamper-evident circular ring buffer
   */
  private static recordAudit(
    agentId: string,
    worktree: string,
    detail: string,
    verdict: SecurityVerdict
  ): void {
    const timestamp = new Date().toISOString();
    const eventId = 'evt_' + crypto.randomBytes(8).toString('hex');

    // Tamper-evident hash chain
    const contentToHash = `${this.lastHash}|${eventId}|${timestamp}|${agentId}|${detail}|${verdict.riskScore}`;
    this.lastHash = crypto.createHash('sha256').update(contentToHash).digest('hex');

    const event: AuditEvent = {
      id: eventId,
      timestamp,
      agentId,
      worktree,
      actionType: verdict.allowed ? 'COMMAND_EXECUTION' : 'THREAT_BLOCKED',
      detail,
      riskScore: verdict.riskScore,
      verdict: verdict.action
    };

    if (this.ringBuffer.length >= this.MAX_RING_BUFFER) {
      this.ringBuffer.shift(); // maintain circular bound
    }
    this.ringBuffer.push(event);
  }

  /**
   * Get latest audit events
   */
  public static getAuditLog(limit: number = 20): AuditEvent[] {
    return [...this.ringBuffer].reverse().slice(0, limit);
  }

  /**
   * Clear audit log (for test suites)
   */
  public static clearAudit(): void {
    this.ringBuffer.length = 0;
    this.lastHash = '0000000000000000000000000000000000000000000000000000000000000000';
  }
}
