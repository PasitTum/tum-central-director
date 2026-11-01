import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { FleetMeshHub } from '../src/main/fleet-mesh-hub.js';
import { createDaemonServer } from '../src/main/daemon.js';

test('FleetMeshHub: Aggregates real-time telemetry across all 8 TUM products', async () => {
  const overview = await FleetMeshHub.getFleetOverview();

  assert.equal(overview.fleetCount, 8);
  assert.ok(overview.totalAutomatedTests >= 400);
  assert.equal(overview.activeQuantumStandard, 'NIST FIPS 203 ML-KEM & FIPS 204 ML-DSA');

  // Verify all 8 product names
  const expectedNames = [
    'tum-group-holdings',
    'tum-trust-security',
    'tum-quantum',
    'tum-socs',
    'tum-central-director',
    'tum-agentic-workos',
    'tum-cybermesh',
    'tum-trust-fabric'
  ];

  for (const name of expectedNames) {
    const prod = overview.products.find(p => p.name === name);
    assert.ok(prod, `Product ${name} must be present in fleet overview`);
    assert.ok(prod?.gitBranch, `Product ${name} must have git branch`);
    assert.ok(prod?.testCount > 0, `Product ${name} must have registered tests`);
  }
});

test('Daemon Server: Exposes /api/fleet/overview and /api/fleet/health endpoints', async () => {
  const server = createDaemonServer();
  await new Promise<void>(resolve => server.listen(0, resolve));
  const port = (server.address() as any).port;

  try {
    // 1. GET /api/fleet/health
    const healthRes = await fetch(`http://127.0.0.1:${port}/api/fleet/health`);
    assert.equal(healthRes.status, 200);
    const healthData: any = await healthRes.json();
    assert.equal(healthData.productsCount, 8);
    assert.ok(healthData.totalAutomatedTests >= 400);

    // 2. GET /api/fleet/overview
    const overviewRes = await fetch(`http://127.0.0.1:${port}/api/fleet/overview`);
    assert.equal(overviewRes.status, 200);
    const overviewData: any = await overviewRes.json();
    assert.equal(overviewData.fleetCount, 8);
    assert.equal(overviewData.products.length, 8);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
