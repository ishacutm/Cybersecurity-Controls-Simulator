/**
 * ABC University - Remediation & Retesting Lifecycle Component (SIM-01)
 * Demonstrates: FAIL -> Identify Gap -> Correct ACL -> Remove Exception -> Apply DENY -> Enable Log -> Retest -> PASS
 */

window.RemediationWorkflow = {
  currentStep: 0,
  steps: [
    {
      id: "step-1",
      name: "1. Initial Verification Test",
      badge: "INITIAL EXECUTION",
      status: "FAIL",
      title: "Test SIM-01 Executed: Student VLAN -> Finance DB (Port 5432)",
      description: "An automated audit probe simulates a student workstation (10.10.105.14) attempting direct TCP connection to the PostgreSQL port on Finance DB Server (10.60.0.15:5432).",
      details: "Expected Result: DENIED / BLOCKED by ISFW.\nObserved Result: SYN-ACK received! Connection state ESTABLISHED. Traffic was permitted across the inter-VLAN boundary.",
      aclState: "ACTIVE ACL RULE #099:\npermit ip 10.10.0.0 0.0.255.255 10.60.0.0 0.0.0.255 [BROAD EXCEPTION ACTIVE]",
      siemLog: '{"timestamp":"2026-09-19T14:35:50Z","sensor":"ISFW-01","rule":"099-TEMP-ALLOW","src":"10.10.105.14","dst":"10.60.0.15:5432","action":"PERMIT","audit_flag":"CRITICAL_DEFENSE_GAP"}',
      riskRating: "High (Score: 6/9)",
      riskClass: "risk-high",
      actionText: "Proceed to Gap Analysis"
    },
    {
      id: "step-2",
      name: "2. Identify Root Cause Gap",
      badge: "AUDIT INVESTIGATION",
      status: "GAP IDENTIFIED",
      title: "Root Cause: Stale Testing Exception in Core ISFW ACL Table",
      description: "The security auditor inspects switch and ISFW running configurations to determine why the simulated packet was not dropped.",
      details: "Audit Discovery: Rule #099 ('permit ip 10.10.0.0/16 10.60.0.0/24') was inserted 6 months ago during legacy ERP migration and never deprecated. This broad wildcard bypasses the default-deny stance.",
      aclState: "RUNNING CONFIG DISCOVERY:\n# Rule 099 was created for temporary developer access during SIS staging.\n# Incident Ticket #IT-8841 was closed without rule de-provisioning!",
      siemLog: '{"timestamp":"2026-09-19T14:36:10Z","component":"Config-Audit","finding":"STALE_BROAD_EXCEPTION","rule_id":"099","impact":"BYPASS_SEGMENTATION"}',
      riskRating: "High (Score: 6/9)",
      riskClass: "risk-high",
      actionText: "Draft Corrective Action & ACL Patch"
    },
    {
      id: "step-3",
      name: "3. Prepare Corrective ACL Patch",
      badge: "CHANGE PLANNING",
      status: "DRAFTING",
      title: "Engineering Change Order: Deprecate Rule 099 & Formulate Deny Rule",
      description: "Network Operations and the Information Security Office collaborate to formulate a corrective configuration diff adhering to the principle of least privilege.",
      details: "Change Specification:\n1. Deprecate and purge broad exception Rule 099.\n2. Insert explicit Rule 102: Drop all traffic from Student VLAN (10.10.0.0/16) to Finance DB (10.60.0.0/24).\n3. Bind explicit logging directive to capture violation attempts.",
      aclState: "CONFIG DIFF (STAGING):\n- no ip access-list extended ISFW_INTER_VLAN permit ip 10.10.0.0 0.0.255.255 10.60.0.0 0.0.0.255\n+ ip access-list extended ISFW_INTER_VLAN deny ip 10.10.0.0 0.0.255.255 10.60.0.0 0.0.0.255 log-input",
      siemLog: '{"timestamp":"2026-09-19T14:36:45Z","service":"Change-Management","ticket":"CHG-2026-0919","status":"APPROVED_EMERGENCY","approver":"CISO"}',
      riskRating: "Pending Deployment",
      riskClass: "risk-pending",
      actionText: "Remove Broad Exception"
    },
    {
      id: "step-4",
      name: "4. Remove Broad Exception",
      badge: "RULE PURGE",
      status: "APPLYING",
      title: "Purging Stale Rule #099 from ISFW Hardware Filter Table",
      description: "Network engineer issues CLI command on Cisco Core Distribution Switch & ISFW cluster to unbind the stale permit entry.",
      details: "Command Executed: 'no ip access-list extended ISFW_INTER_VLAN sequence 99'.\nResult: The blanket bypass is eliminated. Subnets are no longer permitted to traverse without matching rules.",
      aclState: "ISFW TCAM HARDWARE UPDATE:\nSequence 99 removed from memory buffer.\nTCAM lookup tables synchronized across high-availability firewall pairs.",
      siemLog: '{"timestamp":"2026-09-19T14:37:05Z","device":"ISFW-01","event":"CONFIG_MODIFIED","user":"netadmin.keller","command":"no rule 099"}',
      riskRating: "Medium (Score: 4/9)",
      riskClass: "risk-med",
      actionText: "Apply Student -> Finance/DB Explicit DENY"
    },
    {
      id: "step-5",
      name: "5. Apply Student -> Finance/DB DENY",
      badge: "POLICY ENFORCEMENT",
      status: "APPLYING",
      title: "Injecting Explicit Rule 102: Hardware-Enforced Layer 3/4 Drop",
      description: "An explicit, deterministic deny rule is committed into the access control policy prior to the default-deny baseline.",
      details: "Configuration Applied:\naccess-list ISFW_INTER_VLAN deny ip 10.10.0.0 0.0.255.255 10.60.0.0 0.0.0.255 log\nPackets originating in student subnet with destination in database subnet will be dropped at ingress switchport ASIC.",
      aclState: "CURRENT POLICY TABLE:\n101: PERMIT 10.10.0.0/16 -> 10.40.0.10:443 (Student -> LMS)\n102: DENY 10.10.0.0/16 -> 10.60.0.0/24 (Student -> Finance DB) [COMMITTED]\n999: DENY ANY ANY (Default Deny)",
      siemLog: '{"timestamp":"2026-09-19T14:37:30Z","device":"ISFW-01","event":"POLICY_COMMITTED","rule_id":"102","target":"Student_to_FinanceDB","action":"DENY"}',
      riskRating: "Low (Score: 2/9)",
      riskClass: "risk-low",
      actionText: "Enable Real-Time Logging & Telemetry"
    },
    {
      id: "step-6",
      name: "6. Enable Syslog Streaming & SIEM Alert Rule",
      badge: "TELEMETRY BINDING",
      status: "CONFIGURING",
      title: "Connecting Drop Telemetry to Central SIEM Correlation Engine",
      description: "The 'log-input' parameter directs the firewall to emit structured RFC 5424 syslog packets to the SIEM cluster whenever Rule 102 is triggered.",
      details: "SIEM Correlation Rule Activated:\nIf Event(Sensor=ISFW, Rule=102, Action=DENY) THEN\nGenerate High Priority Alert: 'Lateral Movement Probing Detected from Student VLAN'.",
      aclState: "LOGGING DIRECTIVE CONFIRMED:\nRule 102 logging facility: local4.info -> rsyslog-tls -> siem.abc.edu:6514\nHardware rate-limiter: 500 pkts/sec to protect CPU control plane.",
      siemLog: '{"timestamp":"2026-09-19T14:37:55Z","siem_engine":"Correlation-Rule-Engine","rule_name":"ALERT_UNAUTHORIZED_DB_ACCESS","status":"ACTIVE"}',
      riskRating: "Low (Score: 2/9)",
      riskClass: "risk-low",
      actionText: "Execute Verification Retest"
    },
    {
      id: "step-7",
      name: "7. Verification Retest (Post-Remediation)",
      badge: "RETEST VERIFICATION",
      status: "PASS",
      title: "Test SIM-01 Re-executed: Retest Confirmed PASS!",
      description: "The automated verification probe is re-executed: Student host (10.10.105.14) sends TCP SYN to Finance DB (10.60.0.15:5432).",
      details: "Result: Packet immediately DROPPED by ISFW Rule 102.\nTelemetry Verified: Structured Syslog event ingested in Central SIEM within 450ms.\nAccess: BLOCKED | Event: LOGGED | Residual Risk: REDUCED.",
      aclState: "ACTIVE RUNNING ACL (REMEDIATED & VERIFIED):\nISFW_INTER_VLAN Rule 102: Drop Counter: 1 packet | Log Emitted: TRUE\nVerification Status: PASSED COMPLIANCE AUDIT",
      siemLog: '{"timestamp":"2026-09-19T14:38:15Z","sensor":"ISFW-01","rule":"102-DENY","src":"10.10.105.14","dst":"10.60.0.15:5432","action":"DROP","reason":"STUDENT_TO_DB_PROHIBITED","siem_alert_id":9824}',
      riskRating: "Low (Score: 2/9 - Remediated)",
      riskClass: "risk-low",
      actionText: "View Complete Lifecycle Summary"
    },
    {
      id: "step-8",
      name: "8. Lifecycle Complete & Audit Sign-Off",
      badge: "AUDIT CLOSED",
      status: "VERIFIED PASS",
      title: "Full Control Lifecycle Closed: Finding V-001 / SIM-01 Fully Mitigated",
      description: "The complete lifecycle loop has been demonstrated from audit failure to discovery, technical remediation, retest verification, and risk reduction.",
      details: "Key Lifecycle Milestones Achieved:\n1. Initial vulnerability & audit gap recorded.\n2. Stale testing exception purged from production firewalls.\n3. Hardened explicit deny rule implemented.\n4. Continuous SIEM alerting established.\n5. Retest confirmed PASS with cryptographic telemetry receipts.",
      aclState: "CONTROL RE-ASSESSMENT: C-04 Firewall & ACL: IMPLEMENTED (100% compliant)\nResidual Risk: Reduced from 6/9 (High) to 2/9 (Low, monitored).",
      siemLog: '{"timestamp":"2026-09-19T14:38:40Z","audit_system":"GRC-Portal","ticket":"AUD-03-SIM01","status":"CLOSED_VERIFIED","verified_by":"Security-Evaluator"}',
      riskRating: "Low (Monitored)",
      riskClass: "risk-low",
      actionText: "Reset Demonstration"
    }
  ],

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const step = this.steps[this.currentStep];

    container.innerHTML = `
      <div class="remediation-container">
        <!-- Progress Stepper Header -->
        <div class="stepper-header">
          <div class="stepper-track">
            ${this.steps.map((s, idx) => `
              <div class="step-node ${idx === this.currentStep ? 'active' : ''} ${idx < this.currentStep ? 'completed' : ''}" 
                   onclick="RemediationWorkflow.goToStep(${idx})">
                <div class="step-bubble">
                  ${idx < this.currentStep ? '✓' : (idx + 1)}
                </div>
                <div class="step-label">${s.name.split('.')[1]}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Main Remediation Stage Card -->
        <div class="remediation-stage-card">
          <div class="stage-header">
            <div class="stage-meta">
              <span class="badge ${step.status === 'FAIL' ? 'badge-fail' : (step.status.includes('PASS') ? 'badge-pass' : 'badge-warning')}">
                ${step.status}
              </span>
              <span class="badge badge-stage">${step.badge}</span>
              <span class="badge ${step.riskClass}">Risk: ${step.riskRating}</span>
            </div>
            <h2 class="stage-title">${step.title}</h2>
          </div>

          <div class="stage-body-grid">
            <div class="stage-narrative">
              <h3>Scenario & Objective</h3>
              <p>${step.description}</p>
              <div class="stage-details-box">
                <i class="icon-info"></i>
                <pre>${step.details}</pre>
              </div>

              <div class="remediation-controls-bar">
                <button class="btn btn-primary" onclick="RemediationWorkflow.nextStep()">
                  ${step.actionText} →
                </button>
                ${this.currentStep > 0 ? `
                  <button class="btn btn-outline" onclick="RemediationWorkflow.prevStep()">
                    ← Previous Step
                  </button>
                ` : ''}
                <button class="btn btn-secondary btn-sm" onclick="RemediationWorkflow.reset()">
                  ↺ Reset Drill
                </button>
              </div>
            </div>

            <div class="stage-technical-panel">
              <!-- Switch/Firewall ACL Box -->
              <div class="tech-box">
                <div class="tech-box-header">
                  <span><i class="icon-terminal"></i> ISFW ACL Running Configuration</span>
                  <span class="code-badge">Cisco IOS / ISFW CLI</span>
                </div>
                <pre class="code-display"><code>${step.aclState}</code></pre>
              </div>

              <!-- SIEM Telemetry Box -->
              <div class="tech-box">
                <div class="tech-box-header">
                  <span><i class="icon-radar"></i> Live SIEM Ingestion Stream (Syslog RFC 5424)</span>
                  <span class="code-badge">Splunk / Elastic JSON</span>
                </div>
                <pre class="code-display json-stream"><code>${step.siemLog}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Lifecycle Overview Infographic -->
        <div class="lifecycle-overview-card">
          <h3>The Complete Security-Control Lifecycle (Week 3 Rubric)</h3>
          <div class="lifecycle-flow-pills">
            <span class="flow-pill">Week 2 Vulnerability (V-001)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill">Security Requirement (ISFW Default-Deny)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill">Control Selection (C-04 Firewall / ACL)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill">Implementation (Deploy Rule 102)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill">Configuration (Drop + Log)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill">Verification Test (SIM-01)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill alert-pill">Result (FAIL)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill">Remediation (Purge Stale ACL 099)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill success-pill">Retest (PASS)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill">Success Metric (0 Leaks)</span>
            <span class="flow-arrow">→</span>
            <span class="flow-pill">Residual Risk (Low)</span>
          </div>
        </div>
      </div>
    `;
  },

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render("remediation-view-container");
      // Log event in SIEM
      if (window.TelemetryConsole) {
        window.TelemetryConsole.addEvent({
          severity: this.currentStep === 6 ? "HIGH" : "INFO",
          source: "Remediation-Engine",
          message: `SIM-01 Drill advanced to: ${this.steps[this.currentStep].name}`
        });
      }
    } else {
      this.reset();
    }
  },

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render("remediation-view-container");
    }
  },

  goToStep(index) {
    if (index >= 0 && index < this.steps.length) {
      this.currentStep = index;
      this.render("remediation-view-container");
    }
  },

  reset() {
    this.currentStep = 0;
    this.render("remediation-view-container");
  }
};