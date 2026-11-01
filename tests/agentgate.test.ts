import test from 'node:test';
import assert from 'node:assert';
import { AgentGateEngine } from '../src/main/agentgate.js';

test('AgentGate: Successfully mints Delegated Agent Credential (DAC)', () => {
  AgentGateEngine.reset();
  const cred = AgentGateEngine.mintCredential({
    humanSponsor: 'คุณ Pasit (CEO)',
    agentId: 'agent_quantum_01',
    role: 'Quantum Crypto Engineer',
    maxTokenBudgetUsd: 100.00
  });

  assert.ok(cred.tokenId.startsWith('dac_'));
  assert.strictEqual(cred.issuerHuman.name, 'คุณ Pasit (CEO)');
  assert.strictEqual(cred.agentProfile.agentId, 'agent_quantum_01');
  assert.strictEqual(cred.cryptographicProof.algorithm, 'NIST_FIPS_204_ML_DSA_65');
  assert.ok(cred.cryptographicProof.signature.startsWith('mldsa65_'));
});

test('AgentGate: Verifies authentic DAC token with intact cryptographic proof', () => {
  AgentGateEngine.reset();
  const cred = AgentGateEngine.mintCredential({
    humanSponsor: 'กรรมการผู้จัดการ',
    agentId: 'agent_trust_01',
    role: 'Identity Verification Specialist'
  });

  const verification = AgentGateEngine.verifyCredential(cred.tokenId);
  assert.strictEqual(verification.valid, true);
  assert.strictEqual(verification.credential?.tokenId, cred.tokenId);
});

test('AgentGate: Instantly denies revoked credentials globally', () => {
  AgentGateEngine.reset();
  const cred = AgentGateEngine.mintCredential({
    humanSponsor: 'CISO Office',
    agentId: 'agent_temp_01',
    role: 'Temporary Code Auditor'
  });

  const beforeRevoke = AgentGateEngine.verifyCredential(cred.tokenId);
  assert.strictEqual(beforeRevoke.valid, true);

  AgentGateEngine.revokeCredential(cred.tokenId);

  const afterRevoke = AgentGateEngine.verifyCredential(cred.tokenId);
  assert.strictEqual(afterRevoke.valid, false);
  assert.strictEqual(afterRevoke.reason, 'TOKEN_REVOKED_BY_ADMIN');
});

test('AgentGate: Tampered DAC signature fails cryptographic verification', () => {
  AgentGateEngine.reset();
  const cred = AgentGateEngine.mintCredential({
    humanSponsor: 'Sponsor',
    agentId: 'agent_01',
    role: 'Role'
  });

  // Tamper with signature
  cred.cryptographicProof.signature = 'mldsa65_tampered_invalid_signature_bytes';

  const verification = AgentGateEngine.verifyCredential(cred.tokenId);
  assert.strictEqual(verification.valid, false);
  assert.strictEqual(verification.reason, 'CRYPTOGRAPHIC_SIGNATURE_INVALID');
});
