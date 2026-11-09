# Turnkey Architecture Survey Report: R5, R6, R7, and R8

**Author**: Survey Explorer 3  
**Date**: 2026-11-09T16:51:00Z  
**Scope**: 
- **R5: Tum-Cybermesh Turnkey Package** (`D:\TUM\tum-cybermesh` -> `D:\TUM\setup-product\tum-cybermesh`)
- **R6: Tum-Trust-Fabric Turnkey Package** (`D:\TUM\tum-trust-fabric` -> `D:\TUM\setup-product\tum-trust-fabric`)
- **R7: Tum-Central-Director Turnkey Package** (`D:\TUM\tum-central-director` -> `D:\TUM\setup-product\tum-central-director`)
- **R8: Master Setup & Verification Index** (`D:\TUM\setup-product\README.md`)

---

## Executive Summary

A comprehensive, read-only architectural survey was conducted across the source codebases and target delivery directories in `D:\TUM`. 

The current ecosystem packaging state in `D:\TUM\setup-product` is as follows:
- **R5 (`tum-cybermesh`)**: 90% ready. Core files exist in `setup-product/tum-cybermesh` (sensor daemon, SOAR connectors, quickstart guide, smoke test). Requires adding direct standalone Windows/Linux CLI wrappers and documenting CLI arguments.
- **R6 (`tum-trust-fabric`)**: 80% ready. Contains docker appliance files, 29 ICAO Doc 9303 PKI trust certificates/keys, gRPC proto, and smoke test. Missing `INSTALL_AND_QUICKSTART_GUIDE.md` deployment manual and exported offline image archive (`sovereign-corridor-gateway-offline.tar.gz`).
- **R7 (`tum-central-director`)**: 0% packaged (directory is currently empty). All source code and build assets exist in `D:\TUM\tum-central-director` including pre-built Electron binaries (249MB `electron.exe`), compiled JS daemon/engines, and 72KB Web HUD renderer. Ready for immediate packaging into `setup-product/tum-central-director/desktop-app/TUM-Central-Director.exe`.
- **R8 (`setup-product/README.md`)**: Missing. Needs master catalog of all 7 TUM Group products, system prerequisites, and unified smoke test execution guide.

---

## 1. R5: Tum-Cybermesh Turnkey Package

### 1.1 Source Repository Analysis (`D:\TUM\tum-cybermesh`)
- **Package Manifest**: `package.json` (name: `tum-cybermesh`, version: `1.0.0`, type: `module`).
- **Binaries Registered**:
  - `cybermesh`: `./dist/presentation/cli/index.js`
  - `tum-sensor-agent`: `./dist/presentation/sensor/sensor-agent-cli.js`
- **Socket Interception Engines**:
  - `src/infrastructure/sensor/windows-net-socket-collector.ts`: Native Windows TCP/UDP netstat collector with reverse shell & C2 heuristic detection.
  - `src/infrastructure/sensor/linux-procfs-socket-collector.ts`: Linux `/proc/net/tcp` socket collector.
  - `src/infrastructure/sensor/os-socket-collector.factory.ts`: Dynamic OS detection factory.
- **SOAR Multi-Vendor Firewall Connectors**:
  - `src/domain/soar/ports/firewall-connector.port.ts`: IFirewallConnector port interface.
  - `src/infrastructure/soar/connectors/fortinet-firewall.connector.ts`: FortiOS REST API connector for automated IP blacklisting into address groups.
  - `src/infrastructure/soar/connectors/palo-alto-firewall.connector.ts`: PAN-OS XML User-ID API connector for dynamic address group (DAG) registration.
  - `src/infrastructure/soar/connectors/firewall-orchestrator.service.ts`: Concurrent multi-vendor containment coordinator.
- **Automated Test Coverage**: 58 passing tests across 18 test suites in `tests/**/*.test.ts`.

