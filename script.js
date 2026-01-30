/**
 * ========================================
 * REST PORTFOLIO - MAIN SCRIPT
 * ========================================
 * Includes: Visitor tracking, Email sending, Animations
 */

// ========================================
// NOTIFICATION SYSTEM
// ========================================
class NotificationSystem {
  constructor() {
    this.container = document.getElementById('notification-container');
    this.notifications = [];
  }

  show(title, message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
      success: '✓',
      info: 'ℹ',
      warning: '⚠',
      error: '✕'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type] || icons.info}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    notification.querySelector('.notification-close').addEventListener('click', () => this.remove(notification));
    this.container.appendChild(notification);
    this.notifications.push(notification);

    if (duration > 0) {
      setTimeout(() => this.remove(notification), duration);
    }

    return notification;
  }

  remove(notification) {
    notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => {
      notification.remove();
      this.notifications = this.notifications.filter(n => n !== notification);
    }, 300);
  }
}

const notifications = new NotificationSystem();

// ========================================
// VISITOR TRACKING SYSTEM
// ========================================
class VisitorTracker {
  constructor() {
    this.visitorData = null;
    this.storageKey = 'rest_visitors_log';
  }

  async fetchVisitorInfo() {
    try {
      // Using multiple APIs for reliability
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      this.visitorData = {
        ip: data.ip || 'Unknown',
        city: data.city || 'Unknown',
        region: data.region || '',
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || '',
        isp: data.org || 'Unknown',
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        latitude: data.latitude,
        longitude: data.longitude,
        browser: this.detectBrowser(),
        os: this.detectOS(),
        device: this.detectDevice(),
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language || 'Unknown',
        referrer: document.referrer || 'Direct',
        timestamp: new Date().toISOString(),
        page: window.location.href,
        userAgent: navigator.userAgent
      };

      this.updateUI();
      this.saveVisitor();
      this.sendWebhook();
      
      return this.visitorData;
    } catch (error) {
      console.error('Error fetching visitor info:', error);
      this.handleError();
      return null;
    }
  }

  detectBrowser() {
    const ua = navigator.userAgent;
    const browsers = [
      { name: 'Firefox', check: /Firefox/i },
      { name: 'Opera', check: /Opera|OPR/i },
      { name: 'Edge', check: /Edg/i },
      { name: 'Chrome', check: /Chrome/i },
      { name: 'Safari', check: /Safari/i },
      { name: 'IE', check: /Trident/i }
    ];
    
    for (const browser of browsers) {
      if (browser.check.test(ua)) return browser.name;
    }
    return 'Unknown';
  }

  detectOS() {
    const ua = navigator.userAgent;
    const systems = [
      { name: 'Windows 11', check: /Windows NT 10.*Win64/i },
      { name: 'Windows 10', check: /Windows NT 10/i },
      { name: 'Windows', check: /Windows/i },
      { name: 'macOS', check: /Mac OS X/i },
      { name: 'iOS', check: /iPhone|iPad|iPod/i },
      { name: 'Android', check: /Android/i },
      { name: 'Linux', check: /Linux/i }
    ];
    
    for (const os of systems) {
      if (os.check.test(ua)) return os.name;
    }
    return 'Unknown';
  }

