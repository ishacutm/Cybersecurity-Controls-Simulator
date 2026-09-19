window.SIM_ROADMAP = [
  {
    "phase": 1,
    "title": "Phase 1 \u2013 Immediate Containment & Foundational Defences",
    "days": "Days 0\u20137",
    "status": "COMPLETED",
    "objective": "Eliminate critical attack vectors immediately: mandate MFA on perimeter entry points, patch emergency firewall leaks, and establish baseline security logging.",
    "tasks": [
      {
        "id": "T1-01",
        "title": "Mandate MFA on Privileged Accounts & VPN Gateway",
        "controlId": "C-02",
        "owner": "Identity & Directory Lead",
        "dependencies": "IdP FIDO2/TOTP Connector",
        "expectedOutcome": "100% of 25 administrators and 120 faculty/staff accounts protected by MFA; password-only VPN blocked.",
        "verification": "Test MFA-01 and MFA-02 execution against external VPN portal."
      },
      {
        "id": "T1-02",
        "title": "Emergency Firewall Deny Rules on ISFW & P-NGFW",
        "controlId": "C-04",
        "owner": "Perimeter Security Lead",
        "dependencies": "Network topology map & VLAN assignment table",
        "expectedOutcome": "Default-deny enforced on inter-VLAN interfaces; remove broad legacy ANY-ANY test exceptions.",
        "verification": "Execute NET-01 ping and port probes from Student VLAN 10 to Finance DB VLAN 60."
      },
      {
        "id": "T1-03",
        "title": "Centralized Authentication Logging Forwarding",
        "controlId": "C-08",
        "owner": "SOC Logging Engineer",
        "dependencies": "Syslog forwarders on Active Directory DCs",
        "expectedOutcome": "Logons, failed auths, and Kerberos ticket events streamed in real-time to SIEM cluster.",
        "verification": "Generate auth failure (Event 4625) and verify SIEM query visibility in <2s."
      },
      {
        "id": "T1-04",
        "title": "Firewall Drop & State Tracking Syslog Pipeline",
        "controlId": "C-04",
        "owner": "Network Operations Team",
        "dependencies": "Firewall Syslog Daemon & Logstash pipeline",
        "expectedOutcome": "100% of perimeter and internal firewall drop events logged with src/dst IP, port, and rule ID.",
        "verification": "Review SIEM firewall drop dashboard under simulated test probing."
      }
    ]
  },
  {
    "phase": 2,
    "title": "Phase 2 \u2013 Access Hardening & Threat Telemetry Expansion",
    "days": "Days 8\u201330",
    "status": "IN_PROGRESS",
    "objective": "Enforce principle of least privilege, eliminate unencrypted web protocols, deploy EDR fleet, and formalize server vulnerability scanning.",
    "tasks": [
      {
        "id": "T2-01",
        "title": "RBAC Migration & Revocation of Workstation Local Admin Rights",
        "controlId": "C-01",
        "owner": "Directory Services Team",
        "dependencies": "Departmental role matrix & Privileged Identity Management (PIM)",
        "expectedOutcome": "Local admin rights removed from 1,200 faculty/staff PCs; access mapped strictly to approved security groups.",
        "verification": "Audit GPO application and attempt privileged local software installation."
      },
      {
        "id": "T2-02",
        "title": "HTTPS/TLS Enforcement & Protocol Modernization",
        "controlId": "C-06",
        "owner": "PKI & Enterprise Systems Specialist",
        "dependencies": "Automated ACME / Let's Encrypt CA integration",
        "expectedOutcome": "100% public and internal web services redirect to HTTPS (TLS 1.3); HSTS headers active; Telnet/FTP disabled.",
        "verification": "Execute TLS-01 automated test probe against HTTP port 80."
      },
      {
        "id": "T2-03",
        "title": "SIEM Log Source Onboarding (Phase 2 Expansion)",
        "controlId": "C-08",
        "owner": "SOC Analyst Lead",
        "dependencies": "SIEM indexing capacity & rsyslog certs",
        "expectedOutcome": "Core servers, database audit trails, and switch control plane logs streaming to SIEM.",
        "verification": "Check SIEM source list and trigger test audit message (SIEM-01)."
      },
      {
        "id": "T2-04",
        "title": "Endpoint Detection & Response (EDR) Rollout",
        "controlId": "C-09",
        "owner": "Endpoint Security Specialist",
        "dependencies": "Intune / Jamf automated deployment packages",
        "expectedOutcome": "EDR agents deployed and active on \u226598% of managed faculty and administrative workstations.",
        "verification": "Execute test canary file (EDR-01) and verify automated quarantine."
      },
      {
        "id": "T2-05",
        "title": "Server Patch Inventory & Emergency SLA Formalization",
        "controlId": "C-10",
        "owner": "Systems Administration Team",
        "dependencies": "Tenable/Nessus enterprise scanner",
        "expectedOutcome": "100% of campus servers inventoried in CMDB; 72-hour emergency patch SLA established; Apache RCE resolved.",
        "verification": "Execute PATCH-01 post-remediation vulnerability re-scan."
      }
    ]
  },
  {
    "phase": 3,
    "title": "Phase 3 \u2013 Segmentation Validation, Resilient Backups & IDS/IPS",
    "days": "Days 31\u201360",
    "status": "SCHEDULED",
    "objective": "Deepen micro-segmentation, tune intrusion detection sensors, air-gap backup infrastructure, and conduct real-world restoration drills.",
    "tasks": [
      {
        "id": "T3-01",
        "title": "VLAN Micro-Segmentation & DAI/DHCP Snooping Validation",
        "controlId": "C-05",
        "owner": "Network Infrastructure Lead",
        "dependencies": "Access switch firmware updates & port mapping",
        "expectedOutcome": "DHCP snooping and Dynamic ARP Inspection enforced on all access edge ports; client isolation verified.",
        "verification": "Inject rogue DHCP and ARP spoof frames; verify automatic port security violation shutdown."
      },
      {
        "id": "T3-02",
        "title": "Inline Suricata IDS/IPS Sensor Deployment & Rule Tuning",
        "controlId": "C-07",
        "owner": "SOC Threat Hunter",
        "dependencies": "Core switch 10Gbps SPAN/TAP aggregation",
        "expectedOutcome": "Inline DPI active on inter-VLAN links; false positive rate tuned <2% for academic traffic.",
        "verification": "Execute IDS-01 port-scan simulation and verify SOC alert creation within 2 seconds."
      },
      {
        "id": "T3-03",
        "title": "EDR Policy Expansion & Host Isolation Automation",
        "controlId": "C-09",
        "owner": "Endpoint Security Specialist",
        "dependencies": "SOC SOAR playbook integration",
        "expectedOutcome": "Automated host isolation triggered on confirmed ransomware heuristics or LSASS credential dump.",
        "verification": "Test automated containment playbook on isolated sandbox VM."
      },
      {
        "id": "T3-04",
        "title": "Backup Immutability (WORM) & Air-Gap Vaulting",
        "controlId": "C-11",
        "owner": "Storage & DR Architect",
        "dependencies": "S3 Object Lock compliance storage target",
        "expectedOutcome": "Finance Database and SIS backups protected by 30-day immutable WORM lock; credentials isolated from AD.",
        "verification": "Attempt programmatic deletion of backup snapshot using standard domain admin credentials (must be rejected)."
      },
      {
        "id": "T3-05",
        "title": "Automated Database Sandbox Restoration Drill",
        "controlId": "C-11",
        "owner": "Disaster Recovery Team Lead",
        "dependencies": "Isolated staging hypervisor container",
        "expectedOutcome": "Finance Database successfully restored within 4-hour RTO; cryptographic checksums match production.",
        "verification": "Execute BKUP-01 automated restoration verification drill."
      }
    ]
  },
  {
    "phase": 4,
    "title": "Phase 4 \u2013 Governance, Awareness Culture & Continual Assurance",
    "days": "Days 61\u201390",
    "status": "SCHEDULED",
    "objective": "Address lingering legacy exceptions, roll out comprehensive user security awareness, formalize policy governance, and deploy metrics dashboard.",
    "tasks": [
      {
        "id": "T4-01",
        "title": "Legacy Application & Specialized Lab Remediation",
        "controlId": "C-04",
        "owner": "Academic IT Support & Lab Managers",
        "dependencies": "Departmental research grant audits",
        "expectedOutcome": "Isolated reverse proxy deployed for legacy HVAC; research compute nodes migrated to screened DMZ.",
        "verification": "Re-scan departmental subnets to ensure no unauthorized direct internet exposure."
      },
      {
        "id": "T4-02",
        "title": "University-Wide Security Awareness & Phishing Simulation",
        "controlId": "C-12",
        "owner": "Cybersecurity Training Coordinator",
        "dependencies": "LMS training module & PhishDefense platform",
        "expectedOutcome": "\u226595% completion rate across faculty/staff; phishing failure click-rate reduced to <5%.",
        "verification": "Execute AWARE-01 phishing report simulation and analyze monthly campaign click metrics."
      },
      {
        "id": "T4-03",
        "title": "Information Security Policy Formalization & Governance",
        "controlId": "C-01",
        "owner": "Chief Information Security Officer (CISO)",
        "dependencies": "University Senate & Legal Counsel review",
        "expectedOutcome": "Formally ratify Password Policy, Acceptable Use Policy, Data Classification, and Incident Response Playbooks.",
        "verification": "Publish ratified policies on internal employee portal with annual acknowledgement requirement."
      },
      {
        "id": "T4-04",
        "title": "Quarterly Access Certification & Privilege Attestation",
        "controlId": "C-01",
        "owner": "Identity Governance Analyst",
        "dependencies": "PIM access logs and department rosters",
        "expectedOutcome": "Department heads formally certify all privileged role assignments; revoke orphaned accounts.",
        "verification": "Review completed quarterly attestation reports for Finance, HR, and IT teams."
      },
      {
        "id": "T4-05",
        "title": "Continuous Metrics & Executive Security Dashboard",
        "controlId": "C-08",
        "owner": "Cybersecurity Operations Team",
        "dependencies": "SIEM API integration & BI reporting suite",
        "expectedOutcome": "Executive dashboard displaying real-time control health, coverage metrics, and residual risk indicators.",
        "verification": "Validate dashboard data freshness and automated weekly summary distribution to University leadership."
      }
    ]
  }
];
