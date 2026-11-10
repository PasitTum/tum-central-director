# TUM Central Director — Turnkey Fleet Command & Threat Orchestration IDE

**Product**: TUM Central Director Enterprise Suite v1.0.0  
**Target Environment**: Windows 10/11 (64-bit) / Windows Server 2019/2022 / Docker Linux  
**Design Standard**: Hallmark Console Theme (0 sloplint violations, OKLCH Graphite/Amber, No Neon Bloom)  

---

## 1. Package Contents
```
setup-product/tum-central-director/
├── README.md                              # Master product architecture & catalog
├── INSTALL.md                             # Step-by-step enterprise deployment runbook
├── INSTALL_AND_QUICKSTART_GUIDE.md        # Consolidated operator quickstart guide
├── smoke-test.ps1                         # Standalone smoke test & verification script
├── launch-desktop.cmd                     # One-click Windows CMD application launcher
├── launch-desktop.ps1                     # One-click PowerShell application launcher
├── Dockerfile                             # Headless container runner manifest
└── desktop-app/                           # Turnkey Standalone Windows Application
    ├── TUM-Central-Director.exe           # Pre-packaged 249MB Electron desktop runtime
    ├── locales/                           # Chromium locale packs
    ├── d3dcompiler_47.dll, dxcompiler.dll, ffmpeg.dll, vulkan-1.dll
    └── resources/
        └── app/                           # Embedded application runtime
            ├── package.json               # Manifest pointing to dist/main/electron-main.js
            └── dist/                      # Pre-compiled application runtime
                ├── main/                  # electron-main.js, preload.cjs, sentinel.js, agentgate.js
                ├── renderer/              # index.html (72KB Hallmark Console Web HUD)
                ├── cli/                   # Director CLI tools
                ├── mcp/                   # Model Context Protocol services
                └── shared/                # Common types and utilities
```

---

## 2. Installation & Quickstart

### Method A: Standalone Windows Executable
1. Navigate to the `desktop-app/` directory:
   ```powershell
   cd D:\TUM\setup-product\tum-central-director\desktop-app
   ```
2. Double-click or run `TUM-Central-Director.exe`.
3. The Fleet Command Console opens with the Visual Attack Map, Sovereign Fleet Topology, and Threat Mitigations.

### Method B: One-Click Quick Launchers
Double-click `launch-desktop.cmd` in the `setup-product/tum-central-director/` root folder, or run via PowerShell:
```powershell
cd D:\TUM\setup-product\tum-central-director
.\launch-desktop.ps1
```

### Method C: Headless Container Mode
```bash
docker build -t tum-central-director .
docker run -d -p 7799:7799 -p 8443:8443 --name central-director tum-central-director
```

---

## 3. Verification Smoke Test
Run the turnkey package smoke test:
```powershell
cd D:\TUM\setup-product\tum-central-director
powershell -ExecutionPolicy Bypass -File .\smoke-test.ps1
```
The test verifies executable binary integrity (>100MB), preload scripts, embedded Hallmark Console HUD, launch scripts, and documentation files.
