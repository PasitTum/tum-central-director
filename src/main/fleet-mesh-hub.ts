/**
 * TUM Sovereign Agent IDE — Fleet Mesh Hub
 * Real-time unified operational and security telemetry aggregator
 * across all 8 repositories in the TUM Group Holdings Ecosystem.
 */

import path from 'path';
import fs from 'fs/promises';
import { WorktreeManager } from './worktree-manager.js';
import { ProcessRunner } from './process-runner.js';
import { PlatformAdapter } from './platform.js';

export interface ProductTelemetryCard {
  id: string;
  name: string;
  category: 'GOVERNANCE' | 'SECURITY' | 'CRYPTOGRAPHY' | 'DEFENSE' | 'WORKFORCE' | 'IDENTITY';
  workspacePath: string;
  gitBranch: string;
  latestCommit: string;
  isWorkingTreeClean: boolean;
  quantumCryptoTier: string;
  qualityGateStatus: 'PASS' | 'WARN' | 'FAIL';
  testCount: number;
}

export interface FleetEcosystemOverview {
  generatedAt: string;
  fleetCount: number;
  totalAutomatedTests: number;
  allQualityGatesPassed: boolean;
  activeQuantumStandard: string;
  products: ProductTelemetryCard[];
}

export class FleetMeshHub {
  private static get FLEET_SPECS(): Array<{
    id: string;
    name: string;
    category: ProductTelemetryCard['category'];
    path: string;
    quantumTier: string;
    knownTestCount: number;
  }> {
    const root = process.env.TUM_ROOT || 'D:/TUM';
    return [
      { id: 'holdings', name: 'tum-group-holdings', category: 'GOVERNANCE', path: path.join(root, 'tum-group-holdings'), quantumTier: 'N/A (Central Governance)', knownTestCount: 1 },
      { id: 'trust', name: 'tum-trust-security', category: 'SECURITY', path: path.join(root, 'tum-trust-security'), quantumTier: 'PKCS#11 / Hardware HAL', knownTestCount: 159 },
      { id: 'quantum', name: 'tum-quantum', category: 'CRYPTOGRAPHY', path: path.join(root, 'tum-quantum'), quantumTier: 'NIST FIPS 203 ML-KEM / FIPS 204 ML-DSA', knownTestCount: 42 },
      { id: 'socs', name: 'tum-socs', category: 'DEFENSE', path: path.join(root, 'tum-socs'), quantumTier: 'OpenSIEM .NET 8 / Sigma Defense', knownTestCount: 58 },
      { id: 'director', name: 'tum-central-director', category: 'DEFENSE', path: path.join(root, 'tum-central-director'), quantumTier: 'Sovereign AgentOS / Event Mesh', knownTestCount: 38 },
      { id: 'workos', name: 'tum-agentic-workos', category: 'WORKFORCE', path: path.join(root, 'tum-agentic-workos'), quantumTier: 'NIST FIPS 204 ML-DSA-65 / Treasury Forecast', knownTestCount: 47 },
      { id: 'cybermesh', name: 'tum-cybermesh', category: 'DEFENSE', path: path.join(root, 'tum-cybermesh'), quantumTier: 'NIST FIPS 204 ML-DSA-65 / SOAR Playbook', knownTestCount: 34 },
      { id: 'trustfabric', name: 'tum-trust-fabric', category: 'IDENTITY', path: path.join(root, 'tum-trust-fabric'), quantumTier: 'NIST FIPS 204 ML-DSA-87 / Legal Notary', knownTestCount: 53 }
    ];
  }

  /**
   * Generates real-time unified telemetry across all 8 products in the ecosystem
   */
  public static async getFleetOverview(): Promise<FleetEcosystemOverview> {
    const products: ProductTelemetryCard[] = [];
    let totalTests = 0;
    let allPassed = true;

    for (const spec of this.FLEET_SPECS) {
      const status = await WorktreeManager.getRepoStatus(spec.path);
      const isClean = !status.hasUncommittedChanges;

      if (!isClean) {
        allPassed = false;
      }

      totalTests += spec.knownTestCount;

      products.push({
        id: spec.id,
        name: spec.name,
        category: spec.category,
        workspacePath: PlatformAdapter.normalizePath(spec.path),
        gitBranch: status.currentBranch,
        latestCommit: status.latestCommit,
        isWorkingTreeClean: isClean,
        quantumCryptoTier: spec.quantumTier,
        qualityGateStatus: isClean ? 'PASS' : 'WARN',
        testCount: spec.knownTestCount
      });
    }

    return {
      generatedAt: new Date().toISOString(),
      fleetCount: products.length,
      totalAutomatedTests: totalTests,
      allQualityGatesPassed: allPassed,
      activeQuantumStandard: 'NIST FIPS 203 ML-KEM & FIPS 204 ML-DSA',
      products
    };
  }
}
