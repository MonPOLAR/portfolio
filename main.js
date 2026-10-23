/** Terminal loader animation **/

function initTerminalLoader() {
  const loader = document.getElementById('loading-text');
  const content = document.getElementById('content');
  if (!loader || !content) return;
  // Projects page uses its own loader
  if (loader._projectsLoaderActive) return;

  const lines = [
    '> Initializing connection...',
    '> Decrypting secure layers...',
    '> Access granted to user : user_b',
    '> Loading profile data...',
    '> Try with password : bravo...'
  ];

  let lineIdx = 0;

  function typeLog() {
    if (lineIdx < lines.length) {
      const p = document.createElement('div');
      p.innerHTML = lines[lineIdx];
      loader.appendChild(p);
      lineIdx++;
      setTimeout(typeLog, 400);
    } else {
      setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';
      }, 300);
    }
  }

  typeLog();
}

/** Language toggle (EN / FR) **/

function initLangSwitch() {
  const langBtn = document.getElementById('lang-switch');
  if (!langBtn) return;

  langBtn.addEventListener('click', () => {
    document.body.classList.toggle('fr-mode');
    const isFR = document.body.classList.contains('fr-mode');
    langBtn.innerText = isFR ? '[ EN ]' : '[ FR ]';

    // About page: swap CV link href depending on language
    const cvLink = document.getElementById('cv-link');
    if (cvLink) {
      cvLink.href = isFR
        ? '../storage/CV - 2026.pdf'
        : '../storage/CV - 2026 - EN.pdf';
    }
  });
}

/** Passion tags — click to reveal description **/

function initPassionTags() {
  const tags = document.querySelectorAll('.passion-tag');
  const descriptionBox = document.getElementById('passion-description');
  if (!tags.length || !descriptionBox) return;

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      descriptionBox.style.display = 'block';
      descriptionBox.innerHTML = tag.getAttribute('data-info');
    });
  });
}

/** Index page — countdown timer **/

function initTimer() {
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;

  const startTime = Date.now();
  const duration = 12 * 60 * 1000;

  function updateTimer() {
    const diff = duration - (Date.now() - startTime);
    const isNegative = diff < 0;
    const abs = Math.abs(diff);
    const h  = Math.floor(abs / 3_600_000);
    const m  = Math.floor((abs % 3_600_000) / 60_000);
    const s  = Math.floor((abs % 60_000) / 1_000);
    const ms = Math.floor((abs % 1_000) / 10);

    timerEl.innerText =
      (isNegative ? '-' : '') +
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0') + ':' +
      String(ms).padStart(2, '0');
  }

  setInterval(updateTimer, 10);
}

/** Index page — bottom-right date + ISP/city via ipapi **/

function initDateDisplay() {
  const dateEl = document.getElementById('date');
  if (!dateEl) return;

  const today = new Date().toLocaleDateString('fr-FR');

  fetch('https://ipapi.co/json/')
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      if (data.network && data.city) {
        dateEl.innerText = `${today} | ${data.network.toUpperCase()} - ${data.city.toUpperCase()}`;
      } else {
        dateEl.innerText = `${today} | ERROR`;
      }
    })
    .catch(() => {
      dateEl.innerText = `${today} | ERROR`;
    });
}

/** Projects page — custom terminal loader with project-specific lines **/

function initProjectsLoader() {
  const loader = document.getElementById('loading-text');
  const content = document.getElementById('content');
  if (!loader || !content) return;
  // Run on projects page — detect solar-canvas
  if (!document.getElementById('solar-canvas')) return;

  // Override the generic lines with project-specific ones
  loader.innerHTML = '';

  const lines = [
    '> Accessing secure repository...',
    '> Fetching project_manifest.json...',
    '> Verifying checksums...',
    '> Projects found. Rendering...'
  ];

  let lineIdx = 0;

  function typeLog() {
    if (lineIdx < lines.length) {
      const p = document.createElement('div');
      p.innerHTML = lines[lineIdx];
      loader.appendChild(p);
      lineIdx++;
      setTimeout(typeLog, 400);
    } else {
      setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';

        window.dispatchEvent(new Event('resize'));
        
      }, 300);
    }
  }

  // Prevent the generic loader from also running on this page
  loader._projectsLoaderActive = true;
  typeLog();
}

