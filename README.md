# ABC University – Cybersecurity Controls Implementation & Verification Simulator

> **Course / Academic Program:** Week 3 Cybersecurity Educational Practicum  
> **Target Environment:** ABC University *(Fictional Academic Enterprise)*  
> **Core Focus:** Security-Control Lifecycle: Vulnerability → Requirement → Control → Implementation → Configuration → Verification → Remediation → Retest → Success Metrics → Residual Risk.

---

## ⚠️ Important Simulation & Safety Disclaimer

**THIS IS A 100% CONCEPTUAL / SIMULATED ACADEMIC ENVIRONMENT.**  
- **No real network scanning, exploitation, packet sniffing, or attacks** are conducted.  
- **No real systems, IP addresses, or university accounts** are accessed.  
- All IP addresses adhere to RFC 1918 private scopes (e.g., `10.10.0.0/16`, `10.60.0.0/24`).  
- All test results, SIEM alerts, audit logs, and metrics are simulated models designed for defensive cybersecurity education.  
- Framework alignments (NIST CSF 2.0, CIS Controls v8, ISO/IEC 27001:2022) reflect best-practice mappings and do **not** claim official certification.

---

## 🏛️ ABC University Environment Specifications

- **Student Population:** ~8,000 BYOD devices
- **Staff Population:** ~1,200 administrative and operational personnel
- **Administrators:** ~25 IT systems, network, and database administrators
- **Faculty/Staff Accounts:** ~120 core departmental accounts
- **Critical Data Assets:**
  - Finance Database & General Ledger (`VLAN 60` - Crown Jewels)
  - Student Information System (SIS / FERPA Protected)
  - Learning Management System (Moodle / `VLAN 40`)
  - University Research & Patent Repository

### Network Segmentation Topology
```
Untrusted Internet (WAN)
          │
          ▼
Perimeter Next-Gen Firewall / IPS (P-NGFW)
          │
          ├──────────────────────────┐
          ▼                          ▼
Public DMZ (VLAN 100)        VPN Gateway (MFA Enforced)
• web.abc.edu / Mail                 │
                                     ▼
                      Core Distribution Switch (L3 802.1Q)
                                     │
    ┌──────────────┬─────────────────┼─────────────────┬──────────────┐
    ▼              ▼                 ▼                 ▼              ▼
 VLAN 10        VLAN 20           VLAN 30           VLAN 40        VLAN 70
Student BYOD  Faculty/Staff      Admin Office       App Tier      Mgmt (OOBM)
(Untrusted)   (Workstations)     (RBAC / PIM)     (Moodle/ERP)    (Jumpbox)
                                     │
                           [ ISFW Filter Barrier ]
                                     │
                                     ▼
                                  VLAN 60
                            Finance / Database Tier
                                (Crown Jewels)
```

---

## 🚀 Quick Start Guide

### 1. Launch with Python (Zero Dependencies)
```bash
cd /Users/ishabharti/.gemini/antigravity/scratch/abc-university-controls-simulator
python3 server.py
```
Open your browser and navigate to: **`http://localhost:8080`**

---

## 🎯 18-Step Evaluator Demo Flow

The simulator features a built-in **Guided Evaluator Tour** (accessible via the top header button) which walks through the 18 steps:

1. **Dashboard:** Review overall control implementation coverage (12 controls, 13 vulnerabilities, 16 verification tests).
2. **Security Architecture:** Open interactive topology diagram.
3. **Inspect Finance/DB VLAN:** Click `VLAN 60` node to display Purpose, Threat, and Controls.
4. **Week 2 Vulnerabilities:** Inspect `V-001 Poor Network Segmentation`.
5. **Security Controls:** Inspect `C-04 Firewall and ACL` specification.
6. **Student ➔ Finance/DB Test (Initial):** Run `SIM-01` verification test.
7. **Initial FAIL Demonstrated:** Observe FAIL result caused by temporary broad ACL exception `#099`.
8. **Apply Remediation:** Deprecate broad rule and inject explicit `Rule 102 DENY`.
9. **Retest:** Re-execute the verification probe against updated ACL table.
10. **Retest PASS + Telemetry Logged:** Verify traffic dropped and structured Syslog/SIEM event `#9824` generated.
11. **Demonstrate MFA:** Run `MFA-01`, `MFA-02`, and `MFA-03` authentication challenge tests.
12. **Attack Simulator & SIEM:** Run lateral movement simulation with defences active; view Suricata IDS and ISFW drop.
13. **Audit Checklist:** Review PASS and PARTIAL audit checklist items with raw evidence modal.
14. **Best-Practice Alignment:** Review NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover), CIS v8, and ISO/IEC 27001 mappings.
15. **Simulated Success Metrics:** Verify 8 institutional KPI targets (100% MFA, 0 DB leaks, ≥98% EDR).
16. **90-Day Roadmap:** Review Phase 1 through 4 execution timeline and task owners.
17. **Residual Risk Assessment:** Examine post-implementation residual risk ratings and why risk remains.
18. **About & Simulation Disclaimer:** Confirm academic simulation boundaries and educational rubric alignment.

---

## 📊 Application Architecture & Files

```
├── index.html                 # Main application shell with navigation, viewports, and SIEM dock
├── styles.css                 # SOC dark theme, responsive layout, badges, modals, and diagrams
├── app.js                     # Core application router, configuration engine, and tour controller
├── server.py                  # Standalone local HTTP server script
├── data/
│   ├── environment.js         # ABC University network segments, VLANs, and asset metadata
│   ├── vulnerabilities.js     # 13 simulated Week 2 vulnerabilities (V-001 to V-013)
│   ├── controls.js            # 12 security controls with 18 technical lifecycle fields (C-01 to C-12)
│   ├── verificationTests.js   # 16 automated verification test vectors
│   ├── auditChecklist.js      # Audit checklist matrix with simulated evidence artifacts
│   ├── frameworks.js          # NIST CSF 2.0, CIS Controls v8, and ISO/IEC 27001:2022 mappings
│   ├── roadmap.js             # 90-day implementation roadmap broken into 4 phases
│   └── residualRisk.js        # Technical analysis of why residual risk remains post-implementation
└── components/
    ├── networkDiagram.js      # Interactive SVG topology diagram with clickable inspection
    ├── remediationWorkflow.js # Interactive SIM-01 lifecycle widget (FAIL -> Gap -> Fix -> Retest PASS)
    ├── attackSimulator.js     # Safe educational lateral movement attack-path simulation
    └── telemetryConsole.js    # Live simulated SIEM event log feed with filtering and search
```
