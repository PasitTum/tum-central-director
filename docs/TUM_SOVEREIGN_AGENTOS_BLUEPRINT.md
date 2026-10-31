# TUM Sovereign AgentOS — Enterprise System Architecture & Product Blueprint
**Document ID:** `SPEC-DIR-2026-001`  
**Associated Jira Epic:** [`SCRUM-25`](https://daywakler.atlassian.net/browse/SCRUM-25)  
**Classification:** Confidential — TUM Group Executive Board  
**Target Release:** v1.0.0 Commercial Enterprise Edition  
**Owner:** Central Director Team (In collaboration with Trust Security, Socs, & Quantum)

---

## 1. Executive Summary & Vision (วิสัยทัศน์ผลิตภัณฑ์)

**TUM Sovereign AgentOS** คือแพลตฟอร์มบริหารจัดการและควบคุมกองทัพปัญญาประดิษฐ์ (Enterprise Sovereign Autonomous Agent Platform) รายแรกของโลกที่ผสานพลังระหว่าง:
1. **Agent Development Environment (ADE)** เช่นเดียวกับ **Orca** (Desktop Control-Plane & Multi-Worktree Orchestrator)
2. **Agentic Engineering Harness** เช่นเดียวกับ **ECC** (`affaan-m/ECC` / Evaluation-First & Systematic Agent Lifecycles)
3. **Sovereign Deep-Tech Ecosystem** ของเครือ **TUM** (Trust Security Identity, TUMSocs Active SIEM, และ TUMQuantum Post-Quantum Cryptography)

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

---

## 2. โครงสร้าง 4 เสาหลักของแพลตฟอร์ม (The 4 Pillar Architecture)

### 🎨 Pillar 1: TUM Agentic Studio (The Creative Front-End)
*สตูดิโอออกแบบสถาปัตยกรรมและถอดรหัสวิสัยทัศน์สู่การผลิตอัตโนมัติ*
- **Visual Architecture Canvas:** หน้าจอ Graphic Node Graph (Node-based Drag-and-Drop) ให้ผู้บริหารหรือ Product Architect ลากวางกล่องระบบ (Frontend, API Gateway, DB, Auth, Worker) และลากเส้นเชื่อมโยงความสัมพันธ์
- **Vision-to-Task Decomposition Engine:** ใช้ LLM ถอดรหัสภาพรวมของทั้ง Canvas ออกเป็น:
  - Technical Specifications (SDD)
  - Jira Epics และ User Stories
  - คำสั่ง Prompt เฉพาะทางสำหรับแจกจ่ายไปยัง Agent แต่ละสาขา
- **Real-Time WebGL/Canvas Live Prototyping:** แสดงผลหน้าจอแอปพลิเคชันที่สร้างขึ้นแบบ Live Preview รองรับการคลิกทดสอบบนหน้าจอจริง

---

### 🕹️ Pillar 2: TUM Agentic Director (The Orchestration Core)
*ระบบสั่งการและกำกับดูแลกองทัพ AI Agent ทำงานคู่ขนาน (ต่อยอดแนวคิด Orca + ECC)*
- **Parallel Worktree Fleet Manager:** สั่งสร้างและสลับ Git Worktree แยกโฟลเดอร์สำหรับ Agent แต่ละตัวโดยอัตโนมัติ ทำให้ Agent นับสิบตัวเขียนโค้ดและรันคอมไพล์พร้อมกันโดยไม่เกิด Git Collision
- **Unified ECC Engineering Harness:** บังคับใช้วงจรวิศวกรรมมาตรฐาน (*Plan $\rightarrow$ Eval-First $\rightarrow$ Code $\rightarrow$ Security Scan $\rightarrow$ Verify*)
- **Multi-Terminal Stream Multiplexer:** รวมหน้าจอ Terminal ของ Agent ทุกตัว (Antigravity, Claude Code, Codex, Custom LLMs) เข้ามาอยู่ในหน้าต่างเดียว พร้อมระบบ Live Diff และ Git Commit Inspector

---

### 🔐 Pillar 3: TUM AgentGate (Sovereign Identity & Delegated Trust)
*โครงสร้างพื้นฐานออกใบรับรองตัวตนและมอบสิทธิ์แก่ตัวแทนปัญญาประดิษฐ์ (Trust Security + Quantum)*
- **Proof-of-Human Delegation:** มนุษย์สแกนบัตรประชาชนหรือพาสปอร์ตผ่าน **TUM Trust Security** เพื่อออก **Delegated Agent Credential (DAC)** กำหนดขอบเขตอำนาจชัดเจน (เช่น อนุญาตให้เขียนโค้ดเฉพาะในโฟลเดอร์ `frontend/`, จำกัดงบ Token ไม่เกิน $10/วัน)
- **Post-Quantum Cryptographic Action Signing:** ทุกการ Commit โค้ดและการยิง API ของ Agent จะถูกประทับตรารับรองด้วยลายเซ็นดิจิทัลทนควอนตัม **NIST FIPS 204 ML-DSA (Dilithium)** จาก **TUMQuantum**
- **One-Touch Crisis Revocation:** ระบบเพิกถอนสิทธิ์ Agent ทันทีเมื่อตรวจพบพฤติกรรมน่าสงสัย

---

### 🛡️ Pillar 4: TUM AgentOps Sentinel (Observability & Runtime Defense)
*เรดาร์ตรวจจับพฤติกรรมและระบบตัดตอนภัยคุกคามในระดับเคอร์เนล (ต่อยอด TUMSocs)*
- **eBPF Agent Runtime Sniffing:** ดักจับคำสั่ง Shell, Network Traffic, และ File System Call ของ Agent ทันทีที่ระดับ Linux Kernel
- **Prompt Injection & Malicious Shell Interceptor:** สกัดกั้น Indirect Prompt Injections และคำสั่งอันตราย (เช่น `rm -rf`, `curl | bash`, การขโมย `.env` หรือ API Key)
- **Dynamic Behavioral Risk Scoring (0–100):** คำนวณคะแนนความเสี่ยงของ Agent แต่ละตัวแบบเรียลไทม์ พร้อมหน้าจอ **Risk Radar** และแสดงต้นทุน Token Burn Rate

---

## 3. มาตรฐานโครงสร้างข้อมูล (Unified Data Contracts)

### A. Delegated Agent Credential (DAC)
```json
{
  "$schema": "https://tum.group/schemas/agentgate/v1/dac.json",
  "tokenId": "dac_01j7x89q2m4k6e",
  "issuerHuman": {
    "citizenIdMasked": "1-1005-XXXXX-XX-1",
    "verificationAnchor": "DOPA_THAID_OIDC_ES256",
    "authorizedAt": "2026-11-01T06:00:00Z"
  },
  "agentProfile": {
    "agentId": "agent_antigravity_01",
    "role": "Frontend UI Architect",
    "model": "gemini-3.8-flash-high"
  },
  "delegatedPermissions": {
    "allowedWorktreePaths": ["D:/TUM/tum-central-director/agentos/*"],
    "allowedGitBranches": ["feature/*", "bugfix/*"],
    "prohibitedShellCommands": ["rm -rf *", "sudo", "curl", "Invoke-WebRequest"],
    "maxTokenBudgetUsd": 25.00
  },
  "cryptographicProof": {
    "algorithm": "NIST_FIPS_204_ML_DSA_65",
    "signature": "3a8f90b1c2e4...[CRYSTALS-Dilithium-65-Signature]...f9"
  }
}
```

### B. Agent Telemetry Event (TUMSocs Integration)
```json
{
  "eventId": "evt_789123849102",
  "timestamp": "2026-11-01T06:01:15.204Z",
  "agentId": "agent_antigravity_01",
  "worktree": "D:/TUM/tum-central-director",
  "actionType": "SHELL_EXECUTION",
  "command": "dotnet test --no-build",
  "riskScore": 4,
  "mitigationPolicy": "ALLOW_AUDITED",
  "tamperProofChainHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

---

## 4. แผนงานการผสานรวมระดับ Local กับ Orca CLI

TUM Sovereign AgentOS สามารถเชื่อมต่อกับ Orca ที่รันอยู่บนเครื่องผ่าน `bridge/agentos-bridge.ps1`:
- อ่านข้อมูล Worktrees สดจาก `orca worktree list --json`
- ดักจับและส่งข้อความตรงเข้า Terminal สดผ่าน `orca terminal send --terminal <id> --text "<cmd>" --enter`
- ซิงค์สถานะ Git branch และสถานะการทดสอบ Unit Tests จากทุกคลังในเครือ TUM เข้าสู่หน้าจอเดียว
