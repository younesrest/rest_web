/**
 * ========================================
 * CONFIGURACIÓN DE LA PÁGINA WEB
 * ========================================
 * 
 * Este archivo contiene todas las configuraciones necesarias
 * para que tu página web funcione correctamente.
 * 
 * INSTRUCCIONES PARA EMAILJS (envío de correos):
 * 
 * 1. Ve a https://www.emailjs.com/ y crea una cuenta gratuita
 * 2. En el dashboard, ve a "Email Services" y conecta tu Gmail
 * 3. Ve a "Email Templates" y crea una plantilla con estas variables:
 *    - {{from_name}} - Nombre del remitente
 *    - {{from_email}} - Email del remitente
 *    - {{subject}} - Asunto del mensaje
 *    - {{message}} - Contenido del mensaje
 *    - {{to_email}} - Tu email (donde recibes los mensajes)
 * 4. Copia tus credenciales aquí abajo
 * 
 * Plan gratuito: 200 emails/mes
 */

const CONFIG = {
  // ========================================
  // EMAILJS - CONFIGURACIÓN DE CORREOS
  // ========================================
  emailjs: {
    // Tu Public Key de EmailJS (la encuentras en Account > API Keys)
    publicKey: 'TU_PUBLIC_KEY_AQUI',
    
    // El ID de tu servicio de email (lo encuentras en Email Services)
    serviceId: 'TU_SERVICE_ID_AQUI',
    
    // El ID de tu plantilla de email (lo encuentras en Email Templates)
    templateId: 'TU_TEMPLATE_ID_AQUI',
    
    // Tu email donde quieres recibir los mensajes
    toEmail: 'youlal2019@gmail.com'
  },

  // ========================================
  // WEBHOOK - REGISTRO DE VISITANTES
  // ========================================
  // Si quieres recibir notificaciones de visitantes en Discord/Slack
  // Puedes crear un webhook y pegarlo aquí
  webhook: {
    enabled: false,
    // URL del webhook de Discord o Slack (opcional)
    // Para Discord: Server Settings > Integrations > Webhooks > New Webhook
    url: ''
  },

  // ========================================
  // CONTRASEÑA DEL PANEL DE ADMIN
  // ========================================
  admin: {
    // Cambia esta contraseña por una segura
    // Esta contraseña te permite acceder al panel de administración
    password: 'rest2024admin'
  },

  // ========================================
  // CONFIGURACIÓN GENERAL
  // ========================================
  site: {
    // Nombre del sitio
    name: 'Rest Portfolio',
    
    // Tu nombre
    author: 'Rest',
    
    // Ubicación mostrada en el mapa
    location: {
      city: 'Madrid',
      country: 'España',
      coordinates: [40.4168, -3.7038] // [latitud, longitud]
    }
  },

  // ========================================
  // REDES SOCIALES
  // ========================================
  social: {
    github: 'https://github.com/younesrest',
    linkedin: '', // Añade tu LinkedIn si tienes
    twitter: ''   // Añade tu Twitter si tienes
  }
};

// No modificar esta línea - hace que la configuración esté disponible
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
