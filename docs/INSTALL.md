# TUM Central Director — Installation & Operator Configuration Manual

**Product Version**: 1.0.0  
**Classification**: Enterprise Sovereign Agent IDE & Autonomous Fleet Command Console  
**Target Environment**: Windows 10/11 (64-bit), Windows Server 2019/2022, Docker Linux Container  

---

## 1. Prerequisites & Host Readiness

TUM Central Director is distributed as a turnkey, standalone desktop application and does not require external Node.js installations or internet access during runtime.

### 1.1 Hardware Prerequisites
- **CPU**: x86_64 dual-core or quad-core processor (minimum 2.0 GHz).
- **RAM**: Minimum 4 GB RAM (recommended 8 GB for large agent topologies > 50 nodes).
- **Disk Storage**: Minimum 600 MB free space (application bundle: 285 MB).
- **Display**: Minimum 1280x720 screen resolution (recommended 1920x1080 Full HD).

### 1.2 Operating System Prerequisites
- **Windows**: Windows 10 64-bit (Version 2004 / Build 19041 or later), Windows 11, or Windows Server 2019/2022.
- **Visual C++ Redistributable**: Bundled within the application directory (`d3dcompiler_47.dll`, `dxcompiler.dll`).
- **Network Ports**:
  - `7799/tcp`: Inbound CyberMesh socket sensor telemetry endpoint.
  - `8443/tcp`: Secure Central Director HTTPS operator API.
  - `50051/tcp`: gRPC corridor telemetry gateway connection (optional).

---

## 2. Installation & Launch Options

### Option A: Direct Standalone Executable (Recommended)
The application is pre-packaged and ready to run immediately:
1. Navigate to the `desktop-app/` directory:
   ```powershell
   cd D:\TUM\setup-product\tum-central-director\desktop-app
   ```
2. Run `TUM-Central-Director.exe` or create a Windows Desktop shortcut pointing to it.
3. The application initializes the local IPC bridge, starts the Sentinel command guardrail, and renders the Hallmark Console HUD.

### Option B: Operator Launcher Scripts
From the product root directory:
- **Windows Command Prompt**: Run `launch-desktop.cmd`.
- **PowerShell**: Run `.\launch-desktop.ps1`.
Both scripts automatically detect `desktop-app\TUM-Central-Director.exe` and forward any optional runtime arguments.

### Option C: Headless Container Daemon
For cloud servers and CI/CD pipelines:
```bash
cd D:/TUM/setup-product/tum-central-director
docker build -t tum-central-director:latest .
docker run -d \
  -p 7799:7799 \
  -p 8443:8443 \
  -e DIRECTOR_PORT=7799 \
  -e TENANT_ID=tum-sovereign-tenant \
  --name central-director \
  tum-central-director:latest
```

---

## 3. Operator Configuration & Environment Variables

Central Director supports dynamic configuration via environment variables or a local `.env` file placed in `desktop-app/resources/app/`.

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DIRECTOR_PORT` | `7799` | Local TCP port for CyberMesh sensor ingestion |
| `DIRECTOR_HOST` | `127.0.0.1` | Network interface binding address |
| `TENANT_ID` | `tum-sovereign-tenant` | Cryptographic multi-tenant identifier |
| `SENTINEL_POLICY` | `STRICT` | Command guardrail policy: `PERMISSIVE`, `WARN`, `STRICT`, `BLOCK_ALL` |
| `AGENTGATE_DAC_SECRET` | Auto-generated | HMAC/ECDSA secret key for signing Delegated Agent Credentials |
| `AUDIT_LOG_DIR` | `./audit-vault` | Directory for WORM-compliant tamper-evident attestation logs |

---

## 4. Sentinel Interceptor Policy Configuration

The **Sentinel Interceptor** (`dist/main/sentinel.js`) provides real-time command inspection and prompt injection defense.

### 4.1 Threat Classification Rules
- **DESTRUCTIVE_COMMAND**: Detects and aborts destructive system calls:
  - Recursive file deletion (`rm -rf /`, `rmdir /s /q C:\`)
  - Storage volume format commands (`format C:`, `mkfs.ext4`)
  - Raw block device manipulation (`dd if=... of=/dev/...`)
- **PROMPT_INJECTION**: Analyzes LLM agent tool inputs for jailbreak phrases, role-override attacks ("ignore previous instructions"), and unauthorized credential extraction.
- **PRIVILEGE_ESCALATION**: Blocks unexpected `sudo`, `su`, or `Set-ExecutionPolicy Unrestricted` invocations without approved operator token.

### 4.2 Tuning Sentinel via Policy Profile
To customize the enforcement level, update `SENTINEL_POLICY`:
```powershell
$env:SENTINEL_POLICY = "STRICT"
.\launch-desktop.ps1
```
In `STRICT` mode, any command flagged as `DESTRUCTIVE_COMMAND` or `PROMPT_INJECTION` is rejected with an immediate exit code, logged to the audit ledger, and highlighted on the Visual Attack Map.

---

## 5. AgentGate Delegated Agent Credential (DAC) Management

The **AgentGate Engine** (`dist/main/agentgate.js`) issues cryptographically bound credentials to autonomous subagents.

### 5.1 Credential Lifecycle
1. **Minting**: An operator or orchestrator requests a DAC for an agent with explicit scopes (e.g. `['read:code', 'run:tests']`) and expiration (e.g. `3600s`).
2. **Attestation**: Each agent request presents its DAC header. Sentinel validates the digital signature against the tenant key.
3. **Revocation (Kill-Switch)**: In the event of anomalous agent behavior, the operator clicks **Revoke DAC** in the HUD or invokes the CLI revocation endpoint:
   ```bash
   node dist/cli/index.js revoke-dac --tokenId "DAC-NODE-042"
   ```
   Revocation propagates across the fleet event mesh within 50 milliseconds.

---

## 6. Visual Attack Map & Fleet Telemetry Setup

The Visual Attack Map aggregates telemetry from all deployed TUM CyberMesh socket sensors:
1. **Node Registration**: As CyberMesh agents launch (`tum-sensor-agent.cmd`), they register their host ID, IP, and OS platform with Central Director on port 7799.
2. **Topology Graph**: Nodes appear in the Hallmark Console HUD under the **Attack Map** tab.
3. **Suspicious Sockets**: If a sensor detects an unapproved outbound socket connection or C2 pattern, the node turns Amber/Red on the graph.
4. **SOAR Trigger**: The operator can select the affected node and click **Quarantine via SOAR**, dispatching blacklisting requests to connected Fortinet and Palo Alto perimeter firewalls.

---

## 7. Verification & Smoke Testing

Run the automated smoke test script to confirm package readiness:

```powershell
cd D:\TUM\setup-product\tum-central-director
powershell -ExecutionPolicy Bypass -File .\smoke-test.ps1
```

### Verification Criteria
1. Executable file `desktop-app\TUM-Central-Director.exe` exists and exceeds 100 MB.
2. Manifest `desktop-app\resources\app\package.json` specifies `dist/main/electron-main.js`.
3. Preload bridge `dist/main/preload.cjs` and Web HUD renderer `dist/renderer/index.html` exist (>50 KB).
4. Launchers `launch-desktop.cmd` and `launch-desktop.ps1` are present and valid.
5. Documentation files `README.md`, `INSTALL.md`, and `INSTALL_AND_QUICKSTART_GUIDE.md` are present.
6. The test outputs all `[PASS]` tags and terminates with exit code `0`.
