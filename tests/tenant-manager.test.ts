/**
 * Tests for TenantManager (Multi-Tenant RBAC & Isolation Engine)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TenantManager } from '../src/main/tenant-manager.js';

test('TenantManager: Registers standard sovereign tenants on initialization', () => {
  const tenants = TenantManager.listTenants();
  assert.ok(tenants.length >= 5, 'Should have at least 5 standard tenants');
  
  const holdings = TenantManager.getTenant('tum-holdings');
  assert.ok(holdings, 'Holdings parent tenant should exist');
  assert.equal(holdings?.category, 'HOLDINGS');

  const trust = TenantManager.getTenant('tum-trust');
  assert.ok(trust, 'Trust security subsidiary tenant should exist');

  const enterprise = TenantManager.getTenant('enterprise-client-alpha');
  assert.ok(enterprise, 'Enterprise client tenant should exist');
  assert.equal(enterprise?.category, 'ENTERPRISE_CLIENT');
});

test('TenantManager: Enforces role hierarchy in access validation', () => {
  // CISO can access AUDITOR level requests
  const cisoVerdict = TenantManager.validateAccess('user_lead_ciso', 'tum-holdings', 'AUDITOR');
  assert.equal(cisoVerdict.allowed, true);

  // Register an auditor user
  TenantManager.registerUser({
    userId: 'user_auditor_01',
    tenantId: 'tum-trust',
    displayName: 'External Compliance Auditor',
    role: 'AUDITOR'
  });

  // Auditor cannot perform CISO-level operations
  const auditorVerdict = TenantManager.validateAccess('user_auditor_01', 'tum-trust', 'CISO');
  assert.equal(auditorVerdict.allowed, false);
  assert.match(auditorVerdict.reason, /Insufficient role privileges/);
});

test('TenantManager: Blocks cross-tenant boundary violations for non-super tenants', () => {
  // User belongs to tum-trust, tries to access enterprise-client-alpha
  const crossVerdict = TenantManager.validateAccess('user_auditor_01', 'enterprise-client-alpha', 'AUDITOR');
  assert.equal(crossVerdict.allowed, false);
  assert.match(crossVerdict.reason, /Cross-tenant isolation violation/);

  // Holdings super-tenant can access any subsidiary
  const superVerdict = TenantManager.validateAccess('user_pasit_ceo', 'tum-trust', 'BOARD_EXECUTIVE');
  assert.equal(superVerdict.allowed, true);
});

test('TenantManager: Filters events strictly within tenant boundaries', () => {
  const mockEvents = [
    { tenantId: 'tum-trust', worktree: 'D:/TUM/tum-trust-security', detail: 'Event 1' },
    { tenantId: 'tum-socs', worktree: 'D:/TUM/tum-socs', detail: 'Event 2' },
    { tenantId: 'enterprise-client-alpha', worktree: 'D:/TUM/tum-agentic-workos', detail: 'Event 3' }
  ];

  const trustEvents = TenantManager.filterEventsForTenant(mockEvents, 'tum-trust');
  assert.equal(trustEvents.length, 1);
  assert.equal(trustEvents[0].detail, 'Event 1');

  // tum-holdings sees all
  const allEvents = TenantManager.filterEventsForTenant(mockEvents, 'tum-holdings');
  assert.equal(allEvents.length, 3);
});
