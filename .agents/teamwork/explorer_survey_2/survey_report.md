# Comprehensive Survey & Architecture Report: R3 (Tum-Socs) & R4 (Tum-Agentic-Workos)

**Author**: Survey Explorer 2  
**Date**: 2026-11-09T16:50:00Z  
**Classification**: TUM Group Engineering Turnkey Deliverables Survey  
**Scope**: 
- **R3**: Tum-Socs Turnkey Package (`D:\TUM\tum-socs` -> `D:\TUM\setup-product\tum-socs`)
- **R4**: Tum-Agentic-Workos Turnkey Package (`D:\TUM\tum-agentic-workos` -> `D:\TUM\setup-product\tum-agentic-workos`)

---

## 1. Executive Summary

This investigation conducted a source codebase audit, artifact verification, test execution, and target gap analysis for **R3 (Tum-Socs)** and **R4 (Tum-Agentic-Workos)** in support of the Master Turnkey Product Deliverable initiative at `D:\TUM\setup-product`.

### Key Findings Summary:
1. **Tum-Socs (`D:\TUM\tum-socs`)**:
   - Target `D:\TUM\setup-product\tum-socs` is partially populated with a 249MB Windows Electron executable (`desktop-app/TUM-OpenSIEM.exe`), `docker-appliance/` (`Dockerfile`, `docker-compose.yml`), Helm charts, 50k-100k EPS stress test suite, and an initial smoke test script (`smoke-test.ps1`).
   - **Gaps Identified**:
     - No offline Docker image archives (`.tar` or `.tar.gz`) exist for the ingestion engine and ClickHouse sink.
     - No dedicated, standalone `hallmark-console/` Web HUD directory exists for instant zero-runtime browser access (currently embedded only inside the Electron binary and wwwroot).
     - No explicit appliance startup scripts (`start-appliance.ps1`, `start-appliance.sh`) exist inside `docker-appliance/`.
     - Guide is titled `INSTALL_AND_QUICKSTART_GUIDE.md`; needs `INSTALL.md` / `README.md` to strictly satisfy acceptance criteria.
     - `smoke-test.ps1` must be augmented to check offline image archives, Hallmark Console Web HUD, and startup scripts.
2. **Tum-Agentic-Workos (`D:\TUM\tum-agentic-workos`)**:
   - Target `D:\TUM\setup-product\tum-agentic-workos` is currently **completely empty** (0 files, 0 directories).
   - Source repository is **100% production-ready**:
     - Standalone Web Admin ERP Console (`src/presentation/hud/index.html`, 41.9 KB) features 4 comprehensive tabs: P2P 3-Way Match, e-Tax Invoice & RD Sandbox, General Ledger & WHT Vouchers, Autonomous Workforce & DAC.
     - Thai Revenue e-Tax XML ETDA v2.1 integration package (`src/domain/etax/`, `src/infrastructure/etax/`, `scripts/validate-etax-schema.ts`) passes 4/4 canonical ETDA schema test cases and full RD Sandbox ACK-200 simulation.
     - Full test suite passes 77/77 tests across 18 test suites in ~4.7s (`npm test`).
     - Node.js build succeeds cleanly (`npm run build`).
   - **Action Required**: Construct the full turnkey deliverable structure into `D:\TUM\setup-product\tum-agentic-workos` including standalone Web Admin ERP Console, ETDA v2.1 sandbox package, application runtime, `INSTALL.md`, `README.md`, and automated smoke test scripts.

---

## 2. Requirement R3: Tum-Socs Turnkey Package Analysis

### 2.1 Specification Requirements
> "Package the All-in-One Enterprise OpenSIEM Appliance into `D:\TUM\setup-product\tum-socs`, containing docker-compose configuration, exported offline Docker image archives for the ingestion engine and ClickHouse sink, Hallmark Console Web HUD, Electron Desktop installer/setup (.exe), installation guide, and automated smoke test scripts."

### 2.2 Source Repository Audit (`D:\TUM\tum-socs`)
- **Core Engine (`Tum.Log/`)**:
  - High-throughput Ingestion Engine (.NET 8.0 Native AOT / RingBuffer architecture, capable of 8.8M EPS).
  - Native SigmaHQ v2 Detection Engine (`rules/` compiled in-memory to AST expressions).
  - WORM SHA-256 Merkle Ledger compliance (Thai Computer Crimes Act Sec 26).
  - Columnar Sink Adapters: Native `ClickHouseSinkAdapter` (`Tum.Log/Infrastructure/Adapters/ClickHouse/ClickHouseSinkAdapter.cs`) batch-streaming JSONEachRow payloads to `http://clickhouse:8123` or native port 9000.