  detectDevice() {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
      return /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Mobile';
    }
    return 'Desktop';
  }

  updateUI() {
    const data = this.visitorData;
    if (!data) return;

    const elements = {
      'visitor-ip': data.ip,
      'visitor-location': `${data.city}, ${data.country}`,
      'visitor-browser': data.browser,
      'visitor-os': data.os,
      'visitor-isp': data.isp,
      'visitor-timezone': data.timezone
    };

    Object.entries(elements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = value;
        el.classList.add('loaded');
      }
    });
  }

  handleError() {
    const errorElements = ['visitor-ip', 'visitor-location', 'visitor-browser', 'visitor-os', 'visitor-isp', 'visitor-timezone'];
    errorElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = 'Unavailable';
    });
  }

  saveVisitor() {
    if (!this.visitorData) return;
    
    try {
      const visitors = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      visitors.unshift(this.visitorData);
      
      // Keep only the last 1000 visitors
      if (visitors.length > 1000) visitors.length = 1000;
      
      localStorage.setItem(this.storageKey, JSON.stringify(visitors));
    } catch (error) {
      console.error('Error saving visitor:', error);
    }
  }

  async sendWebhook() {
    const config = window.CONFIG?.webhook;
    if (!config?.enabled || !config?.url) return;

    try {
      const data = this.visitorData;
      const embed = {
        embeds: [{
          title: '🌐 New Visitor',
          color: 3447003,
          fields: [
            { name: 'IP', value: data.ip, inline: true },
            { name: 'Location', value: `${data.city}, ${data.country}`, inline: true },
            { name: 'Browser', value: data.browser, inline: true },
            { name: 'OS', value: data.os, inline: true },
            { name: 'Device', value: data.device, inline: true },
            { name: 'ISP', value: data.isp, inline: true }
          ],
          timestamp: data.timestamp
        }]
      };

      await fetch(config.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(embed)
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }

  static getStoredVisitors() {
    try {
      return JSON.parse(localStorage.getItem('rest_visitors_log') || '[]');
    } catch {
      return [];
    }
  }

  static clearVisitors() {
    localStorage.removeItem('rest_visitors_log');
  }
}

// ========================================
// EMAIL SERVICE
// ========================================
class EmailService {
  constructor() {
    this.initialized = false;
  }

  init() {
    const config = window.CONFIG?.emailjs;
    if (!config?.publicKey || config.publicKey === 'TU_PUBLIC_KEY_AQUI') {
      console.warn('EmailJS not configured. Please update config.js');
      return false;
    }

    try {
      emailjs.init(config.publicKey);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('EmailJS init error:', error);
      return false;
    }
  }

  async send(formData) {
    const config = window.CONFIG?.emailjs;
    
    if (!this.initialized || !config) {
      throw new Error('Email service not configured');
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: config.toEmail
    };

    return await emailjs.send(config.serviceId, config.templateId, templateParams);
  }
}

const emailService = new EmailService();

// ========================================
// PARTICLE BACKGROUND
// ========================================
class ParticleBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createParticles();
  }

  createParticles() {
    const count = Math.min(60, Math.floor((this.canvas.width * this.canvas.height) / 15000));
    this.particles = [];
    
    const isDark = document.documentElement.classList.contains('dark-theme');
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const isDark = document.documentElement.classList.contains('dark-theme');
    const baseColor = isDark ? '96, 165, 250' : '59, 130, 246';

    // Update and draw particles
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${baseColor}, ${p.opacity})`;
      this.ctx.fill();
    });

    // Draw connections
    const maxDist = 120;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
          this.ctx.stroke();
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this.update());
  }

  start() {
    this.update();
  }
}

// ========================================
// MAIN APP
// ========================================
class App {
  constructor() {
    this.visitorTracker = new VisitorTracker();
    this.particleBackground = null;
    this.map = null;
  }

  init() {
    this.initParticles();
    this.initTheme();
    this.initNavigation();
    this.initMap();
    this.initContactForm();
    this.initAnimations();
    this.initMisc();
    
    // Track visitor
    this.visitorTracker.fetchVisitorInfo();
    
    // Init email service
    emailService.init();
    
    // Welcome notification
    setTimeout(() => {
      notifications.show(
        '👋 Welcome!',
        'Thanks for visiting my portfolio. Feel free to explore!',
        'info',
        5000
      );
    }, 1500);
  }

  initParticles() {
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
      this.particleBackground = new ParticleBackground(canvas);
      this.particleBackground.start();
    }
  }

  initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem('theme');

    if (saved === 'dark' || (!saved && prefersDark.matches)) {
      document.documentElement.classList.add('dark-theme');
    }

    toggle?.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-theme');
      const isDark = document.documentElement.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      // Recreate particles with new colors
      this.particleBackground?.createParticles();
      
      // Update map tiles
      this.updateMapTheme();
      
      notifications.show(
        'Theme Changed',
        `Switched to ${isDark ? 'dark' : 'light'} mode`,
        'success',
        2000
      );
    });

    prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark-theme', e.matches);
        this.particleBackground?.createParticles();
      }
    });
  }

  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const sectionId = link.dataset.section;
        const section = document.getElementById(sectionId);
        
        if (section) {
          window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === entry.target.id);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }

  initMap() {
    const mapElement = document.getElementById('map');
    const L = window.L;
    
    if (!mapElement || !L) return;

    const config = window.CONFIG?.site?.location;
    const coords = config?.coordinates || [40.4168, -3.7038];

    this.map = L.map('map', {
      center: coords,
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: false
    });

    this.updateMapTheme();

    const marker = L.marker(coords).addTo(this.map);
    marker.bindPopup(`<b>${config?.city || 'Madrid'}, ${config?.country || 'España'}</b><br>I'm based here!`);
  }

  updateMapTheme() {
    if (!this.map || !window.L) return;

    const isDark = document.documentElement.classList.contains('dark-theme');
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    // Remove existing tile layers
    this.map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        this.map.removeLayer(layer);
      }
    });

    // Add new tile layer
    L.tileLayer(tileUrl, {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.map);
  }

  initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('#submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');

      const formData = {
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        subject: form.querySelector('#subject').value.trim(),
        message: form.querySelector('#message').value.trim()
      };

      // Validation
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        notifications.show('Error', 'Please fill in all fields', 'warning');
        return;
      }

      // Show loading state
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      submitBtn.disabled = true;

      try {
        // Check if EmailJS is configured
        const config = window.CONFIG?.emailjs;
        if (!config?.publicKey || config.publicKey === 'TU_PUBLIC_KEY_AQUI') {
          // Fallback: Save to localStorage for admin panel
          this.saveMessage(formData);
          
          // Simulate success
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          notifications.show(
            '✓ Message Received!',
            "Thanks for reaching out! I'll get back to you soon.",
            'success',
            5000
          );
        } else {
          // Send via EmailJS
          await emailService.send(formData);
          
          // Also save locally
          this.saveMessage(formData);
          
          notifications.show(
            '✓ Message Sent!',
            "Thanks for reaching out! I'll respond as soon as possible.",
            'success',
            5000
          );
        }

        form.reset();
      } catch (error) {
        console.error('Email error:', error);
        
        // Save locally even if EmailJS fails
        this.saveMessage(formData);
        
        notifications.show(
          '⚠ Partial Success',
          'Message saved. Email delivery may be delayed.',
          'warning',
          5000
        );
      } finally {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
      }
    });
  }

  saveMessage(formData) {
    try {
      const messages = JSON.parse(localStorage.getItem('rest_messages') || '[]');
      messages.unshift({
        ...formData,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('rest_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  initAnimations() {
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.progress');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = `${width}%`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));

    // Animate stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateNumber(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statObserver.observe(num));

    // Fade in elements
    const fadeElements = document.querySelectorAll('.card, .project-card, .contact-card, .visitor-info-card');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  animateNumber(element) {
    const target = parseInt(element.dataset.target) || 0;
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + '+';
      }
    }, 16);
  }

  initMisc() {
    // Set current year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // GitHub link notification
    const githubLink = document.getElementById('github-link');
    githubLink?.addEventListener('click', () => {
      notifications.show(
        '🚀 GitHub',
        'Check out my latest projects!',
        'info',
        3000
      );
    });
  }
}

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// Export for admin panel
window.VisitorTracker = VisitorTracker;
