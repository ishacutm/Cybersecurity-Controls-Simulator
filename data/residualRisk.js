window.SIM_RESIDUAL_RISK = [
  {
    "id": "RISK-01",
    "riskArea": "Credential Attacks Against MFA-Protected Accounts",
    "inherentRisk": "Critical (9/9)",
    "residualRiskLevel": "Low (2/9)",
    "statusColor": "green",
    "primaryControls": [
      "C-02 Multi-Factor Authentication",
      "C-03 Password & Account Security"
    ],
    "whyRiskRemains": "While standard credential stuffing and dictionary attacks are virtually eliminated (99.9% reduction), sophisticated threat actors can attempt Adversary-in-the-Middle (AiTM) reverse proxy phishing (e.g. Evilginx) to capture session cookies, or execute MFA push notification fatigue against fatigued administrators. Hardware FIDO2 keys mitigate AiTM, but mobile push fallback retains a minor residual threat vector.",
    "compensatingDefences": "FIDO2 WebAuthn token binding, number-matching authentication prompts, continuous sign-in risk evaluation via Conditional Access, and automated anomalous impossible-travel alerts.",
    "futureAction": "Deprecate mobile push notifications for Tier 0 Domain Administrators in favor of exclusive FIDO2 YubiKey hardware tokens."
  },
  {
    "id": "RISK-02",
    "riskArea": "Student VLAN -> Finance/Database Lateral Movement",
    "inherentRisk": "High (6/9)",
    "residualRiskLevel": "Low (with Medium for remaining legacy exceptions)",
    "statusColor": "blue",
    "primaryControls": [
      "C-04 Firewall & ACL",
      "C-05 VLAN Network Segmentation",
      "C-07 IDS/IPS"
    ],
    "whyRiskRemains": "Micro-segmentation and default-deny ISFW rules drop direct layer-3 traffic from Student VLAN to Finance DB. However, specialized academic requirements (such as student work-study lab assistants accessing specific billing APIs or legacy dual-homed research servers) introduce pinpoint firewall pinhole exceptions that could theoretically be abused if an approved intermediate host is compromised.",
    "compensatingDefences": "Strict source IP binding on firewall rules, DPI inspection via Suricata on all permitted transit, continuous SIEM correlation on database access attempts, and short 30-day exception lifecycles.",
    "futureAction": "Enforce Zero-Trust Network Access (ZTNA) with micro-tunneling and device health attestation for any non-standard administrative exception."
  },
  {
    "id": "RISK-03",
    "riskArea": "Known Vulnerabilities on Critical Enterprise Servers",
    "inherentRisk": "Critical (9/9)",
    "residualRiskLevel": "Low\u2013Medium (depending on patch SLA & vendor disclosure window)",
    "statusColor": "yellow",
    "primaryControls": [
      "C-10 Patch & Vulnerability Management",
      "C-09 EDR Fleet",
      "C-04 Perimeter Firewall"
    ],
    "whyRiskRemains": "The 72-hour emergency patch SLA for CVSS \u22659.0 vulnerabilities dramatically compresses exposure, but cannot eliminate the zero-day window (time elapsed between zero-day public exploitation and patch availability/testing). Furthermore, complex ERP and Student Information Systems require regression testing to prevent unexpected academic outages, creating a transient exposure window.",
    "compensatingDefences": "Web Application Firewall (WAF) virtual patching, inline Suricata IPS signatures blocking exploit payloads, and Next-Gen EDR memory protection preventing arbitrary code execution regardless of file status.",
    "futureAction": "Implement automated canary blue/green testing environments to reduce staging regression lead times from 48 hours to under 6 hours."
  },
  {
    "id": "RISK-04",
    "riskArea": "Ransomware Destruction & Recovery Risk",
    "inherentRisk": "Critical (9/9)",
    "residualRiskLevel": "Low\u2013Medium (after immutable backup isolation)",
    "statusColor": "blue",
    "primaryControls": [
      "C-11 Backup and Recovery",
      "C-09 EDR",
      "C-01 Access Control"
    ],
    "whyRiskRemains": "Deploying 3-2-1 immutable WORM cloud backups guarantees that historical snapshot files cannot be altered, encrypted, or deleted by ransomware operators, solving permanent data loss. However, the operational Recovery Time Objective (RTO) required to pull multi-terabyte database images across the WAN and orchestrate bare-metal restoration still implies potential service downtime (4 to 12 hours) during a catastrophic enterprise disaster.",
    "compensatingDefences": "Local read-only immutable snapshot appliances for fast on-premises recovery, daily synthetic incremental verification, and automated quarterly sandbox restoration drills.",
    "futureAction": "Provision dedicated secondary disaster recovery hot-site with automated failover replication to bring RTO under 30 minutes."
  },
  {
    "id": "RISK-05",
    "riskArea": "Human Social Engineering & Spear-Phishing",
    "inherentRisk": "High (6/9)",
    "residualRiskLevel": "Medium (4/9)",
    "statusColor": "orange",
    "primaryControls": [
      "C-12 Security Awareness & Phishing Training",
      "C-02 MFA",
      "C-09 EDR"
    ],
    "whyRiskRemains": "Technical safeguards neutralize malware attachments and unauthorized logins, but human susceptibility cannot be completely reduced to zero. In a university environment with 1,200 staff and turnover among adjunct instructors, sophisticated AI-generated spear-phishing lures, vendor invoice fraud, and deepfake voice scams will continue to elicit clicks from a small percentage of users (baseline 4.2%).",
    "compensatingDefences": "One-click 'Report Phish' button with automated triage, mail gateway banner tagging of all external emails, out-of-band verbal authorization procedures for wire transfers >$5,000, and just-in-time micro-coaching.",
    "futureAction": "Deploy automated AI behavioral email analysis (Inky / Abnormal Security) to detect linguistic anomalies and impersonation in inbound messages."
  },
  {
    "id": "RISK-06",
    "riskArea": "Unmanaged Student Endpoints (BYOD Fleet)",
    "inherentRisk": "High (6/9)",
    "residualRiskLevel": "Medium (4/9)",
    "statusColor": "orange",
    "primaryControls": [
      "C-05 VLAN Network Segmentation",
      "C-04 Firewall / ACL"
    ],
    "whyRiskRemains": "ABC University cannot legally or operationally mandate the installation of university-managed EDR agents or configuration software on the personal laptops and smartphones of 8,000 students. Consequently, student devices will inevitably contract commodity malware, adware, and participate in external botnets while connected to the campus Wi-Fi.",
    "compensatingDefences": "Complete logical isolation of the Student VLAN (10.10.0.0/16); mandatory BSS wireless client isolation (peer student laptops cannot see or communicate with each other); strict perimeter egress inspection; DNS filtering blocking known malicious C2 domains.",
    "futureAction": "Deploy 802.1X Network Access Control (NAC) posture assessment that verifies minimum OS patch level before granting internet connectivity."
  }
];