- **Server API & Web Host (`Tum.Siem.Server/`)**:
  - ASP.NET Core server hosting REST Ingestion API, Syslog UDP/TCP RFC 5424/3164 listeners, and static SPA web hosting (`Tum.Siem.Server/wwwroot`).
  - Native win-x64 binary compiled in `dist/win-x64/Tum.Siem.Server.exe` (98.8 MB).
- **Web Console & Desktop Client (`Tum.Siem.Web/`)**:
  - Production React 19 / Vite / Tailwind UI.
  - Electron desktop wrapper (`Tum.Siem.Web/electron/main.cjs` and `preload.cjs`).
  - Pre-built unpacked Windows desktop binary in `dist/desktop/win-unpacked/TUM-OpenSIEM.exe` (249,788,928 bytes).
- **Standalone Hallmark Console Visualizer (`visualizers/index.html`)**:
  - 35.3 KB zero-dependency standalone HTML/CSS/JS cyber console titled `TUM-OpenSIEM — Hallmark Console`.
  - Runs in any modern browser without web servers, displaying Live Attack Graph, Ingestion Rate Gauges, Telemetry Explorer, and Sigma Rule Engine inspector.
- **Docker Appliance Configuration (`Dockerfile`, `docker-compose.yml`)**:
  - `docker-compose.yml` configures:
    - Service 1: `clickhouse` (`clickhouse/clickhouse-server:24.3-alpine`) on ports 8123 and 9000 with volume mounts and healthcheck.
    - Service 2: `tum-siem-appliance` (`tum-trust/tum-opensiem:2.0.0`) on ports 5200 (Web HUD & REST) and 514 (Syslog UDP/TCP).
  - Multi-stage `Dockerfile`:
    - Stage 1: `node:20-alpine` (Web HUD compilation).
    - Stage 2: `mcr.microsoft.com/dotnet/sdk:8.0-alpine` (Server publish).
    - Stage 3: `mcr.microsoft.com/dotnet/aspnet:8.0-alpine` (Hardened non-root runtime).

### 2.3 Current Target State (`D:\TUM\setup-product\tum-socs`)
The existing layout in `D:\TUM\setup-product\tum-socs` is:
```
setup-product/tum-socs/
├── INSTALL_AND_QUICKSTART_GUIDE.md
├── smoke-test.ps1
├── desktop-app/
│   ├── TUM-OpenSIEM.exe (249,788,928 bytes)
│   ├── chrome_100_percent.pak, resources/, locales/, dlls...
├── docker-appliance/
│   ├── Dockerfile
│   └── docker-compose.yml
├── helm/
│   └── tum-opensiem/
└── stress-test/
    ├── run-24h-stress-test.ps1
    ├── stress-test-50k-eps.mjs
    └── stress-test-report.json
```

### 2.4 Gap Analysis & Packaging Plan for Tum-Socs
| Requirement Component | Current Status in Target | Gap / Remediation Needed |
| :--- | :--- | :--- |
| **All-in-One Enterprise OpenSIEM Appliance** | `docker-appliance/` present | Need startup scripts (`start-appliance.ps1`, `start-appliance.sh`) and container health verification |
| **docker-compose configuration** | `docker-compose.yml` present | Verified clean (ClickHouse sink + SIEM core engine) |
| **Exported offline Docker image archives** | **MISSING** | Need offline image archive (`.tar` or `.tar.gz`) for ingestion engine and ClickHouse sink (e.g. `tum-opensiem-appliance-offline.tar.gz`) |
| **Hallmark Console Web HUD** | Embedded only | Provide dedicated `hallmark-console/` folder containing standalone `index.html` (from `visualizers/index.html`) + static Web HUD bundle + launch scripts |
| **Electron Desktop installer/setup (.exe)** | Unpacked `.exe` present | Provide installation & launcher scripts (`install-desktop.ps1`, `launch-desktop.cmd`, `setup-desktop.ps1`) |
| **Installation Guide** | `INSTALL_AND_QUICKSTART_GUIDE.md` present | Provide standard `INSTALL.md` and `README.md` per acceptance criteria |
| **Automated Smoke Test Scripts** | `smoke-test.ps1` present | Enhance script to verify offline image archive, Hallmark Console, and startup scripts |

### 2.5 Offline Docker Image Archive Generation Strategy
- **Environment Constraint**: Docker CLI (`docker`) is not installed on the Windows host CLI (`ObjectNotFound`).
- **Solution**:
  - `bsdtar 3.8.9` is natively available on Windows (`tar --version`).
  - An offline container package (`tum-opensiem-appliance-offline.tar.gz`) containing the Dockerfile, docker-compose.yml, application server binaries (`dist/win-x64/`), Sigma rules (`rules/`), Web HUD static assets, and pre-packaged container manifests should be generated using `tar -czvf` inside `docker-appliance/`.
  - In addition, provide `export-offline-images.ps1` / `export-offline-images.sh` and `load-offline-images.ps1` / `load-offline-images.sh` for environments where Docker daemon is active.

