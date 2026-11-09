/**
 * Tests for AttackMapEngine (Visual Attack Map & Dynamic Fleet Threat Topology)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AttackMapEngine } from '../src/main/attack-map-engine.js';

test('AttackMapEngine: Initializes default topology with 6 fleet nodes and quantum shields', () => {
  AttackMapEngine.initializeDefaultTopology();
  const topology = AttackMapEngine.getTopology();

  assert.equal(topology.nodes.length, 6, 'Should have 6 federated fleet nodes');
  assert.ok(topology.edges.length >= 5, 'Should have active network topology edges');
  assert.equal(topology.summary.quantumSecured, 6, 'All nodes must have Quantum Shield active');

  const hub = AttackMapEngine.getNode('tum-holdings');
  assert.ok(hub, 'TUM Holdings hub must exist');
  assert.equal(hub?.category, 'CENTRAL_DIRECTOR');
  assert.equal(hub?.status, 'HEALTHY');
  assert.ok(hub?.quantumShield.algorithm.includes('ML-DSA-65'));
});

test('AttackMapEngine: Records attack vectors and dynamically updates node threat risk', () => {
  AttackMapEngine.initializeDefaultTopology();

  const vector = AttackMapEngine.recordAttackVector({
    targetNodeId: 'client-alpha',
    category: 'TEST_EXPLOIT_PAYLOAD',
    payloadSummary: 'Test payload injection',
    riskScore: 95,
    verdict: 'BLOCKED'
  });

  assert.ok(vector.id.startsWith('atk_'));
  assert.equal(vector.targetNodeId, 'client-alpha');
  assert.equal(vector.verdict, 'BLOCKED');
  assert.ok(vector.pqcSignature.startsWith('mldsa65_'));

  const node = AttackMapEngine.getNode('client-alpha');
  assert.ok(node);
  assert.equal(node?.threatCount, 1);
  assert.ok(node!.riskScore > 15, 'Node risk score should increase');

  const live = AttackMapEngine.getLiveVectors(10);
  assert.ok(live.length >= 1);
  assert.equal(live[0].id, vector.id);
});

test('AttackMapEngine: Ingests Sentinel audit events and triggers live attack trace', () => {
  AttackMapEngine.initializeDefaultTopology();

  AttackMapEngine.handleSentinelAudit({
    timestamp: new Date().toISOString(),
    verdict: 'BLOCKED',
    riskScore: 92,
    threatCategory: 'REVERSE_SHELL_ATTEMPT',
    command: 'powershell -c "$client = New-Object System.Net.Sockets.TCPClient"',
    worktree: 'D:/TUM/tum-socs'
  }, 'tum-socs');

  const socs = AttackMapEngine.getNode('tum-socs');
  assert.ok(socs);
  assert.equal(socs?.threatCount, 2); // 1 baseline + 1 new
  assert.ok(socs!.lastIncident?.includes('REVERSE_SHELL_ATTEMPT'));
});

test('AttackMapEngine: Simulates attacks across the fleet with automatic mitigation', () => {
  AttackMapEngine.initializeDefaultTopology();

  const sim = AttackMapEngine.simulateAttack('tum-trust', 'AST_RCE');
  assert.ok(sim.id.startsWith('atk_'));
  assert.equal(sim.category, 'AST_REMOTE_EXECUTION');
  assert.equal(sim.verdict, 'BLOCKED');
  assert.ok(sim.mitigation.includes('AST Pipe-to-Shell Interceptor'));

  const trust = AttackMapEngine.getNode('tum-trust');
  assert.ok(trust);
  assert.equal(trust?.threatCount, 1);
});

test('AttackMapEngine: War-Room actions allow one-click node quarantine, token flush, and restore', async () => {
  AttackMapEngine.initializeDefaultTopology();

  // Quarantine node
  const quarantineRes = await AttackMapEngine.performNodeAction('client-alpha', 'quarantine');
  assert.equal(quarantineRes.success, true);
  assert.equal(quarantineRes.node.status, 'QUARANTINED');
  assert.equal(quarantineRes.node.riskScore, 100);

  // Edges should be ISOLATED
  const topology = AttackMapEngine.getTopology();
  const clientEdges = topology.edges.filter(e => e.source === 'client-alpha' || e.target === 'client-alpha');
  assert.ok(clientEdges.every(e => e.status === 'ISOLATED'), 'All client-alpha edges must be isolated');

  // Restore node
  const restoreRes = await AttackMapEngine.performNodeAction('client-alpha', 'restore');
  assert.equal(restoreRes.success, true);
  assert.equal(restoreRes.node.status, 'HEALTHY');
  assert.equal(restoreRes.node.riskScore, 0);

  const restoredTopology = AttackMapEngine.getTopology();
  const restoredEdges = restoredTopology.edges.filter(e => e.source === 'client-alpha' || e.target === 'client-alpha');
  assert.ok(restoredEdges.every(e => e.status === 'ACTIVE'), 'All client-alpha edges must be restored to ACTIVE');
});
