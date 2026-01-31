/* ========================================
   Storage Keys & Config
======================================== */
const STORAGE_KEYS = {
  visitors: 'rest_visitors',
  messages: 'rest_messages',
  loginAttempts: 'rest_login_attempts',
  isLoggedIn: 'rest_logged_in'
};

const CONFIG = {
  username: 'rest',
  password: 'CyberRest2024!',
  maxLoginAttempts: 5,
  lockoutTime: 5 * 60 * 1000 // 5 minutes
};

/* ========================================
   Utility Functions
======================================== */
function getStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/* ========================================
   Matrix Background Effect
======================================== */
function initMatrixBackground() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
  const charArray = chars.split('');
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = [];

  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = charArray[Math.floor(Math.random() * charArray.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/* ========================================
   Typewriter Effect
======================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const words = ['Rest', 'Hacker', 'Developer', 'Security'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ========================================
   IP Tracker
======================================== */
async function trackVisitor() {
  const statusEl = document.getElementById('connection-status');
  
  try {
    // Get IP info from API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    // Get browser and OS info
    const ua = navigator.userAgent;
    const browser = getBrowser(ua);
    const os = getOS(ua);

    // Update UI
    updateElement('user-ip', data.ip || 'Desconocida');
    updateElement('user-location', `${data.city || 'N/A'}, ${data.country_name || 'N/A'}`);
    updateElement('user-browser', browser);
    updateElement('user-os', os);
    updateElement('user-isp', data.org || 'Desconocido');
    updateElement('user-timezone', data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (statusEl) {
      statusEl.innerHTML = '<span class="status-dot"></span>Conectado';
    }

    // Save visitor data
    const visitor = {
      id: generateId(),
      ip: data.ip,
      location: `${data.city || 'N/A'}, ${data.country_name || 'N/A'}`,
      browser,
      os,
      isp: data.org || 'Desconocido',
      timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    };

    const visitors = getStorage(STORAGE_KEYS.visitors) || [];
    
    // Check if this IP was already tracked today
    const today = new Date().toDateString();
    const alreadyTracked = visitors.some(v => 
      v.ip === visitor.ip && new Date(v.timestamp).toDateString() === today
    );

    if (!alreadyTracked) {
      visitors.unshift(visitor);
      setStorage(STORAGE_KEYS.visitors, visitors);
    }

  } catch (error) {
    console.error('Error tracking visitor:', error);
    
    updateElement('user-ip', 'Error');
    updateElement('user-location', 'Error');
    updateElement('user-browser', getBrowser(navigator.userAgent));
    updateElement('user-os', getOS(navigator.userAgent));
    updateElement('user-isp', 'Error');
    updateElement('user-timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (statusEl) {
      statusEl.innerHTML = '<span class="status-dot" style="background: var(--destructive);"></span>Error';
    }
  }
}

function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function getBrowser(ua) {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Desconocido';
}

function getOS(ua) {
  if (ua.includes('Windows NT 10')) return 'Windows 10/11';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Desconocido';
}

/* ========================================
   Contact Form
======================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('form-message');
    
    const formData = {
      id: generateId(),
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    // Validate
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showFormMessage(messageEl, 'Por favor, completa todos los campos.', 'error');
      return;
    }

    // Show loading
    btn.disabled = true;
    btn.innerHTML = '<svg class="icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Enviando...';

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save message
    const messages = getStorage(STORAGE_KEYS.messages) || [];
    messages.unshift(formData);
    setStorage(STORAGE_KEYS.messages, messages);

    // Show success
    showFormMessage(messageEl, 'Mensaje enviado correctamente. Te respondere pronto.', 'success');
    form.reset();

    // Reset button
    btn.disabled = false;
    btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Enviar Mensaje';
  });
}

function showFormMessage(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = `form-message ${type}`;
  
  setTimeout(() => {
    el.className = 'form-message';
  }, 5000);
}

/* ========================================
   Secret Logo Access
======================================== */
function initSecretLogo() {
  const logo = document.getElementById('secret-logo');
  if (!logo) return;

  let clickCount = 0;
  let clickTimer = null;

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    clickCount++;

    if (clickTimer) clearTimeout(clickTimer);

    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 2000);

    if (clickCount >= 5) {
      window.location.href = 'panel.html';
    }
  });
}