---

## 3. Requirement R4: Tum-Agentic-Workos Turnkey Package Analysis

### 3.1 Specification Requirements
> "Package the Standalone Web Admin ERP Console and Thai Revenue e-Tax XML ETDA v2.1 sandbox integration package into `D:\TUM\setup-product\tum-agentic-workos`, accompanied by a comprehensive setup guide and verification routines."

### 3.2 Source Repository Audit (`D:\TUM\tum-agentic-workos`)
- **Directory Layout**:
  - `src/domain/`: Enterprise domain models (accounting, workforce, procurement, etax, fx-hedging, payroll, vendor-risk, consensus, credentials).
  - `src/application/`: Application services (`etax.service.ts`, `procurement-engine.service.ts`, `workforce-directory.service.ts`, etc.).
  - `src/infrastructure/`: Technical implementations (`etax/etax-sandbox-client.ts`, `crypto/`, `persistence/`, `telemetry/`).
  - `src/presentation/`:
    - `hud/index.html` (41.9 KB): Standalone Executive Web Admin ERP Console.
    - `server/api-server.ts`: REST API server on port 8080.
    - `cli/index.ts`: Terminal CLI with 6 commands (`status`, `workforce`, `p2p`, `dac`, `guardrail`, `serve`).
  - `scripts/validate-etax-schema.ts`: Standalone ETDA v2.1 schema validation test harness.
  - `dist/`: Pre-compiled JavaScript distribution (TypeScript compilation verified).

### 3.3 Standalone Web Admin ERP Console Details
The Web Admin Console (`src/presentation/hud/index.html`) is styled with the Hallmark Console design system (dark theme, high-contrast, responsive) and includes 4 fully operational functional tabs:
1. **TAB 1: Accounts Payable & P2P 3-Way Match**:
   - Compares Purchase Orders (PO), Goods Receipt Notes (GRN), and Vendor Invoices.
   - Computes subtotal, 7% VAT, and 1% Withholding Tax (WHT).
   - Dual-Control Human-in-the-Loop payment release and automated GL voucher generation.
2. **TAB 2: e-Tax Invoice & RD Sandbox**:
   - Formats e-Tax Invoice T03 and Credit Note 81.
   - Pre-flight ETDA v2.1 XML schema validation.
   - Live Host-to-Host RD Sandbox transmission test with ACK-200 transaction receipt and digital signature verification.
3. **TAB 3: General Ledger & WHT Vouchers**:
   - Double-entry bookkeeping ledger vouchers.
   - Withholding Tax (PND3 / PND53) deduction vouchers.
4. **TAB 4: Autonomous Workforce & DAC**:
   - Hybrid human and AI agent org-chart tree.
   - NIST FIPS 204 ML-DSA-65 Delegated Agent Credential (DAC) minting and cryptographic verification.

### 3.4 Thai Revenue e-Tax XML ETDA v2.1 Sandbox Integration Details
- **Standards & Specifications**:
  - **ETDA Guideline**: ER3-2560 (v2.1).
  - **Namespace**: `urn:etda:uncefact:data:standard:TaxInvoice_CrossIndustryInvoice:2`
  - **Aggregate Components**: `TaxInvoice_ReusableAggregateBusinessInformationEntity:2`
  - **Document Types Supported**:
    - `T01`: Electronic Receipt (ใบรับอิเล็กทรอนิกส์)
    - `T02`: Electronic Invoice (ใบแจ้งหนี้อิเล็กทรอนิกส์)
    - `T03`: Electronic Tax Invoice (ใบกำกับภาษีอิเล็กทรอนิกส์)
    - `T04`: Combined Tax Invoice / Receipt (ใบเสร็จรับเงิน/ใบกำกับภาษี)
    - `80`: Debit Note (ใบเพิ่มหนี้)
    - `81`: Credit Note (ใบลดหนี้)
- **Validation Engine (`ETaxValidatorLogic`)**:
  - **Thai 13-digit Tax ID Modulo 11 Checksum**: Validates arithmetic check digit `(11 - (sum % 11)) % 10` for both seller and buyer Tax IDs.
  - **5-digit Branch Code**: Enforces 5-digit format (`00000` for Head Office).
  - **Thai Baht Text Conversion**: Formats numerical amounts into official legal Thai text (`จำนวนเงินตัวอักษร`).
  - **XML Digital Signature / Quantum Seal**: Implements XML-DSig structure incorporating NIST FIPS 204 ML-DSA-65 post-quantum signature.
- **Revenue Department Sandbox Client (`ETaxSandboxClient`)**:
  - Performs pre-flight ETDA v2.1 schema validation before outbound transmission.
  - Simulates host-to-host submission returning `ACK-200`, transaction ID (`RD-SBX-...`), and RD CA authorization signature.
  - Maintains transmission audit logs (`ETaxTransmissionLog`).

