# Task Assignment: E2E Test Writer

## Mission
Design and implement the Master E2E Testing Track for all 7 TUM Group products in `D:\TUM\setup-product`.
You are derived from user requirements in `ORIGINAL_REQUEST.md` and `PROJECT.md`, NOT implementation design.

Read:
- `D:\TUM\tum-central-director\.agents\teamwork\ORIGINAL_REQUEST.md`
- `D:\TUM\tum-central-director\PROJECT.md`

## Responsibilities
1. Create `D:\TUM\setup-product\TEST_INFRA.md` covering:
   - Test philosophy (opaque-box, requirement-driven, progressive testability)
   - Feature inventory coverage mapping (all 30 features from PROJECT.md)
   - 4-Tier test architecture:
     * Tier 1: Feature Coverage (>=5 test cases per product/feature)
     * Tier 2: Boundary & Corner Cases (>=5 test cases per product)
     * Tier 3: Cross-Feature / Cross-Product Integration
     * Tier 4: Real-World Enterprise Deployment Scenarios
2. Implement the automated master test suite and verification runner:
   - Create `D:\TUM\setup-product\verify-all.ps1` (and `verify-all.bat` or `.sh` if applicable) that programmatically executes and validates all 7 product directories, checking:
     * Directory existence and integrity
     * Executable presence and size thresholds (.exe files)
     * Offline container archive validity (.tar/.tar.gz archives)
     * Documentation completeness (`INSTALL.md`, `README.md`)
     * Execution of individual product `smoke-test.ps1` scripts with exit code verification
3. Publish `D:\TUM\setup-product\TEST_READY.md` when complete, summarizing test runner commands, coverage table by tier, and feature checklist.

Write your completion handoff to `D:\TUM\tum-central-director\.agents\teamwork\e2e_test_writer\handoff.md`.
## 2026-11-09T16:53:57Z
Received message from orchestrator (4e259946-20b0-4bb0-8cbd-76cbbf0025dd):
Scope:
Design and implement the Master E2E Testing Track for all 7 TUM Group products in D:\TUM\setup-product.
1. Create D:\TUM\setup-product\TEST_INFRA.md following the 4-tier methodology (Tier 1: Feature coverage >=5 per feature; Tier 2: Boundary/corner >=5 per feature; Tier 3: Cross-feature interactions; Tier 4: Real-world workloads).
2. Create automated master verification script D:\TUM\setup-product\verify-all.ps1 that validates all 7 product directories, executable existence, container archives, installation guides, and executes individual smoke tests.
3. Publish D:\TUM\setup-product\TEST_READY.md when complete.
4. Run your verification test suite and ensure it functions cleanly.

Write your completion handoff to D:\TUM\tum-central-director\.agents\teamwork\e2e_test_writer\handoff.md and notify the orchestrator.
## 2026-11-09T17:08:57Z
Received message from orchestrator (4e259946-20b0-4bb0-8cbd-76cbbf0025dd):
**Context**: Milestone M8 Test Infra & Readiness
**Content**: We observed that D:\TUM\setup-product\TEST_INFRA.md and TEST_READY.md have been published and verify-all.ps1 is in place. Please report your completion status and write handoff.md.
**Action**: Finalize handoff.md and send completion report.
