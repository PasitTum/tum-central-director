# Project: TUM Group Commercial Production Turnkey Product Deliverables

## Architecture

The TUM Group commercial product distribution packages all 7 enterprise products into a unified turnkey directory structure under `D:\TUM\setup-product`, with complete offline artifacts, container deployment archives, desktop binaries, API integration testbeds, and automated verification suites.

### Product Ecosystem Architecture
1. **Tum-Trust-Security (R1)**: Sovereign Edge Kiosk Security. High-assurance Windows Kiosk Service daemon (.NET 8 self-contained AOT, 67.1 MB), Electron Kiosk Diagnostics Console (`TUM-Kiosk-Diagnostics.exe`), WiX Toolset MSI installer specification, and HIL JavaCard APDU / Virtual Camera biometric testbed.
2. **Tum-Quantum (R2)**: Post-Quantum Reverse Proxy Gateway appliance (NIST FIPS 203 ML-KEM / FIPS 204 ML-DSA). PQC-hardened NGINX reverse proxy, dual-algorithm hybrid certificate generation, DudeCT constant-time statistical analysis suite, and offline Docker image archive (`tum-quantum-gateway-offline.tar.gz`).
3. **Tum-Socs (R3)**: All-in-One Enterprise OpenSIEM Appliance. Ingestion engine capable of 8.8M EPS with WORM SHA-256 Merkle Ledger (Thai Computer Crimes Act Sec 26), ClickHouse columnar sink adapter, standalone Hallmark Console Web HUD (zero-dependency dark-theme console), standalone Electron Desktop App (`TUM-OpenSIEM.exe`, 249 MB), Helm v3 chart, and offline Docker image archive (`tum-opensiem-appliance-offline.tar.gz`).
4. **Tum-Agentic-Workos (R4)**: Sovereign Corporate Accounting & Workforce ERP. Standalone Web Admin ERP Console (P2P 3-Way Match, e-Tax & RD Sandbox, GL Ledger & WHT Vouchers, Autonomous Workforce & DAC credentials), Thai Revenue e-Tax XML ETDA v2.1 (ER3-2560) schema engine and Host-to-Host Sandbox ACK-200 simulator.
5. **Tum-Cybermesh (R5)**: Autonomous Sensor Mesh & SOAR Orchestration. Native socket telemetry collector for Windows and Linux, standalone daemon CLI (`tum-sensor-agent`), multi-vendor SOAR firewall connectors (FortiOS REST API and Palo Alto PAN-OS XML API dynamic address containment), and Windows Service / Linux systemd installation packages.
6. **Tum-Trust-Fabric (R6)**: Sovereign Corridor E-Gate Docker Gateway. Border corridor clearance appliance (port 8088), 29 ICAO Doc 9303 CSCA PKI trust anchors (Passive Authentication across Thailand, Singapore, Germany, Japan, Test Enclaves), gRPC protobuf contracts, enterprise REST blueprint, and offline Docker image archive (`sovereign-corridor-gateway-offline.tar.gz`).
7. **Tum-Central-Director (R7)**: Enterprise Operator Sovereign IDE. Standalone Electron Desktop IDE (`TUM-Central-Director.exe`, 249 MB), Sentinel command guardrail and prompt injection interceptor, AgentGate Delegated Agent Credential (DAC) minting engine, and 72 KB Web HUD renderer.
8. **Master Setup & Verification Index (R8)**: Root `README.md` cataloging all 7 products, hardware/software prerequisites, and unified automated smoke test execution harness.

---