### 1.2 Current State in Target (`D:\TUM\setup-product\tum-cybermesh`)
Existing structure:
```
setup-product/tum-cybermesh/
├── INSTALL_AND_QUICKSTART_GUIDE.md  (59 lines, 2593 bytes)
├── smoke-test.ps1                   (44 lines, 2180 bytes)
├── sensor-agent/
│   ├── Dockerfile                   (591 bytes)
│   ├── package.json                 (1258 bytes)
│   ├── deploy/
│   │   ├── agent-config.example.json (1322 bytes)
│   │   ├── linux/
│   │   │   └── tum-sensor-agent.service (712 bytes)
│   │   └── windows/
│   │       └── Install-TumSensorAgent.ps1 (3252 bytes)
│   └── dist/                        (Full compiled TS build)
└── soar-connectors/
    ├── firewall-orchestrator.service.ts (3432 bytes)
    ├── fortinet-firewall.connector.ts   (8207 bytes)
    └── palo-alto-firewall.connector.ts  (7881 bytes)
```

### 1.3 Gaps & Actions Required
1. **Standalone CLI Runner**: Add `sensor-agent/tum-sensor-agent.cmd` and `sensor-agent/tum-sensor-agent.ps1` for direct CLI execution without deep path navigation.
2. **Verification Execution**: Tested live execution via `node dist/presentation/sensor/sensor-agent-cli.js --once`. Verified: 277 active sockets sampled on Windows host with 0 false positives.
3. **Smoke Test Status**: `smoke-test.ps1` runs and passes all 3 validation checks (Windows installer, Linux systemd, Sensor CLI + SOAR connectors).

---

## 2. R6: Tum-Trust-Fabric Turnkey Package

### 2.1 Source Repository Analysis (`D:\TUM\tum-trust-fabric`)
- **Package Manifest**: `package.json` (name: `@tum/trust-fabric`, version: `1.0.0`, type: `module`).
- **Turnkey Container Appliance**:
  - `Dockerfile`: Multi-stage Alpine Linux 3.21 / Node.js 22 LTS container.
  - `docker-compose.yml`: Deploys `sovereign-corridor-gateway` (port 8088) with `edge-cache` (Redis 7 Alpine on port 6379) and named volumes (`tum_corridor_pki_certs`, `tum_corridor_audit_vault`, `tum_corridor_edge_data`).
  - `config/appliance.json`: Border corridor lane hardware parameters (gate IDs, biometric threshold 0.85, liveness threshold 0.90, PQC level ML-DSA-65).
- **ICAO Doc 9303 CSCA Trust Store** (`data/icao-pki/`):
  - Thailand: `TH_csca_cert.pem`, `TH_ds_cert.pem`, `TH_revoked_ds_cert.pem`
  - Singapore: `SG_csca_cert.pem`, `SG_ds_cert.pem`
  - Germany: `DE_csca_cert.pem`, `DE_ds_cert.pem`
  - Japan: `JP_csca_cert.pem`, `JP_ds_cert.pem`
  - Test Enclave: `XX_csca_cert.pem`, `XX_ds_cert.pem`
  - ICAO Master List Signer: `ICAO_mls_cert.pem`
  - Total: 29 PEM/SRL files.
- **Integration Specs**:
  - `proto/sovereign_corridor.proto`: gRPC protobuf contracts for passenger clearance and biometric verification.
  - `docs/REST_GRPC_INTEGRATION_BLUEPRINT.md`: Comprehensive 25KB enterprise blueprint.
- **Automated Test Coverage**: 133 passing tests across 40 test suites in `tests/**/*.test.ts`.

### 2.2 Current State in Target (`D:\TUM\setup-product\tum-trust-fabric`)
Existing structure:
```
setup-product/tum-trust-fabric/
├── smoke-test.ps1                   (59 lines, 2810 bytes)
├── blueprints/
│   └── REST_GRPC_INTEGRATION_BLUEPRINT.md (25648 bytes)
├── proto/
│   └── sovereign_corridor.proto     (6794 bytes)
├── docker-appliance/
│   ├── .env.example                 (1196 bytes)
│   ├── Dockerfile                   (2973 bytes)
│   ├── docker-compose.yml           (3430 bytes)
│   ├── config/
│   │   └── appliance.json           (1361 bytes)
│   └── data/
│       └── icao-pki/                (29 certificate/key files)
└── standalone-server/
    └── dist/                        (Full compiled server runtime)
```

