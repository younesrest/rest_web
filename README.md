# 🔐 Rest Portfolio - Versión 2.0

Portfolio personal con estética cybersecurity, tracking de visitantes y sistema de mensajes.

---

## ✨ Características

### 🌐 Tracking de Visitantes (MEJORADO)
- **Múltiples APIs** para obtener la IP (ipify, ipapi.co, ip-api.com)
- Funciona en móvil y escritorio
- Detecta: IP, ubicación, navegador, sistema operativo, ISP, zona horaria
- Guarda hasta 500 visitantes

### 🔐 Panel de Administración SEGURO
- **Usuario + Contraseña** para acceder
- Bloqueo después de 5 intentos fallidos (5 minutos)
- Sin enlaces visibles - acceso secreto

### 🎨 Diseño Cybersecurity
- Efecto Matrix en el fondo
- Colores verdes neón (tema oscuro)
- Animaciones suaves
- 100% responsive

### 📧 Envío de Correos
- Integración con EmailJS
- Backup local de mensajes

---

## 🚀 Cómo Acceder al Panel de Admin

### Método Secreto:
**Haz click 5 veces en el logo [Rest_]** de la página principal

Esto te llevará al panel de login donde introduces tu usuario y contraseña.

---

## ⚙️ Configuración

### 1. Cambiar credenciales (¡IMPORTANTE!)

Abre `config.js` y cambia:

```javascript
admin: {
  username: 'tu_usuario',        // Cambia esto
  password: 'tu_contraseña',     // Cambia esto
  maxAttempts: 5
}
```

### 2. Configurar EmailJS (opcional)

Para que el formulario envíe correos reales:

1. Crea cuenta en [emailjs.com](https://www.emailjs.com/)
2. Conecta tu Gmail
3. Crea una plantilla con estas variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{subject}}`
   - `{{message}}`
4. Copia las credenciales en `config.js`:

```javascript
emailjs: {
  publicKey: 'tu_public_key',
  serviceId: 'tu_service_id',
  templateId: 'tu_template_id',
  toEmail: 'tu@email.com'
}
```

---

## 📁 Archivos

```
rests.info_mejorada/
├── index.html      # Página principal
├── panel.html      # Panel de admin (acceso secreto)
├── styles.css      # Estilos
├── script.js       # JavaScript principal
├── config.js       # ⚠️ CONFIGURACIÓN
├── logo.jpg        # Tu foto
├── pomodoro.png    # Imagen proyecto
└── img/
    ├── ciberseguridad.jpg
    └── nmap-escaneo.png
```

---

## 🔒 Seguridad

### Protecciones implementadas:

1. **XSS Prevention** - Todo el contenido se escapa antes de mostrarse
2. **Rate Limiting** - Bloqueo después de intentos fallidos
3. **Acceso oculto** - No hay enlaces al panel
4. **Sanitización** - Todos los inputs se limpian

### Recomendaciones:

- ✅ Cambia el usuario y contraseña por defecto
- ✅ Usa contraseñas largas y únicas
- ✅ El archivo `config.js` contiene tus credenciales, pero en GitHub Pages es visible. Usa credenciales que no uses en otros sitios.

---

## 📱 Tracking en Móvil

El tracking funciona en móvil usando múltiples APIs:

1. Primero intenta `api.ipify.org`
2. Si falla, intenta `ipapi.co`
3. Si falla, intenta `ip-api.com`

Si todas fallan (por ejemplo, sin conexión), muestra los datos del navegador que sí puede detectar localmente.

---

## 🎯 Subir a GitHub Pages

1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings > Pages
4. Selecciona "Deploy from branch" > "main" > "/ (root)"
5. Tu sitio estará en: `https://tu-usuario.github.io/tu-repo`

---

## 💡 Tips

- **Para acceder al admin**: Click 5 veces en el logo
- **Los datos se guardan** en el navegador del admin (localStorage)
- **Exporta regularmente** los datos desde el panel
- **El tema oscuro** es el predeterminado pero hay tema claro

---

## 📞 Soporte

Si algo no funciona:

1. Abre la consola del navegador (F12 > Console)
2. Revisa si hay errores en rojo
3. Asegúrate de que todos los archivos estén subidos correctamente

---

¡Disfruta tu nuevo portfolio! 🚀
