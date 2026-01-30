/**
 * ========================================
 * REST PORTFOLIO - MAIN SCRIPT
 * ========================================
 * Tracking de visitantes, animaciones, formulario
 */

// ========================================
// UTILIDADES DE SEGURIDAD
// ========================================
const Security = {
  // Escapar HTML para prevenir XSS
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  // Sanitizar input
  sanitize(input) {
    if (!input) return '';
    return String(input).trim().slice(0, 1000);
  }
};

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================
const Toast = {
  container: null,
  
  init() {
    this.container = document.getElementById('toast-container');
  },
  
  show(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${Security.escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Cerrar">×</button>
    `;
    
    toast.querySelector('.toast-close').onclick = () => this.remove(toast);
    this.container.appendChild(toast);
    
    setTimeout(() => this.remove(toast), duration);
  },
  
  remove(toast) {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }
};

// ========================================
// TRACKING DE VISITANTES (Mejorado)
// ========================================
const Tracker = {
  data: null,
  storageKey: 'rest_visitors',
  
  // APIs de respaldo para IP
  apis: [
    'https://api.ipify.org?format=json',
    'https://ipapi.co/json/',
    'https://ip-api.com/json/?fields=66846719'
  ],
  
  async init() {
    try {
      await this.fetchVisitorData();
      this.updateUI();
      this.saveVisitor();
    } catch (error) {
      console.error('Error en tracking:', error);
      this.showFallback();
    }
  },
  
  async fetchVisitorData() {
    // Intentar obtener IP con múltiples APIs
    let ipData = null;
    
    for (const api of this.apis) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(api, { 
          signal: controller.signal,
          mode: 'cors'
        });
        clearTimeout(timeout);
        
        if (response.ok) {
          ipData = await response.json();
          break;
        }
      } catch (e) {
        console.log(`API ${api} falló, intentando siguiente...`);
      }
    }
    
    // Parsear datos según la API que respondió
    this.data = {
      ip: ipData?.ip || ipData?.query || 'No disponible',
      city: ipData?.city || 'Desconocido',
      region: ipData?.region || ipData?.regionName || '',
      country: ipData?.country_name || ipData?.country || 'Desconocido',
      countryCode: ipData?.country_code || ipData?.countryCode || '',
      isp: ipData?.org || ipData?.isp || 'Desconocido',
      timezone: ipData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      lat: ipData?.latitude || ipData?.lat,
      lon: ipData?.longitude || ipData?.lon,
      browser: this.getBrowser(),
      os: this.getOS(),
      device: this.getDevice(),
      screen: `${screen.width}x${screen.height}`,
      language: navigator.language,
      referrer: document.referrer || 'Directo',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
  },
  
  getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('SamsungBrowser')) return 'Samsung';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Otro';
  },
  
  getOS() {
    const ua = navigator.userAgent;
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    return 'Otro';
  },
  
  getDevice() {
    const ua = navigator.userAgent;
    if (/iPad|Tablet/i.test(ua)) return 'Tablet';
    if (/Mobile|Android|iPhone/i.test(ua)) return 'Móvil';
    return 'Escritorio';
  },
  
  updateUI() {
    const d = this.data;
    if (!d) return;
    
    const elements = {
      'v-ip': d.ip,
      'v-location': `${d.city}, ${d.country}`,
      'v-browser': d.browser,
      'v-os': d.os,
      'v-isp': d.isp,
      'v-timezone': d.timezone
    };
    
    Object.entries(elements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = Security.escapeHtml(value);
        el.classList.add('loaded');
      }
    });
  },
  
  showFallback() {
    // Mostrar datos del navegador aunque falle la IP
    const elements = {
      'v-ip': 'No disponible',
      'v-location': 'No disponible',
      'v-browser': this.getBrowser(),
      'v-os': this.getOS(),
      'v-isp': 'No disponible',
      'v-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    Object.entries(elements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  },
  
  saveVisitor() {
    if (!this.data) return;
    
    try {
      const visitors = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      visitors.unshift(this.data);
      
      // Máximo 500 visitantes
      if (visitors.length > 500) visitors.length = 500;
      
      localStorage.setItem(this.storageKey, JSON.stringify(visitors));
    } catch (e) {
      console.error('Error guardando visitante:', e);
    }
  },
  
  static getVisitors() {
    try {
      return JSON.parse(localStorage.getItem('rest_visitors') || '[]');
    } catch {
      return [];
    }
  }
};

// ========================================
// ACCESO SECRETO AL PANEL
// ========================================
const SecretAccess = {
  clicks: 0,
  timeout: null,
  required: 5,
  
  init() {
    const logo = document.getElementById('logo');
    if (!logo) return;
    
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      this.clicks++;
      
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.clicks = 0, 2000);
      
      if (this.clicks >= this.required) {
        this.clicks = 0;
        window.location.href = 'panel.html';
      } else if (this.clicks >= 3) {
        Toast.show(`${this.required - this.clicks} clicks más...`, 'info', 1500);
      }
    });
  }
};

// ========================================
// EFECTO MATRIX
// ========================================
const Matrix = {
  canvas: null,
  ctx: null,
  columns: [],
  fontSize: 14,
  chars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  
  init() {
    this.canvas = document.getElementById('matrix-bg');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  },
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    const cols = Math.floor(this.canvas.width / this.fontSize);
    this.columns = Array(cols).fill(1);
  },
  
  animate() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    
    this.ctx.fillStyle = isDark ? 'rgba(10, 10, 15, 0.05)' : 'rgba(248, 250, 252, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = isDark ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 102, 255, 0.08)';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    for (let i = 0; i < this.columns.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;
      
      this.ctx.fillText(char, x, y);
      
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    }
    
    requestAnimationFrame(() => this.animate());
  }
};

// ========================================
// EFECTO TYPEWRITER
// ========================================
const Typewriter = {
  element: null,
  texts: [
    'Estudiante de Ciberseguridad',
    'Desarrollador Python',
    'Pentester en formación',
    'Apasionado por la seguridad'
  ],
  textIndex: 0,
  charIndex: 0,
  isDeleting: false,
  
  init() {
    this.element = document.getElementById('typewriter');
    if (!this.element) return;
    this.type();
  },
  
  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }
    
    this.element.textContent = currentText.substring(0, this.charIndex);
    
    let delay = this.isDeleting ? 50 : 100;
    
    if (!this.isDeleting && this.charIndex === currentText.length) {
      delay = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      delay = 500;
    }
    
    setTimeout(() => this.type(), delay);
  }
};

// ========================================
// TEMA
// ========================================
const Theme = {
  init() {
    const toggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem('theme');
    
    // Aplicar tema guardado o preferencia del sistema
    if (saved === 'dark' || (!saved && prefersDark.matches)) {
      document.documentElement.classList.add('dark-theme');
    }
    
    toggle?.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-theme');
      const isDark = document.documentElement.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
};

// ========================================
// NAVEGACIÓN
// ========================================
const Navigation = {
  init() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Smooth scroll
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    
    // Active state on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.3 });
    
    sections.forEach(section => observer.observe(section));
  }
};

// ========================================
// ANIMACIONES
// ========================================
const Animations = {
  init() {
    this.animateOnScroll();
    this.animateCounters();
    this.animateSkillBars();
  },
  
  animateOnScroll() {
    const elements = document.querySelectorAll('.project-card, .skill-card, .contact-card, .connection-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
  },
  
  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          this.countUp(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  },
  
  countUp(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + '+';
      }
    }, 30);
  },
  
  animateSkillBars() {
    const bars = document.querySelectorAll('.skill-fill');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = `${width}%`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    bars.forEach(bar => observer.observe(bar));
  }
};

// ========================================
// MAPA
// ========================================
const Map = {
  instance: null,
  
  init() {
    const container = document.getElementById('map');
    const L = window.L;
    
    if (!container || !L) return;
    
    const coords = [40.4168, -3.7038]; // Madrid
    
    this.instance = L.map('map', {
      center: coords,
      zoom: 5,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false
    });
    
    this.updateTiles();
    L.marker(coords).addTo(this.instance);
    
    // Actualizar tiles cuando cambia el tema
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      setTimeout(() => this.updateTiles(), 100);
    });
  },
  
  updateTiles() {
    if (!this.instance || !window.L) return;
    
    const isDark = document.documentElement.classList.contains('dark-theme');
    const tiles = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    
    this.instance.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        this.instance.removeLayer(layer);
      }
    });
    
    L.tileLayer(tiles, {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(this.instance);
  }
};

// ========================================
// FORMULARIO DE CONTACTO
// ========================================
const ContactForm = {
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('#submit-btn');
      const btnText = btn.querySelector('.btn-text');
      const btnLoader = btn.querySelector('.btn-loader');
      
      const data = {
        name: Security.sanitize(form.name.value),
        email: Security.sanitize(form.email.value),
        subject: Security.sanitize(form.subject.value),
        message: Security.sanitize(form.message.value),
        timestamp: new Date().toISOString()
      };
      
      // Validación
      if (!data.name || !data.email || !data.subject || !data.message) {
        Toast.show('Por favor, completa todos los campos', 'warning');
        return;
      }
      
      // Validar email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        Toast.show('Por favor, introduce un email válido', 'warning');
        return;
      }
      
      // Loading state
      btn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline';
      
      try {
        // Intentar enviar con EmailJS
        const config = window.CONFIG?.emailjs;
        if (config?.publicKey && config.publicKey !== 'TU_PUBLIC_KEY_AQUI') {
          await emailjs.send(config.serviceId, config.templateId, {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            to_email: config.toEmail
          });
        }
        
        // Guardar mensaje localmente
        this.saveMessage(data);
        
        Toast.show('¡Mensaje enviado correctamente!', 'success');
        form.reset();
        
      } catch (error) {
        console.error('Error:', error);
        // Guardar localmente aunque falle el email
        this.saveMessage(data);
        Toast.show('Mensaje guardado. Te responderé pronto.', 'info');
        form.reset();
        
      } finally {
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
      }
    });
  },
  
  saveMessage(data) {
    try {
      const messages = JSON.parse(localStorage.getItem('rest_messages') || '[]');
      messages.unshift({ ...data, read: false });
      localStorage.setItem('rest_messages', JSON.stringify(messages));
    } catch (e) {
      console.error('Error guardando mensaje:', e);
    }
  }
};

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Theme.init();
  Matrix.init();
  Typewriter.init();
  Navigation.init();
  Animations.init();
  Map.init();
  ContactForm.init();
  SecretAccess.init();
  Tracker.init();
  
  // Año actual
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  // Bienvenida
  setTimeout(() => {
    Toast.show('¡Bienvenido a mi portfolio!', 'info', 3000);
  }, 1500);
});

// Exportar para panel
window.Tracker = Tracker;