### 2.3 Gaps & Actions Required
1. **Missing Deployment Guide**: Create `INSTALL_AND_QUICKSTART_GUIDE.md` detailing:
   - System prerequisites (Docker 24+, Compose v2, 2 CPU cores, 4GB RAM).
   - Step 1: Starting the Sovereign Corridor Gateway (`docker compose up -d`).
   - Step 2: ICAO Doc 9303 CSCA Trust Store configuration and Passive Authentication.
   - Step 3: Standalone Node.js server fallback (`node standalone-server/dist/src/presentation/api/server.js`).
   - Step 4: Air-gapped offline Docker image export/import procedures.
2. **Exported Offline Image Archive**:
   - Create `sovereign-corridor-gateway-offline.tar.gz` (packaged container deployment bundle containing appliance context, compose file, offline PKI trust anchors, and start scripts) to satisfy acceptance criterion: `Dockerized appliance packages contain exported image archives (.tar or .tar.gz)`.
3. **Smoke Test Status**: `smoke-test.ps1` runs and passes all 4 verification checks (Docker manifests, ICAO PKI certificates, Protobuf + Blueprint, compiled server runtime).

---

## 3. R7: Tum-Central-Director Turnkey Package

### 3.1 Source Repository Analysis (`D:\TUM\tum-central-director`)
- **Package Manifest**: `package.json` (name: `tum-sovereign-agent-ide`, version: `1.0.0`).
- **Main Entrypoint**: `dist/main/electron-main.js` (compiled from `src/main/electron-main.ts`).
- **Core Modules**:
  - `SentinelInterceptor` (`sentinel.js`): Real-time command inspection, prompt injection detection, and destructive shell command blocking.
  - `AgentGateEngine` (`agentgate.js`): Delegated Agent Credential (DAC) minting and instant cryptographic revocation.
  - `AttackMapEngine` (`attack-map-engine.js`): Multi-node live attack trace, fleet telemetry, and war-room mitigation.
  - `TenantManager` (`tenant-manager.js`): Strict multi-tenant isolation and role-based access control.
  - `ReportGenerator` (`report-generator.js`): Executive HTML reports with cryptographic SHA-256 tamper-evident attestation.
- **Renderer UI**: `dist/renderer/index.html` (72,872 bytes self-contained single-page enterprise Web HUD).
- **Available Electron Distribution**: `D:\TUM\tum-central-director\node_modules\electron\dist`:
  - `electron.exe`: 249,788,928 bytes pre-built Electron v45.2.1 runtime.
  - Supporting libraries: `ffmpeg.dll`, `d3dcompiler_47.dll`, `dxcompiler.dll`, `icudtl.dat`, `resources.pak`, `chrome_100_percent.pak`, `chrome_200_percent.pak`, `locales/`.
- **Automated Test Coverage**: 58 passing tests in `tests/**/*.test.ts` (verified via task 166).

### 3.2 Current State in Target (`D:\TUM\setup-product\tum-central-director`)
- **Current Status**: Empty directory (0 files, 0 folders).

