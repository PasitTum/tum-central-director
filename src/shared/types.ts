/**
 * TUM Sovereign Agent IDE — Shared Data Contracts & Protocol Definitions
 * Modeled after enterprise agentic engineering architectures.
 */

export interface WorktreeInfo {
  path: string;
  head: string;
  branch: string;
  isBare: boolean;
  isLocked: boolean;
  isPrunable: boolean;
}

export interface RepoFleetInfo {
  id: string;
  name: string;
  path: string;
  currentBranch: string;
  latestCommit: string;
  hasUncommittedChanges: boolean;
  worktrees: WorktreeInfo[];
}

export interface DelegatedAgentCredential {
  tokenId: string;
  issuerHuman: {
    name: string;
    citizenIdMasked: string;
    verificationAnchor: string;
    authorizedAt: string;
  };
  agentProfile: {
    agentId: string;
    role: string;
    model: string;
  };
  delegatedPermissions: {
    allowedWorktreePaths: string[];
    allowedGitBranches: string[];
    prohibitedShellCommands: string[];
    maxTokenBudgetUsd: number;
  };
  validity: {
    issuedAt: string;
    expiresAt: string;
    revoked: boolean;
  };
  cryptographicProof: {
    algorithm: 'NIST_FIPS_204_ML_DSA_65' | 'HYBRID_PQC_ECDSA';
    publicKeyThumbprint: string;
    signature: string;
  };
}

export type ThreatCategory =
  | 'SAFE_OPERATION'
  | 'SUSPICIOUS_BEHAVIOR'
  | 'PROMPT_INJECTION'
  | 'MALICIOUS_SHELL'
  | 'CREDENTIAL_EXFILTRATION'
  | 'PRIVILEGE_ESCALATION';

export type SecurityMitigationAction =
  | 'ALLOW_AUDITED'
  | 'WARN_CHALLENGE'
  | 'BLOCK_QUARANTINE'
  | 'BLOCK_KILL';

export interface SecurityVerdict {
  allowed: boolean;
  riskScore: number; // 0 - 100
  threatCategory: ThreatCategory;
  matchedRule: string;
  action: SecurityMitigationAction;
  attribution: {
    detectedAt: string;
    where: string;
    reason: string;
  };
}

export interface AuditEvent {
  id?: string;
  timestamp: string;
  agentId?: string;
  worktree?: string;
  actionType?: 'WORKTREE_OP' | 'COMMAND_EXECUTION' | 'DAC_MINT' | 'DAC_REVOKE' | 'THREAT_BLOCKED';
  detail: string;
  riskScore: number;
  verdict: string;
  threatCategory?: string;
  attribution?: {
    reason: string;
  };
}

export type AuditLogEntry = AuditEvent;

export interface StudioNode {
  id: string;
  title: string;
  category: 'frontend' | 'security' | 'quantum' | 'analytics' | 'gateway';
  role: string;
  status: 'active' | 'standby' | 'running';
  x: number;
  y: number;
}
