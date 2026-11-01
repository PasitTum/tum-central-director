/**
 * TUM Sovereign Harness — Deterministic Lifecycle Hooks
 * Inspired by affaan-m/ECC (Agent Harness Optimization System).
 * Enforces deterministic security gates, eval-first testing, and PQC commit signing.
 */

import { SentinelInterceptor } from '../main/sentinel.js';
import { AgentGateEngine } from '../main/agentgate.js';
import { ProcessRunner } from '../main/process-runner.js';
import { SecurityVerdict, DelegatedAgentCredential } from '../shared/types.js';

export class SecurityPolicyViolationError extends Error {
  public readonly verdict: SecurityVerdict;
  constructor(verdict: SecurityVerdict) {
    super(`[SENTINEL_SECURITY_GATE]: Execution halted. Action: ${verdict.action} (Risk Score: ${verdict.riskScore}/100 - ${verdict.matchedRule})`);
    this.name = 'SecurityPolicyViolationError';
    this.verdict = verdict;
  }
}

export class EvalGateFailureError extends Error {
  public readonly testOutput: string;
  constructor(message: string, testOutput: string) {
    super(`[EVAL_GATE_FAILURE]: Verification tests failed. Cannot progress until tests pass. Details:\n${testOutput}`);
    this.name = 'EvalGateFailureError';
    this.testOutput = testOutput;
  }
}

export class SovereignHooks {
  /**
   * Deterministic Pre-Command Hook (ECC-style AgentShield)
   * Intercepts command before execution; deterministically throws if threat detected.
   */
  public static preCommand(
    command: string,
    agentId: string = 'agent_runtime',
    worktree: string = process.cwd()
  ): SecurityVerdict {
    const verdict = SentinelInterceptor.inspect(command, agentId, worktree);
    if (!verdict.allowed) {
      throw new SecurityPolicyViolationError(verdict);
    }
    return verdict;
  }

  /**
   * Deterministic Evaluation Gate Hook (ECC Research-First & Eval-First)
   * Forces code to pass evaluation test suite before allowing commits or task completion.
   */
  public static async evalGate(
    testCommand: string,
    cwd: string = process.cwd()
  ): Promise<{ passed: boolean; durationMs: number; output: string }> {
    const res = await ProcessRunner.execute(testCommand, cwd);
    if (!res.success) {
      throw new EvalGateFailureError('Evaluation test suite failed', res.stderr || res.stdout);
    }
    return {
      passed: true,
      durationMs: res.durationMs,
      output: res.stdout
    };
  }

  /**
   * Deterministic Pre-Commit Hook
   * Attaches NIST FIPS 204 ML-DSA-65 post-quantum signature and DAC proof trailer to Git commit.
   */
  public static preCommit(
    commitMessage: string,
    credential: DelegatedAgentCredential
  ): { enhancedMessage: string; pqcSignature: string } {
    const verification = AgentGateEngine.verifyCredential(credential.tokenId);
    if (!verification.valid) {
      throw new Error(`[PQC_COMMIT_BLOCKED]: Invalid or revoked DAC token: ${verification.reason}`);
    }

    const pqcSignature = credential.cryptographicProof.signature;
    const trailer = [
      '',
      '---',
      `TUM-Sovereign-Agent: ${credential.agentProfile.agentId}`,
      `TUM-Human-Sponsor: ${credential.issuerHuman.name}`,
      `TUM-DAC-Token: ${credential.tokenId}`,
      `TUM-PQC-Algorithm: ${credential.cryptographicProof.algorithm}`,
      `TUM-PQC-Signature: ${pqcSignature.substring(0, 48)}...`
    ].join('\n');

    return {
      enhancedMessage: `${commitMessage.trim()}\n${trailer}`,
      pqcSignature
    };
  }
}