## Feature Inventory

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Standalone Kiosk Service Executable | Pre-built 67.1MB self-contained .NET 8 binary `Tum.Trust.KioskService.exe` | M1 | Survey E1 |
| F2 | Windows Kiosk Service Installer & WiX | `install-kiosk-service.ps1` decoupled from source tree + `TumKioskService.wxs` | M1 | Survey E1 |
| F3 | Electron Kiosk Diagnostics Binary | Standalone compiled executable `TUM-Kiosk-Diagnostics.exe` packaged with Electron runtime | M1 | Survey E1 |
| F4 | HIL JavaCard & Virtual Camera Testbed | Standalone Python testbed runner `run_all_testbeds.py` (11 APDU + 5 PAD tests) | M1 | Survey E1 |
| F5 | Trust-Security Documentation & Smoke Test | Step-by-step `INSTALL.md`, `README.md`, and automated `smoke-test.ps1` | M1 | Survey E1 |
| F6 | Dockerized PQC Reverse Proxy Appliance | NGINX PQC gateway with `docker-compose.yml`, Dockerfiles, and certificate generator | M2 | Survey E1 |
| F7 | Quantum Gateway Offline Container Archive | Exported offline image archive `tum-quantum-gateway-offline.tar.gz` | M2 | Survey E1 |
| F8 | Quantum Architecture Manual & Setup Scripts | `ARCHITECTURE_MANUAL.md`, `setup.ps1`, `setup.sh` | M2 | Survey E1 |
| F9 | Quantum Documentation & Smoke Test | Step-by-step `INSTALL.md`, `README.md`, and automated `smoke-test.ps1` | M2 | Survey E1 |
| F10 | OpenSIEM Docker Appliance & Compose | All-in-One SIEM + ClickHouse columnar sink docker-compose stack | M3 | Survey E2 |
| F11 | OpenSIEM Offline Container Archive | Exported offline image archive `tum-opensiem-appliance-offline.tar.gz` | M3 | Survey E2 |
| F12 | Standalone Hallmark Console Web HUD | Zero-dependency browser-based cybersecurity HUD (`visualizers/index.html` + launchers) | M3 | Survey E2 |
| F13 | OpenSIEM Electron Desktop App | 249MB standalone `TUM-OpenSIEM.exe` with `install-desktop.ps1` & `launch-desktop.cmd` | M3 | Survey E2 |
| F14 | OpenSIEM Documentation & Smoke Test | Step-by-step `INSTALL.md`, `README.md`, and automated `smoke-test.ps1` | M3 | Survey E2 |
| F15 | Standalone Web Admin ERP Console HUD | 4-tab Hallmark ERP console (P2P 3-Way Match, e-Tax, GL Ledger, DAC Org Chart) | M4 | Survey E2 |
| F16 | Thai Revenue e-Tax XML ETDA v2.1 Package | Runnable ETDA ER3-2560 validation engine, canonical XML samples, RD Sandbox client | M4 | Survey E2 |
| F17 | Agentic WorkOS Application Runtime | Pre-compiled Node.js application, CLI `workos`, Dockerfile, docker-compose.yml | M4 | Survey E2 |
| F18 | Agentic WorkOS Documentation & Smoke Test | Step-by-step `INSTALL.md`, `README.md`, `smoke-test.ps1`, `smoke-test.sh` | M4 | Survey E2 |
| F19 | Standalone Sensor Agent Daemon | Windows/Linux socket collector daemon with `tum-sensor-agent.cmd`/`.ps1` launchers | M5 | Survey E3 |
| F20 | SOAR Multi-Vendor Firewall Connectors | Fortinet FortiOS REST & Palo Alto PAN-OS XML containment connectors | M5 | Survey E3 |
| F21 | Cybermesh Runbooks & Smoke Test | Windows/Linux deployment runbooks, `INSTALL.md`, `README.md`, `smoke-test.ps1` | M5 | Survey E3 |
| F22 | Sovereign Corridor E-Gate Docker Gateway | Docker appliance (port 8088), compose stack, edge cache, biometric thresholds | M6 | Survey E3 |
| F23 | ICAO Doc 9303 CSCA PKI Trust Store | 29 CSCA/DS certificates & Master List signer for Passive Authentication | M6 | Survey E3 |
| F24 | Trust-Fabric Offline Container Archive | Exported offline image archive `sovereign-corridor-gateway-offline.tar.gz` | M6 | Survey E3 |
| F25 | Trust-Fabric Deployment Manual & Smoke Test | `INSTALL.md`, `README.md`, `REST_GRPC_INTEGRATION_BLUEPRINT.md`, `smoke-test.ps1` | M6 | Survey E3 |
| F26 | Central Director Electron Desktop IDE | 249MB standalone `TUM-Central-Director.exe` with DLLs, paks, locales, Web HUD | M7 | Survey E3 |
| F27 | Central Director Launchers & Smoke Test | `launch-desktop.cmd`, `launch-desktop.ps1`, `smoke-test.ps1` | M7 | Survey E3 |
| F28 | Central Director Operator Manual | `INSTALL.md`, `README.md` with operator configuration guide | M7 | Survey E3 |
| F29 | Master Product Catalog & Prerequisites | `D:\TUM\setup-product\README.md` cataloging all 7 products and prerequisites | M8 | Survey E3 |
| F30 | Master Unified Verification Harness | Global multi-product verification script executing all smoke tests sequentially | M8 | Survey E3 |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Tum-Trust-Security Turnkey Package (R1) | F1, F2, F3, F4, F5 in `setup-product/tum-trust-security` | none | COMPLETED |
| M2 | Tum-Quantum Turnkey Package (R2) | F6, F7, F8, F9 in `setup-product/tum-quantum` | none | COMPLETED |
| M3 | Tum-Socs Turnkey Package (R3) | F10, F11, F12, F13, F14 in `setup-product/tum-socs` | none | COMPLETED |
| M4 | Tum-Agentic-Workos Turnkey Package (R4) | F15, F16, F17, F18 in `setup-product/tum-agentic-workos` | none | COMPLETED |
| M5 | Tum-Cybermesh Turnkey Package (R5) | F19, F20, F21 in `setup-product/tum-cybermesh` | none | COMPLETED |
| M6 | Tum-Trust-Fabric Turnkey Package (R6) | F22, F23, F24, F25 in `setup-product/tum-trust-fabric` | none | COMPLETED |
| M7 | Tum-Central-Director Turnkey Package (R7) | F26, F27, F28 in `setup-product/tum-central-director` | none | COMPLETED |
| M8 | Master Index & Unified Verification (R8) | F29, F30 in `setup-product/README.md` | M1-M7 | COMPLETED |