/* ========================================
   Login System
======================================== */
function initLogin() {
  const loginForm = document.getElementById('login-form');
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('login-pass');
  
  if (!loginForm) return;

  // Check if already logged in
  if (getStorage(STORAGE_KEYS.isLoggedIn)) {
    showDashboard();
    return;
  }

  // Toggle password visibility
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
    });
  }

  // Login form submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    // Check lockout
    const attempts = getStorage(STORAGE_KEYS.loginAttempts) || { count: 0, lastAttempt: 0 };
    const now = Date.now();

    if (attempts.count >= CONFIG.maxLoginAttempts) {
      const timeLeft = CONFIG.lockoutTime - (now - attempts.lastAttempt);
      if (timeLeft > 0) {
        const minutes = Math.ceil(timeLeft / 60000);
        showLoginError(errorEl, `Demasiados intentos. Espera ${minutes} minuto(s).`);
        return;
      } else {
        // Reset after lockout
        attempts.count = 0;
      }
    }

    // Validate credentials
    if (username === CONFIG.username && password === CONFIG.password) {
      // Reset attempts
      setStorage(STORAGE_KEYS.loginAttempts, { count: 0, lastAttempt: 0 });
      setStorage(STORAGE_KEYS.isLoggedIn, true);
      showDashboard();
    } else {
      // Increment attempts
      attempts.count++;
      attempts.lastAttempt = now;
      setStorage(STORAGE_KEYS.loginAttempts, attempts);

      const remaining = CONFIG.maxLoginAttempts - attempts.count;
      if (remaining > 0) {
        showLoginError(errorEl, `Credenciales incorrectas. ${remaining} intento(s) restante(s).`);
      } else {
        showLoginError(errorEl, 'Cuenta bloqueada por 5 minutos.');
      }
    }
  });
}

function showLoginError(el, message) {
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
}

function showDashboard() {
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');

  if (loginSection) loginSection.style.display = 'none';
  if (dashboardSection) dashboardSection.style.display = 'block';

  initDashboard();
}

/* ========================================
   Dashboard
======================================== */
function initDashboard() {
  updateStats();
  renderVisitors();
  renderMessages();
  initTabs();
  initSearch();
  initDashboardActions();
}

function updateStats() {
  const visitors = getStorage(STORAGE_KEYS.visitors) || [];
  const messages = getStorage(STORAGE_KEYS.messages) || [];
  const today = new Date().toDateString();

  const todayVisitors = visitors.filter(v => 
    new Date(v.timestamp).toDateString() === today
  ).length;

  const unreadMessages = messages.filter(m => !m.read).length;

  updateElement('total-visitors', visitors.length);
  updateElement('total-messages', messages.length);
  updateElement('today-visitors', todayVisitors);
  updateElement('unread-messages', unreadMessages);
}

function renderVisitors(filter = '') {
  const tbody = document.getElementById('visitors-table');
  if (!tbody) return;

  let visitors = getStorage(STORAGE_KEYS.visitors) || [];

  if (filter) {
    const lowerFilter = filter.toLowerCase();
    visitors = visitors.filter(v =>
      v.ip.toLowerCase().includes(lowerFilter) ||
      v.location.toLowerCase().includes(lowerFilter) ||
      v.browser.toLowerCase().includes(lowerFilter) ||
      v.os.toLowerCase().includes(lowerFilter)
    );
  }

  if (visitors.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No hay visitantes registrados</td></tr>';
    return;
  }

  tbody.innerHTML = visitors.map(v => `
    <tr>
      <td>${escapeHtml(v.ip)}</td>
      <td>${escapeHtml(v.location)}</td>
      <td>${escapeHtml(v.browser)}</td>
      <td>${escapeHtml(v.os)}</td>
      <td>${escapeHtml(v.isp)}</td>
      <td>${formatDate(v.timestamp)}</td>
    </tr>
  `).join('');
}

