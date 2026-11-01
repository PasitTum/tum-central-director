/**
 * Tests for ReportGenerator (One-Click Executive Audit Report Generator)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ReportGenerator } from '../src/main/report-generator.js';

test('ReportGenerator: Generates Executive HTML report with tamper-evident attestation', async () => {
  const report = await ReportGenerator.generateReport({
    tenantId: 'tum-holdings',
    format: 'html',
    title: 'Executive Board Q4 Cyber Audit'
  });

  assert.ok(report.reportId.startsWith('rep_'), 'Should produce report ID');
  assert.equal(report.format, 'html');
  assert.ok(report.content.includes('SOVEREIGN AGENTOS'), 'Should include brand header');
  assert.ok(report.content.includes('NIST FIPS 204 ML-DSA-65'), 'Should include quantum standard');
  assert.ok(report.content.includes('Pasit') && report.content.includes('Chairman'), 'Should include CEO sign-off');
  assert.ok(report.sha256Digest.length === 64, 'Should compute valid SHA-256 digest');
  assert.ok(report.pqcSignature.startsWith('mldsa65_'), 'Should attach ML-DSA-65 attestation signature');
  assert.ok(report.metrics.fleetProductsActive >= 5, 'Should track active products in fleet');
});

test('ReportGenerator: Generates RFC-4180 CSV report for spreadsheet analysis', async () => {
  const report = await ReportGenerator.generateReport({
    tenantId: 'tum-trust',
    format: 'csv'
  });

  assert.equal(report.format, 'csv');
  assert.ok(report.content.includes('"Timestamp","Verdict","Threat Category"'), 'Should have CSV header row');
  assert.ok(report.content.includes('Report ID: ' + report.reportId), 'Should have metadata comments');
  assert.equal(report.tenantId, 'tum-trust');
});

test('ReportGenerator: Generates machine-readable SOC2/ISO27001 JSON manifest', async () => {
  const report = await ReportGenerator.generateReport({
    tenantId: 'tum-socs',
    format: 'json'
  });

  assert.equal(report.format, 'json');
  const parsed = JSON.parse(report.content);
  assert.equal(parsed.reportId, report.reportId);
  assert.equal(parsed.tenant.id, 'tum-socs');
  assert.ok(Array.isArray(parsed.metadata.complianceFrameworks));
  assert.ok(parsed.metadata.complianceFrameworks.includes('SOC2_TYPE_II'));
  assert.ok(parsed.metrics.totalAutomatedTests >= 400);
});
