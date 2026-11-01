/**
 * TUM Central Director — Incident Response Playbook Trigger & Fleet Security Orchestrator
 * Pure TypeScript (Zero External Dependencies)
 * Orchestrates cross-fleet active mitigations, quarantine orders, and sovereign playbooks.
 */

import crypto from 'crypto';
import { FleetEventMesh } from './event-mesh.js';
import { AgentGate } from './agentgate.js';

export interface PlaybookDefinition {
  id: string;
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  targetFleets: string[];
  estimatedExecutionMs: number;
  mitigationActions: string[];
}

export interface PlaybookExecutionRecord {
  executionId: string;
  playbookId: string;
  playbookName: string;
  status: 'COMPLETED' | 'FAILED' | 'CHALLENGED';
  triggeredBy: string;
  parameters: Record<string, unknown>;
  results: Record<string, unknown>;
  auditDigestHex: string;
  executedAtIso: string;
  durationMs: number;
}

export class PlaybookOrchestrator {
  private static readonly PLAYBOOKS: PlaybookDefinition[] = [
    {
      id: 'IR-PLAYBOOK-01',
      name: 'Fleet-Wide Host & Agent Containment',
      severity: 'CRITICAL',
      description: 'Isolates suspect node, revokes agent execution tokens, and broadcasts quarantine orders via FleetEventMesh.',
      targetFleets: ['tum-cybermesh', 'tum-agentic-workos', 'tum-socs'],
      estimatedExecutionMs: 120,
      mitigationActions: ['DAC_FREEZE', 'NETWORK_EGRESS_BLOCK', 'SOAR_CONTAINMENT_DISPATCH']
    },
    {
      id: 'IR-PLAYBOOK-02',
      name: 'Sovereign Credential Revocation & Session Kill',
      severity: 'HIGH',
      description: 'Terminates active user/agent sessions and immediately blacklists DAC token in AgentGate.',
      targetFleets: ['tum-central-director', 'tum-agentic-workos', 'tum-trust-security'],
      estimatedExecutionMs: 45,
      mitigationActions: ['REVOKE_DAC_TOKEN', 'TERMINATE_ACTIVE_SESSION', 'AUDIT_LEDGER_ALERT']
    },
    {
      id: 'IR-PLAYBOOK-03',
      name: 'Suvarnabhumi Corridor Emergency Lockdown',
      severity: 'CRITICAL',
      description: 'Halts automatic gate pulse clearances and enforces mandatory secondary officer biometric screening.',
      targetFleets: ['tum-trust-fabric'],
      estimatedExecutionMs: 80,
      mitigationActions: ['CORRIDOR_GATE_HOLD', 'RED_NOTICE_ALERT_DISPATCH', 'OFFICER_CHALLENGE_FLAG']
    },
    {
      id: 'IR-PLAYBOOK-04',
      name: 'Post-Quantum Key Agility Emergency Rotation',
      severity: 'HIGH',
      description: 'Rotates active classical asymmetric keys to NIST FIPS 204 ML-DSA-87 across all microservices.',
      targetFleets: ['tum-quantum', 'tum-socs', 'tum-trust-security'],
      estimatedExecutionMs: 250,
      mitigationActions: ['ROTATE_CRYPTO_SUITE', 'INVALIDATE_HARVESTED_EPHEMERALS', 'PQC_ASSERTION_ISSUE']
    }
  ];

  private static readonly history: PlaybookExecutionRecord[] = [];

  public static getPlaybooks(): PlaybookDefinition[] {
    return [...this.PLAYBOOKS];
  }

  public static getPlaybookById(id: string): PlaybookDefinition | undefined {
    return this.PLAYBOOKS.find((p) => p.id === id);
  }

  public static getExecutionHistory(limit: number = 50): PlaybookExecutionRecord[] {
    return this.history.slice(-limit).reverse();
  }

  public static async executePlaybook(
    playbookId: string,
    parameters: Record<string, unknown> = {},
    triggeredBy: string = 'CEO_EXECUTIVE_CONSOLE'
  ): Promise<PlaybookExecutionRecord> {
    const start = performance.now();
    const playbook = this.getPlaybookById(playbookId);
    if (!playbook) {
      throw new Error(`Playbook not found: ${playbookId}`);
    }

    const executionId = `exec_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const results: Record<string, unknown> = {};

    const mesh = FleetEventMesh.getInstance();

    // Execute specific playbook actions
    if (playbookId === 'IR-PLAYBOOK-01') {
      const targetAgentId = (parameters.targetAgentId as string) || 'agent-unknown';
      // Broadcast via Event Mesh
      await mesh.publish('CYBERMESH_SOAR_CONTAINMENT', 'tum-central-director', {
        executionId,
        targetAgentId,
        reason: parameters.reason || 'Critical security incident flagged by Central Director',
        timestamp: new Date().toISOString()
      });
      results.containmentBroadcast = 'SUCCESS';
      results.targetAgentId = targetAgentId;
    } else if (playbookId === 'IR-PLAYBOOK-02') {
      const tokenId = parameters.tokenId as string;
      if (tokenId) {
        AgentGate.revoke(tokenId, (parameters.reason as string) || 'Executive emergency revocation');
        results.revocationStatus = 'REVOKED';
        results.revokedTokenId = tokenId;
      }
    } else if (playbookId === 'IR-PLAYBOOK-03') {
      await mesh.publish('DIRECTOR_POLICY_ENFORCED', 'tum-central-director', {
        action: 'CORRIDOR_EMERGENCY_LOCKDOWN',
        gateId: parameters.gateId || 'ALL_GATES',
        reason: parameters.reason || 'Interpol watchlist containment incident',
        timestamp: new Date().toISOString()
      });
      results.corridorLockdown = 'ACTIVE';
    } else if (playbookId === 'IR-PLAYBOOK-04') {
      await mesh.publish('QUANTUM_KEY_ROTATED', 'tum-central-director', {
        targetSuite: 'NIST_FIPS_204_ML_DSA_87',
        reason: 'Emergency forward secrecy hardening',
        timestamp: new Date().toISOString()
      });
      results.pqcKeyRotation = 'DISPATCHED';
    }

    const durationMs = Math.round(performance.now() - start);

    // Compute tamper-evident audit digest
    const hash = crypto.createHash('sha256');
    hash.update(executionId);
    hash.update(playbookId);
    hash.update(triggeredBy);
    hash.update(JSON.stringify(parameters));
    hash.update(JSON.stringify(results));
    const auditDigestHex = hash.digest('hex');

    const record: PlaybookExecutionRecord = {
      executionId,
      playbookId,
      playbookName: playbook.name,
      status: 'COMPLETED',
      triggeredBy,
      parameters,
      results,
      auditDigestHex,
      executedAtIso: new Date().toISOString(),
      durationMs
    };

    this.history.push(record);

    // Broadcast execution notification to fleet
    await mesh.publish('DIRECTOR_PLAYBOOK_EXECUTED', 'tum-central-director', {
      executionId,
      playbookId,
      auditDigestHex,
      status: 'COMPLETED'
    });

    return record;
  }
}