---

## Interface Contracts

### 1. Unified Smoke Test Contract
Every product directory in `D:\TUM\setup-product\<product-name>` MUST provide `smoke-test.ps1`:
- Invocation: `powershell -ExecutionPolicy Bypass -File .\smoke-test.ps1`
- Standard Exit Codes: `0` on 100% verification pass, non-zero on failure.
- Output: Structured `[PASS]` tags and final summary block.

### 2. Turnkey Desktop Executable Contract
Products delivering Windows applications (`tum-trust-security`, `tum-socs`, `tum-central-director`) MUST provide:
- An executable `.exe` file (>50MB self-contained binary or unpacked Electron runtime) located in a dedicated binary folder.
- Direct launchers: `launch-desktop.cmd` or equivalent setup/install script.

### 3. Container Appliance Offline Delivery Contract
Products delivering containerized appliances (`tum-quantum`, `tum-socs`, `tum-trust-fabric`) MUST provide:
- `docker-appliance/docker-compose.yml` and `Dockerfile`
- Exported offline image archive `.tar` or `.tar.gz` in `docker-appliance/`
- Startup script `start-appliance.ps1` / `start-appliance.sh`

### 4. Documentation Standard Contract
Every product directory in `D:\TUM\setup-product\<product-name>` MUST provide:
- `README.md` (Product overview, turnkey directory layout, features, architecture)
- `INSTALL.md` (Step-by-step installation, prerequisites, operation guide, troubleshooting)

---

## Code Layout

```
D:\TUM\setup-product\
├── README.md                                  # Master index and global verification guide
├── tum-trust-security/                        # R1: Standalone Kiosk & Diagnostics Console
│   ├── README.md
│   ├── INSTALL.md
│   ├── smoke-test.ps1
│   ├── service-bin/Tum.Trust.KioskService.exe
│   ├── installer/install-kiosk-service.ps1
│   ├── installer/TumKioskService.wxs
│   ├── kiosk-diagnostics-console/TUM-Kiosk-Diagnostics.exe
│   └── hil-testbed/run_all_testbeds.py
├── tum-quantum/                               # R2: Dockerized PQC Reverse Proxy Gateway
│   ├── README.md
│   ├── INSTALL.md
│   ├── ARCHITECTURE_MANUAL.md
│   ├── setup.ps1 / setup.sh
│   ├── smoke-test.ps1
│   └── docker-appliance/
│       ├── docker-compose.yml
│       ├── Dockerfile
│       └── tum-quantum-gateway-offline.tar.gz
├── tum-socs/                                  # R3: All-in-One Enterprise OpenSIEM Appliance
│   ├── README.md
│   ├── INSTALL.md
│   ├── smoke-test.ps1
│   ├── desktop-app/TUM-OpenSIEM.exe
│   ├── hallmark-console/index.html
│   └── docker-appliance/
│       ├── docker-compose.yml
│       ├── Dockerfile
│       ├── start-appliance.ps1 / .sh
│       └── tum-opensiem-appliance-offline.tar.gz
├── tum-agentic-workos/                        # R4: Standalone Web Admin ERP Console & ETDA v2.1
│   ├── README.md
│   ├── INSTALL.md
│   ├── smoke-test.ps1 / smoke-test.sh
│   ├── erp-console/index.html
│   ├── etax-v2.1-sandbox/
│   │   ├── validate-schema.ts
│   │   ├── ETDA_V2_1_SPECIFICATION.md
│   │   └── samples/
│   └── app/
│       ├── package.json
│       ├── dist/
│       └── bin/workos.js
├── tum-cybermesh/                             # R5: Standalone Sensor Agent & SOAR Connectors
│   ├── README.md
│   ├── INSTALL.md
│   ├── smoke-test.ps1
│   ├── sensor-agent/
│   │   ├── tum-sensor-agent.cmd / .ps1
│   │   └── dist/presentation/sensor/sensor-agent-cli.js
│   └── soar-connectors/
├── tum-trust-fabric/                          # R6: Sovereign Corridor E-Gate Docker Gateway
│   ├── README.md
│   ├── INSTALL.md
│   ├── smoke-test.ps1
│   ├── proto/sovereign_corridor.proto
│   ├── blueprints/REST_GRPC_INTEGRATION_BLUEPRINT.md
│   └── docker-appliance/
│       ├── docker-compose.yml
│       ├── Dockerfile
│       ├── data/icao-pki/ (29 certs)
│       └── sovereign-corridor-gateway-offline.tar.gz
└── tum-central-director/                      # R7: Enterprise Operator Desktop IDE
    ├── README.md
    ├── INSTALL.md
    ├── smoke-test.ps1
    ├── launch-desktop.cmd / .ps1
    └── desktop-app/
        ├── TUM-Central-Director.exe (249MB)
        └── resources/app/
```
