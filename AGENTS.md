# AGENTS.md — TUM Central Director Agent Operating Mandate
**Authority:** Office of the CTA & Resident Technical Auditor for Fleet HUD & Console (RTA-07)  
**Baseline Standard:** [EI-VS v2.0.0 (TUM-STD-ENG-001)](file:///D:/TUM/tum-central-director/GEMINI.md)  
**Status:** STRICT ENFORCEMENT  

---

## 1. Agent Attitude & Operational Calibration

Every AI coding agent operating within `tum-central-director` must strictly adhere to the following principles:

1. **Telemetry & Attack Map Truthfulness:**
   - Visual Attack Map nodes, threat telemetry feeds, and system status indicators must accurately reflect the true operational state of backend services.
   - If a backend subsidiary service is unreachable or offline, the HUD must visibly surface an `OFFLINE` or `DISCONNECTED` badge. Generating simulated live attacks or fake security events to make the HUD look dynamic is strictly prohibited.

2. **Cryptographic Integrity:**
   - In `agentgate.ts` and related authentication gates, do NOT prepend fake `mldsa65_` strings to HMAC-SHA512 hashes. Bind to verified post-quantum libraries or explicitly label tokens as classical HMAC testing tokens.

3. **Zero-Persona & Direct Communication:**
   - Eliminate sycophancy, flattery, and conversational filler. Communicate directly using verified telemetry, network status, and operational logs.

4. **Mandatory Verification Gate:**
   - Before completing tasks:
     ```bash
     npm test
     ```
