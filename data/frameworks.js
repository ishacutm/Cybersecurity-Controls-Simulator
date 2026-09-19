window.SIM_FRAMEWORKS = {
  "disclaimer": "Academic and conceptual mapping. Aligned with relevant industry practices for educational demonstration purposes. ABC University is a fictional simulation; no formal certification or compliance warranty is implied.",
  "nistFunctions": [
    {
      "id": "GOVERN",
      "name": "Govern (GV)",
      "description": "Establish and monitor the university's cybersecurity risk management strategy, expectations, and policy enforcement.",
      "controls": [
        "C-01",
        "C-03",
        "C-12"
      ],
      "categories": [
        {
          "code": "GV.OC",
          "name": "Organizational Context",
          "description": "The circumstances \u2014 mission, stakeholder expectations, and legal requirements \u2014 surrounding ABC University risk decisions are understood."
        },
        {
          "code": "GV.RM",
          "name": "Risk Management Strategy",
          "description": "University priorities, risk tolerances, and resource allocation are established and communicated."
        },
        {
          "code": "GV.PO",
          "name": "Policy",
          "description": "Campus security policies (passwords, MFA, access control) are formalized, published, and communicated to staff and faculty."
        }
      ]
    },
    {
      "id": "IDENTIFY",
      "name": "Identify (ID)",
      "description": "Understand cybersecurity risk to assets, people, systems, and data within ABC University's academic enterprise.",
      "controls": [
        "C-01",
        "C-10"
      ],
      "categories": [
        {
          "code": "ID.AM",
          "name": "Asset Management",
          "description": "Inventories of physical servers, virtual machines, cloud buckets, and network devices are actively maintained."
        },
        {
          "code": "ID.RA",
          "name": "Risk Assessment",
          "description": "Vulnerabilities (V-001 through V-013) are identified, scored via 3x3 risk matrix, and prioritized for defensive control."
        }
      ]
    },
    {
      "id": "PROTECT",
      "name": "Protect (PR)",
      "description": "Implement safeguards to contain or limit the impact of potential cybersecurity events across university infrastructure.",
      "controls": [
        "C-01",
        "C-02",
        "C-03",
        "C-04",
        "C-05",
        "C-06",
        "C-09",
        "C-12"
      ],
      "categories": [
        {
          "code": "PR.AA",
          "name": "Identity Management & Access Control",
          "description": "MFA enforced for privileged access (C-02), least privilege RBAC (C-01), strong passphrases and lockout policies (C-03)."
        },
        {
          "code": "PR.AT",
          "name": "Awareness and Training",
          "description": "Faculty and staff trained to recognize phishing lures and report suspicious events (C-12)."
        },
        {
          "code": "PR.DS",
          "name": "Data Security",
          "description": "Data in transit protected via TLS 1.3 / HSTS (C-06); public S3 access blocked."
        },
        {
          "code": "PR.PS",
          "name": "Platform & Network Security",
          "description": "VLAN micro-segmentation (C-05), default-deny firewalls (C-04), and EDR protection on workstations (C-09)."
        }
      ]
    },
    {
      "id": "DETECT",
      "name": "Detect (DE)",
      "description": "Find and analyze possible cybersecurity attacks and compromises in real-time across campus systems.",
      "controls": [
        "C-07",
        "C-08",
        "C-09"
      ],
      "categories": [
        {
          "code": "DE.AE",
          "name": "Adverse Event Analysis",
          "description": "Inline Suricata IDS/IPS inspects packet streams (C-07) and SIEM aggregates event logs for multi-vector correlation (C-08)."
        },
        {
          "code": "DE.CM",
          "name": "Continuous Monitoring",
          "description": "Network traffic, host processes, and authentication logs continuously analyzed for anomalous patterns and malicious activity."
        }
      ]
    },
    {
      "id": "RESPOND",
      "name": "Respond (RS)",
      "description": "Take action regarding a detected cybersecurity incident to contain damage and maintain academic continuity.",
      "controls": [
        "C-07",
        "C-08",
        "C-09"
      ],
      "categories": [
        {
          "code": "RS.MA",
          "name": "Incident Management",
          "description": "SOC triage playbooks trigger automated EDR host isolation and dynamic firewall shunting upon confirmed threat."
        },
        {
          "code": "RS.AN",
          "name": "Incident Analysis",
          "description": "Forensic memory captures and SIEM timelines analyzed to determine root cause and attack blast radius."
        },
        {
          "code": "RS.MI",
          "name": "Incident Mitigation",
          "description": "Compromised accounts suspended, infected nodes quarantined, and firewall rules updated to block malicious IPs."
        }
      ]
    },
    {
      "id": "RECOVER",
      "name": "Recover (RC)",
      "description": "Restore assets and operations that were impacted by a cybersecurity incident to normal university operations.",
      "controls": [
        "C-11"
      ],
      "categories": [
        {
          "code": "RC.RP",
          "name": "Recovery Execution",
          "description": "Immutable 3-2-1 WORM backups restored into isolated staging environments to resume academic and financial services (C-11)."
        },
        {
          "code": "RC.CO",
          "name": "Recovery Communication",
          "description": "Post-incident reporting, restoration verification checklists, and lessons learned integrated into future controls."
        }
      ]
    }
  ],
  "cisControls": [
    {
      "id": "CIS-01",
      "name": "Inventory and Control of Enterprise Assets",
      "safeguard": "1.1 / 1.2",
      "controls": [
        "C-10"
      ],
      "description": "Actively manage all campus devices; maintain up-to-date asset CMDB."
    },
    {
      "id": "CIS-03",
      "name": "Data Protection",
      "safeguard": "3.10 / 3.11",
      "controls": [
        "C-06",
        "C-11"
      ],
      "description": "Encrypt sensitive student records in transit (TLS 1.3) and protect backups with WORM immutability."
    },
    {
      "id": "CIS-04",
      "name": "Secure Configuration of Assets and Software",
      "safeguard": "4.1 / 4.4",
      "controls": [
        "C-04",
        "C-05"
      ],
      "description": "Deploy default-deny firewall ACLs and harden network switch ports with DHCP Snooping."
    },
    {
      "id": "CIS-05",
      "name": "Account Management",
      "safeguard": "5.2 / 5.4",
      "controls": [
        "C-01",
        "C-03"
      ],
      "description": "Enforce 14+ character passphrases, account lockout, and eliminate default credentials."
    },
    {
      "id": "CIS-06",
      "name": "Access Control Management",
      "safeguard": "6.3 / 6.4",
      "controls": [
        "C-01",
        "C-02"
      ],
      "description": "Mandate FIDO2/TOTP MFA for all administrators and enforce least-privilege RBAC."
    },
    {
      "id": "CIS-07",
      "name": "Continuous Vulnerability Management",
      "safeguard": "7.1 / 7.2",
      "controls": [
        "C-10"
      ],
      "description": "Execute weekly vulnerability scans; remediate critical CVEs within 72 hours."
    },
    {
      "id": "CIS-08",
      "name": "Audit Log Management",
      "safeguard": "8.2 / 8.5",
      "controls": [
        "C-08"
      ],
      "description": "Collect, review, and retain security logs in a centralized, tamper-evident SIEM for 365 days."
    },
    {
      "id": "CIS-10",
      "name": "Malware Defenses",
      "safeguard": "10.1 / 10.2",
      "controls": [
        "C-09"
      ],
      "description": "Deploy behavioral Next-Gen EDR with automated process quarantine across all workstations."
    },
    {
      "id": "CIS-11",
      "name": "Data Recovery",
      "safeguard": "11.1 / 11.2",
      "controls": [
        "C-11"
      ],
      "description": "Maintain immutable 3-2-1 backups; perform scheduled restoration drills with hash verification."
    },
    {
      "id": "CIS-12",
      "name": "Network Infrastructure Management",
      "safeguard": "12.1 / 12.2",
      "controls": [
        "C-04",
        "C-05"
      ],
      "description": "Segment student and administrative subnets into dedicated 802.1Q VLANs; isolate OOBM."
    },
    {
      "id": "CIS-13",
      "name": "Network Monitoring and Defense",
      "safeguard": "13.2 / 13.3",
      "controls": [
        "C-07"
      ],
      "description": "Deploy inline Suricata IDS/IPS on core switch trunks with automatic signature updates."
    },
    {
      "id": "CIS-14",
      "name": "Security Awareness and Skills Training",
      "safeguard": "14.1 / 14.2",
      "controls": [
        "C-12"
      ],
      "description": "Deliver annual cybersecurity training and monthly simulated phishing testing to all faculty and staff."
    }
  ],
  "isoControls": [
    {
      "clause": "A.5.15",
      "name": "Access Control",
      "controls": [
        "C-01",
        "C-02"
      ],
      "notes": "Rules to control physical and logical access based on business and security requirements."
    },
    {
      "clause": "A.8.5",
      "name": "Secure Authentication",
      "controls": [
        "C-02",
        "C-03"
      ],
      "notes": "Secure log-on procedures with multi-factor authentication for privileged accounts."
    },
    {
      "clause": "A.8.7",
      "name": "Protection Against Malware",
      "controls": [
        "C-09"
      ],
      "notes": "Deployment of behavioral detection and response agents with automated quarantine."
    },
    {
      "clause": "A.8.8",
      "name": "Management of Technical Vulnerabilities",
      "controls": [
        "C-10"
      ],
      "notes": "Information about technical vulnerabilities evaluated and addressed through patch management."
    },
    {
      "clause": "A.8.15",
      "name": "Logging",
      "controls": [
        "C-08"
      ],
      "notes": "Logs that record activities, exceptions, and security events produced, stored, and reviewed in SIEM."
    },
    {
      "clause": "A.8.20",
      "name": "Network Security",
      "controls": [
        "C-04",
        "C-05"
      ],
      "notes": "Networks secured, managed, and controlled to protect information in systems and applications."
    },
    {
      "clause": "A.8.21",
      "name": "Security of Network Services",
      "controls": [
        "C-04",
        "C-07"
      ],
      "notes": "Security mechanisms and service levels of network services identified and monitored."
    },
    {
      "clause": "A.8.24",
      "name": "Use of Cryptography",
      "controls": [
        "C-06"
      ],
      "notes": "Rules for effective use of cryptography (TLS 1.3 / AES-256) defined and implemented."
    },
    {
      "clause": "A.8.26",
      "name": "Application Security Requirements",
      "controls": [
        "C-04",
        "C-06"
      ],
      "notes": "Security requirements identified and addressed when developing or acquiring applications."
    },
    {
      "clause": "A.8.31",
      "name": "Separation of Development, Test and Production",
      "controls": [
        "C-01",
        "C-05"
      ],
      "notes": "Separation between development, testing, and production environments enforced via VLANs."
    },
    {
      "clause": "A.8.32",
      "name": "Change Management",
      "controls": [
        "C-04",
        "C-10"
      ],
      "notes": "Changes to information processing facilities and systems subject to formal change control."
    },
    {
      "clause": "A.8.34",
      "name": "Protection of Information Systems During Audit Testing",
      "controls": [
        "C-04",
        "C-08"
      ],
      "notes": "Audit tests planned and agreed upon to minimize disruption to operational processes."
    }
  ]
};
