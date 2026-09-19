/**
 * ABC University - Interactive Network Architecture Diagram Component
 */

window.NetworkDiagram = {
  render(containerId, onSelectNode) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-diagram-wrapper">
        <div class="diagram-toolbar">
          <div class="diagram-legend">
            <span class="legend-item"><span class="dot untrusted"></span> Untrusted BYOD</span>
            <span class="legend-item"><span class="dot trusted"></span> Core / Administrative</span>
            <span class="legend-item"><span class="dot crown"></span> Crown Jewel DB</span>
            <span class="legend-item"><span class="dot security"></span> Security Controls</span>
          </div>
          <div class="diagram-hint">
            <i class="icon-info"></i> Click any network node to inspect its controls, threats, and test vectors.
          </div>
        </div>

        <div class="diagram-canvas-container">
          <svg viewBox="0 0 980 620" class="network-svg" id="university-topology-svg">
            <defs>
              <linearGradient id="grad-internet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e293b" />
                <stop offset="100%" stop-color="#0f172a" />
              </linearGradient>
              <linearGradient id="grad-firewall" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#b91c1c" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0.6" />
              </linearGradient>
              <linearGradient id="grad-core" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#0369a1" stop-opacity="0.5" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Links / Bus Lines -->
            <!-- Internet to Perimeter FW -->
            <line x1="490" y1="55" x2="490" y2="110" class="topo-link wan-link" />
            
            <!-- Perimeter FW to Core Switch -->
            <line x1="490" y1="170" x2="490" y2="230" class="topo-link core-link" />
            
            <!-- Perimeter FW to DMZ -->
            <path d="M 430 140 L 220 140 L 220 190" class="topo-link dmz-link" />
            
            <!-- Perimeter FW to VPN Gateway -->
            <path d="M 550 140 L 760 140 L 760 190" class="topo-link vpn-link" />

            <!-- Core Switch Distribution Bus -->
            <path d="M 120 290 L 860 290" class="topo-link bus-link" />
            
            <!-- Core Drop Lines to VLANs -->
            <line x1="120" y1="290" x2="120" y2="350" class="topo-link vlan-drop" />
            <line x1="280" y1="290" x2="280" y2="350" class="topo-link vlan-drop" />
            <line x1="440" y1="290" x2="440" y2="350" class="topo-link vlan-drop" />
            <line x1="600" y1="290" x2="600" y2="350" class="topo-link vlan-drop" />
            <line x1="760" y1="290" x2="760" y2="350" class="topo-link vlan-drop" />
            <line x1="880" y1="290" x2="880" y2="350" class="topo-link vlan-drop" />

            <!-- ISFW Intercept Bar -->
            <rect x="520" y="325" width="220" height="24" rx="4" class="isfw-barrier" />
            <text x="630" y="341" text-anchor="middle" class="isfw-text">ISFW INTER-VLAN FILTER (C-04)</text>

            <!-- Security Telemetry Links to SIEM -->
            <path d="M 490 140 C 350 110, 200 480, 180 520" class="telemetry-link" stroke-dasharray="4 4" />
            <path d="M 490 260 C 420 380, 280 480, 210 520" class="telemetry-link" stroke-dasharray="4 4" />
            <path d="M 760 410 C 700 520, 320 540, 240 540" class="telemetry-link" stroke-dasharray="4 4" />

            <!-- NODES -->

            <!-- 1. Internet -->
            <g class="topo-node" data-node="WAN" transform="translate(430, 15)">
              <rect width="120" height="40" rx="8" class="node-box wan-box" />
              <text x="60" y="24" text-anchor="middle" class="node-title">🌐 Untrusted WAN</text>
            </g>

            <!-- 2. DMZ (Public Services) -->
            <g class="topo-node" data-node="DMZ-100" transform="translate(150, 190)">
              <rect width="140" height="60" rx="8" class="node-box dmz-box" />
              <text x="70" y="25" text-anchor="middle" class="node-title">VLAN 100: DMZ</text>
              <text x="70" y="44" text-anchor="middle" class="node-sub">web.abc.edu / Mail</text>
            </g>

            <!-- 3. Perimeter Firewall & IPS -->
            <g class="topo-node" data-node="INFRA-01" transform="translate(400, 110)">
              <rect width="180" height="60" rx="8" class="node-box fw-box" />
              <text x="90" y="25" text-anchor="middle" class="node-title">🛡️ Perimeter NGFW / IPS</text>
              <text x="90" y="44" text-anchor="middle" class="node-sub">DDoS / Stateful / C-04</text>
            </g>

            <!-- 4. VPN Gateway -->
            <g class="topo-node" data-node="INFRA-07" transform="translate(690, 190)">
              <rect width="140" height="60" rx="8" class="node-box vpn-box" />
              <text x="70" y="25" text-anchor="middle" class="node-title">🔑 VPN Gateway</text>
              <text x="70" y="44" text-anchor="middle" class="node-sub">MFA Mandate / C-02</text>
            </g>

            <!-- 5. Core Switch / Router -->
            <g class="topo-node" data-node="INFRA-03" transform="translate(390, 230)">
              <rect width="200" height="60" rx="8" class="node-box core-box" />
              <text x="100" y="25" text-anchor="middle" class="node-title">🔀 Core Switch / Router</text>
              <text x="100" y="44" text-anchor="middle" class="node-sub">802.1Q / DHCP Snoop / C-05</text>
            </g>

            <!-- 6. VLAN 10: Student VLAN -->
            <g class="topo-node" data-node="VLAN-10" transform="translate(50, 350)">
              <rect width="140" height="75" rx="8" class="node-box student-box" />
              <text x="70" y="24" text-anchor="middle" class="node-title">VLAN 10: Student</text>
              <text x="70" y="42" text-anchor="middle" class="node-sub">10.10.0.0/16 (BYOD)</text>
              <text x="70" y="60" text-anchor="middle" class="node-status badge-untrusted">Untrusted</text>
            </g>

            <!-- 7. VLAN 20: Faculty/Staff -->
            <g class="topo-node" data-node="VLAN-20" transform="translate(210, 350)">
              <rect width="140" height="75" rx="8" class="node-box faculty-box" />
              <text x="70" y="24" text-anchor="middle" class="node-title">VLAN 20: Faculty</text>
              <text x="70" y="42" text-anchor="middle" class="node-sub">10.20.0.0/24</text>
              <text x="70" y="60" text-anchor="middle" class="node-status badge-managed">EDR Fleet (C-09)</text>
            </g>

            <!-- 8. VLAN 30: Administrative -->
            <g class="topo-node" data-node="VLAN-30" transform="translate(370, 350)">
              <rect width="140" height="75" rx="8" class="node-box admin-box" />
              <text x="70" y="24" text-anchor="middle" class="node-title">VLAN 30: Admin</text>
              <text x="70" y="42" text-anchor="middle" class="node-sub">10.30.0.0/24</text>
              <text x="70" y="60" text-anchor="middle" class="node-status badge-rbac">RBAC / PIM (C-01)</text>
            </g>

            <!-- 9. VLAN 40: Server Tier (LMS/ERP) -->
            <g class="topo-node" data-node="VLAN-40" transform="translate(530, 350)">
              <rect width="140" height="75" rx="8" class="node-box server-box" />
              <text x="70" y="24" text-anchor="middle" class="node-title">VLAN 40: App Tier</text>
              <text x="70" y="42" text-anchor="middle" class="node-sub">Moodle LMS / 10.40.0.0</text>
              <text x="70" y="60" text-anchor="middle" class="node-status badge-tls">TLS 1.3 (C-06)</text>
            </g>

            <!-- 10. VLAN 60: Finance / Crown Jewel DB -->
            <g class="topo-node highlight-crown" data-node="VLAN-60" transform="translate(690, 350)">
              <rect width="140" height="75" rx="8" class="node-box finance-box" />
              <text x="70" y="24" text-anchor="middle" class="node-title">💎 VLAN 60: Finance</text>
              <text x="70" y="42" text-anchor="middle" class="node-sub">Student & Ledger DB</text>
              <text x="70" y="60" text-anchor="middle" class="node-status badge-crown">Crown Jewels</text>
            </g>

            <!-- 11. VLAN 70: Management (OOBM) -->
            <g class="topo-node" data-node="VLAN-70" transform="translate(840, 350)">
              <rect width="115" height="75" rx="8" class="node-box mgmt-box" />
              <text x="57" y="24" text-anchor="middle" class="node-title">VLAN 70: Mgmt</text>
              <text x="57" y="42" text-anchor="middle" class="node-sub">OOBM / Jumpbox</text>
              <text x="57" y="60" text-anchor="middle" class="node-status badge-isolated">Isolated</text>
            </g>

            <!-- Telemetry & Security Infrastructure Tier (Bottom Row) -->
            <!-- SIEM Hub -->
            <g class="topo-node" data-node="INFRA-04" transform="translate(90, 490)">
              <rect width="170" height="60" rx="8" class="node-box siem-box" />
              <text x="85" y="25" text-anchor="middle" class="node-title">📊 Central SIEM (C-08)</text>
              <text x="85" y="44" text-anchor="middle" class="node-sub">365-Day Log Ingestion</text>
            </g>

            <!-- Suricata IDS/IPS -->
            <g class="topo-node" data-node="INFRA-05" transform="translate(300, 490)">
              <rect width="180" height="60" rx="8" class="node-box ids-box" />
              <text x="90" y="25" text-anchor="middle" class="node-title">👁️ Suricata IDS/IPS (C-07)</text>
              <text x="90" y="44" text-anchor="middle" class="node-sub">Inline DPI / Threat Feeds</text>
            </g>

            <!-- EDR Fleet -->
            <g class="topo-node" data-node="INFRA-06" transform="translate(520, 490)">
              <rect width="170" height="60" rx="8" class="node-box edr-box" />
              <text x="85" y="25" text-anchor="middle" class="node-title">🛡️ EDR Agent Fleet (C-09)</text>
              <text x="85" y="44" text-anchor="middle" class="node-sub">≥98% Managed Coverage</text>
            </g>

            <!-- Immutable Backup Repository -->
            <g class="topo-node" data-node="INFRA-08" transform="translate(730, 490)">
              <rect width="180" height="60" rx="8" class="node-box backup-box" />
              <text x="90" y="25" text-anchor="middle" class="node-title">💾 Immutable WORM (C-11)</text>
              <text x="90" y="44" text-anchor="middle" class="node-sub">3-2-1 Air-Gapped Vault</text>
            </g>

            <!-- Flow indicators -->
            <circle cx="490" cy="85" r="4" class="anim-packet packet-inbound" />
            <circle cx="760" cy="335" r="4" class="anim-packet packet-blocked" />
          </svg>
        </div>

        <div id="node-inspector-drawer" class="node-inspector-drawer hidden">
          <div class="drawer-header">
            <div class="drawer-title-area">
              <span id="drawer-badge" class="badge">VLAN</span>
              <h3 id="drawer-title">Node Title</h3>
            </div>
            <button class="btn-close-drawer" id="btn-close-drawer">✕</button>
          </div>
          <div class="drawer-body" id="drawer-content">
            <!-- Dynamic Content Injected Here -->
          </div>
        </div>
      </div>
    `;

    // Attach click listeners to all nodes
    const nodes = container.querySelectorAll(".topo-node");
    nodes.forEach(node => {
      node.addEventListener("click", () => {
        const nodeId = node.getAttribute("data-node");
        this.inspectNode(nodeId, onSelectNode);
      });
    });

    const closeBtn = document.getElementById("btn-close-drawer");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        document.getElementById("node-inspector-drawer").classList.add("hidden");
      });
    }
  },

  inspectNode(nodeId, callback) {
    const drawer = document.getElementById("node-inspector-drawer");
    const drawerTitle = document.getElementById("drawer-title");
    const drawerBadge = document.getElementById("drawer-badge");
    const drawerContent = document.getElementById("drawer-content");
    if (!drawer) return;

    let item = window.SIM_ENVIRONMENT.networkSegments.find(s => s.id === nodeId);
    let isVlan = true;

    if (!item) {
      item = window.SIM_ENVIRONMENT.securityInfrastructure.find(i => i.id === nodeId);
      isVlan = false;
    }

    if (!item && nodeId === "WAN") {
      item = {
        name: "Untrusted Internet / WAN",
        purpose: "External internet access and untrusted adversary entry point.",
        securityFunction: "Screened at Perimeter NGFW with geo-filtering, intrusion prevention, and rate-limiting.",
        threatAddressed: "Botnets, external scanning, DDoS, weaponized exploit delivery.",
        relatedControls: ["C-04 Firewall / ACL", "C-06 Encryption / TLS"],
        relatedVulnerabilities: ["V-002 Weak Firewalls", "V-004 Outdated Server Software"],
        exampleVerification: "External port scan directed at perimeter IP.",
        expectedResult: "All ports DROP / SILENT except 443 (HTTPS) and 500/4500 (VPN)."
      };
    }

    if (!item) return;

    drawerBadge.textContent = isVlan ? (item.vlanId ? `VLAN ${item.vlanId}` : "DMZ") : "DEFENSIVE INFRA";
    drawerBadge.className = isVlan ? "badge badge-vlan" : "badge badge-infra";
    drawerTitle.textContent = item.name;

    drawerContent.innerHTML = `
      <div class="inspector-section">
        <label>Purpose</label>
        <p>${item.purpose || item.details}</p>
      </div>

      <div class="inspector-section">
        <label>Security Function</label>
        <p class="sec-func">${item.securityFunction || item.type}</p>
      </div>

      <div class="inspector-section">
        <label>Threat Addressed</label>
        <p class="threat-alert"><i class="icon-alert"></i> ${item.threatAddressed || "Lateral movement and unauthorized access."}</p>
      </div>

      <div class="inspector-grid-2">
        <div class="inspector-section">
          <label>Related Controls</label>
          <div class="tag-group">
            ${(item.relatedControls || ["C-04", "C-05"]).map(c => `<span class="tag-control">${c}</span>`).join(" ")}
          </div>
        </div>

        <div class="inspector-section">
          <label>Related Week 2 Findings</label>
          <div class="tag-group">
            ${(item.relatedVulnerabilities || ["V-001"]).map(v => `<span class="tag-vuln">${v}</span>`).join(" ")}
          </div>
        </div>
      </div>

      <div class="inspector-section highlight-box">
        <label>Example Verification Test</label>
        <div class="verif-detail">
          <strong>Test:</strong> ${item.exampleVerification || "Simulated Layer 3 reachability verification."}
        </div>
        <div class="verif-expected">
          <strong>Expected Result:</strong> <span class="badge-expected">${item.expectedResult || "BLOCKED / DENIED"}</span>
        </div>
      </div>

      <div class="inspector-actions">
        <button class="btn btn-sm btn-primary" id="btn-run-sample-test" data-test="${item.id || 'NET-01'}">
          <i class="icon-play"></i> Run Verification Test
        </button>
      </div>
    `;

    drawer.classList.remove("hidden");

    const runSampleBtn = document.getElementById("btn-run-sample-test");
    if (runSampleBtn && callback) {
      runSampleBtn.addEventListener("click", () => {
        if (nodeId === "VLAN-60") {
          callback("NET-01");
        } else if (nodeId === "VLAN-10") {
          callback("NET-01");
        } else if (nodeId === "INFRA-07") {
          callback("MFA-01");
        } else if (nodeId === "INFRA-05") {
          callback("IDS-01");
        } else if (nodeId === "INFRA-06") {
          callback("EDR-01");
        } else if (nodeId === "INFRA-08") {
          callback("BKUP-01");
        } else {
          callback("NET-01");
        }
      });
    }
  }
};