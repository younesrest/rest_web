/**
 * ========================================
 * CONFIGURACIÓN - REST PORTFOLIO
 * ========================================
 * 
 * ⚠️ IMPORTANTE: Cambia estos valores antes de subir a GitHub
 */

const CONFIG = {
  // ========================================
  // 🔐 CREDENCIALES DEL PANEL DE ADMIN
  // ========================================
  admin: {
    // Usuario para acceder al panel
    username: 'rest',
    
    // Contraseña (cámbiala por una segura)
    // Tip: Usa algo largo y único
    password: 'CyberRest2024!',
    
    // Máximo intentos de login antes de bloquear (5 minutos)
    maxAttempts: 5
  },

  // ========================================
  // 📧 EMAILJS - ENVÍO DE CORREOS
  // ========================================
  // Instrucciones en README.md
  emailjs: {
    publicKey: 'TU_PUBLIC_KEY_AQUI',
    serviceId: 'TU_SERVICE_ID_AQUI',
    templateId: 'TU_TEMPLATE_ID_AQUI',
    toEmail: 'youlal2019@gmail.com'
  },

  // ========================================
  // 🌐 WEBHOOK DE DISCORD (Opcional)
  // ========================================
  webhook: {
    enabled: false,
    url: ''
  },

  // ========================================
  // 📍 INFORMACIÓN DEL SITIO
  // ========================================
  site: {
    name: 'Rest Portfolio',
    author: 'Rest',
    location: {
      city: 'Madrid',
      country: 'España',
      coordinates: [40.4168, -3.7038]
    }
  },

  // ========================================
  // 🔗 REDES SOCIALES
  // ========================================
  social: {
    github: 'https://github.com/younesrest',
    email: 'youlal2019@gmail.com'
  }
};

// Exportar configuración
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
