# 04_Central_Director — TUM Sovereign AgentOS
## ฝ่ายบริหารผลิตภัณฑ์ส่วนกลาง (Central Director Team)

> **คำขวัญ:** *"From Deep-Tech Engines to Turnkey Sovereign Agentic AI"*  
> **สถานะ:** Active Production Flagship 🟢  
> **ผลิตภัณฑ์เรือธง:** **TUM Sovereign AgentOS** (The World's First Enterprise Sovereign Agentic Platform)  
> **ขึ้นตรงต่อ:** ท่านประธานกรรมการบริหาร (Chairman Pasit) & สำนักประธานเจ้าหน้าที่บริหาร (CEO)

---

## 1. ผลิตภัณฑ์เรือธง: TUM Sovereign AgentOS

ต่อยอดจากความสำเร็จของเครื่องมือยุค Agentic Engineering อย่าง **Orca** (Agent Development Environment) และ **ECC** (Agentic Engineering Toolkit) ผนวกเข้ากับเทคโนโลยีอธิปไตยระดับลึก (Sovereign Deep-Tech) ของเครือ TUM Group สู่แพลตฟอร์มบริหารจัดการและควบคุมกองทัพปัญญาประดิษฐ์ระดับองค์กร:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TUM SOVEREIGN AGENTOS ECOSYSTEM                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  TUM Agentic Studio  │    │ TUM Agentic Director │    │    TUM AgentGate     │
│ (Visual Design HUD)  │    │ (Fleet Orchestration)│    │ (Sovereign Identity) │
└──────────┬───────────┘    └──────────┬───────────┘    └──────────┬───────────┘
           │                           │                           │
           └───────────────────────────┼───────────────────────────┘
                                       ▼
                       ┌──────────────────────────────┐
                       │    TUM AgentOps Sentinel     │
                       │ (eBPF Telemetry & Sandboxing)│
                       └──────────────────────────────┘
```

### 4 เสาหลักของแพลตฟอร์ม (The 4 Pillars):
1. **🎨 TUM Agentic Studio (`agentos/`):** Visual Architecture Canvas วาดพิมพ์เขียวสถาปัตยกรรมแล้วแปลงเป็น Jira Epics และคำสั่งแจกจ่าย Agent ใน Orca Worktrees อัตโนมัติ
2. **🕹️ TUM Agentic Director:** ระบบควบคุมกองทัพ AI Agent ควบคู่ทั้ง 5 โครงการ พร้อมกรอบวิศวกรรม ECC (*Plan $\rightarrow$ Eval $\rightarrow$ Code $\rightarrow$ Verify*)
3. **🔐 TUM AgentGate:** ระบบออกบัตรตัวตนและมอบสิทธิ์ (Delegated Agent Credential) ผูกกับ DOPA Thai ID พร้อมลงลายมือชื่อดิจิทัลทนควอนตัม **NIST FIPS 204 ML-DSA**
4. **🛡️ TUM AgentOps Sentinel:** เรดาร์วิเคราะห์พฤติกรรมความเสี่ยง (0-100) และระบบตัดตอนคำสั่งอันตราย (Prompt Injection / Malicious Shell) ในระดับเคอร์เนลด้วย eBPF จาก TUMSocs

---

## 2. โครงสร้างโฟลเดอร์ภายใน (Internal Architecture)

```
04_Central_Director/
├── agentos/
│   └── index.html               # TUM Sovereign AgentOS — Interactive Single-Page Application
├── bridge/
│   └── agentos-bridge.ps1       # Local Orca CLI Runtime Bridge & Multi-Fleet Controller
├── docs/
│   ├── TUM_SOVEREIGN_AGENTOS_BLUEPRINT.md # พิมพ์เขียวและข้อกำหนดสถาปัตยกรรมระบบ AgentOS
│   ├── TUM_DIRECTOR_TEAM_CHARTER.md       # ธรรมนูญทีม Central Director
│   └── GIT_FLOW.md                        # มาตรฐานการจัดการ Git Flow
├── visualizers/
│   └── index.html               # Reference Executive HUD (ส่งมอบให้ TUM-Socs เรียบร้อยแล้ว)
├── index.html                   # Root Redirect ไปยัง agentos/index.html
└── README.md                    # เอกสารภาพรวมทีม Central Director
```

---

## 3. วิธีการเปิดใช้งาน (Quickstart)

### เปิดใช้งานผ่าน Web Browser:
เปิดไฟล์ [agentos/index.html](file:///D:/TUM/tum-central-director/agentos/index.html) ในเบราว์เซอร์ เพื่อเข้าสู่หน้าจอ **War Room HUD, Studio Canvas, Fleet Director, AgentGate, และ Sentinel Defense** ได้ทันทีโดยไม่ต้องติดตั้งเซิร์ฟเวอร์ภายนอก

### เชื่อมต่อกับ Orca Runtime บนเครื่อง:
```powershell
# ตรวจสอบสถานะการเชื่อมต่อกับ Orca Worktrees
powershell -ExecutionPolicy Bypass -File bridge/agentos-bridge.ps1 -Action status

# ดูรายการ Terminal ของ Agent ทั้งหมดที่กำลังรันอยู่ใน Orca
powershell -ExecutionPolicy Bypass -File bridge/agentos-bridge.ps1 -Action list-terminals

# สั่งรันชุดทดสอบความปลอดภัยและการทำงานของระบบทั้งหมด
powershell -ExecutionPolicy Bypass -File bridge/agentos-bridge.ps1 -Action eval
```


---

## 3. Commercial Turnkey Packaging (`D:\TUM\setup-product\tum-central-director`)

ฝ่ายบริหารผลิตภัณฑ์ส่วนกลางได้จัดส่งมอบแอปพลิเคชัน Desktop สำหรับผู้ปฏิบัติงานระดับผู้บังคับการกองทัพ AI (Fleet Commander):

- **`desktop-app/TUM-Central-Director.exe`**: Standalone Windows Electron Application (238 MB) รวม Embedded Node.js, V8 Runtime, Chromium GUI, และ Web HUD
- **Launchers**:
  - `launch-desktop.cmd`: สคริปต์คลิกเดียวสำหรับ Windows Command Prompt
  - `launch-desktop.ps1`: สคริปต์คลิกเดียวสำหรับ PowerShell
- **`smoke-test.ps1`**: สคริปต์ทดสอบความสมบูรณ์ของแอปพลิเคชัน PE Header, ไวยากรณ์ Main/Preload, และ Asset Manifest

### คำสั่งรัน Smoke Test:
```powershell
powershell -ExecutionPolicy Bypass -File D:\TUM\setup-product\tum-central-director\smoke-test.ps1
```
