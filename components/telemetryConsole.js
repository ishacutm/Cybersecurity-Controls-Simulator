/**
 * ABC University - Central SIEM Telemetry Console Component
 */

window.TelemetryConsole = {
  events: [
    {
      id: "EVT-1001",
      timestamp: "2026-09-19 14:15:22",
      severity: "INFO",
      sensor: "IdP-Auth",
      sourceIp: "10.30.0.12",
      destIp: "198.51.100.5",
      message: "FIDO2 Token Verified successfully for user admin.curtis@abc.edu (MFA-01)",
      rule: "AUTH_SUCCESS_MFA"
    },
    {
      id: "EVT-1002",
      timestamp: "2026-09-19 14:18:30",
      severity: "HIGH",
      sensor: "SIEM-Correlation",
      sourceIp: "192.0.2.14",
      destIp: "198.51.100.5",
      message: "MFA Brute Force Burst: 5 consecutive failed tokens for registrar.adams@abc.edu (MFA-03)",
      rule: "SEC-CORR-01"
    },
    {
      id: "EVT-1003",
      timestamp: "2026-09-19 14:20:10",
      severity: "HIGH",
      sensor: "ISFW-01",
      sourceIp: "10.10.42.15",
      destIp: "10.60.0.15:5432",
      message: "DROP: Unauthorized Inter-VLAN TCP SYN from Student VLAN to Finance DB (NET-01)",
      rule: "RULE-102-DENY"
    },
    {
      id: "EVT-1004",
      timestamp: "2026-09-19 14:23:44",
      severity: "MEDIUM",
      sensor: "Finance-DB-Audit",
      sourceIp: "10.20.0.88",
      destIp: "10.60.0.15",
      message: "RBAC Violation: Faculty role attempted UPDATE on tuition_ledger. SQLSTATE 42501 (RBAC-01)",
      rule: "DB_RBAC_POLICY"
    },
    {
      id: "EVT-1005",
      timestamp: "2026-09-19 14:27:35",
      severity: "HIGH",
      sensor: "Suricata-DPI",
      sourceIp: "10.10.42.99",
      destIp: "10.40.0.0/24",
      message: "ET SCAN Potential Nmap Port Scan Detected (>40 SYNs/sec) (IDS-01)",
      rule: "ET_SCAN_2001"
    },
    {
      id: "EVT-1006",
      timestamp: "2026-09-19 14:30:15",
      severity: "CRITICAL",
      sensor: "EDR-Agent-v4",
      sourceIp: "10.20.0.77",
      destIp: "Local-Filesystem",
      message: "Process test_ransom_canary.exe killed & quarantined. Heuristic: Mass Rename (EDR-01)",
      rule: "EDR_HEUR_RANSOM"
    }
  ],
  filterSeverity: "ALL",
  searchQuery: "",
  isPaused: false,

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = this.events.filter(e => {
      const matchSev = this.filterSeverity === "ALL" || e.severity === this.filterSeverity;
      const matchSearch = !this.searchQuery || 
        e.message.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        e.sensor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        e.rule.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchSev && matchSearch;
    });

    container.innerHTML = `
      <div class="telemetry-console-card">
        <div class="console-header-bar">
          <div class="console-title">
            <span class="pulse-indicator"></span>
            <h3>Central SIEM Live Telemetry Feed (Splunk / Elastic Simulated Indexer)</h3>
          </div>
          <div class="console-stats">
            <span class="stat-pill">Total Events: ${this.events.length}</span>
            <span class="stat-pill text-red">Critical/High: ${this.events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH').length}</span>
            <span class="stat-pill text-green">Status: ${this.isPaused ? 'PAUSED' : 'INGESTING'}</span>
          </div>
        </div>

        <div class="console-controls">
          <div class="filter-buttons">
            ${['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map(sev => `
              <button class="btn btn-xs ${this.filterSeverity === sev ? 'btn-primary' : 'btn-outline'}" 
                      onclick="TelemetryConsole.setFilter('${sev}')">${sev}</button>
            `).join("")}
          </div>

          <div class="console-search">
            <input type="text" placeholder="Search IP, sensor, rule..." 
                   value="${this.searchQuery}" 
                   oninput="TelemetryConsole.setSearch(this.value)" class="form-input-sm" />
          </div>

          <div class="console-actions">
            <button class="btn btn-xs btn-outline" onclick="TelemetryConsole.togglePause()">
              ${this.isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button class="btn btn-xs btn-outline" onclick="TelemetryConsole.clearLogs()">
              Clear Logs
            </button>
            <button class="btn btn-xs btn-secondary" onclick="TelemetryConsole.generateSampleEvent()">
              + Synthetic Event
            </button>
          </div>
        </div>

        <div class="console-stream-box">
          <table class="telemetry-table">
            <thead>
              <tr>
                <th style="width: 140px;">Timestamp</th>
                <th style="width: 90px;">Severity</th>
                <th style="width: 130px;">Sensor</th>
                <th style="width: 120px;">Source IP</th>
                <th style="width: 120px;">Rule ID</th>
                <th>Event Message / Normalized Telemetry</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr><td colspan="6" class="text-center text-muted">No security events match current filter.</td></tr>
              ` : filtered.slice().reverse().map(e => `
                <tr class="log-row sev-${e.severity.toLowerCase()}">
                  <td class="col-mono text-muted">${e.timestamp}</td>
                  <td><span class="badge badge-sev-${e.severity.toLowerCase()}">${e.severity}</span></td>
                  <td class="col-mono">${e.sensor}</td>
                  <td class="col-mono">${e.sourceIp}</td>
                  <td><span class="tag-rule">${e.rule}</span></td>
                  <td class="col-msg">${e.message}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  addEvent(evt) {
    if (this.isPaused) return;

    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const fullEvent = {
      id: "EVT-" + (1000 + this.events.length + 1),
      timestamp: timeStr,
      severity: evt.severity || "INFO",
      sensor: evt.sensor || evt.source || "ISFW-Cluster",
      sourceIp: evt.sourceIp || "10.10.42.15",
      destIp: evt.destIp || "10.60.0.15",
      message: evt.message || "Simulated security event telemetry received.",
      rule: evt.rule || "POLICY_INSPECT"
    };

    this.events.push(fullEvent);
    this.render("telemetry-console-container");

    // Also update dashboard ticker if present
    const ticker = document.getElementById("siem-ticker-latest");
    if (ticker) {
      ticker.textContent = `[${fullEvent.severity}] ${fullEvent.sensor}: ${fullEvent.message}`;
    }
  },

  setFilter(sev) {
    this.filterSeverity = sev;
    this.render("telemetry-console-container");
  },

  setSearch(q) {
    this.searchQuery = q;
    this.render("telemetry-console-container");
  },

  togglePause() {
    this.isPaused = !this.isPaused;
    this.render("telemetry-console-container");
  },

  clearLogs() {
    this.events = [];
    this.render("telemetry-console-container");
  },

  generateSampleEvent() {
    const sensors = ["ISFW-01", "P-NGFW", "ActiveDirectory-DC01", "Suricata-IPS", "EDR-Agent", "Moodle-WAF"];
    const sevs = ["INFO", "MEDIUM", "HIGH", "CRITICAL"];
    const randSensor = sensors[Math.floor(Math.random() * sensors.length)];
    const randSev = sevs[Math.floor(Math.random() * sevs.length)];

    this.addEvent({
      severity: randSev,
      sensor: randSensor,
      sourceIp: `10.${Math.floor(Math.random() * 70)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destIp: "10.60.0.15",
      message: `Periodic synthetic security event generated by ${randSensor}`,
      rule: `RULE-SYNTH-${Math.floor(Math.random() * 900 + 100)}`
    });
  }
};