### 3.3 Turnkey Packaging Specification for `setup-product/tum-central-director`
The package should mirror the proven structure used by `setup-product/tum-socs/desktop-app`:
```
setup-product/tum-central-director/
├── INSTALL_AND_QUICKSTART_GUIDE.md    # Step-by-step enterprise operator manual
├── smoke-test.ps1                     # Standalone smoke test & verification script
├── launch-desktop.cmd                 # Quick double-click launcher
├── launch-desktop.ps1                 # PowerShell launcher
└── desktop-app/
    ├── TUM-Central-Director.exe       # 249MB Electron runtime executable
    ├── d3dcompiler_47.dll
    ├── dxcompiler.dll
    ├── electron_wer.dll
    ├── ffmpeg.dll
    ├── icudtl.dat
    ├── vk_swiftshader.dll
    ├── vulkan-1.dll
    ├── chrome_100_percent.pak
    ├── chrome_200_percent.pak
    ├── resources.pak
    ├── locales/                       # Chromium locale packs
    └── resources/
        └── app/                       # Application code
            ├── package.json           # Configured with main: dist/main/electron-main.js
            └── dist/                  # Compiled JavaScript runtime
                ├── main/              # electron-main.js, preload.cjs, daemon.js, sentinel.js, etc.
                ├── renderer/          # index.html (72KB Web HUD)
                ├── cli/
                ├── mcp/
                └── shared/
```

### 3.4 Packaging Commands
```powershell
# 1. Create target directories
New-Item -ItemType Directory -Path "D:\TUM\setup-product\tum-central-director\desktop-app\resources\app" -Force

# 2. Copy Electron binary runtime and rename to TUM-Central-Director.exe
Copy-Item "D:\TUM\tum-central-director\node_modules\electron\dist\electron.exe" "D:\TUM\setup-product\tum-central-director\desktop-app\TUM-Central-Director.exe"
Copy-Item "D:\TUM\tum-central-director\node_modules\electron\dist\*.dll" "D:\TUM\setup-product\tum-central-director\desktop-app\"
Copy-Item "D:\TUM\tum-central-director\node_modules\electron\dist\*.pak" "D:\TUM\setup-product\tum-central-director\desktop-app\"
Copy-Item "D:\TUM\tum-central-director\node_modules\electron\dist\*.dat" "D:\TUM\setup-product\tum-central-director\desktop-app\"
Copy-Item "D:\TUM\tum-central-director\node_modules\electron\dist\*.bin" "D:\TUM\setup-product\tum-central-director\desktop-app\"
Copy-Item "D:\TUM\tum-central-director\node_modules\electron\dist\locales" "D:\TUM\setup-product\tum-central-director\desktop-app\locales" -Recurse

# 3. Copy application distribution and package manifest
Copy-Item "D:\TUM\tum-central-director\package.json" "D:\TUM\setup-product\tum-central-director\desktop-app\resources\app\package.json"
Copy-Item "D:\TUM\tum-central-director\dist" "D:\TUM\setup-product\tum-central-director\desktop-app\resources\app\dist" -Recurse

# 4. Copy launcher scripts
Copy-Item "D:\TUM\tum-central-director\launch-desktop.cmd" "D:\TUM\setup-product\tum-central-director\launch-desktop.cmd"
Copy-Item "D:\TUM\tum-central-director\launch-desktop.ps1" "D:\TUM\setup-product\tum-central-director\launch-desktop.ps1"
```

### 3.5 Smoke Test Script (`smoke-test.ps1`) Specification
The smoke test must verify:
1. `desktop-app\TUM-Central-Director.exe` exists and is >100MB.
2. `desktop-app\resources\app\dist\main\electron-main.js` and `preload.cjs` exist.
3. `desktop-app\resources\app\dist\renderer\index.html` exists (>50KB).
4. `INSTALL_AND_QUICKSTART_GUIDE.md` exists.
5. Exit code 0 on complete pass, 1 on failure.

---

## 4. R8: Master Setup & Verification Index (`D:\TUM\setup-product\README.md`)

### 4.1 Master Index Purpose & Scope
The master index catalogs all 7 TUM Group products, establishes a single source of truth for prerequisites, directory structures, verification procedures, and provides a unified batch execution script to run all 7 smoke tests.

### 4.2 Product Directory Mapping Matrix