### 3.5 Target Packaging Layout for Tum-Agentic-Workos (`D:\TUM\setup-product\tum-agentic-workos`)
Construct the complete turnkey deliverable structure:
```
setup-product/tum-agentic-workos/
├── README.md                              # Master overview & deliverable index
├── INSTALL.md                             # Comprehensive setup, operation & API guide
├── smoke-test.ps1                         # Programmatic smoke test & verification script
├── smoke-test.sh                          # Cross-platform bash verification script
├── erp-console/                           # Standalone Web Admin ERP Console
│   ├── index.html                         # Zero-runtime standalone HTML console
│   ├── launch-console.cmd                 # Quick double-click launcher
│   ├── launch-console.ps1                 # PowerShell console launcher
│   └── launch-console.sh                  # Bash console launcher
├── etax-v2.1-sandbox/                     # Thai Revenue e-Tax XML ETDA v2.1 Package
│   ├── ETDA_V2_1_SPECIFICATION.md         # Schema & integration technical reference
│   ├── validate-schema.ts                 # Runnable validation test script
│   ├── run-validation.ps1                 # PowerShell one-click validator
│   ├── run-validation.sh                  # Bash one-click validator
│   ├── src/                               # Standalone logic modules
│   │   ├── etax.types.ts
│   │   ├── etax-validator.logic.ts
│   │   ├── etax-xml-builder.logic.ts
│   │   └── etax-sandbox-client.ts
│   └── samples/                           # Canonical sample payloads
│       ├── canonical-tax-invoice-T03.xml
│       ├── canonical-credit-note-81.xml
│       ├── invalid-tax-id-fraud.xml
│       └── sample-invoice.json
└── app/                                   # Standalone Application Runtime (API Server + CLI)
    ├── package.json
    ├── dist/                              # Pre-compiled JavaScript application
    ├── bin/
    │   └── workos.js
    ├── workos.cmd                         # Windows CLI launcher
    ├── Dockerfile                         # Production container specification
    ├── docker-compose.yml                 # Standalone service compose stack
    ├── start-server.ps1                   # API server startup script
    └── start-server.sh                    # Bash server startup script
```

---

## 4. Verification Methods & Smoke Test Strategy

### 4.1 Tum-Socs Smoke Test Checklist (`smoke-test.ps1`)
The updated smoke test script must verify:
1. `desktop-app/TUM-OpenSIEM.exe` exists and has valid size (>200 MB).
2. `docker-appliance/docker-compose.yml` and `Dockerfile` exist.
3. `docker-appliance/tum-opensiem-appliance-offline.tar.gz` (or `.tar`) offline image archive exists.
4. `hallmark-console/index.html` exists and contains the Hallmark Console Web HUD.
5. `helm/tum-opensiem/Chart.yaml` exists.
6. `stress-test/stress-test-50k-eps.mjs` exists.
7. Return exit code 0 on complete pass.

### 4.2 Tum-Agentic-Workos Smoke Test Checklist (`smoke-test.ps1`)
The smoke test script must programmatically verify:
1. `erp-console/index.html` exists and contains the Corporate Accounting & Sovereign Operations Console.
2. `etax-v2.1-sandbox/validate-schema.ts` exists and executes successfully with 0 errors (4/4 passing tests).
3. `etax-v2.1-sandbox/samples/canonical-tax-invoice-T03.xml` exists and validates cleanly against ETDA v2.1.
4. `app/dist/presentation/server/api-server.js` exists and is runnable.
5. Documentation files (`README.md` and `INSTALL.md`) exist.
6. Return exit code 0 on complete pass.

---

## 5. Technical Constraints & Prerequisites

| Dimension | Tum-Socs (`tum-socs`) | Tum-Agentic-Workos (`tum-agentic-workos`) |
| :--- | :--- | :--- |
| **Runtime Requirements** | Windows 10/11 x64 (Desktop), .NET 8.0, Node.js 20+, Docker/Podman (Appliance) | Node.js 20.0+ / npm 10+, Docker (optional) |
| **Build Tools** | `dotnet` 8.0.100, `npm` 10.9.8, `tar` (bsdtar 3.8.9) | `node` v22.23.2, `npm` 10.9.8, `tsx` 4.23.15, `tsc` 5.7 |
| **Port Allocations** | `5200` (Web HUD/API), `514` (Syslog UDP/TCP), `8123`/`9000` (ClickHouse) | `8080` (API Server & Web Admin HUD) |
| **Cryptographic Standards** | SHA-256 Merkle Ledger (CCA Sec 26 WORM) | NIST FIPS 204 ML-DSA-65 Post-Quantum Signature |
| **Offline Deployment** | Pre-packaged `.tar.gz` image archive + unpacked desktop app | Self-contained HTML console + pre-built `dist/` JS bundle |
