/**
 * ABC University - Simulated Environment Metadata
 * Purely conceptual & educational model for Week 3 Cybersecurity Controls Simulator.
 */

window.SIM_ENVIRONMENT = {
  institution: "ABC University",
  domain: "abc.edu",
  classification: "Simulated Higher Education Enterprise",
  userPopulation: {
    students: 8000,
    staff: 1200,
    administrators: 25,
    facultyStaffAccounts: 120,
    totalIdentities: 9345
  },
  criticalDataAssets: [
    {
      id: "DATA-01",
      name: "Finance Database & General Ledger",
      location: "VLAN 60 (Finance/DB Subnet - 10.60.0.15)",
      classification: "Restricted / Crown Jewels",
      description: "Student tuition records, university endowment accounts, faculty payroll, procurement balances."
    },
    {
      id: "DATA-02",
      name: "Student Information System (SIS)",
      location: "VLAN 60 (Database Tier - 10.60.0.20)",
      classification: "Confidential / FERPA Protected",
      description: "Academic transcripts, national identity/SSN details, admissions data, demographic records."
    },
    {
      id: "DATA-03",
      name: "Learning Management System (LMS / Moodle)",
      location: "VLAN 40 (Application Tier - 10.40.0.10)",
      classification: "Internal Sensitive",
      description: "Course assignments, faculty gradebooks, exam submissions, discussion forum archives."
    },
    {
      id: "DATA-04",
      name: "University Research Repository",
      location: "VLAN 40 / Cloud Storage (10.40.0.50)",
      classification: "Restricted / Proprietary IP",
      description: "Grant-funded biomedical and engineering data, pre-publication patents, export-controlled datasets."
    }
  ],
  networkSegments: [
    {
      id: "VLAN-10",
      vlanId: 10,
      name: "Student VLAN",
      cidr: "10.10.0.0/16",
      gateway: "10.10.0.1",
      trustLevel: "Untrusted (BYOD)",
      purpose: "Campus-wide student dormitory and campus Wi-Fi access.",
      securityFunction: "Isolated BYOD subnet; client isolation enabled; strictly prohibited from administrative assets.",
      threatAddressed: "Rogue student devices, infected personal laptops, internal port scanning, lateral probing.",
      relatedControls: ["C-04", "C-05", "C-07", "C-08"],
      relatedVulnerabilities: ["V-001", "V-005"],
      exampleVerification: "Ping or TCP probe from Student host (10.10.42.5) to Finance DB (10.60.0.15).",
      expectedResult: "BLOCKED & LOGGED (Dropped by ISFW ACL)."
    },
    {
      id: "VLAN-20",
      vlanId: 20,
      name: "Faculty/Staff VLAN",
      cidr: "10.20.0.0/24",
      gateway: "10.20.0.1",
      trustLevel: "Semi-Trusted",
      purpose: "Workstation network for professors, departmental lecturers, and academic coordinators.",
      securityFunction: "Allows outbound web browsing, TLS connection to LMS and campus email; filtered access to grading servers.",
      threatAddressed: "Phishing payload execution, credential harvesting, malware pivoting to enterprise core.",
      relatedControls: ["C-01", "C-02", "C-06", "C-09"],
      relatedVulnerabilities: ["V-006", "V-008", "V-012"],
      exampleVerification: "HTTPS access probe from Faculty host to Moodle LMS (10.40.0.10:443).",
      expectedResult: "ALLOWED (Legitimate authenticated educational traffic)."
    },
    {
      id: "VLAN-30",
      vlanId: 30,
      name: "Administrative VLAN",
      cidr: "10.30.0.0/24",
      gateway: "10.30.0.1",
      trustLevel: "Privileged Internal",
      purpose: "Office workstations for Registrar, Human Resources, Admissions, and Financial Aid officers.",
      securityFunction: "Restricted subnet requiring MFA conditional access; filtered RBAC access to specific ERP APIs.",
      threatAddressed: "Privilege escalation, unauthorized grade modifications, confidential personnel data leakage.",
      relatedControls: ["C-01", "C-02", "C-03", "C-08"],
      relatedVulnerabilities: ["V-006", "V-008", "V-011"],
      exampleVerification: "Attempt non-MFA login to administrative ERP console.",
      expectedResult: "DENIED (MFA prompt required)."
    },
    {
      id: "VLAN-40",
      vlanId: 40,
      name: "Server Environment / Application Tier",
      cidr: "10.40.0.0/24",
      gateway: "10.40.0.1",
      trustLevel: "Secure Internal Server Zone",
      purpose: "Houses internal university application engines: Moodle LMS, Identity Providers (IdP), and ERP frontends.",
      securityFunction: "Strict ingress rules allowing only designated ports (e.g. 443 HTTPS); egress proxying for updates.",
      threatAddressed: "Unnecessary open services, unpatched application RCE exploits, unencrypted web traffic.",
      relatedControls: ["C-04", "C-06", "C-07", "C-10"],
      relatedVulnerabilities: ["V-003", "V-004", "V-007"],
      exampleVerification: "Port scan of port 21 (FTP) and 23 (Telnet) on App Server.",
      expectedResult: "CONNECTION REFUSED / FILTERED (Only 443 permitted)."
    },
    {
      id: "VLAN-60",
      vlanId: 60,
      name: "Finance/Database VLAN",
      cidr: "10.60.0.0/24",
      gateway: "10.60.0.1",
      trustLevel: "Restricted Tier 0 / Crown Jewels",
      purpose: "Houses the core PostgreSQL/Oracle databases storing Student Records and Finance Ledgers.",
      securityFunction: "Zero direct access from user subnets; reachable solely via App Tier on port 5432/1521 with TLS and audit logging.",
      threatAddressed: "Unauthorized lateral movement, SQL exfiltration, ransomware database encryption.",
      relatedControls: ["C-01", "C-04", "C-05", "C-06", "C-08", "C-11"],
      relatedVulnerabilities: ["V-001", "V-002", "V-008", "V-013"],
      exampleVerification: "Student VLAN host initiates TCP SYN to 10.60.0.15:5432.",
      expectedResult: "BLOCKED (ISFW drops packet and triggers High Priority SIEM Alert)."
    },
    {
      id: "VLAN-70",
      vlanId: 70,
      name: "Management VLAN (OOBM)",
      cidr: "10.70.0.0/24",
      gateway: "10.70.0.1",
      trustLevel: "Isolated Out-of-Band Management",
      purpose: "Dedicated infrastructure management: Switch SSH, Firewall GUI, Hypervisor consoles, and Bastion Jumpbox.",
      securityFunction: "Completely isolated from general campus routing; requires hardware token MFA and Jumpbox proxy.",
      threatAddressed: "Switch takeover, unauthorized router reconfiguration, firewall compromise.",
      relatedControls: ["C-01", "C-02", "C-04", "C-05"],
      relatedVulnerabilities: ["V-002", "V-006", "V-009"],
      exampleVerification: "External or Student network connection attempt to switch SSH on port 22.",
      expectedResult: "BLOCKED / SILENT DROP."
    },
    {
      id: "DMZ-100",
      vlanId: 100,
      name: "Public-Facing DMZ",
      cidr: "198.51.100.0/24",
      gateway: "198.51.100.1",
      trustLevel: "Screened Subnet / DMZ",
      purpose: "Hosts public internet portals: web.abc.edu, mail.abc.edu, and DNS resolvers.",
      securityFunction: "Terminated at Perimeter NGFW with WAF inspection; cannot initiate connections to internal VLANs.",
      threatAddressed: "Internet-based automated botnets, web exploitation, DDoS attacks.",
      relatedControls: ["C-04", "C-06", "C-07", "C-10"],
      relatedVulnerabilities: ["V-002", "V-004", "V-010"],
      exampleVerification: "Inbound HTTP request on port 80 to public web server.",
      expectedResult: "301 REDIRECT to HTTPS (TLS 1.3 enforced)."
    }
  ],
  securityInfrastructure: [
    {
      id: "INFRA-01",
      name: "Perimeter Next-Gen Firewall / IPS (P-NGFW)",
      type: "Edge Defense",
      status: "ACTIVE",
      details: "Stateful inspection, TLS inspection, automated geo-blocking, perimeter DDoS mitigation."
    },
    {
      id: "INFRA-02",
      name: "Internal Segmentation Firewall (ISFW)",
      type: "Micro-Segmentation",
      status: "ACTIVE",
      details: "Inspects and filters inter-VLAN transit; isolates Crown Jewel VLAN 60 and Management VLAN 70."
    },
    {
      id: "INFRA-03",
      name: "Campus Core Distribution Switch / Router",
      type: "Core Routing",
      status: "ACTIVE",
      details: "802.1Q trunking, isolated VRFs, hardware ACL enforcement, DHCP Snooping, Dynamic ARP Inspection (DAI)."
    },
    {
      id: "INFRA-04",
      name: "Centralized SIEM & Telemetry Hub",
      type: "Detection & SOC",
      status: "ACTIVE",
      details: "Ingesting Syslog from ISFW, Windows Event Logs from Active Directory, Suricata alerts, and EDR beacons."
    },
    {
      id: "INFRA-05",
      name: "Inline Suricata IDS / IPS Engine",
      type: "Network Detection",
      status: "ACTIVE",
      details: "Deep packet inspection (DPI) monitoring inter-VLAN links for port scanning, brute force, and exploit signatures."
    },
    {
      id: "INFRA-06",
      name: "Endpoint Detection and Response (EDR) Fleet",
      type: "Host Security",
      status: "ACTIVE",
      details: "Behavioral heuristics and memory protection deployed across faculty and administrative workstations."
    },
    {
      id: "INFRA-07",
      name: "Secure Remote Access VPN Gateway",
      type: "Identity & Access",
      status: "ACTIVE",
      details: "WireGuard/IPSec tunnel terminating outside internal subnets; mandates FIDO2/TOTP MFA for staff."
    },
    {
      id: "INFRA-08",
      name: "Isolated / Immutable Backup Repository (3-2-1 WORM)",
      type: "Resilience & Recovery",
      status: "ACTIVE",
      details: "Write-Once-Read-Many (WORM) air-gapped storage for daily database snapshots and configuration archives."
    }
  ]
};