function renderMessages(filter = '') {
  const container = document.getElementById('messages-list');
  if (!container) return;

  let messages = getStorage(STORAGE_KEYS.messages) || [];

  if (filter) {
    const lowerFilter = filter.toLowerCase();
    messages = messages.filter(m =>
      m.name.toLowerCase().includes(lowerFilter) ||
      m.email.toLowerCase().includes(lowerFilter) ||
      m.subject.toLowerCase().includes(lowerFilter) ||
      m.message.toLowerCase().includes(lowerFilter)
    );
  }

  if (messages.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <p>No hay mensajes</p>
      </div>
    `;
    return;
  }

  container.innerHTML = messages.map(m => `
    <div class="message-card ${m.read ? '' : 'unread'}" data-id="${m.id}">
      <div class="message-header">
        <span class="message-from">${escapeHtml(m.name)}</span>
        <span class="message-date">${formatDate(m.timestamp)}</span>
      </div>
      <div class="message-subject">${escapeHtml(m.subject)}</div>
      <div class="message-preview">${escapeHtml(m.message)}</div>
    </div>
  `).join('');

  // Add click handlers
  container.querySelectorAll('.message-card').forEach(card => {
    card.addEventListener('click', () => openMessage(card.dataset.id));
  });
}

function openMessage(id) {
  const messages = getStorage(STORAGE_KEYS.messages) || [];
  const message = messages.find(m => m.id === id);
  if (!message) return;

  // Mark as read
  message.read = true;
  setStorage(STORAGE_KEYS.messages, messages);
  updateStats();
  renderMessages();

  // Show modal
  const modal = document.getElementById('message-modal');
  document.getElementById('modal-subject').textContent = message.subject;
  document.getElementById('modal-from').textContent = `De: ${message.name} (${message.email})`;
  document.getElementById('modal-date').textContent = formatDate(message.timestamp);
  document.getElementById('modal-message').textContent = message.message;

  modal.classList.add('show');
  modal.dataset.messageId = id;
}

function closeModal() {
  const modal = document.getElementById('message-modal');
  if (modal) modal.classList.remove('show');
}

function deleteMessage(id) {
  let messages = getStorage(STORAGE_KEYS.messages) || [];
  messages = messages.filter(m => m.id !== id);
  setStorage(STORAGE_KEYS.messages, messages);
  updateStats();
  renderMessages();
  closeModal();
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`${tab}-tab`).classList.add('active');
    });
  });
}

function initSearch() {
  const visitorsSearch = document.getElementById('visitors-search');
  const messagesSearch = document.getElementById('messages-search');

  if (visitorsSearch) {
    visitorsSearch.addEventListener('input', (e) => renderVisitors(e.target.value));
  }

  if (messagesSearch) {
    messagesSearch.addEventListener('input', (e) => renderMessages(e.target.value));
  }
}

function initDashboardActions() {
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setStorage(STORAGE_KEYS.isLoggedIn, false);
      window.location.reload();
    });
  }

  // Export visitors
  const exportVisitors = document.getElementById('export-visitors');
  if (exportVisitors) {
    exportVisitors.addEventListener('click', () => {
      const visitors = getStorage(STORAGE_KEYS.visitors) || [];
      downloadJSON(visitors, 'visitors.json');
    });
  }

  // Export messages
  const exportMessages = document.getElementById('export-messages');
  if (exportMessages) {
    exportMessages.addEventListener('click', () => {
      const messages = getStorage(STORAGE_KEYS.messages) || [];
      downloadJSON(messages, 'messages.json');
    });
  }

  // Clear visitors
  const clearVisitors = document.getElementById('clear-visitors');
  if (clearVisitors) {
    clearVisitors.addEventListener('click', () => {
      if (confirm('¿Estas seguro de eliminar todos los visitantes?')) {
        setStorage(STORAGE_KEYS.visitors, []);
        updateStats();
        renderVisitors();
      }
    });
  }

  // Clear messages
  const clearMessages = document.getElementById('clear-messages');
  if (clearMessages) {
    clearMessages.addEventListener('click', () => {
      if (confirm('¿Estas seguro de eliminar todos los mensajes?')) {
        setStorage(STORAGE_KEYS.messages, []);
        updateStats();
        renderMessages();
      }
    });
  }

  // Modal actions
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalDelete = document.getElementById('modal-delete');
  const modalReply = document.getElementById('modal-reply');

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  if (modalDelete) {
    modalDelete.addEventListener('click', () => {
      const modal = document.getElementById('message-modal');
      const id = modal.dataset.messageId;
      if (confirm('¿Eliminar este mensaje?')) {
        deleteMessage(id);
      }
    });
  }

  if (modalReply) {
    modalReply.addEventListener('click', () => {
      const modal = document.getElementById('message-modal');
      const messages = getStorage(STORAGE_KEYS.messages) || [];
      const message = messages.find(m => m.id === modal.dataset.messageId);
      if (message) {
        window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
      }
    });
  }
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ========================================
   Initialize
======================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Common init
  initMatrixBackground();

  // Page specific init
  if (document.getElementById('typewriter')) {
    initTypewriter();
    trackVisitor();
    initContactForm();
    initSecretLogo();
  }

  if (document.getElementById('login-form')) {
    initLogin();
  }
});