/** Projects page — "Capture Me" CTF button **/

function initCtfButton() {
  const btn = document.getElementById('ctf-button');
  const flagDisplay = document.getElementById('flag-display');
  if (!btn || !flagDisplay) return;

  let clicksNeeded = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
  let currentClicks = 0;

  btn.addEventListener('click', () => {
    currentClicks++;

    if (currentClicks < clicksNeeded) {
      const x = Math.random() * (window.innerWidth  - btn.offsetWidth  - 100);
      const y = Math.random() * (window.innerHeight - btn.offsetHeight - 100);
      btn.style.position = 'fixed';
      btn.style.left = x + 'px';
      btn.style.top  = y + 'px';
      btn.innerText = 'ACCESS_DENIED';
      setTimeout(() => { btn.innerText = 'Try Again'; }, 500);
    } else {
      btn.style.display = 'none';
      flagDisplay.style.display = 'block';
      console.log('Well played, hacker!');
    }
  });
}

/** Bethesavior page - Credential **/

function initLoginPage() {
  const loginBtn = document.querySelector('.login-btn');

  if (!loginBtn) return;

  function checkLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const err = document.getElementById('error-msg');

    const hashU = CryptoJS.SHA256(u).toString();
    const hashP = CryptoJS.SHA256(p).toString();

    console.log(hashU);
    console.log(hashP);

    if (
      hashU === '449d911a5a57c56b9eb31294052d9d85385f033902f80f3b1d2156153445fdad' &&
      hashP === 'f144a6907dc4284d1f9fe6a7d9b9ff53c02c1d07ba68f24d413d7ff7f757a782'
    ) {
      alert('ACCESS GRANTED.');
      window.location.href = '/404/systemsaved.html';
    } else {
      err.style.display = 'block';

      setTimeout(() => {
        err.style.display = 'none';
      }, 2000);
    }
  }

  loginBtn.addEventListener('click', checkLogin);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkLogin();
    }
  });
}

/** Index page — hint button **/

function initHintButton() {
  const btn   = document.getElementById('hint-btn');
  const popup = document.getElementById('hint-popup');
  const close = document.getElementById('hint-close');
  if (!btn || !popup || !close) return;

  const isMulti = popup.getAttribute('data-multi') === 'true';

  if (isMulti) {
    const next    = document.getElementById('hint-next');
    const textEl  = document.getElementById('hint-text');
    const counter = document.getElementById('hint-counter');

    const hints = [
      "When you are tired, you want to go... home?",
      "The flag is hidden in plain sight... Have you tried reading what's the eyes cannot see at the first time?",
      "Sometimes, flags are in pages we don't suspect... did you try some different pages that don't exist?"
    ];

    let current = 0;

    function showHint(idx) {
      textEl.innerText  = hints[idx];
      counter.innerText = `${idx + 1} / ${hints.length}`;
      next.style.opacity      = idx === hints.length - 1 ? '0.2' : '1';
      next.style.pointerEvents = idx === hints.length - 1 ? 'none' : 'auto';
    }

    btn.addEventListener('click', () => {
      popup.classList.toggle('visible');
      if (popup.classList.contains('visible')) {
        current = 0;
        showHint(current);
      }
    });

    next.addEventListener('click', (e) => {
      e.stopPropagation();
      if (current < hints.length - 1) {
        current++;
        showHint(current);
      }
    });

  } else {
    btn.addEventListener('click', () => {
      popup.classList.toggle('visible');
    });
  }

  close.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.remove('visible');
  });

  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== btn) {
      popup.classList.remove('visible');
    }
  });
}

/** Projects page — animated solar system **/