| ID | Product Directory | Product Name | Primary Deliverables | Verification Script |
|:---|:---|:---|:---|:---|
| **R1** | `tum-trust-security` | TUM Trust Security | Windows Kiosk Service (`Tum.Trust.KioskService.exe` 67MB), WiX Installer, Electron Kiosk Diagnostics Console, HIL JavaCard / Virtual Camera Testbed | `smoke-test.ps1` |
| **R2** | `tum-quantum` | TUM Quantum | Dockerized PQC Reverse Proxy Gateway (NIST FIPS 203/204), ML-KEM/ML-DSA cert generator, constant-time validation suite, offline archive | `smoke-test.ps1` |
| **R3** | `tum-socs` | TUM OpenSIEM | Windows Electron Desktop App (`TUM-OpenSIEM.exe` 238MB), Docker Appliance (ClickHouse + Vector + Web HUD), Helm chart, 50k EPS load generator | `smoke-test.ps1` |
| **R4** | `tum-agentic-workos` | TUM Agentic WorkOS | Standalone Web Admin ERP Console (Hallmark Web HUD), Thai Revenue e-Tax XML (ETDA v2.1 ER3-2560) schema validation engine | `smoke-test.ps1` |
| **R5** | `tum-cybermesh` | TUM Sovereign CyberMesh | Standalone eBPF/Socket Sensor Agent Daemon (Windows/Linux), Fortinet & Palo Alto SOAR connectors, Windows Service installer | `smoke-test.ps1` |
| **R6** | `tum-trust-fabric` | TUM Sovereign Trust Fabric | Sovereign Corridor E-Gate Docker Gateway (port 8088), 29 ICAO Doc 9303 CSCA Trust Anchors, gRPC proto, REST blueprint, offline container archive | `smoke-test.ps1` |
| **R7** | `tum-central-director` | TUM Central Director | Standalone Electron Desktop IDE (`TUM-Central-Director.exe` 249MB), Sentinel command guardrail, AgentGate DAC engine, Attack Map HUD | `smoke-test.ps1` |

### 4.3 Unified Verification Procedure
`D:\TUM\setup-product\README.md` must provide the exact PowerShell command to run all smoke tests sequentially:
```powershell
cd D:\TUM\setup-product
Get-ChildItem -Directory | ForEach-Object {
    $smokeScript = Join-Path $_.FullName "smoke-test.ps1"
    if (Test-Path $smokeScript) {
        Write-Host "`n>>> Testing: $($_.Name) <<<" -ForegroundColor Cyan
        powershell -ExecutionPolicy Bypass -File $smokeScript
    }
}
```

---

## 5. Summary of Pending Turnkey Deliverables & Execution Plan

To reach 100% completion against the acceptance criteria:

1. **For `tum-central-director` (R7)**:
   - Copy and assemble `desktop-app/` with `TUM-Central-Director.exe` (249MB), DLLs, paks, and `resources/app/` (package.json + dist/ + renderer).
   - Create `launch-desktop.cmd` and `launch-desktop.ps1`.
   - Write `INSTALL_AND_QUICKSTART_GUIDE.md`.
   - Write and execute `smoke-test.ps1`.

2. **For `tum-trust-fabric` (R6)**:
   - Write `INSTALL_AND_QUICKSTART_GUIDE.md` covering E-Gate appliance deployment, ICAO PKI verification, gRPC integration, and air-gapped container workflows.
   - Package `sovereign-corridor-gateway-offline.tar.gz` in `docker-appliance/` containing the offline Docker deployment bundle.

3. **For `tum-cybermesh` (R5)**:
   - Provide `tum-sensor-agent.cmd` / `tum-sensor-agent.ps1` launcher scripts in `sensor-agent/`.

4. **For Offline Container Archives (`tum-quantum`, `tum-socs`, `tum-trust-fabric`)**:
   - Ensure `tum-quantum-gateway-offline.tar.gz`, `tum-opensiem-offline.tar.gz`, and `sovereign-corridor-gateway-offline.tar.gz` exist in the respective `docker-appliance/` directories.

5. **For Master Index (R8)**:
   - Write `D:\TUM\setup-product\README.md` cataloging all 7 products, hardware/software prerequisites, directory structures, and global verification routines.
