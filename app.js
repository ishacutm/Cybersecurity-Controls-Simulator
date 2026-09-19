/**
 * ABC University – Cybersecurity Controls Implementation & Verification Simulator
 * Core Application Controller & State Engine
 */

window.App = {
  currentView: "dashboard",
  selectedCategory: "ALL",
  selectedVulnId: null,
  selectedControlId: null,
  auditFilter: "ALL",

  // Simulated System Configuration State (Interactive in Configuration Center)
  config: {
    mfaEnforced: true,
    vpnMfa: true,
    fwDefaultInbound: "DENY",
    studentFinanceAcl: "BLOCK", // BLOCK or ALLOW
    studentLmsAcl: "ALLOW",
    httpsEnforced: true,
    authLogging: true,
    siemConnected: true,
    edrEnabled: true,
    backupImmutability: true,
    wifiClientIsolation: true,
    accountLockoutThreshold: 5
  },

  // Test Results Store
  testResults: {},

  // Guided Evaluator Tour State (1 to 18)
  evaluatorTour: {
    active: false,
    step: 1,
    steps: [
      { step: 1, view: "dashboard", title: "1. Executive Dashboard", action: "Review overall implementation metrics, coverage %, and control distribution." },
      { step: 2, view: "architecture", title: "2. Security Architecture", action: "Inspect the campus network segmentation topology and defense-in-depth layout." },
      { step: 3, view: "architecture", title: "3. Inspect Finance/DB VLAN", action: "Click 'Finance/Database VLAN' to view its threat profile and controls.", triggerNode: "VLAN-60" },
      { step: 4, view: "vulnerabilities", title: "4. Week 2 Vulnerabilities (V-001)", action: "Inspect V-001 Poor Network Segmentation and affected assets.", triggerVuln: "V-001" },
      { step: 5, view: "controls", title: "5. Security Controls (C-04)", action: "Review C-04 Firewall & ACL specification and configuration parameters.", triggerControl: "C-04" },
      { step: 6, view: "remediation", title: "6. Student -> Finance/DB Test (Initial)", action: "Observe the initial test execution of Student -> Finance DB.", triggerRemediationStep: 0 },
      { step: 7, view: "remediation", title: "7. Initial FAIL Demonstrated", action: "Notice FAIL caused by temporary broad ACL exception #099.", triggerRemediationStep: 1 },
      { step: 8, view: "remediation", title: "8. Apply Remediation Patch", action: "Deprecate broad exception and apply explicit Rule 102 DENY.", triggerRemediationStep: 4 },
      { step: 9, view: "remediation", title: "9. Verification Retest", action: "Re-run verification probe against updated ACL table.", triggerRemediationStep: 6 },
      { step: 10, view: "remediation", title: "10. Retest PASS + Telemetry Logged", action: "Confirm traffic dropped and structured event recorded in SIEM.", triggerRemediationStep: 7 },
      { step: 11, view: "testing", title: "11. Demonstrate MFA Verification", action: "Run MFA-01, MFA-02, and MFA-03 authentication challenge tests.", filterTest: "MFA" },
      { step: 12, view: "attack-sim", title: "12. Educational Attack Simulator & SIEM", action: "Launch attack probe with Defences Active; verify Suricata IDS -> SIEM alert." },
      { step: 13, view: "audit", title: "13. Audit Checklist", action: "Inspect PASS/PARTIAL audit items and view simulated evidence artifacts." },
      { step: 14, view: "frameworks", title: "14. Best-Practice Framework Alignment", action: "Review NIST CSF 2.0, CIS Controls v8, and ISO/IEC 27001:2022 mappings." },
      { step: 15, view: "metrics", title: "15. Simulated Success Metrics", action: "Examine 8 institutional target metrics and implementation coverage." },
      { step: 16, view: "roadmap", title: "16. 90-Day Implementation Roadmap", action: "Review Phase 1 through 4 milestones, owners, and dependencies." },
      { step: 17, view: "residual", title: "17. Residual Risk Assessment", action: "Examine post-implementation residual risk ratings and why risk remains." },
      { step: 18, view: "about", title: "18. Academic Simulation Disclaimer", action: "Confirm simulation boundaries and academic educational purpose." }
    ]
  },

  init() {
    // Initialize default test results from verification tests definition
    if (window.SIM_VERIFICATION_TESTS) {
      window.SIM_VERIFICATION_TESTS.forEach(t => {
        this.testResults[t.id] = {
          status: t.defaultResult || "PASS",
          timestamp: "Baseline Audit",
          log: t.telemetrySnippet
        };
      });
    }

    this.bindNavigation();
    this.renderCurrentView();
    this.updateDashboardMetrics();

    // Render Telemetry Console in footer/sidebar
    if (window.TelemetryConsole) {
      window.TelemetryConsole.render("telemetry-console-container");
    }

    console.log("ABC University Simulator Initialized.");
  },

  bindNavigation() {
    const navItems = document.querySelectorAll(".nav-item[data-view]");
    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const view = item.getAttribute("data-view");
        this.navigateTo(view);
      });
    });

    // Tour navigation buttons
    const btnTourNext = document.getElementById("tour-btn-next");
    const btnTourPrev = document.getElementById("tour-btn-prev");
    const btnTourClose = document.getElementById("tour-btn-close");
    const btnStartTour = document.getElementById("btn-start-tour");

    if (btnTourNext) btnTourNext.addEventListener("click", () => this.tourNext());
    if (btnTourPrev) btnTourPrev.addEventListener("click", () => this.tourPrev());
    if (btnTourClose) btnTourClose.addEventListener("click", () => this.stopTour());
    if (btnStartTour) btnStartTour.addEventListener("click", () => this.startTour());
  },

  navigateTo(viewId) {
    this.currentView = viewId;

    // Update active state in sidebar
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.getAttribute("data-view") === viewId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Scroll to top of main content
    const mainContent = document.getElementById("main-content-scroll");
    if (mainContent) mainContent.scrollTop = 0;

    this.renderCurrentView();
  },

  renderCurrentView() {
    const container = document.getElementById("view-content-area");
    if (!container) return;

    // Hide all view containers and reveal active one
    switch (this.currentView) {
      case "dashboard":
        this.renderDashboard(container);
        break;
      case "architecture":
        this.renderArchitecture(container);
        break;
      case "vulnerabilities":
        this.renderVulnerabilities(container);
        break;
      case "controls":
        this.renderControls(container);
        break;
      case "implementation":
        this.renderImplementation(container);
        break;
      case "configuration":
        this.renderConfiguration(container);
        break;
      case "testing":
        this.renderTesting(container);
        break;
      case "remediation":
        this.renderRemediation(container);
        break;
      case "audit":
        this.renderAudit(container);
        break;
      case "frameworks":
        this.renderFrameworks(container);
        break;
      case "metrics":
        this.renderMetrics(container);
        break;
      case "roadmap":
        this.renderRoadmap(container);
        break;
      case "residual":
        this.renderResidual(container);
        break;
      case "attack-sim":
        this.renderAttackSim(container);
        break;
      case "before-after":
        this.renderBeforeAfter(container);
        break;
      case "about":
        this.renderAbout(container);
        break;
      default:
        this.renderDashboard(container);
    }
  },

  // -------------------------------------------------------------
  // VIEW: 1. DASHBOARD
  // -------------------------------------------------------------
  renderDashboard(container) {
    const totalControls = window.SIM_CONTROLS.length;
    const totalVulns = window.SIM_VULNERABILITIES.length;
    const totalTests = window.SIM_VERIFICATION_TESTS.length;

    const implementedControls = window.SIM_CONTROLS.filter(c => c.status === "IMPLEMENTED").length;
    const partialControls = window.SIM_CONTROLS.filter(c => c.status === "PARTIAL").length;
    const remediationControls = window.SIM_CONTROLS.filter(c => c.status === "NOT_IMPLEMENTED" || c.status === "REMEDIATION_REQUIRED").length;

    const passTests = Object.values(this.testResults).filter(t => t.status === "PASS").length;
    const failTests = Object.values(this.testResults).filter(t => t.status === "FAIL").length;
    const partialTests = Object.values(this.testResults).filter(t => t.status === "PARTIAL").length;

    const coveragePct = Math.round(((implementedControls + (partialControls * 0.5)) / totalControls) * 100);

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Security Controls Implementation & Verification Dashboard</h1>
          <p class="subtitle">Simulated Academic Security Operations & Control Verification Platform for ABC University</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" onclick="App.startTour()">
            🚀 Launch Guided Evaluator Tour (18 Steps)
          </button>
          <button class="btn btn-secondary" onclick="App.runAllVerificationTests()">
            ▶ Run All 16 Verification Tests
          </button>
        </div>
      </div>

      <!-- Quick Action Alert Banner -->
      <div class="soc-banner">
        <div class="banner-left">
          <span class="live-dot"></span>
          <strong>SOC TELEMETRY STREAM ACTIVE:</strong>
          <span id="siem-ticker-latest">Ingesting Syslog, Active Directory Event 4624/4625, Suricata DPI, and ISFW Drop logs.</span>
        </div>
        <div class="banner-right">
          <span class="badge badge-academic">SIMULATED ACADEMIC ENVIRONMENT</span>
        </div>
      </div>

      <!-- Key Metrics Row -->
      <div class="metrics-grid">
        <div class="metric-card" onclick="App.navigateTo('controls')">
          <div class="metric-icon bg-blue">🛡️</div>
          <div class="metric-info">
            <span class="metric-label">Total Security Controls</span>
            <h2 class="metric-val">${totalControls}</h2>
            <span class="metric-sub text-green">${implementedControls} Implemented | ${partialControls} Partial</span>
          </div>
        </div>

        <div class="metric-card" onclick="App.navigateTo('vulnerabilities')">
          <div class="metric-icon bg-orange">🔍</div>
          <div class="metric-info">
            <span class="metric-label">Week 2 Vulns Addressed</span>
            <h2 class="metric-val">${totalVulns}</h2>
            <span class="metric-sub text-blue">100% Mapped to Controls</span>
          </div>
        </div>

        <div class="metric-card" onclick="App.navigateTo('testing')">
          <div class="metric-icon bg-purple">🧪</div>
          <div class="metric-info">
            <span class="metric-label">Verification Tests</span>
            <h2 class="metric-val">${totalTests}</h2>
            <span class="metric-sub text-green">${passTests} PASS | ${failTests} FAIL | ${partialTests} PARTIAL</span>
          </div>
        </div>

        <div class="metric-card" onclick="App.navigateTo('metrics')">
          <div class="metric-icon bg-teal">📊</div>
          <div class="metric-info">
            <span class="metric-label">Implementation Coverage</span>
            <h2 class="metric-val">${coveragePct}%</h2>
            <div class="progress-bar-sm">
              <div class="progress-fill bg-teal" style="width: ${coveragePct}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Status Row -->
      <div class="dashboard-split-grid">
        <!-- Control Implementation Status Card -->
        <div class="card">
          <div class="card-header">
            <h3>Security Control Implementation Status</h3>
            <span class="badge badge-outline">12 Controls Total</span>
          </div>
          <div class="card-body">
            <div class="status-distribution-bar">
              <div class="bar-segment bg-green" style="width: ${(implementedControls/totalControls)*100}%" title="${implementedControls} Implemented"></div>
              <div class="bar-segment bg-yellow" style="width: ${(partialControls/totalControls)*100}%" title="${partialControls} Partial"></div>
              <div class="bar-segment bg-red" style="width: ${(remediationControls/totalControls)*100}%" title="${remediationControls} Remediation Required"></div>
            </div>
            <div class="legend-row">
              <span class="legend-item"><span class="dot bg-green"></span> Implemented (${implementedControls})</span>
              <span class="legend-item"><span class="dot bg-yellow"></span> Partially Implemented (${partialControls})</span>
              <span class="legend-item"><span class="dot bg-red"></span> Requiring Remediation (${remediationControls})</span>
            </div>

            <div class="control-mini-list">
              ${window.SIM_CONTROLS.slice(0, 6).map(c => `
                <div class="mini-item" onclick="App.inspectControl('${c.id}')">
                  <div class="mini-meta">
                    <strong>${c.id}</strong>: ${c.name}
                  </div>
                  <span class="badge ${c.status === 'IMPLEMENTED' ? 'badge-pass' : 'badge-warning'}">${c.status}</span>
                </div>
              `).join("")}
            </div>
            <div class="card-footer-action">
              <button class="btn btn-link btn-sm" onclick="App.navigateTo('controls')">View All 12 Controls →</button>
            </div>
          </div>
        </div>

        <!-- Verification Results & Remediation Spotlight -->
        <div class="card">
          <div class="card-header">
            <h3>Special Remediation Drill (SIM-01)</h3>
            <span class="badge ${this.testResults['SIM-01'].status === 'PASS' ? 'badge-pass' : 'badge-fail'}">
              SIM-01: ${this.testResults['SIM-01'].status}
            </span>
          </div>
          <div class="card-body">
            <p class="text-sm">
              Demonstrates the core academic lifecycle:
              <strong>FAIL</strong> (due to legacy broad ACL) → <strong>Identify Gap</strong> → <strong>Correct ACL</strong> → <strong>Retest PASS</strong>.
            </p>
            <div class="spotlight-box">
              <div class="spotlight-header">
                <strong>Student VLAN ➔ Finance DB (Port 5432)</strong>
                <span>ISFW Rule 102</span>
              </div>
              <div class="spotlight-content">
                ${this.testResults['SIM-01'].status === 'FAIL' ? `
                  <div class="status-banner banner-fail">
                    ⚠️ INITIAL STATUS: FAIL – Temporary broad allow rule active.
                  </div>
                ` : `
                  <div class="status-banner banner-pass">
                    ✅ REMEDIATED STATUS: PASS – Broad rule removed, traffic dropped and logged.
                  </div>
                `}
              </div>
              <button class="btn btn-primary btn-block" onclick="App.navigateTo('remediation')">
                Open Interactive SIM-01 Remediation Workflow →
              </button>
            </div>

            <div class="quick-stats-row">
              <div class="stat-bubble">
                <span class="stat-num">100%</span>
                <span class="stat-desc">Privileged MFA</span>
              </div>
              <div class="stat-bubble">
                <span class="stat-num">0</span>
                <span class="stat-desc">Student ➔ DB Leaks</span>
              </div>
              <div class="stat-bubble">
                <span class="stat-num">98.5%</span>
                <span class="stat-desc">EDR Fleet Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links Grid -->
      <div class="quick-links-grid">
        <div class="quick-card" onclick="App.navigateTo('architecture')">
          <h4>🗺️ Interactive Security Architecture</h4>
          <p>Explore the 5 VLANs, perimeter firewalls, and core distribution switches with clickable node inspection.</p>
        </div>
        <div class="quick-card" onclick="App.navigateTo('attack-sim')">
          <h4>⚔️ Safe Educational Attack Simulator</h4>
          <p>Watch simulated lateral movement from compromised student BYOD get blocked and logged by ISFW.</p>
        </div>
        <div class="quick-card" onclick="App.navigateTo('frameworks')">
          <h4>🏛️ NIST CSF 2.0 & Best Practices</h4>
          <p>View mapping across Govern, Identify, Protect, Detect, Respond, and Recover.</p>
        </div>
        <div class="quick-card" onclick="App.navigateTo('residual')">
          <h4>⚖️ Residual Risk Assessment</h4>
          <p>Analyze post-implementation residual risk scores and technical explanations for remaining risks.</p>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------
  // VIEW: 2. SECURITY ARCHITECTURE
  // -------------------------------------------------------------
  renderArchitecture(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Interactive Security Architecture & Topology</h1>
          <p class="subtitle">Campus defense-in-depth layout: Perimeter NGFW ➔ Core Distribution Switch ➔ 5 Isolated 802.1Q VLANs</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" onclick="App.inspectArchitectureNode('VLAN-60')">
            Inspect Finance/DB VLAN
          </button>
          <button class="btn btn-primary" onclick="App.navigateTo('attack-sim')">
            Launch Attack Path Simulation →
          </button>
        </div>
      </div>

      <div id="network-diagram-container"></div>
    `;

    // Render the SVG network diagram
    window.NetworkDiagram.render("network-diagram-container", (testId) => {
      this.runSingleVerificationTest(testId);
    });
  },

  inspectArchitectureNode(nodeId) {
    if (this.currentView !== "architecture") {
      this.navigateTo("architecture");
    }
    setTimeout(() => {
      window.NetworkDiagram.inspectNode(nodeId, (testId) => {
        this.runSingleVerificationTest(testId);
      });
    }, 100);
  },

  // -------------------------------------------------------------
  // VIEW: 3. WEEK 2 VULNERABILITIES
  // -------------------------------------------------------------
  renderVulnerabilities(container) {
    const categories = ["ALL", "Network", "Identity", "Endpoint", "Data", "Monitoring", "Recovery"];
    const filtered = window.SIM_VULNERABILITIES.filter(v => {
      return this.selectedCategory === "ALL" || v.category === this.selectedCategory;
    });

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Week 2 Vulnerability Baseline (13 Simulated Findings)</h1>
          <p class="subtitle">Predefined technical vulnerabilities identified during campus security assessment, mapped to defensive controls.</p>
        </div>
        <div class="header-actions">
          <div class="filter-pills">
            ${categories.map(cat => `
              <button class="pill ${this.selectedCategory === cat ? 'active' : ''}" 
                      onclick="App.filterVulns('${cat}')">${cat}</button>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="vuln-grid">
        ${filtered.map(v => `
          <div class="vuln-card priority-${v.priority.toLowerCase()}" id="vuln-card-${v.id}" onclick="App.inspectVuln('${v.id}')">
            <div class="vuln-card-header">
              <span class="vuln-id">${v.id}</span>
              <span class="badge badge-priority-${v.priority.toLowerCase()}">${v.priority}</span>
              <span class="badge badge-cat">${v.category}</span>
            </div>
            <h3 class="vuln-title">${v.name}</h3>
            <p class="vuln-asset"><strong>Asset:</strong> ${v.affectedAsset}</p>
            <p class="vuln-desc">${v.description}</p>
            <div class="vuln-footer">
              <div class="vuln-control">
                <span class="control-label">Defensive Control:</span>
                <span class="tag-control">${v.relatedControl}</span>
              </div>
              <div class="vuln-risk-badge">
                Inherent Score: <strong>${v.inherentScore}/9</strong>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Vulnerability Modal -->
      <div id="vuln-detail-modal" class="modal-backdrop hidden">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 id="vuln-modal-title">Vulnerability Finding</h3>
            <button class="modal-close" onclick="App.closeVulnModal()">✕</button>
          </div>
          <div class="modal-body" id="vuln-modal-body"></div>
        </div>
      </div>
    `;
  },

  filterVulns(cat) {
    this.selectedCategory = cat;
    this.renderCurrentView();
  },

  inspectVuln(vulnId) {
    const v = window.SIM_VULNERABILITIES.find(item => item.id === vulnId);
    if (!v) return;

    const modal = document.getElementById("vuln-detail-modal");
    const title = document.getElementById("vuln-modal-title");
    const body = document.getElementById("vuln-modal-body");
    if (!modal) return;

    title.innerHTML = `<span class="badge badge-priority-${v.priority.toLowerCase()}">${v.priority}</span> [${v.id}] ${v.name}`;
    body.innerHTML = `
      <div class="modal-section">
        <label>Affected University Asset</label>
        <p class="lead-text">${v.affectedAsset}</p>
      </div>

      <div class="modal-section">
        <label>Technical Description</label>
        <p>${v.description}</p>
      </div>

      <div class="modal-section alert-box-red">
        <label>Realistic Threat Scenario</label>
        <p>${v.threatScenario}</p>
      </div>

      <div class="modal-section">
        <label>Security & Educational Impact</label>
        <p>${v.securityImpact}</p>
      </div>

      <div class="modal-grid-2">
        <div class="modal-section">
          <label>Mapped Defensive Control</label>
          <div class="tag-control">${v.relatedControl}</div>
        </div>
        <div class="modal-section">
          <label>Inherent 3x3 Risk Rating</label>
          <p>Likelihood: <strong>${v.likelihood}</strong> | Impact: <strong>${v.impact}</strong> | Score: <strong>${v.inherentScore}/9 (${v.priority})</strong></p>
        </div>
      </div>

      <div class="modal-section highlight-box">
        <label>Recommended Remediation</label>
        <p>${v.remediation}</p>
      </div>

      <div class="modal-section">
        <label>Residual Risk After Implementation</label>
        <p>${v.residualRisk}</p>
      </div>

      <div class="modal-actions">
        <button class="btn btn-primary" onclick="App.inspectControl('${v.controlId}'); App.closeVulnModal();">
          Open Related Control Specification (${v.controlId}) →
        </button>
      </div>
    `;

    modal.classList.remove("hidden");
  },

  closeVulnModal() {
    const modal = document.getElementById("vuln-detail-modal");
    if (modal) modal.classList.add("hidden");
  },

  // -------------------------------------------------------------
  // VIEW: 4. SECURITY CONTROLS (12 Controls)
  // -------------------------------------------------------------
  renderControls(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Security Controls Catalogue (12 Controls)</h1>
          <p class="subtitle">Complete technical specifications across the implementation and verification lifecycle.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" onclick="App.navigateTo('implementation')">
            Interactive Implementation Stepper →
          </button>
        </div>
      </div>

      <div class="controls-list-view">
        ${window.SIM_CONTROLS.map(c => `
          <div class="control-card ${c.status === 'IMPLEMENTED' ? 'status-implemented' : 'status-partial'}" 
               id="control-card-${c.id}">
            <div class="control-header-bar">
              <div class="control-id-badge">${c.id}</div>
              <div class="control-header-text">
                <h3>${c.name}</h3>
                <span class="control-owner"><i class="icon-user"></i> Owner: ${c.owner} | ${c.timeline}</span>
              </div>
              <div class="control-status-badge">
                <span class="badge ${c.status === 'IMPLEMENTED' ? 'badge-pass' : 'badge-warning'}">${c.status}</span>
                <span class="badge badge-priority-${c.priority.toLowerCase()}">${c.priority}</span>
              </div>
            </div>

            <div class="control-summary-grid">
              <div class="summary-box">
                <label>Security Problem & Scenario</label>
                <p>${c.securityProblem}</p>
              </div>
              <div class="summary-box">
                <label>Security Objective</label>
                <p>${c.securityObjective}</p>
              </div>
              <div class="summary-box">
                <label>Configuration Directive</label>
                <code class="code-inline">${c.configuration.split('\n')[0]}</code>
              </div>
              <div class="summary-box">
                <label>Verification & Simulated Result</label>
                <p><strong>Test:</strong> ${c.verification.split(':')[1] || c.verification}</p>
                <span class="badge-expected">Expected: ${c.expectedResult}</span>
              </div>
            </div>

            <div class="control-card-footer">
              <button class="btn btn-sm btn-primary" onclick="App.inspectControl('${c.id}')">
                Inspect Full Lifecycle Specification (18 Fields) →
              </button>
              <button class="btn btn-sm btn-outline" onclick="App.navigateTo('configuration')">
                Adjust in Config Center
              </button>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Control Full Modal -->
      <div id="control-detail-modal" class="modal-backdrop hidden">
        <div class="modal-dialog modal-lg">
          <div class="modal-header">
            <h3 id="control-modal-title">Control Specification</h3>
            <button class="modal-close" onclick="App.closeControlModal()">✕</button>
          </div>
          <div class="modal-body" id="control-modal-body"></div>
        </div>
      </div>
    `;
  },

  inspectControl(controlId) {
    const c = window.SIM_CONTROLS.find(item => item.id === controlId);
    if (!c) return;

    if (this.currentView !== "controls") {
      this.navigateTo("controls");
    }

    setTimeout(() => {
      const modal = document.getElementById("control-detail-modal");
      const title = document.getElementById("control-modal-title");
      const body = document.getElementById("control-modal-body");
      if (!modal) return;

      title.innerHTML = `[${c.id}] ${c.name} <span class="badge ${c.status === 'IMPLEMENTED' ? 'badge-pass' : 'badge-warning'}">${c.status}</span>`;
      body.innerHTML = `
        <div class="modal-grid-3">
          <div class="modal-section"><label>Control Owner</label><p>${c.owner}</p></div>
          <div class="modal-section"><label>Priority</label><p><span class="badge badge-priority-${c.priority.toLowerCase()}">${c.priority}</span></p></div>
          <div class="modal-section"><label>Implementation Timeline</label><p>${c.timeline}</p></div>
        </div>

        <div class="modal-section alert-box-red">
          <label>Security Problem & Realistic Scenario</label>
          <p><strong>Problem:</strong> ${c.securityProblem}</p>
          <p style="margin-top: 6px;"><strong>Realistic Scenario:</strong> ${c.realisticScenario}</p>
        </div>

        <div class="modal-grid-2">
          <div class="modal-section">
            <label>Security Objective</label>
            <p>${c.securityObjective}</p>
          </div>
          <div class="modal-section">
            <label>Why Appropriate</label>
            <p>${c.whyAppropriate}</p>
          </div>
        </div>

        <div class="modal-section">
          <label>Implementation Steps</label>
          <ul class="step-list">
            ${c.implementationSteps.map(step => `<li>${step}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-section">
          <label>Simulated Configuration Directive</label>
          <pre class="code-display"><code>${c.configuration}</code></pre>
        </div>

        <div class="modal-section highlight-box">
          <label>Verification & Testing</label>
          <p><strong>Procedure:</strong> ${c.verification}</p>
          <p><strong>Expected Result:</strong> <span class="text-green">${c.expectedResult}</span></p>
          <p><strong>Simulated Audit Result:</strong> <span class="badge badge-pass">${c.simulatedResult}</span></p>
        </div>

        <div class="modal-grid-2">
          <div class="modal-section">
            <label>Best-Practice Alignment</label>
            <p>${c.bestPracticeAlignment}</p>
          </div>
          <div class="modal-section">
            <label>Known Gap / Limitation</label>
            <p>${c.gap}</p>
          </div>
        </div>

        <div class="modal-grid-2">
          <div class="modal-section">
            <label>Success Metric</label>
            <p class="text-teal font-semibold">${c.successMetric}</p>
          </div>
          <div class="modal-section">
            <label>Residual Risk</label>
            <p>${c.residualRisk}</p>
          </div>
        </div>
      `;

      modal.classList.remove("hidden");
    }, 120);
  },

  closeControlModal() {
    const modal = document.getElementById("control-detail-modal");
    if (modal) modal.classList.add("hidden");
  },

  // -------------------------------------------------------------
  // VIEW: 5. CONTROL IMPLEMENTATION WORKFLOW
  // -------------------------------------------------------------
  renderImplementation(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Interactive Control Implementation Workflow</h1>
          <p class="subtitle">Step-by-step rollout simulator demonstrating progressive configuration deployment.</p>
        </div>
        <div class="header-actions">
          <span class="badge badge-academic">SIMULATED DEPLOYMENT</span>
        </div>
      </div>

      <!-- Spotlight: C-02 Multi-Factor Authentication Rollout -->
      <div class="card implementation-card">
        <div class="card-header">
          <div class="card-title-group">
            <span class="badge badge-pass">C-02 FEATURED WORKFLOW</span>
            <h3>Multi-Factor Authentication (MFA) Implementation Stepper</h3>
          </div>
          <button class="btn btn-success" id="btn-apply-mfa-control" onclick="App.applyControl('C-02')">
            ✓ Apply Control (Enforce MFA Everywhere)
          </button>
        </div>
        <div class="card-body">
          <div class="workflow-stepper">
            <div class="flow-step completed"><div class="num">1</div><div class="txt">Identify privileged accounts (25 Admins, 120 Faculty)</div></div>
            <div class="flow-step completed"><div class="num">2</div><div class="txt">Select MFA mechanism (FIDO2 WebAuthn & TOTP)</div></div>
            <div class="flow-step completed"><div class="num">3</div><div class="txt">Enrol users in Identity Provider (IdP)</div></div>
            <div class="flow-step completed"><div class="num">4</div><div class="txt">Configure conditional access (VPN & Admin portals)</div></div>
            <div class="flow-step completed"><div class="num">5</div><div class="txt">Disable password-only privileged access</div></div>
            <div class="flow-step completed"><div class="num">6</div><div class="txt">Enable authentication logging to Central SIEM</div></div>
            <div class="flow-step completed"><div class="num">7</div><div class="txt">Verify with test vectors (MFA-01, 02, 03)</div></div>
          </div>

          <div class="config-terminal-box">
            <div class="config-header">
              <span><i class="icon-terminal"></i> Simulated Identity Provider (IdP) Active Configuration</span>
              <span class="badge badge-outline">FIDO2 / Conditional Access</span>
            </div>
            <pre class="code-display"><code>Privileged accounts          ➔ MFA REQUIRED (Enforced: 100%)
VPN access                   ➔ MFA REQUIRED (Conditional Access: Active)
Password-only privileged     ➔ DISABLED (Legacy Auth Blocked)
Authentication logging       ➔ SIEM ENABLED (Syslog RFC 5424 to siem.abc.edu)
Enrollment window            ➔ 7 days (Phase 1 Target Met)</code></pre>
          </div>
        </div>
      </div>

      <!-- Control Rollout Matrix (All 12 Controls) -->
      <div class="card">
        <div class="card-header">
          <h3>Implementation Control Center (All 12 Controls)</h3>
          <span class="text-sm text-muted">Click "Apply Control" to toggle state</span>
        </div>
        <div class="card-body">
          <div class="implementation-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Control Name</th>
                  <th>Current State</th>
                  <th>Implementation Scope</th>
                  <th>Target Timeline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${window.SIM_CONTROLS.map(c => `
                  <tr>
                    <td><strong>${c.id}</strong></td>
                    <td>${c.name}</td>
                    <td>
                      <span class="badge ${c.status === 'IMPLEMENTED' ? 'badge-pass' : 'badge-warning'}" id="status-badge-${c.id}">
                        ${c.status}
                      </span>
                    </td>
                    <td class="text-sm">${c.securityObjective}</td>
                    <td>${c.timeline.split('(')[0]}</td>
                    <td>
                      <button class="btn btn-xs ${c.status === 'IMPLEMENTED' ? 'btn-outline' : 'btn-primary'}" 
                              id="btn-apply-${c.id}"
                              onclick="App.applyControl('${c.id}')">
                        ${c.status === 'IMPLEMENTED' ? 'Re-Apply' : 'Apply Control'}
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  applyControl(controlId) {
    const c = window.SIM_CONTROLS.find(item => item.id === controlId);
    if (!c) return;

    c.status = "IMPLEMENTED";
    const badge = document.getElementById(`status-badge-${c.id}`);
    if (badge) {
      badge.className = "badge badge-pass";
      badge.textContent = "IMPLEMENTED";
    }

    if (window.TelemetryConsole) {
      window.TelemetryConsole.addEvent({
        severity: "INFO",
        sensor: "Control-Orchestrator",
        message: `Control ${c.id} (${c.name}) successfully applied and validated.`
      });
    }

    this.updateDashboardMetrics();
    alert(`Simulated Action: Control ${c.id} [${c.name}] has been set to IMPLEMENTED in the ABC University simulation.`);
  },

  // -------------------------------------------------------------
  // VIEW: 6. CONFIGURATION CENTER
  // -------------------------------------------------------------
  renderConfiguration(container) {
    const cfg = this.config;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Simulated Security Configuration Center</h1>
          <p class="subtitle">Interactive controls to toggle network rules, authentication policies, and security services in real-time.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" onclick="App.resetConfig()">
            ↺ Reset to Hardened Defaults
          </button>
        </div>
      </div>

      <div class="config-grid">
        <!-- Identity & Access Settings -->
        <div class="card config-card">
          <div class="card-header">
            <h3>Identity & Access Defences</h3>
          </div>
          <div class="card-body">
            <div class="config-row">
              <div class="config-info">
                <strong>Mandatory MFA for Privileged Accounts</strong>
                <p>Enforce FIDO2/TOTP token validation on administrative logins.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.mfaEnforced ? 'active-on' : 'active-off'}" 
                        onclick="App.toggleSetting('mfaEnforced')">
                  ${cfg.mfaEnforced ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div class="config-row">
              <div class="config-info">
                <strong>Remote Access VPN MFA</strong>
                <p>Require secondary factor before granting tunnel connection.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.vpnMfa ? 'active-on' : 'active-off'}" 
                        onclick="App.toggleSetting('vpnMfa')">
                  ${cfg.vpnMfa ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div class="config-row">
              <div class="config-info">
                <strong>Centralized Authentication Logging</strong>
                <p>Forward all logon events and Kerberos tickets to SIEM.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.authLogging ? 'active-on' : 'active-off'}" 
                        onclick="App.toggleSetting('authLogging')">
                  ${cfg.authLogging ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Network & Firewall Settings -->
        <div class="card config-card">
          <div class="card-header">
            <h3>Firewall & Inter-VLAN Access Control Lists</h3>
          </div>
          <div class="card-body">
            <div class="config-row">
              <div class="config-info">
                <strong>Firewall Default Inbound Policy</strong>
                <p>Stateful perimeter posture for unclassified ingress traffic.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.fwDefaultInbound === 'DENY' ? 'active-on' : 'active-off'}" 
                        onclick="App.toggleSetting('fwDefaultInbound')">
                  ${cfg.fwDefaultInbound}
                </button>
              </div>
            </div>

            <div class="config-row">
              <div class="config-info">
                <strong>Student VLAN ➔ Finance/DB ACL (Rule 102)</strong>
                <p>Drop raw packet traversal from Student BYOD to Database subnet.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.studentFinanceAcl === 'BLOCK' ? 'active-on' : 'active-danger'}" 
                        onclick="App.toggleSetting('studentFinanceAcl')">
                  ${cfg.studentFinanceAcl}
                </button>
              </div>
            </div>

            <div class="config-row">
              <div class="config-info">
                <strong>Student VLAN ➔ Moodle LMS Access (Rule 101)</strong>
                <p>Permit authenticated educational HTTPS traffic on port 443.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.studentLmsAcl === 'ALLOW' ? 'active-on' : 'active-off'}" 
                        onclick="App.toggleSetting('studentLmsAcl')">
                  ${cfg.studentLmsAcl}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Host & Data Protection -->
        <div class="card config-card">
          <div class="card-header">
            <h3>Host Security & Cryptography</h3>
          </div>
          <div class="card-body">
            <div class="config-row">
              <div class="config-info">
                <strong>HTTPS / TLS 1.3 Strict Enforcement</strong>
                <p>Enforce HSTS and automatic HTTP 301 redirection.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.httpsEnforced ? 'active-on' : 'active-off'}" 
                        onclick="App.toggleSetting('httpsEnforced')">
                  ${cfg.httpsEnforced ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            <div class="config-row">
              <div class="config-info">
                <strong>Endpoint Detection and Response (EDR)</strong>
                <p>Real-time behavioral heuristics and ransomware quarantine.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.edrEnabled ? 'active-on' : 'active-off'}" 
                        onclick="App.toggleSetting('edrEnabled')">
                  ${cfg.edrEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            <div class="config-row">
              <div class="config-info">
                <strong>Backup Immutability (WORM Compliance)</strong>
                <p>30-day Write-Once-Read-Many air-gapped S3 Object Lock.</p>
              </div>
              <div class="config-toggle">
                <button class="toggle-btn ${cfg.backupImmutability ? 'active-on' : 'active-off'}" 
                        onclick="App.toggleSetting('backupImmutability')">
                  ${cfg.backupImmutability ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Posture Summary -->
        <div class="card config-card">
          <div class="card-header">
            <h3>Live Simulated Posture Impact</h3>
          </div>
          <div class="card-body">
            <div class="posture-gauge-box">
              <div class="posture-score">${this.calculatePostureScore()}%</div>
              <div class="posture-label">Simulated Defense Health Index</div>
            </div>
            <p class="text-sm text-muted">
              Modifying these settings immediately impacts verification test outcomes (e.g. Setting Student ➔ DB to ALLOW causes test NET-01 to FAIL).
            </p>
            <div class="posture-action-row">
              <button class="btn btn-primary btn-block" onclick="App.navigateTo('testing')">
                Re-Run Verification Test Suite with Current Settings →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  toggleSetting(key) {
    if (key === "fwDefaultInbound") {
      this.config.fwDefaultInbound = this.config.fwDefaultInbound === "DENY" ? "ALLOW" : "DENY";
    } else if (key === "studentFinanceAcl") {
      this.config.studentFinanceAcl = this.config.studentFinanceAcl === "BLOCK" ? "ALLOW" : "BLOCK";
      // Update NET-01 test result accordingly
      if (this.config.studentFinanceAcl === "ALLOW") {
        this.testResults["NET-01"].status = "FAIL";
      } else {
        this.testResults["NET-01"].status = "PASS";
      }
    } else if (key === "studentLmsAcl") {
      this.config.studentLmsAcl = this.config.studentLmsAcl === "ALLOW" ? "BLOCK" : "ALLOW";
    } else {
      this.config[key] = !this.config[key];
    }

    if (window.TelemetryConsole) {
      window.TelemetryConsole.addEvent({
        severity: "INFO",
        sensor: "Config-Engine",
        message: `Configuration parameter [${key}] updated to: ${this.config[key]}`
      });
    }

    this.renderCurrentView();
  },

  calculatePostureScore() {
    let score = 100;
    if (!this.config.mfaEnforced) score -= 25;
    if (!this.config.vpnMfa) score -= 15;
    if (this.config.fwDefaultInbound !== "DENY") score -= 20;
    if (this.config.studentFinanceAcl !== "BLOCK") score -= 20;
    if (!this.config.httpsEnforced) score -= 10;
    if (!this.config.edrEnabled) score -= 15;
    if (!this.config.backupImmutability) score -= 10;
    return Math.max(0, score);
  },

  resetConfig() {
    this.config = {
      mfaEnforced: true,
      vpnMfa: true,
      fwDefaultInbound: "DENY",
      studentFinanceAcl: "BLOCK",
      studentLmsAcl: "ALLOW",
      httpsEnforced: true,
      authLogging: true,
      siemConnected: true,
      edrEnabled: true,
      backupImmutability: true,
      wifiClientIsolation: true,
      accountLockoutThreshold: 5
    };
    this.renderCurrentView();
  },

  // -------------------------------------------------------------
  // VIEW: 7. VERIFICATION & TESTING CENTER (15+ Tests)
  // -------------------------------------------------------------
  renderTesting(container) {
    const tests = window.SIM_VERIFICATION_TESTS;
    const passCount = Object.values(this.testResults).filter(t => t.status === "PASS").length;
    const failCount = Object.values(this.testResults).filter(t => t.status === "FAIL").length;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Security Controls Verification & Testing Center</h1>
          <p class="subtitle">Automated test harness executing 16 verification probes across Identity, Network, Host, and Recovery.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" onclick="App.runAllVerificationTests()">
            ▶ Execute All 16 Tests
          </button>
        </div>
      </div>

      <!-- Test Metrics Bar -->
      <div class="test-summary-bar">
        <div class="test-stat">
          <span class="val text-green">${passCount}</span>
          <span class="lbl">Tests Passing</span>
        </div>
        <div class="test-stat">
          <span class="val text-red">${failCount}</span>
          <span class="lbl">Tests Failing</span>
        </div>
        <div class="test-stat">
          <span class="val text-blue">16</span>
          <span class="lbl">Total Automated Probes</span>
        </div>
        <div class="test-stat">
          <span class="val">${Math.round((passCount / 16) * 100)}%</span>
          <span class="lbl">Compliance Rate</span>
        </div>
      </div>

      <div class="tests-table-card card">
        <div class="card-body no-padding">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 100px;">Test ID</th>
                <th style="width: 110px;">Category</th>
                <th>Test Vector & Scenario</th>
                <th>Expected Outcome</th>
                <th style="width: 110px;">Simulated Result</th>
                <th style="width: 100px;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${tests.map(t => {
                const res = this.testResults[t.id] || { status: t.defaultResult };
                return `
                  <tr id="test-row-${t.id}">
                    <td><strong>${t.id}</strong></td>
                    <td><span class="badge badge-cat">${t.category}</span></td>
                    <td>
                      <div class="test-name">${t.name}</div>
                      <div class="test-sub text-muted">${t.sourceNode} ➔ ${t.targetNode} (${t.protocol})</div>
                    </td>
                    <td><span class="badge-expected">${t.expectedResult}</span></td>
                    <td>
                      <span class="badge ${res.status === 'PASS' ? 'badge-pass' : (res.status === 'FAIL' ? 'badge-fail' : 'badge-warning')}" id="test-badge-${t.id}">
                        ${res.status}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-xs btn-primary" onclick="App.runSingleVerificationTest('${t.id}')">
                        Run
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  runSingleVerificationTest(testId) {
    const t = window.SIM_VERIFICATION_TESTS.find(item => item.id === testId);
    if (!t) return;

    let result = "PASS";

    // Check dynamic configuration rules
    if (testId === "NET-01" && this.config.studentFinanceAcl === "ALLOW") {
      result = "FAIL";
    } else if (testId === "MFA-01" && !this.config.mfaEnforced) {
      result = "FAIL";
    } else if (testId === "TLS-01" && !this.config.httpsEnforced) {
      result = "FAIL";
    } else if (testId === "EDR-01" && !this.config.edrEnabled) {
      result = "FAIL";
    } else if (testId === "SIM-01") {
      // In SIM-01, status matches current workflow step
      result = window.RemediationWorkflow.steps[window.RemediationWorkflow.currentStep].status.includes("PASS") ? "PASS" : "FAIL";
    }

    this.testResults[testId] = {
      status: result,
      timestamp: new Date().toLocaleTimeString(),
      log: t.telemetrySnippet
    };

    // Update UI badge
    const badge = document.getElementById(`test-badge-${testId}`);
    if (badge) {
      badge.className = `badge ${result === 'PASS' ? 'badge-pass' : (result === 'FAIL' ? 'badge-fail' : 'badge-warning')}`;
      badge.textContent = result;
    }

    // Forward to SIEM
    if (window.TelemetryConsole) {
      window.TelemetryConsole.addEvent({
        severity: result === "FAIL" ? "HIGH" : "INFO",
        sensor: "Verification-Harness",
        sourceIp: t.sourceNode.split('(')[1]?.replace(')', '') || "10.10.42.15",
        destIp: t.targetNode.split('(')[1]?.replace(')', '') || "10.60.0.15",
        message: `Verification Test ${testId} executed: ${t.name} -> Result: [${result}]`
      });
    }

    alert(`Verification Test [${testId}] Executed!\n\nTest: ${t.name}\nExpected: ${t.expectedResult}\nObserved: ${result}\n\nSimulated Telemetry logged in Central SIEM.`);
  },

  runAllVerificationTests() {
    window.SIM_VERIFICATION_TESTS.forEach(t => {
      let result = "PASS";
      if (t.id === "NET-01" && this.config.studentFinanceAcl === "ALLOW") result = "FAIL";
      if (t.id === "SIM-01") result = window.RemediationWorkflow.steps[window.RemediationWorkflow.currentStep].status.includes("PASS") ? "PASS" : "FAIL";

      this.testResults[t.id] = {
        status: result,
        timestamp: new Date().toLocaleTimeString(),
        log: t.telemetrySnippet
      };
    });

    if (window.TelemetryConsole) {
      window.TelemetryConsole.addEvent({
        severity: "INFO",
        sensor: "Verification-Harness",
        message: "Completed automated execution of all 16 verification test vectors."
      });
    }

    this.renderCurrentView();
    alert("Executed all 16 simulated verification tests. Check test results table and SIEM telemetry feed.");
  },

  // -------------------------------------------------------------
  // VIEW: 8. REMEDIATION & RETESTING (SIM-01)
  // -------------------------------------------------------------
  renderRemediation(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Simulated Remediation & Retesting Lifecycle (SIM-01)</h1>
          <p class="subtitle">Detailed walkthrough: Discovering an ACL audit failure, purging the stale broad exception, enforcing DENY, and retesting to PASS.</p>
        </div>
        <div class="header-actions">
          <span class="badge badge-academic">CORE EVALUATOR DEMO VECTOR</span>
        </div>
      </div>

      <div id="remediation-view-container"></div>
    `;

    window.RemediationWorkflow.render("remediation-view-container");
  },

  // -------------------------------------------------------------
  // VIEW: 9. AUDIT CHECKLIST
  // -------------------------------------------------------------
  renderAudit(container) {
    const items = window.SIM_AUDIT_CHECKLIST;
    const filtered = items.filter(i => {
      return this.auditFilter === "ALL" || i.status === this.auditFilter;
    });

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Simulated Audit & Compliance Checklist</h1>
          <p class="subtitle">Independent evaluator audit matrix reviewing evidence, verification methodology, and corrective actions.</p>
        </div>
        <div class="header-actions">
          <div class="filter-pills">
            ${['ALL', 'PASS', 'PARTIAL'].map(st => `
              <button class="pill ${this.auditFilter === st ? 'active' : ''}" 
                      onclick="App.filterAudit('${st}')">${st}</button>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body no-padding">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 100px;">Audit ID</th>
                <th style="width: 140px;">Control & Domain</th>
                <th>Security Requirement</th>
                <th>Verification Method</th>
                <th style="width: 110px;">Status</th>
                <th>Gap & Corrective Action</th>
                <th style="width: 100px;">Evidence</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(item => `
                <tr>
                  <td><strong>${item.id}</strong></td>
                  <td>
                    <strong>${item.controlId}</strong>
                    <div class="text-muted text-xs">${item.controlName}</div>
                  </td>
                  <td>${item.requirement}</td>
                  <td>${item.verificationMethod}</td>
                  <td>
                    <span class="badge ${item.status === 'PASS' ? 'badge-pass' : 'badge-warning'}">
                      ${item.status}
                    </span>
                  </td>
                  <td>
                    <div class="text-sm"><strong>Gap:</strong> ${item.gap}</div>
                    <div class="text-xs text-muted"><strong>Action:</strong> ${item.correctiveAction}</div>
                  </td>
                  <td>
                    <button class="btn btn-xs btn-outline" onclick="App.viewAuditEvidence('${item.id}')">
                      Inspect
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Evidence Modal -->
      <div id="evidence-modal" class="modal-backdrop hidden">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 id="evidence-modal-title">Simulated Audit Evidence Artifact</h3>
            <button class="modal-close" onclick="App.closeEvidenceModal()">✕</button>
          </div>
          <div class="modal-body" id="evidence-modal-body"></div>
        </div>
      </div>
    `;
  },

  filterAudit(status) {
    this.auditFilter = status;
    this.renderCurrentView();
  },

  viewAuditEvidence(auditId) {
    const item = window.SIM_AUDIT_CHECKLIST.find(i => i.id === auditId);
    if (!item) return;

    const modal = document.getElementById("evidence-modal");
    const title = document.getElementById("evidence-modal-title");
    const body = document.getElementById("evidence-modal-body");
    if (!modal) return;

    title.innerHTML = `Audit Evidence: [${item.id}] ${item.controlName}`;
    body.innerHTML = `
      <div class="modal-section">
        <label>Audit Requirement</label>
        <p>${item.requirement}</p>
      </div>

      <div class="modal-section">
        <label>Expected Evidence Specification</label>
        <p>${item.evidenceExpected}</p>
      </div>

      <div class="modal-section">
        <label>Simulated Raw Evidence Artifact</label>
        <pre class="code-display"><code>${item.evidenceSnippet}</code></pre>
      </div>

      <div class="modal-section highlight-box">
        <label>Auditor Evaluation & Finding</label>
        <p><strong>Status:</strong> <span class="badge ${item.status === 'PASS' ? 'badge-pass' : 'badge-warning'}">${item.status}</span></p>
        <p><strong>Identified Gap:</strong> ${item.gap}</p>
        <p><strong>Approved Corrective Action:</strong> ${item.correctiveAction}</p>
      </div>
    `;

    modal.classList.remove("hidden");
  },

  closeEvidenceModal() {
    const modal = document.getElementById("evidence-modal");
    if (modal) modal.classList.add("hidden");
  },

  // -------------------------------------------------------------
  // VIEW: 10. BEST-PRACTICE ALIGNMENT (NIST, CIS, ISO)
  // -------------------------------------------------------------
  renderFrameworks(container) {
    const fw = window.SIM_FRAMEWORKS;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Best-Practice Framework Alignment</h1>
          <p class="subtitle">Comprehensive mapping of ABC University controls to NIST CSF 2.0, CIS Controls v8, and ISO/IEC 27001:2022.</p>
        </div>
        <div class="header-actions">
          <span class="badge badge-academic">PRACTICE ALIGNMENT ONLY</span>
        </div>
      </div>

      <div class="disclaimer-alert-box">
        <i class="icon-shield"></i>
        <div>
          <strong>ACADEMIC SIMULATION NOTICE:</strong>
          <p>${fw.disclaimer}</p>
        </div>
      </div>

      <!-- NIST CSF 2.0 (6 Functions) -->
      <div class="framework-card card">
        <div class="card-header">
          <h3>NIST Cybersecurity Framework 2.0 (6 Core Functions)</h3>
          <span class="badge badge-outline">NIST CSF 2.0</span>
        </div>
        <div class="card-body">
          <div class="nist-grid">
            ${fw.nistFunctions.map(fn => `
              <div class="nist-function-card">
                <div class="nist-func-header">
                  <h4>${fn.name}</h4>
                  <div class="tag-group">
                    ${fn.controls.map(c => `<span class="tag-control">${c}</span>`).join(" ")}
                  </div>
                </div>
                <p class="nist-desc">${fn.description}</p>
                <div class="nist-cats">
                  ${fn.categories.map(cat => `
                    <div class="nist-cat-item">
                      <strong>${cat.code}</strong>: ${cat.name}
                      <div class="text-xs text-muted">${cat.description}</div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- CIS Controls & ISO/IEC 27001 -->
      <div class="dashboard-split-grid">
        <!-- CIS Controls v8 -->
        <div class="card">
          <div class="card-header">
            <h3>CIS Controls v8 Safeguards</h3>
            <span class="badge badge-outline">Center for Internet Security</span>
          </div>
          <div class="card-body no-padding">
            <table class="data-table">
              <thead>
                <tr>
                  <th>CIS Control</th>
                  <th>Safeguard</th>
                  <th>ABC Control</th>
                </tr>
              </thead>
              <tbody>
                ${fw.cisControls.map(c => `
                  <tr>
                    <td><strong>${c.id}</strong>: ${c.name}</td>
                    <td>${c.safeguard}</td>
                    <td>${c.controls.map(ctrl => `<span class="tag-control">${ctrl}</span>`).join(" ")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ISO/IEC 27001:2022 -->
        <div class="card">
          <div class="card-header">
            <h3>ISO/IEC 27001:2022 Control Clauses</h3>
            <span class="badge badge-outline">Aligned with relevant practices</span>
          </div>
          <div class="card-body no-padding">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Clause</th>
                  <th>Control Title</th>
                  <th>ABC Control</th>
                </tr>
              </thead>
              <tbody>
                ${fw.isoControls.map(i => `
                  <tr>
                    <td><strong>${i.clause}</strong></td>
                    <td>${i.name}</td>
                    <td>${i.controls.map(ctrl => `<span class="tag-control">${ctrl}</span>`).join(" ")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------
  // VIEW: 11. METRICS & SUCCESS CRITERIA
  // -------------------------------------------------------------
  renderMetrics(container) {
    const metricsData = [
      { name: "Privileged accounts with MFA", current: 100, target: 100, unit: "%", status: "PASS", note: "25/25 Admins enrolled with FIDO2 hardware tokens." },
      { name: "VPN accounts with MFA", current: 100, target: 100, unit: "%", status: "PASS", note: "All remote access authenticated via TOTP/FIDO2." },
      { name: "Unauthorized Student ➔ DB connections", current: 0, target: 0, unit: "", status: "PASS", note: "ISFW Rule 102 hardware drop active." },
      { name: "Critical servers in patch inventory", current: 100, target: 100, unit: "%", status: "PASS", note: "100% CMDB server coverage; weekly Nessus scans." },
      { name: "Critical security logs in SIEM", current: 100, target: 100, unit: "%", status: "PASS", note: "All Tier 0/1 identity and network streams active." },
      { name: "Managed endpoint EDR coverage", current: 98.5, target: 98, unit: "%", status: "PASS", note: "1,182 of 1,200 workstations reporting healthy." },
      { name: "Critical backup jobs monitored", current: 100, target: 100, unit: "%", status: "PASS", note: "Finance DB & SIS protected by 30-day WORM lock." },
      { name: "Security awareness completion", current: 95.6, target: 95, unit: "%", status: "PASS", note: "Phishing click rate down to 4.2% (Target <5%)." }
    ];

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Simulated Metrics & Success Criteria</h1>
          <p class="subtitle">Target key performance indicators (KPIs) validating operational effectiveness of implemented controls.</p>
        </div>
        <div class="header-actions">
          <span class="badge badge-academic">SIMULATED TARGETS</span>
        </div>
      </div>

      <div class="metrics-dashboard-grid">
        ${metricsData.map(m => `
          <div class="metric-progress-card card">
            <div class="card-header">
              <span class="metric-title">${m.name}</span>
              <span class="badge ${m.status === 'PASS' ? 'badge-pass' : 'badge-warning'}">SIMULATED TARGET MET</span>
            </div>
            <div class="card-body">
              <div class="metric-val-row">
                <span class="current-val">${m.current}${m.unit}</span>
                <span class="target-val">Target: ${m.target === 0 ? '0' : '≥' + m.target + m.unit}</span>
              </div>
              <div class="progress-bar-lg">
                <div class="progress-fill bg-green" style="width: ${m.target === 0 ? (m.current === 0 ? '100%' : '20%') : Math.min(100, (m.current/m.target)*100) + '%'}"></div>
              </div>
              <p class="metric-note">${m.note}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  // -------------------------------------------------------------
  // VIEW: 12. 90-DAY ROADMAP
  // -------------------------------------------------------------
  renderRoadmap(container) {
    const phases = window.SIM_ROADMAP;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>90-Day Implementation Roadmap</h1>
          <p class="subtitle">Structured 4-phase program sequencing immediate containment, access hardening, resilience, and governance.</p>
        </div>
        <div class="header-actions">
          <span class="badge badge-academic">SIMULATED TIMELINE</span>
        </div>
      </div>

      <div class="roadmap-timeline">
        ${phases.map(p => `
          <div class="roadmap-phase-card card" id="phase-${p.phase}">
            <div class="card-header phase-header">
              <div class="phase-meta">
                <span class="badge badge-phase">PHASE ${p.phase}</span>
                <h3>${p.title}</h3>
              </div>
              <span class="badge ${p.status === 'COMPLETED' ? 'badge-pass' : (p.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-outline')}">
                ${p.status}
              </span>
            </div>
            <div class="card-body">
              <p class="phase-objective"><strong>Strategic Objective:</strong> ${p.objective}</p>
              
              <div class="task-grid">
                ${p.tasks.map(t => `
                  <div class="task-card">
                    <div class="task-header">
                      <span class="task-id">${t.id}</span>
                      <span class="tag-control">${t.controlId}</span>
                    </div>
                    <h4 class="task-title">${t.title}</h4>
                    <p class="task-owner"><i class="icon-user"></i> <strong>Owner:</strong> ${t.owner}</p>
                    <p class="task-deps"><strong>Dependencies:</strong> ${t.dependencies}</p>
                    <p class="task-outcome"><strong>Outcome:</strong> ${t.expectedOutcome}</p>
                    <div class="task-verif">
                      <i class="icon-check"></i> <strong>Verification:</strong> ${t.verification}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  // -------------------------------------------------------------
  // VIEW: 13. RESIDUAL RISK ASSESSMENT
  // -------------------------------------------------------------
  renderResidual(container) {
    const risks = window.SIM_RESIDUAL_RISK;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Post-Implementation Residual Risk Assessment</h1>
          <p class="subtitle">Rigorous academic analysis explaining WHY specific technical risks remain after control implementation.</p>
        </div>
        <div class="header-actions">
          <span class="badge badge-academic">RISK ANALYSIS</span>
        </div>
      </div>

      <div class="residual-risk-grid">
        ${risks.map(r => `
          <div class="risk-card card">
            <div class="card-header">
              <div>
                <span class="risk-id">${r.id}</span>
                <h3>${r.riskArea}</h3>
              </div>
              <div class="risk-ratings-badge">
                <span class="badge badge-outline">Inherent: ${r.inherentRisk}</span>
                <span class="badge badge-priority-${r.statusColor}">Residual: ${r.residualRiskLevel}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="risk-why-box alert-box-${r.statusColor}">
                <label><i class="icon-alert"></i> WHY Residual Risk Remains</label>
                <p>${r.whyRiskRemains}</p>
              </div>

              <div class="risk-meta-grid">
                <div class="meta-item">
                  <label>Primary Controls Deployed</label>
                  <div class="tag-group">
                    ${r.primaryControls.map(c => `<span class="tag-control">${c}</span>`).join(" ")}
                  </div>
                </div>
                <div class="meta-item">
                  <label>Compensating Defences Active</label>
                  <p class="text-sm">${r.compensatingDefences}</p>
                </div>
              </div>

              <div class="risk-future-action">
                <label>Planned Continuous Improvement</label>
                <p class="text-sm text-teal">${r.futureAction}</p>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  // -------------------------------------------------------------
  // VIEW: 14. ATTACK SCENARIO SIMULATOR
  // -------------------------------------------------------------
  renderAttackSim(container) {
    container.innerHTML = `
      <div id="attack-simulator-container"></div>
    `;
    window.AttackSimulator.render("attack-simulator-container");
  },

  // -------------------------------------------------------------
  // VIEW: 15. BEFORE VS AFTER EXPOSURE MATRIX
  // -------------------------------------------------------------
  renderBeforeAfter(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Before vs. After Security Posture Comparison</h1>
          <p class="subtitle">Direct comparative analysis: Week 2 vulnerable baseline vs. Week 3 implemented defensive controls.</p>
        </div>
        <div class="header-actions">
          <span class="badge badge-academic">POSTURE EVOLUTION</span>
        </div>
      </div>

      <div class="card">
        <div class="card-body no-padding">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 200px;">Architecture Domain</th>
                <th style="width: 45%;">Week 2 Baseline (Vulnerable State)</th>
                <th style="width: 45%;">Week 3 Post-Remediation (Hardened State)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Network Segmentation</strong></td>
                <td class="text-red">Flat broadcast routing; student BYOD can directly ping Finance DB and administrative consoles.</td>
                <td class="text-green">802.1Q isolated VLANs; ISFW default-deny ACL drops unauthorized inter-VLAN transit.</td>
              </tr>
              <tr>
                <td><strong>Perimeter & ACL Rules</strong></td>
                <td class="text-red">Permissive ANY-ANY rules active; broad exceptions allowing student traversal to database tier.</td>
                <td class="text-green">Strict default-deny ingress/egress; explicit Rule 102 dropping student packets with Syslog logging.</td>
              </tr>
              <tr>
                <td><strong>User Authentication</strong></td>
                <td class="text-red">Single-factor passwords only for VPN and admin portals; vulnerable to credential spraying.</td>
                <td class="text-green">100% mandatory FIDO2 hardware token & TOTP MFA for all administrators and VPN tunnels.</td>
              </tr>
              <tr>
                <td><strong>Data in Transit</strong></td>
                <td class="text-red">Cleartext HTTP (port 80), POP3, and unencrypted database connections active.</td>
                <td class="text-green">Mandatory TLS 1.3 with HSTS 301 redirects; all web and DB connections cryptographically encrypted.</td>
              </tr>
              <tr>
                <td><strong>Telemetry & Logging</strong></td>
                <td class="text-red">Disparate local 24-hour circular logs; no centralized correlation or threat visibility.</td>
                <td class="text-green">Centralized Splunk/Elastic SIEM ingesting syslog, auth, and Suricata alerts with 365-day retention.</td>
              </tr>
              <tr>
                <td><strong>Endpoint Protection</strong></td>
                <td class="text-red">Legacy signature antivirus; zero defense against fileless memory execution or ransomware.</td>
                <td class="text-green">Next-Gen EDR deployed across 98.5% of workstations with automated process quarantine.</td>
              </tr>
              <tr>
                <td><strong>Backup Resilience</strong></td>
                <td class="text-red">Online SMB backup shares writable by domain administrators; vulnerable to ransomware deletion.</td>
                <td class="text-green">3-2-1 air-gapped architecture with 30-day Write-Once-Read-Many (WORM) immutable cloud vaults.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------
  // VIEW: 16. ABOUT / SIMULATION DISCLAIMER
  // -------------------------------------------------------------
  renderAbout(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>About & Academic Simulation Disclaimer</h1>
          <p class="subtitle">Academic context, simulation scope, and ethical cybersecurity guidelines for ABC University.</p>
        </div>
      </div>

      <div class="about-card card">
        <div class="card-body">
          <div class="disclaimer-callout">
            <h2>⚠️ IMPORTANT SIMULATION DISCLAIMER</h2>
            <p>
              This application is a <strong>100% CONCEPTUAL AND SIMULATED ACADEMIC ENVIRONMENT</strong> created specifically for educational coursework (Week 3: Cybersecurity Controls Implementation & Verification).
            </p>
            <p>
              <strong>Strict Academic Safety Boundaries:</strong>
            </p>
            <ul>
              <li><strong>NO REAL NETWORKS</strong> are scanned, probed, or connected to.</li>
              <li><strong>NO REAL EXPLOITS</strong>, malware binaries, or attacking payloads are executed.</li>
              <li><strong>NO REAL CREDENTIALS</strong> or user identities are harvested or stored.</li>
              <li>All IP addresses are conceptual RFC 1918 private subnets (e.g. 10.10.0.0/16, 10.60.0.0/24).</li>
              <li>All test results, SIEM logs, and metrics are simulated for demonstration purposes.</li>
              <li>No claim of official ISO 27001 certification or real-world university deployment is made.</li>
            </ul>
          </div>

          <div class="about-section">
            <h3>Week 3 Coursework Purpose & Lifecycle</h3>
            <p>
              The primary educational objective of this simulation is to illustrate the complete end-to-end security control lifecycle:
            </p>
            <div class="about-flow-box">
              Week 2 Vulnerability ➔ Security Requirement ➔ Control Selection ➔ Implementation ➔ Configuration ➔ Verification Test ➔ Result ➔ Remediation ➔ Retest ➔ Success Metric ➔ Residual Risk
            </div>
            <p>
              By giving evaluators interactive control over configuration parameters, test execution, and remediation workflows, this application transforms a static academic report into an interactive security operations platform.
            </p>
          </div>

          <div class="about-section">
            <h3>Simulated Environment Summary</h3>
            <div class="env-stats-row">
              <div class="stat-box"><strong>8,000</strong> Students</div>
              <div class="stat-box"><strong>1,200</strong> Faculty & Staff</div>
              <div class="stat-box"><strong>25</strong> Administrators</div>
              <div class="stat-box"><strong>5</strong> 802.1Q VLANs</div>
              <div class="stat-box"><strong>12</strong> Security Controls</div>
              <div class="stat-box"><strong>13</strong> Week 2 Findings</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------
  // GUIDED EVALUATOR TOUR (18 Steps)
  // -------------------------------------------------------------
  startTour() {
    this.evaluatorTour.active = true;
    this.evaluatorTour.step = 1;
    document.getElementById("evaluator-tour-bar").classList.remove("hidden");
    this.executeTourStep();
  },

  stopTour() {
    this.evaluatorTour.active = false;
    document.getElementById("evaluator-tour-bar").classList.add("hidden");
  },

  tourNext() {
    if (this.evaluatorTour.step < 18) {
      this.evaluatorTour.step++;
      this.executeTourStep();
    } else {
      this.stopTour();
      alert("Guided Evaluator Tour Complete! You have reviewed all 18 key evaluation points.");
    }
  },

  tourPrev() {
    if (this.evaluatorTour.step > 1) {
      this.evaluatorTour.step--;
      this.executeTourStep();
    }
  },

  executeTourStep() {
    const cur = this.evaluatorTour.steps.find(s => s.step === this.evaluatorTour.step);
    if (!cur) return;

    // Update Tour Bar UI
    document.getElementById("tour-step-counter").textContent = `Step ${cur.step} of 18`;
    document.getElementById("tour-step-title").textContent = cur.title;
    document.getElementById("tour-step-action").textContent = cur.action;

    // Navigate to target view
    if (this.currentView !== cur.view) {
      this.navigateTo(cur.view);
    }

    // Trigger step-specific actions
    if (cur.triggerNode) {
      this.inspectArchitectureNode(cur.triggerNode);
    }
    if (cur.triggerVuln) {
      setTimeout(() => this.inspectVuln(cur.triggerVuln), 200);
    }
    if (cur.triggerControl) {
      setTimeout(() => this.inspectControl(cur.triggerControl), 200);
    }
    if (typeof cur.triggerRemediationStep === "number") {
      setTimeout(() => {
        window.RemediationWorkflow.goToStep(cur.triggerRemediationStep);
      }, 200);
    }
  },

  updateDashboardMetrics() {
    // Refresh stats when called
  }
};

// Auto-boot application upon DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});