/* ========================================
   REST PORTFOLIO — MAIN SCRIPT
   Matrix rain + all interactivity
======================================== */

// ========================================
// TOAST NOTIFICATION SYSTEM
// ========================================
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
  },

  show(title, message, type = 'info', duration = 5000) {
    if (!this.container) this.init();
    const icons = { success: '✓', info: 'ℹ', warning: '⚠', error: '✕' };

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-msg"><strong>${title}</strong>${message}</div>
      <button class="toast-close" aria-label="Close">✕</button>
    `;

    el.querySelector('.toast-close').addEventListener('click', () => this.remove(el));
    this.container.appendChild(el);

    if (duration > 0) {
      setTimeout(() => this.remove(el), duration);
    }
  },

  remove(el) {
    el.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }
};

// ========================================
// MAIN INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  initMatrixBackground();
  initTypewriter();
  initNavigation();
  initMobileMenu();
  initMap();
  initContactForm();
  initVisitorInfo();
  initYear();
  showWelcome();
});

// ========================================
// MATRIX BACKGROUND
// ========================================
function initMatrixBackground() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();

  const chars = 'アイウエオカキクケコRESTトナニヌネノハヒフRESTムメモヤユヨラリルレロワヲRESTン0123456RESTCDEF<>REST}[]();:=REST&#@!';
  const charArray = chars.split('');
  const fontSize = 14;
  let columns, drops;

  function initDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
  }

  initDrops();

  window.addEventListener('resize', () => {
    resize();
    initDrops();
  });

  setInterval(() => {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = charArray[Math.floor(Math.random() * charArray.length)];
      const b = Math.random();

      if (b > 0.95) {
        ctx.fillStyle = '#ffffff';
      } else if (b > 0.8) {
        ctx.fillStyle = '#00ff88';
      } else {
        ctx.fillStyle = `rgba(0, 255, 136, ${0.12 + Math.random() * 0.3})`;
      }

      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }, 50);
}

// ========================================
// TYPEWRITER EFFECT
// ========================================
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = ['Rest', 'Hacker', 'Developer', 'Security'];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = words[wordIdx];

    if (deleting) {
      el.textContent = word.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = word.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = deleting ? 50 : 100;

    if (!deleting && charIdx === word.length) {
      speed = 2000;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 500;
    }

    setTimeout(tick, speed);
  }

  tick();
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
  const links = document.querySelectorAll('.nav-link, .mobile-nav-link');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const id = this.getAttribute('data-section');
      const section = document.getElementById(id);
      if (section) {
        window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
      }
      // Close mobile nav
      document.getElementById('mobile-nav')?.classList.remove('open');
    });
  });

  // Active link on scroll
  function onScroll() {
    const scrollY = window.scrollY + 200;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        const id = section.getAttribute('id');
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('data-section') === id);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll);
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ========================================
// MAP
// ========================================
function initMap() {
  const mapEl = document.getElementById('map');
  const L = window.L;
  if (!mapEl || !L) return;

  const coords = [40.4168, -3.7038];
  const map = L.map('map', {
    center: coords,
    zoom: 6,
    zoomControl: true,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    maxZoom: 19,
  }).addTo(map);

  const marker = L.marker(coords).addTo(map);
  marker.bindPopup('<b>Madrid, Spain</b><br>Estoy aqui!').openPopup();
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !subject || !message) {
      Toast.show('Error', 'Rellena todos los campos.', 'warning', 4000);
      return;
    }

    const btn = document.getElementById('submit-btn');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      Toast.show('✓ Enviado!', 'Gracias por tu mensaje. Te respondere pronto.', 'success', 5000);
      form.reset();
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Enviar Mensaje
      `;
      btn.disabled = false;
    }, 1500);
  });
}

// ========================================
// VISITOR INFO
// ========================================
function initVisitorInfo() {
  const statusEl = document.getElementById('conn-status');

  // Browser & OS detection
  const browser = detectBrowser();
  const os = detectOS();
  setText('visitor-browser', browser);
  setText('visitor-os', os);
  setText('visitor-tz', Intl.DateTimeFormat().resolvedOptions().timeZone || 'N/A');

  // Fetch IP info
  fetchIP(statusEl);
}

async function fetchIP(statusEl) {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();

    setText('visitor-ip', data.ip || 'N/A');
    setText('visitor-location', `${data.city || '?'}, ${data.country_name || '?'}`);
    setText('visitor-isp', data.org || 'N/A');

    if (statusEl) {
      statusEl.innerHTML = '<span class="live-dot"></span>Conectado';
    }
  } catch (err) {
    setText('visitor-ip', 'Error');
    setText('visitor-location', 'Error');
    setText('visitor-isp', 'Error');
    if (statusEl) {
      statusEl.innerHTML = '<span class="live-dot" style="background:var(--red)"></span>Error';
      statusEl.style.color = 'var(--red)';
    }
  }
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
}

function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) {
    if (ua.includes('Windows NT 10')) return 'Windows 10/11';
    return 'Windows';
  }
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('like Mac')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown';
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ========================================
// YEAR
// ========================================
function initYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ========================================
// WELCOME
// ========================================
function showWelcome() {
  setTimeout(() => {
    Toast.show('👋 Bienvenido!', 'Gracias por visitar mi portfolio.', 'info', 5000);
  }, 1500);
}
