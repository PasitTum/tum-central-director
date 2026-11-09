# Task Assignment: Worker M5, M6 & M7 (Cybermesh, Trust-Fabric & Central-Director)

## Scope & File Ownership
You exclusively own:
- `D:\TUM\setup-product\tum-cybermesh\` (M5)
- `D:\TUM\setup-product\tum-trust-fabric\` (M6)
- `D:\TUM\setup-product\tum-central-director\` (M7)

Do NOT write to any other product directory.

Read:
- `D:\TUM\tum-central-director\.agents\teamwork\ORIGINAL_REQUEST.md`
- `D:\TUM\tum-central-director\PROJECT.md`
- `D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_3\survey_report.md`
- `D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_3\handoff.md`

## Tasks for M5 (Tum-Cybermesh):
1. In `D:\TUM\setup-product\tum-cybermesh\sensor-agent\`:
   - Add direct launcher scripts `tum-sensor-agent.cmd` and `tum-sensor-agent.ps1` for immediate CLI invocation without deep path navigation.
2. In `D:\TUM\setup-product\tum-cybermesh\`:
   - Provide standard `README.md` and `INSTALL.md` with step-by-step setup, agent deployment runbooks for Windows and Linux, SOAR firewall configuration, and verification procedures.
   - Run existing `smoke-test.ps1` and verify it passes cleanly with exit code 0.

## Tasks for M6 (Tum-Trust-Fabric):
1. In `D:\TUM\setup-product\tum-trust-fabric\docker-appliance\`:
   - Package offline container archive `sovereign-corridor-gateway-offline.tar.gz` (packaged container deployment bundle containing appliance context, compose file, offline ICAO PKI trust anchors, proto, and start scripts).
2. In `D:\TUM\setup-product\tum-trust-fabric\`:
   - Provide comprehensive deployment manual `INSTALL.md`, `README.md`, and `INSTALL_AND_QUICKSTART_GUIDE.md` detailing border corridor lane parameters, ICAO Doc 9303 CSCA Trust Store configuration, Passive Authentication, and gRPC integration.
   - Run existing `smoke-test.ps1` (updating if needed to assert offline archive and install guide) and verify it passes with exit code 0.

## Tasks for M7 (Tum-Central-Director):
Construct the turnkey deliverable in `D:\TUM\setup-product\tum-central-director\`:
1. `desktop-app/`:
   - Assemble `TUM-Central-Director.exe` (249MB Electron runtime from `D:\TUM\tum-central-director\node_modules\electron\dist`), DLLs, paks, locales, and `resources\app\` directory.
   - Place `package.json` (pointing to `dist/main/electron-main.js`) and compiled `dist/` (including `dist/main/`, `dist/renderer/index.html`, `dist/shared/`, `dist/cli/`) into `desktop-app\resources\app\`.
2. Root launchers & guides:
   - Provide `launch-desktop.cmd` and `launch-desktop.ps1`.
   - Provide comprehensive `INSTALL.md`, `README.md`, and `INSTALL_AND_QUICKSTART_GUIDE.md`.
   - Provide automated `smoke-test.ps1` verifying `TUM-Central-Director.exe`, main script, Web HUD, launchers, and guide.
   - Run `smoke-test.ps1` and verify it passes with exit code 0.

Write your completion handoff to `D:\TUM\tum-central-director\.agents\teamwork\worker_m5_m6_m7\handoff.md`.


## 2026-11-09T16:54:18Z
You are Worker M5, M6 & M7.
Your working directory is: D:\TUM\tum-central-director\.agents\teamwork\worker_m5_m6_m7
Read D:\TUM\tum-central-director\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Read your task assignment at: D:\TUM\tum-central-director\.agents\teamwork\worker_m5_m6_m7\DISPATCH.md
Read project specification at: D:\TUM\tum-central-director\PROJECT.md
Read survey report at: D:\TUM\tum-central-director\.agents\teamwork\explorer_survey_3\survey_report.md
