# Original User Request

## Approved Task Prompt — 2026-11-09T16:38:00Z

Deliver tangible, commercial production turnkey product deliverables, offline container archives, and comprehensive installation and operation guides into `D:\TUM\setup-product`, structured across all 7 TUM Group products.

Working directory: D:\TUM
Integrity mode: development

## Requirements

### R1. Tum-Trust-Security Turnkey Package
Package the standalone Windows Kiosk Service executable/installer, Electron Kiosk Diagnostics Console (.exe/setup), and the HIL JavaCard / Virtual Camera testbed runner into `D:\TUM\setup-product\tum-trust-security`, accompanied by an installation guide and a smoke test verification script.

### R2. Tum-Quantum Turnkey Package
Package the Dockerized TUM-Quantum Reverse Proxy Gateway appliance into `D:\TUM\setup-product\tum-quantum`, containing docker-compose configurations, Dockerfile, setup script, exported offline Docker image archive (.tar/.tar.gz), architecture manual, and a health check verification script.

### R3. Tum-Socs Turnkey Package
Package the All-in-One Enterprise OpenSIEM Appliance into `D:\TUM\setup-product\tum-socs`, containing docker-compose configuration, exported offline Docker image archives for the ingestion engine and ClickHouse sink, Hallmark Console Web HUD, Electron Desktop installer/setup (.exe), installation guide, and automated smoke test scripts.

### R4. Tum-Agentic-Workos Turnkey Package
Package the Standalone Web Admin ERP Console and Thai Revenue e-Tax XML ETDA v2.1 sandbox integration package into `D:\TUM\setup-product\tum-agentic-workos`, accompanied by a comprehensive setup guide and verification routines.

### R5. Tum-Cybermesh Turnkey Package
Package the Standalone Sensor Agent binary for Windows/Linux and SOAR firewall connectors into `D:\TUM\setup-product\tum-cybermesh`, complete with deployment runbooks and agent verification scripts.

### R6. Tum-Trust-Fabric Turnkey Package
Package the Sovereign Corridor E-Gate Docker Gateway appliance with ICAO Doc 9303 CSCA verification setup into `D:\TUM\setup-product\tum-trust-fabric`, including exported offline Docker image archive (.tar/.tar.gz), docker-compose configuration, deployment manual, and verification test scripts.

### R7. Tum-Central-Director Turnkey Package
Package the Electron Desktop IDE installer (.exe) for enterprise operator management into `D:\TUM\setup-product\tum-central-director`, complete with an installation and configuration guide and verification checks.

### R8. Master Setup & Verification Index
Provide a master index and overview documentation at `D:\TUM\setup-product\README.md` cataloging all 7 product directories, system prerequisites, and verification steps.

## Acceptance Criteria

### Package Structure & Turnkey Deliverables
- [ ] `D:\TUM\setup-product` contains dedicated subdirectories for all 7 products: `tum-trust-security`, `tum-quantum`, `tum-socs`, `tum-agentic-workos`, `tum-cybermesh`, `tum-trust-fabric`, and `tum-central-director`.
- [ ] Windows application packages (`tum-trust-security`, `tum-socs`, `tum-central-director`) contain executable installer files (`.exe` or setup packages).
- [ ] Dockerized appliance packages (`tum-quantum`, `tum-socs`, `tum-trust-fabric`) contain `docker-compose.yml`, Dockerfiles, startup scripts, and exported image archives (`.tar` or `.tar.gz`).
- [ ] Agent and integration packages (`tum-cybermesh`, `tum-agentic-workos`) contain executable binaries or runnable integration packages and configuration runbooks.

### Documentation & Verification
- [ ] Every product subdirectory in `D:\TUM\setup-product` contains a step-by-step installation and operation guide (`INSTALL.md` or `README.md`).
- [ ] Every product subdirectory in `D:\TUM\setup-product` contains a standalone smoke test or health check script to programmatically verify deployment readiness.
- [ ] `D:\TUM\setup-product\README.md` provides a master index of all deliverables, directory paths, and verification commands.
