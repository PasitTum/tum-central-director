import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PlaybookOrchestrator } from '../src/main/playbook-orchestrator.js';
import { FleetEventMesh } from '../src/main/event-mesh.js';
import { AgentGate } from '../src/main/agentgate.js';

test('PlaybookOrchestrator: Lists predefined sovereign incident response playbooks', () => {
  const playbooks = PlaybookOrchestrator.getPlaybooks();
  assert.ok(playbooks.length >= 4);

  const ir01 = playbooks.find((p) => p.id === 'IR-PLAYBOOK-01');
  assert.ok(ir01);
  assert.equal(ir01.severity, 'CRITICAL');
  assert.ok(ir01.mitigationActions.includes('DAC_FREEZE'));
});

test('PlaybookOrchestrator: Executes Fleet-Wide Containment and broadcasts to event mesh', async () => {
  const mesh = FleetEventMesh.getInstance();
  let containmentReceived = false;
  mesh.subscribe('CYBERMESH_SOAR_CONTAINMENT', 'test-sub-01', (event) => {
    containmentReceived = true;
    assert.equal(event.sourceRepo, 'tum-central-director');
  });

  const record = await PlaybookOrchestrator.executePlaybook('IR-PLAYBOOK-01', {
    targetAgentId: 'agent-rogue-007',
    reason: 'Compromised LSASS credential dump detected'
  }, 'SECURITY_LEAD');

  assert.equal(record.status, 'COMPLETED');
  assert.equal(record.playbookId, 'IR-PLAYBOOK-01');
  assert.equal(record.results.containmentBroadcast, 'SUCCESS');
  assert.ok(record.auditDigestHex.length === 64);
  assert.ok(containmentReceived);

  mesh.unsubscribe('CYBERMESH_SOAR_CONTAINMENT', 'test-sub-01');
});

test('PlaybookOrchestrator: Executes Credential Revocation playbook and revokes DAC in AgentGate', async () => {
  const dac = AgentGate.mint({
    agentId: 'agent-suspect-01',
    role: 'PROCUREMENT_OPERATOR',
    humanSponsor: 'Security Lead'
  });

  assert.equal(AgentGate.verify(dac.tokenId).valid, true);

  const record = await PlaybookOrchestrator.executePlaybook('IR-PLAYBOOK-02', {
    tokenId: dac.tokenId,
    reason: 'Unauthorized disbursement attempt'
  });

  assert.equal(record.status, 'COMPLETED');
  assert.equal(record.results.revocationStatus, 'REVOKED');
  assert.equal(AgentGate.verify(dac.tokenId).valid, false);
});

test('PlaybookOrchestrator: Maintains execution history audit trail', () => {
  const history = PlaybookOrchestrator.getExecutionHistory();
  assert.ok(history.length >= 2);
  assert.ok(history[0].executionId.startsWith('exec_'));
  assert.ok(history[0].auditDigestHex.length === 64);
});
