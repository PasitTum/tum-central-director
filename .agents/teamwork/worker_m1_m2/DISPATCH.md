# Task Assignment: Worker M1 & M2 (Trust-Security & Quantum)

## Scope & File Ownership
You exclusively own:
- `D:\TUM\setup-product\tum-trust-security\` (M1)
- `D:\TUM\setup-product\tum-quantum\` (M2)

Do NOT write to any other product directory.

Read:
- `D:\TUM\tum-central-director\.agents\teamwork\ORIGINAL_REQUEST.md`
- `D:\TUM\tum-central-director\PROJECT.md`
- `D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_1\survey_report.md`
- `D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_1\handoff.md`

## Tasks for M1 (Tum-Trust-Security):
1. In `D:\TUM\setup-product\tum-trust-security\kiosk-diagnostics-console\`:
   - Package the standalone Electron Diagnostics executable (`TUM-Kiosk-Diagnostics.exe`) by utilizing the pre-built Electron runtime (available at `D:\TUM\tum-central-director\node_modules\electron\dist` or via electron/asar).
   - Ensure `TUM-Kiosk-Diagnostics.exe` and its supporting files (resources/app, DLLs, paks) are properly placed and runnable.
2. In `D:\TUM\setup-product\tum-trust-security\installer\`:
   - Decouple `install-kiosk-service.ps1` so it directly uses the pre-built `service-bin\Tum.Trust.KioskService.exe` without requiring dotnet build or source tree access.
3. In `D:\TUM\setup-product\tum-trust-security\`:
   - Provide standard `README.md` and `INSTALL.md` with step-by-step setup, hardware prerequisites (JavaCard, virtual camera), service installation, and troubleshooting.
   - Update `smoke-test.ps1` to assert `TUM-Kiosk-Diagnostics.exe`, `Tum.Trust.KioskService.exe`, WiX installer, HIL testbeds, and exit 0. Run the smoke test and verify it passes.

## Tasks for M2 (Tum-Quantum):
1. In `D:\TUM\setup-product\tum-quantum\docker-appliance\`:
   - Create the standard offline container archive `tum-quantum-gateway-offline.tar.gz` (packaged container deployment bundle containing Dockerfile, docker-compose.yml, NGINX configurations, PQC certificate generators, mock upstream, entrypoint scripts). Use `tar -czvf` or Python `tarfile`.
2. In `D:\TUM\setup-product\tum-quantum\`:
   - Copy or adapt the architecture manual from `D:\TUM\tum-quantum\docs\QUANTUM_READINESS_ENTERPRISE_BRIEFING.md` into `D:\TUM\setup-product\tum-quantum\ARCHITECTURE_MANUAL.md`.
   - Provide root deployment scripts `setup.ps1` and `setup.sh` for one-click setup.
   - Provide standard `README.md` and `INSTALL.md` with step-by-step setup, PQC algorithm details (NIST FIPS 203/204), container startup, and air-gapped deployment.
   - Update `smoke-test.ps1` to verify the offline archive, architecture manual, setup scripts, and exit 0. Run the smoke test and verify it passes.

Write your completion handoff to `D:\TUM\tum-central-director\.agents\teamwork\worker_m1_m2\handoff.md`.


## 2026-11-09T16:54:04Z
[Message] timestamp=2026-11-09T16:54:04Z sender=4e259946-20b0-4bb0-8cbd-76cbbf0025dd priority=MESSAGE_PRIORITY_HIGH content=You are Worker M1 & M2.
Your working directory is: D:\TUM\tum-central-director\.agents\teamwork\worker_m1_m2
Read D:\TUM\tum-central-director\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Read your task assignment at: D:\TUM\tum-central-director\.agents\teamwork\worker_m1_m2\DISPATCH.md
Read project specification at: D:\TUM\tum-central-director\PROJECT.md
Read survey report at: D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_1\survey_report.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You exclusively own:
- D:\TUM\setup-product\tum-trust-security\ (M1)
- D:\TUM\setup-product\tum-quantum\ (M2)

Implement all deliverables described in your DISPATCH.md:
1. M1: Package TUM-Kiosk-Diagnostics.exe in kiosk-diagnostics-console, decouple install-kiosk-service.ps1, provide INSTALL.md and README.md, update smoke-test.ps1 and run it to verify.
2. M2: Generate tum-quantum-gateway-offline.tar.gz in docker-appliance, copy ARCHITECTURE_MANUAL.md, provide setup.ps1/setup.sh, provide INSTALL.md and README.md, update smoke-test.ps1 and run it to verify.

Write your completion handoff to D:\TUM\tum-central-director\.agents\teamwork\worker_m1_m2\handoff.md and notify the orchestrator.
