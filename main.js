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
    '> Try with passcode : bravo...',
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
  // Only run if we're on the projects page (check for projects-grid)
  if (!document.querySelector('.projects-grid')) return;

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

/** Bethesavior page — credential check with SHA-256 **/

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
      window.location.href = 'secret_archive.html';
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

/** INIT — runs on every page, each function guards itself with element existence checks **/

document.addEventListener('DOMContentLoaded', () => {
  initLangSwitch();
  initProjectsLoader();
  initTerminalLoader();
  initPassionTags();
  initTimer();
  initDateDisplay();
  initCtfButton();
  initLoginPage();
});