function initSolarSystem() {
  const canvas = document.getElementById('solar-canvas');
  const panel  = document.getElementById('project-panel');
  if (!canvas || !panel) return;

  const ctx = canvas.getContext('2d');
  let lang  = document.body.classList.contains('fr-mode') ? 'fr' : 'en';
  let activePlanet = null;

  /* ── CATEGORY COLOURS — pure RGB, no pale ── */
  const CAT_COLORS = {
    redteam:  '#ff2222',
    sysadmin: '#2288ff',
    code:     '#00ff88',
    ctf:      '#ffcc00',
  };

  /* ── PROJECTS DATA ── */
  const PROJECTS = [
    {
      id: 0, cat: 'redteam',
      name: { en: 'Vuln Exploit', fr: 'Exploitation' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Vulnerability Exploitation', fr: 'Exploitation de Vulnérabilités' },
      desc:   { en: 'Intrusion simulations with Metasploit, Nmap & Pivoting techniques.', fr: 'Simulations d\'intrusions via Metasploit, Nmap et Pivotement.' },
      tags:   ['Metasploit', 'Pentest', 'Nmap'],
      link:   { label: '> EXPLOIT_LOGS', href: '../storage/metasploit.pdf', blank: true },
    },
    {
      id: 1, cat: 'redteam',
      name: { en: 'Linux Intrusion', fr: 'Intrusion Linux' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Linux Intrusion Test', fr: 'Test d\'intrusion Linux' },
      desc:   { en: 'Boot-to-Root: research & exploitation of a vulnerable machine.', fr: 'Boot-to-Root : exploitation d\'une machine vulnérable.' },
      tags:   ['Intrusion', 'Boot-to-Root', 'Linux'],
      link:   { label: '> VIEW_REPORT', href: '../storage/intrusion.pdf', blank: true },
    },
    {
      id: 7, cat: 'redteam',
      name: { en: 'Web Pentest', fr: 'Pentest Web' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Web Application Penetration Testing', fr: 'Test d\'Intrusion Application Web' },
      desc:   { en: 'Infrastructure mapping with Nmap, directory fuzzing via Gobuster, PHP injections, and exploitation of web vulnerabilities.', fr: 'Cartographie de l\'infrastructure avec Nmap, énumération de répertoires via Gobuster, injections PHP  et exploitation de vulnérabilités web.' },
      tags:   ['GoBuster', 'PHP Injection', 'Web Security'],
      link:   { label: '> AUDIT_REPORT', href: '../storage/web_pentest.pdf', blank: true },
    },
    {
      id: 2, cat: 'sysadmin',
      name: { en: 'Active Directory', fr: 'Active Directory' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Active Directory — ValorElec', fr: 'Active Directory — ValorElec' },
      desc:   { en: 'Windows Server infra, PowerShell automation, restrictive GPOs.', fr: 'Infra Windows Server, automatisation PowerShell, GPO restrictives.' },
      tags:   ['Active Directory', 'PowerShell', 'GPO'],
      link:   { label: '> CASE_FILE', href: '../storage/ValorElec.pdf', blank: true },
    },
    {
      id: 3, cat: 'sysadmin',
      name: { en: 'Linux Hardening', fr: 'Hardening Linux' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Linux Hardening', fr: 'Hardening Linux' },
      desc:   { en: 'SSH keys only, IPTables/UFW firewall, CIS Benchmark compliance.', fr: 'SSH clés uniquement, pare-feu UFW, CIS Benchmark.' },
      tags:   ['Linux', 'Hardening', 'SSH Security'],
      link:   { label: '> SECURITY_POLICIES', href: '../storage/hardening.pdf', blank: true },
    },
    {
      id: 9, cat: 'sysadmin',
      name: { en: 'Hybrid Cloud Migration', fr: 'Migration Cloud Hybride' },
      status: { en: 'COMPLETED', fr: 'TERMINÉ' },
      title:  { en: 'Secure Hybrid Infrastructure', fr: 'Infrastructure Hybride Sécurisée' },
      desc:   { en: 'Proxmox VE + Microsoft 365 migration, VLAN segmentation, Fortinet, Zabbix/Grafana monitoring, Splunk SIEM.',fr: 'Migration Proxmox VE + Microsoft 365, segmentation VLAN, Fortinet, supervision Zabbix/Grafana, SIEM Splunk.' },
      tags:   ['Proxmox', 'Microsoft 365', 'Zabbix', 'Fortinet', 'SIEM'],
      link:   { label: '> TECHNICAL_DOSSIER', href: '../storage/projetb3.pdf', blank: true },
    },
    {
      id: 4, cat: 'code',
      name: { en: 'ACB Website', fr: 'Site ACB' },
      status: { en: 'LIVE', fr: 'EN COURS' },
      title:  { en: 'Client Website — ACB', fr: 'Site Web Client — ACB' },
      desc:   { en: 'Full front-end website for a client, hosted on GitHub Pages.', fr: 'Site front-end complet pour un client, hébergé sur GitHub Pages.' },
      tags:   ['HTML', 'CSS', 'JavaScript', 'GitHub'],
      link:   { label: '> VIEW_LIVE_SITE', href: 'https://monpolar.github.io/acb/', blank: true },
    },
    {
      id: 5, cat: 'code',
      name: { en: 'Portfolio', fr: 'Portfolio' },
      status: { en: 'LIVE', fr: 'EN COURS' },
      title:  { en: 'Portfolio — B_SYSTEM', fr: 'Portfolio — B_SYSTEM' },
      desc:   { en: 'This very portfolio, built from scratch with HTML, CSS & JS. Terminal aesthetic, CTF easter eggs included.', fr: 'Ce portfolio, construit from scratch en HTML, CSS & JS. Esthétique terminal, easter eggs CTF inclus.' },
      tags:   ['HTML', 'CSS', 'JavaScript', 'GitHub'],
      link:   { label: '> VIEW_SOURCE', href: 'https://github.com/MonPOLAR/portfolio', blank: true },
    },
    {
      id: 6, cat: 'ctf',
      name: { en: 'TryHackMe', fr: 'TryHackMe' },
      status: { en: 'LIVE', fr: 'EN COURS' },
      title:  { en: 'CTF Training', fr: 'Entraînement CTF' },
      desc:   { en: 'TryHackMe. Focus on Web exploitation and Privilege Escalation.', fr: 'TryHackMe. Focus : Web & Escalade de Privilèges.' },
      tags:   ['CTF', 'PrivEsc', 'Cyber-Training'],
      link:   { label: '> VIEW_BADGES', href: 'https://tryhackme.com/p/.exe.polar', blank: false },
    },
    {
      id: 8, cat: 'ctf',
      name: { en: 'HTB', fr: 'HTB' },
      status: { en: 'LIVE', fr: 'EN COURS' },
      title:  { en: 'Cyber Training', fr: 'Entraînement Cyber' },
      desc:   { en: 'Hack The Box, Recon, Exploit, PrivEsc.', fr: 'Hack The Box, Recon, Exploit, PrivEsc.' },
      tags:   ['CTF', 'Hack The Box', 'Full Pentest'],
      link:   { label: '> VIEW_BADGES', href: 'https://profile.hackthebox.com/profile/019e72df-3619-7029-8d9c-d4d4b00289cb', blank: false },
    },
  ];

  const ORBIT_DEFS = [
    { cat: 'redteam',  radiusFactor: 0.18, speed: 0.00025, color: CAT_COLORS.redteam  },
    { cat: 'sysadmin', radiusFactor: 0.28, speed: 0.00016, color: CAT_COLORS.sysadmin },
    { cat: 'code',     radiusFactor: 0.38, speed: 0.00010, color: CAT_COLORS.code     },
    { cat: 'ctf',      radiusFactor: 0.46, speed: 0.00007, color: CAT_COLORS.ctf      },
  ];

  ORBIT_DEFS.forEach(od => {
    const planets = PROJECTS.filter(p => p.cat === od.cat);
    const step = (2 * Math.PI) / planets.length;
    planets.forEach((p, i) => { p._angleOffset = step * i; });
  });

  /* ── RESIZE ── */
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  function CX() { return canvas.width  * 0.5; }
  function CY() { return canvas.height * 0.5; }

  /* ── DRAW ── */
  let lastTime = 0;
  const elapsedAngle = {};
  ORBIT_DEFS.forEach(od => { elapsedAngle[od.cat] = 0; });

  function draw(ts) {
    const dt = Math.min(ts - lastTime, 50); // cap dt to avoid jump on tab switch
    lastTime = ts;

    const W = canvas.width, H = canvas.height;
    const cx = CX(), cy = CY();
    const minDim = Math.min(W, H);

    ctx.clearRect(0, 0, W, H);

    /* Black background — no stars */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    /* Sun */
    const sunR = minDim * 0.052;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 2);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(207,122,255,0.8)');
    grad.addColorStop(1,   'rgba(207,122,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, sunR * 2, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#CF7AFF';
    ctx.shadowBlur  = 35;
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Orbits + planets */
    ORBIT_DEFS.forEach(od => {
      elapsedAngle[od.cat] += od.speed * dt;
      const R = minDim * od.radiusFactor;

      /* Orbit ring — more visible */
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = od.color + '55';
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      /* Planets */
      const planets = PROJECTS.filter(p => p.cat === od.cat);
      planets.forEach(p => {
        const angle = elapsedAngle[od.cat] + p._angleOffset;
        const px = cx + R * Math.cos(angle);
        const py = cy + R * Math.sin(angle);
        p._px = px; p._py = py;

        const pR       = minDim * 0.024;
        const isActive = activePlanet && activePlanet.id === p.id;

        /* Glow */
        if (isActive) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, pR * 2.5);
          glow.addColorStop(0, od.color + '99');
          glow.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(px, py, pR * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        /* Planet body */
        ctx.beginPath();
        ctx.arc(px, py, pR, 0, Math.PI * 2);
        ctx.fillStyle   = od.color;
        ctx.shadowColor = od.color;
        ctx.shadowBlur  = isActive ? 22 : 10;
        ctx.fill();
        ctx.shadowBlur  = 0;

        /* Label — smaller font, no overlap */
        const fontSize = Math.max(8, minDim * 0.016);
        ctx.font      = `bold ${fontSize}px 'Courier New', monospace`;
        ctx.fillStyle = isActive ? '#ffffff' : od.color;
        ctx.textAlign = 'center';
        ctx.fillText(p.name[lang], px, py - pR - 5);
      });
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  /* ── HIT DETECTION ── */
  canvas.addEventListener('click', e => {
    const rect   = canvas.getBoundingClientRect();
    const mx     = e.clientX - rect.left;
    const my     = e.clientY - rect.top;
    const hitR   = Math.min(canvas.width, canvas.height) * 0.024 + 8;

    let hit = null;
    PROJECTS.forEach(p => {
      if (p._px === undefined) return;
      const dx = mx - p._px, dy = my - p._py;
      if (Math.sqrt(dx * dx + dy * dy) <= hitR) hit = p;
    });

    if (!hit) {
      activePlanet = null;
      panel.classList.remove('visible');
      return;
    }

    if (activePlanet && activePlanet.id === hit.id) {
      activePlanet = null;
      panel.classList.remove('visible');
    } else {
      activePlanet = hit;
      renderPanel(hit, lang);
      panel.classList.add('visible');
    }
  });

  canvas.addEventListener('mousemove', e => {
    const rect  = canvas.getBoundingClientRect();
    const mx    = e.clientX - rect.left;
    const my    = e.clientY - rect.top;
    const hitR  = Math.min(canvas.width, canvas.height) * 0.024 + 8;
    let over = false;
    PROJECTS.forEach(p => {
      if (p._px === undefined) return;
      const dx = mx - p._px, dy = my - p._py;
      if (Math.sqrt(dx * dx + dy * dy) <= hitR) over = true;
    });
    canvas.style.cursor = over ? 'pointer' : 'default';
  });

  /* ── PANEL ── */
  function renderPanel(proj, l) {
    const color = CAT_COLORS[proj.cat];
    const tags  = proj.tags.map(t =>
      `<span class="tech-tag">${t}</span>`
    ).join('');
    const blank = proj.link.blank ? 'target="_blank"' : '';
    panel.innerHTML = `
      <div class="project-card" style="border-color:${color}22;">
        <span class="project-status" style="color:${color}">[ ${proj.status[l]} ]</span>
        <div class="project-title">${proj.title[l]}</div>
        <p class="project-desc">${proj.desc[l]}</p>
        <div class="tech-tags">${tags}</div>
        <a href="${proj.link.href}" ${blank} class="project-link">&gt; ${proj.link.label.replace('> ', '')}</a>
      </div>
    `;
  }

  /* ── LANGUAGE SWITCH ── */
  const langBtn = document.getElementById('lang-switch');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      lang = document.body.classList.contains('fr-mode') ? 'fr' : 'en';
      if (activePlanet) renderPanel(activePlanet, lang);
    });
  }
}

/** INIT **/

document.addEventListener('DOMContentLoaded', () => {
  initLangSwitch();
  initProjectsLoader();
  initTerminalLoader();
  initPassionTags();
  initTimer();
  initDateDisplay();
  initCtfButton();
  initLoginPage();
  initHintButton();
  initSolarSystem();
});
