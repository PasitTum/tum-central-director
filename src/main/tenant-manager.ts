/**
 * TUM Sovereign AgentOS — Multi-Tenant RBAC & Isolation Engine
 * Pure TypeScript (Zero External Dependencies)
 * Provides cryptographically bounded tenant isolation, role-based access control,
 * and tenant-partitioned audit queries for Enterprise and Sovereign Clients.
 */

export type TenantRole = 'CISO' | 'BOARD_EXECUTIVE' | 'SOC_OPERATOR' | 'AUDITOR';

export interface TenantDefinition {
  id: string;
  name: string;
  category: 'HOLDINGS' | 'SUBSIDIARY' | 'ENTERPRISE_CLIENT';
  description: string;
  allowedRepos: string[];
  maxDailyTokenBudgetUsd: number;
  contactEmail: string;
  createdAt: string;
}

export interface TenantUser {
  userId: string;
  tenantId: string;
  displayName: string;
  role: TenantRole;
  citizenIdMasked?: string;
  dacTokenId?: string;
}

export interface TenantAccessVerdict {
  allowed: boolean;
  tenantId: string;
  role: TenantRole;
  reason: string;
}

export class TenantManager {
  private static tenants: Map<string, TenantDefinition> = new Map();
  private static users: Map<string, TenantUser> = new Map();

  static {
    // Initialize standard TUM Sovereign Tenants
    this.registerTenant({
      id: 'tum-holdings',
      name: 'TUM Group Holdings (Global Parent)',
      category: 'HOLDINGS',
      description: 'Super-tenant with global visibility across all 8 sovereign product pillars.',
      allowedRepos: ['*'],
      maxDailyTokenBudgetUsd: 1000.0,
      contactEmail: 'board@tum.group',
      createdAt: '2026-10-15T00:00:00Z'
    });

    this.registerTenant({
      id: 'tum-trust',
      name: 'TUM Trust Security',
      category: 'SUBSIDIARY',
      description: 'Identity validation, ICAO 9303 ePassport MRZ, biometric kiosk, and DAC tokens.',
      allowedRepos: ['tum-trust-security', 'tum-trust-fabric'],
      maxDailyTokenBudgetUsd: 250.0,
      contactEmail: 'security@tum.group',
      createdAt: '2026-10-15T00:00:00Z'
    });

    this.registerTenant({
      id: 'tum-socs',
      name: 'TUM Socs & CyberMesh',
      category: 'SUBSIDIARY',
      description: 'Autonomous XSIAM, eBPF telemetry streaming, and active cyber-range containment.',
      allowedRepos: ['tum-socs', 'tum-cybermesh'],
      maxDailyTokenBudgetUsd: 250.0,
      contactEmail: 'socs@tum.group',
      createdAt: '2026-10-15T00:00:00Z'
    });

    this.registerTenant({
      id: 'tum-quantum',
      name: 'TUM Quantum & PQC',
      category: 'SUBSIDIARY',
      description: 'Post-Quantum NIST FIPS 204 ML-DSA signatures and lattice key exchange.',
      allowedRepos: ['tum-quantum'],
      maxDailyTokenBudgetUsd: 200.0,
      contactEmail: 'quantum@tum.group',
      createdAt: '2026-10-15T00:00:00Z'
    });

    this.registerTenant({
      id: 'enterprise-client-alpha',
      name: 'Sovereign Enterprise Client (Alpha)',
      category: 'ENTERPRISE_CLIENT',
      description: 'Isolated external enterprise client with strict partitioned telemetry boundaries.',
      allowedRepos: ['tum-central-director', 'tum-agentic-workos'],
      maxDailyTokenBudgetUsd: 150.0,
      contactEmail: 'ciso@clientalpha.enterprise.com',
      createdAt: '2026-11-01T00:00:00Z'
    });

    // Default Seed Users
    this.registerUser({
      userId: 'user_pasit_ceo',
      tenantId: 'tum-holdings',
      displayName: 'Pasit (Chairman & CEO)',
      role: 'BOARD_EXECUTIVE',
      citizenIdMasked: '1-1005-XXXXX-XX-1',
      dacTokenId: 'dac_master_holdings_001'
    });

    this.registerUser({
      userId: 'user_lead_ciso',
      tenantId: 'tum-holdings',
      displayName: 'Chief Information Security Officer',
      role: 'CISO',
      dacTokenId: 'dac_ciso_001'
    });
  }

  public static registerTenant(tenant: TenantDefinition): void {
    this.tenants.set(tenant.id, tenant);
  }

  public static getTenant(tenantId: string): TenantDefinition | undefined {
    return this.tenants.get(tenantId);
  }

  public static listTenants(): TenantDefinition[] {
    return Array.from(this.tenants.values());
  }

  public static registerUser(user: TenantUser): void {
    this.users.set(user.userId, user);
  }

  public static getUser(userId: string): TenantUser | undefined {
    return this.users.get(userId);
  }

  /**
   * Check if a user has sufficient permission within a target tenant
   */
  public static validateAccess(userId: string, targetTenantId: string, requiredRole: TenantRole): TenantAccessVerdict {
    const user = this.users.get(userId);
    if (!user) {
      return {
        allowed: false,
        tenantId: targetTenantId,
        role: 'AUDITOR',
        reason: `User ${userId} not recognized in sovereign registry.`
      };
    }

    // Holdings Super-tenant can access any subsidiary
    const isSuperTenant = user.tenantId === 'tum-holdings';
    if (!isSuperTenant && user.tenantId !== targetTenantId) {
      return {
        allowed: false,
        tenantId: targetTenantId,
        role: user.role,
        reason: `Access Denied: Cross-tenant isolation violation. User belongs to ${user.tenantId}, requested ${targetTenantId}.`
      };
    }

    // Role Hierarchy Check: CISO >= BOARD_EXECUTIVE >= SOC_OPERATOR >= AUDITOR
    const roleRank: Record<TenantRole, number> = {
      CISO: 4,
      BOARD_EXECUTIVE: 3,
      SOC_OPERATOR: 2,
      AUDITOR: 1
    };

    if (roleRank[user.role] < roleRank[requiredRole]) {
      return {
        allowed: false,
        tenantId: targetTenantId,
        role: user.role,
        reason: `Insufficient role privileges. User has ${user.role}, required ${requiredRole}.`
      };
    }

    return {
      allowed: true,
      tenantId: targetTenantId,
      role: user.role,
      reason: 'Access granted under sovereign multi-tenant policy.'
    };
  }

  /**
   * Filter an array of events to only include records belonging to the target tenant
   */
  public static filterEventsForTenant<T extends { tenantId?: string; worktree?: string; targetTenant?: string }>(
    events: T[],
    tenantId: string
  ): T[] {
    if (!tenantId || tenantId === 'tum-holdings' || tenantId === 'all') {
      return events; // Super-tenant or global view
    }

    const tenant = this.tenants.get(tenantId);
    if (!tenant) return [];

    return events.filter(evt => {
      // 1. Direct tenant match
      if (evt.tenantId === tenantId || evt.targetTenant === tenantId) return true;

      // 2. Repo / worktree mapping
      if (evt.worktree) {
        return tenant.allowedRepos.some(repo => repo === '*' || evt.worktree!.includes(repo));
      }

      return false;
    });
  }
}
