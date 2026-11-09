# Task Assignment: Worker M3 & M4 (OpenSIEM & Agentic-WorkOS)

## Scope & File Ownership
You exclusively own:
- `D:\TUM\setup-product\tum-socs\` (M3)
- `D:\TUM\setup-product\tum-agentic-workos\` (M4)

Do NOT write to any other product directory.

Read:
- `D:\TUM\tum-central-director\.agents\teamwork\ORIGINAL_REQUEST.md`
- `D:\TUM\tum-central-director\PROJECT.md`
- `D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_2\survey_report.md`
- `D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_2\handoff.md`

## Tasks for M3 (Tum-Socs):
1. In `D:\TUM\setup-product\tum-socs\docker-appliance\`:
   - Package offline container archive `tum-opensiem-appliance-offline.tar.gz` (packaged container deployment bundle containing Dockerfile, docker-compose.yml, ClickHouse sink configs, SigmaHQ rules, server binaries, and Web HUD assets).
   - Add `start-appliance.ps1` and `start-appliance.sh` for one-click startup.
2. In `D:\TUM\setup-product\tum-socs\`:
   - Create dedicated `hallmark-console/` directory containing the standalone Web HUD visualizer from `D:\TUM\tum-socs\visualizers\index.html` (35KB zero-dependency console), plus launcher scripts `launch-console.cmd`, `launch-console.ps1`, `launch-console.sh`.
   - In `desktop-app/`: provide `install-desktop.ps1` and `launch-desktop.cmd`.
   - Provide standard `README.md` and `INSTALL.md` satisfying acceptance criteria.
   - Update `smoke-test.ps1` to assert `TUM-OpenSIEM.exe`, offline container archive, Hallmark Console HUD, and exit 0. Run the smoke test and verify it passes.

## Tasks for M4 (Tum-Agentic-Workos):
Construct the complete turnkey deliverable structure into `D:\TUM\setup-product\tum-agentic-workos\`:
1. `erp-console/`:
   - Copy Standalone Web Admin ERP Console HUD from `D:\TUM\tum-agentic-workos\src\presentation\hud\index.html` (41.9 KB 4-tab HUD: P2P 3-Way Match, e-Tax Invoice, GL Ledger, DAC Credentials).
   - Add `launch-console.cmd`, `launch-console.ps1`, and `launch-console.sh`.
2. `etax-v2.1-sandbox/`:
   - Package Thai Revenue e-Tax XML ETDA v2.1 integration package: runnable `validate-schema.ts`, `run-validation.ps1`, `run-validation.sh`, `ETDA_V2_1_SPECIFICATION.md`, and canonical XML sample files (`canonical-tax-invoice-T03.xml`, `canonical-credit-note-81.xml`, `invalid-tax-id-fraud.xml`).
3. `app/`:
   - Package the pre-compiled application runtime: `dist/`, `package.json`, `bin/workos.js`, `workos.cmd`, `Dockerfile`, `docker-compose.yml`, `start-server.ps1`, `start-server.sh`.
4. Root documents and verification:
   - Provide comprehensive `INSTALL.md` and `README.md`.
   - Provide automated `smoke-test.ps1` and `smoke-test.sh` verifying all components. Run `smoke-test.ps1` and verify it passes cleanly with exit code 0.

Write your completion handoff to `D:\TUM\tum-central-director\.agents\teamwork\worker_m3_m4\handoff.md`.


## 2026-11-09T16:54:11Z
[Message] timestamp=2026-11-09T16:54:11Z sender=4e259946-20b0-4bb0-8cbd-76cbbf0025dd priority=MESSAGE_PRIORITY_HIGH content=You are Worker M3 & M4.
Your working directory is: D:\TUM\tum-central-director\.agents\teamwork\worker_m3_m4
Read D:\TUM\tum-central-director\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Read your task assignment at: D:\TUM\tum-central-director\.agents\teamwork\worker_m3_m4\DISPATCH.md
Read project specification at: D:\TUM\tum-central-director\PROJECT.md
Read survey report at: D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_2\survey_report.md


## 2026-11-09T17:09:02Z
[Message] timestamp=2026-11-09T17:09:02Z sender=4e259946-20b0-4bb0-8cbd-76cbbf0025dd priority=MESSAGE_PRIORITY_HIGH content=**Context**: Milestones M3 & M4 Turnkey Implementation
**Content**: We observed that D:\TUM\setup-product\tum-socs and D:\TUM\setup-product\tum-agentic-workos have been populated with turnkey assets, offline archives, and smoke tests. Please report your completion status and write handoff.md.
**Action**: Finalize handoff.md and send completion report.
