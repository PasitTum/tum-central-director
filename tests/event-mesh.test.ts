import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { FleetEventMesh, FleetEvent } from '../src/main/event-mesh.js';

describe('FleetEventMesh (DIRECTOR-EVENT-MESH-01)', () => {
  let mesh: FleetEventMesh;

  beforeEach(() => {
    mesh = FleetEventMesh.getInstance();
    mesh.clear();
  });

  it('successfully publishes event and generates cryptographic signature', async () => {
    const published = await mesh.publish(
      'CYBERMESH_SOAR_CONTAINMENT',
      'tum-cybermesh',
      { incidentId: 'INC-7001', technique: 'T1486', host: 'srv-finance-01' }
    );

    assert.ok(published.id.startsWith('EVT-'));
    assert.strictEqual(published.topic, 'CYBERMESH_SOAR_CONTAINMENT');
    assert.strictEqual(published.sourceRepo, 'tum-cybermesh');
    assert.strictEqual(published.payload.technique, 'T1486');
    assert.ok(published.signatureSha256.length === 64);
  });

  it('delivers events to registered subscribers asynchronously', async () => {
    const received: FleetEvent[] = [];

    mesh.subscribe('WORKOS_TREASURY_CRUNCH', 'test-subscriber-1', (ev) => {
      received.push(ev);
    });

    await mesh.publish('WORKOS_TREASURY_CRUNCH', 'tum-agentic-workos', {
      deficitDay: 5,
      deficitThb: 1500000
    });

    assert.strictEqual(received.length, 1);
    assert.strictEqual(received[0].topic, 'WORKOS_TREASURY_CRUNCH');
    assert.strictEqual(received[0].payload.deficitDay, 5);
  });

  it('unsubscribes listeners cleanly without affecting other subscribers', async () => {
    let callCount = 0;

    mesh.subscribe('TRUST_FABRIC_CITIZEN_CLEARED', 'sub-a', () => {
      callCount++;
    });

    await mesh.publish('TRUST_FABRIC_CITIZEN_CLEARED', 'tum-trust-fabric', { citizenId: '1100' });
    assert.strictEqual(callCount, 1);

    mesh.unsubscribe('TRUST_FABRIC_CITIZEN_CLEARED', 'sub-a');
    await mesh.publish('TRUST_FABRIC_CITIZEN_CLEARED', 'tum-trust-fabric', { citizenId: '1100' });
    assert.strictEqual(callCount, 1); // Should not increase
  });

  it('maintains ring buffer history of recent events', async () => {
    for (let i = 0; i < 5; i++) {
      await mesh.publish('QUANTUM_KEY_ROTATED', 'tum-quantum', { keyIndex: i });
    }

    const history = mesh.getHistory(3);
    assert.strictEqual(history.length, 3);
    assert.strictEqual(history[2].payload.keyIndex, 4);
  });
});
