/**
 * ABC University - Safe Educational Attack Scenario Simulator
 * Simulates: Compromised BYOD -> Student VLAN -> Lateral Movement Attempt -> Firewall/ACL -> Finance DB
 */

window.AttackSimulator = {
  defencesActive: true,
  currentStage: 0,
  isAnimating: false,

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="attack-sim-wrapper">
        <div class="attack-header-bar">
          <div>
            <h2>Educational Attack-Path Simulation (Lateral Movement Defense)</h2>
            <p class="subtitle">Safe academic demonstration of defense-in-depth intercepting internal lateral expansion.</p>
          </div>
          <div class="attack-toggle-group">
            <span class="toggle-label">Defensive Controls:</span>
            <button id="btn-toggle-defences" class="btn ${this.defencesActive ? 'btn-success' : 'btn-danger'}" onclick="AttackSimulator.toggleDefences()">
              ${this.defencesActive ? '🛡️ Defences ACTIVE (Hardened)' : '⚠️ Defences DISABLED (Vulnerable)'}
            </button>
            <button class="btn btn-primary" onclick="AttackSimulator.launchSimulation()">
              ▶ Launch Attack Probe
            </button>
          </div>
        </div>

        <div class="attack-stage-indicators">
          <div class="attack-card-path">
            <!-- Node 1 -->
            <div class="path-node ${this.currentStage >= 1 ? 'active' : ''}" id="path-node-1">
              <div class="node-icon">💻</div>
              <div class="node-name">1. Compromised BYOD</div>
              <div class="node-meta">10.10.42.5 (Student Laptop)</div>
              <div class="node-desc">Infected with commodity trojan via malicious torrent download.</div>
            </div>

            <div class="path-connector ${this.currentStage >= 2 ? 'active' : ''}">➔</div>

            <!-- Node 2 -->
            <div class="path-node ${this.currentStage >= 2 ? 'active' : ''}" id="path-node-2">
              <div class="node-icon">🌐</div>
              <div class="node-name">2. Student VLAN 10</div>
              <div class="node-meta">10.10.0.0/16 Subnet</div>
              <div class="node-desc">Trojan executes local ARP sweeps and initiates port scanning.</div>
            </div>

            <div class="path-connector ${this.currentStage >= 3 ? 'active' : ''}">➔</div>

            <!-- Node 3 -->
            <div class="path-node ${this.currentStage >= 3 ? (this.defencesActive ? 'blocked' : 'active') : ''}" id="path-node-3">
              <div class="node-icon">${this.defencesActive ? '🛡️' : '🔀'}</div>
              <div class="node-name">3. Internal Firewall / ACL</div>
              <div class="node-meta">ISFW & Suricata DPI</div>
              <div class="node-desc">${this.defencesActive ? 'Rule 102 Drops packet; Suricata triggers alert!' : 'Legacy allow-rule passes packet without inspection!'}</div>
            </div>

            <div class="path-connector ${this.currentStage >= 4 ? 'active' : ''}">➔</div>

            <!-- Node 4 -->
            <div class="path-node ${this.currentStage >= 4 ? (this.defencesActive ? 'safe' : 'compromised') : ''}" id="path-node-4">
              <div class="node-icon">💎</div>
              <div class="node-name">4. Finance DB VLAN 60</div>
              <div class="node-meta">10.60.0.15 (Crown Jewels)</div>
              <div class="node-desc">${this.defencesActive ? 'UNTOUCHED: Protected by micro-segmentation.' : 'COMPROMISED: Attacker reaches port 5432 and extracts records!'}</div>
            </div>
          </div>
        </div>

        <!-- Outcome Banner & Telemetry Panel -->
        <div class="attack-outcome-panel" id="attack-outcome-panel">
          <div class="outcome-header">
            <h3>Simulated Defense Analysis & Telemetry</h3>
            <span class="badge ${this.defencesActive ? 'badge-pass' : 'badge-fail'}" id="outcome-badge">
              ${this.defencesActive ? 'SECURITY CONTROLS ENGAGED' : 'UNMITIGATED EXPOSURE'}
            </span>
          </div>

          <div class="outcome-grid">
            <div class="outcome-status-box">
              <div class="outcome-stat-item">
                <label>Detection (Suricata IDS):</label>
                <span class="stat-value ${this.defencesActive ? 'text-green' : 'text-red'}" id="stat-detection">
                  ${this.defencesActive ? 'DETECTED (ET SCAN Potential Nmap SYN Sweep)' : 'UNDETECTED (No IDS sensor active)'}
                </span>
              </div>
              <div class="outcome-stat-item">
                <label>Containment (ISFW ACL):</label>
                <span class="stat-value ${this.defencesActive ? 'text-green' : 'text-red'}" id="stat-containment">
                  ${this.defencesActive ? 'BLOCKED (Dropped by Rule 102 at edge)' : 'PERMITTED (Permissive transit)'}
                </span>
              </div>
              <div class="outcome-stat-item">
                <label>Logging & SOC Telemetry:</label>
                <span class="stat-value ${this.defencesActive ? 'text-green' : 'text-red'}" id="stat-logging">
                  ${this.defencesActive ? 'LOGGED (Syslog streamed to Central SIEM)' : 'UNRECORDED (Local log dropped)'}
                </span>
              </div>
              <div class="outcome-stat-item">
                <label>Crown Jewel DB Status:</label>
                <span class="stat-value ${this.defencesActive ? 'text-green' : 'text-red'}" id="stat-db">
                  ${this.defencesActive ? 'CONFIDENTIALITY & INTEGRITY PRESERVED' : 'EXPOSURE: UNAUTHORIZED QUERY POSSIBLE'}
                </span>
              </div>
            </div>

            <div class="outcome-terminal">
              <div class="terminal-bar">
                <span><i class="icon-terminal"></i> Security Telemetry Stream</span>
                <span class="term-status">${this.defencesActive ? 'LIVE MONITORING' : 'OFFLINE'}</span>
              </div>
              <pre class="terminal-code" id="attack-term-logs">${this.getTelemetryLog()}</pre>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getTelemetryLog() {
    if (this.defencesActive) {
      return `[2026-09-19T14:40:01Z] [SURICATA-IDS] [ALERT] Priority: 2 | ET SCAN Potential Nmap Port Scan | Src: 10.10.42.5 -> Dst: 10.60.0.15:5432
[2026-09-19T14:40:01Z] [ISFW-RULE-102] [DROP] Packet DROPPED | Proto: TCP (SYN) | Ingress: VLAN 10 | Egress: VLAN 60
[2026-09-19T14:40:01Z] [SIEM-INGESTION] [CORRELATION #9921] Rule: UNAUTHORIZED_LATERAL_MOVEMENT | Action: SOC Notification Dispatched
[2026-09-19T14:40:02Z] [EDR-FLEET] Target host (10.60.0.15) reported zero unauthorized sockets created. Perimeter intact.`;
    } else {
      return `[2026-09-19T14:40:01Z] [CORE-ROUTER] Routing packet across flat routing interface...
[2026-09-19T14:40:01Z] [ISFW-RULE-099] [PERMIT] Temporary broad allow matched | Src: 10.10.42.5 -> Dst: 10.60.0.15:5432
[2026-09-19T14:40:02Z] [DB-POSTGRES] Inbound TCP connection accepted on port 5432 from 10.10.42.5.
[2026-09-19T14:40:02Z] [WARNING] CRITICAL SECURITY BREACH: Untrusted BYOD endpoint reached database listener!`;
    }
  },

  toggleDefences() {
    this.defencesActive = !this.defencesActive;
    this.currentStage = 0;
    this.render("attack-simulator-container");
  },

  launchSimulation() {
    this.currentStage = 0;
    const stages = [1, 2, 3, 4];
    let i = 0;

    const interval = setInterval(() => {
      this.currentStage = stages[i];
      i++;
      this.render("attack-simulator-container");

      if (i >= stages.length) {
        clearInterval(interval);
        if (window.TelemetryConsole) {
          window.TelemetryConsole.addEvent({
            severity: this.defencesActive ? "HIGH" : "CRITICAL",
            source: "Attack-Simulator",
            message: this.defencesActive ? "Simulated Lateral Attack BLOCKED & LOGGED by ISFW" : "Simulated Lateral Attack SUCCEEDED (Vulnerable State)"
          });
        }
      }
    }, 600);
  }
};