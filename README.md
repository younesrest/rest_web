# 🚀 Rest Portfolio - Versión Mejorada

Portfolio personal con sistema de tracking de visitantes y envío de emails funcional.

## ✨ Características Nuevas

### 1. 📊 Sistema de Tracking de Visitantes
- Registra automáticamente todos los visitantes
- Muestra: IP, ubicación, navegador, sistema operativo, ISP, timezone
- Los datos se guardan en localStorage (máximo 1000 visitantes)
- Panel de administración para ver todos los datos

### 2. 📧 Envío de Correos Electrónicos
- Integración con **EmailJS** (gratuito, 200 emails/mes)
- Los mensajes también se guardan localmente como backup
- Notificaciones de éxito/error

### 3. 🔐 Panel de Administración
- Accede desde: `tu-sitio.com/admin.html`
- Contraseña por defecto: `rest2024admin` (¡cámbiala en config.js!)
- Ver todos los visitantes
- Ver todos los mensajes recibidos
- Exportar datos a JSON
- Borrar datos

### 4. 🎨 Mejoras de Código
- Código más limpio y organizado
- Mejor rendimiento
- Animaciones suaves
- Diseño responsive mejorado
- Accesibilidad mejorada

---

## 🔧 Configuración

### Paso 1: Configurar EmailJS (para enviar correos)

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/) y crea una cuenta gratuita

2. En el dashboard, ve a **"Email Services"** y conecta tu Gmail:
   - Click en "Add New Service"
   - Selecciona "Gmail"
   - Autoriza tu cuenta de Gmail
   - Copia el **Service ID** (ej: `service_abc123`)

3. Ve a **"Email Templates"** y crea una plantilla:
   - Click en "Create New Template"
   - En el contenido del email, usa estas variables:
   ```
   De: {{from_name}} ({{from_email}})
   Asunto: {{subject}}
   
   Mensaje:
   {{message}}
   ```
   - Guarda y copia el **Template ID** (ej: `template_xyz789`)

4. Ve a **"Account"** > **"API Keys"** y copia tu **Public Key**

5. Abre el archivo `config.js` y reemplaza los valores:
   ```javascript
   emailjs: {
     publicKey: 'TU_PUBLIC_KEY_AQUI',     // Pega tu Public Key
     serviceId: 'TU_SERVICE_ID_AQUI',      // Pega tu Service ID
     templateId: 'TU_TEMPLATE_ID_AQUI',    // Pega tu Template ID
     toEmail: 'tu-email@gmail.com'         // Tu email donde recibes mensajes
   }
   ```

### Paso 2: Cambiar la Contraseña del Admin

En `config.js`, cambia la contraseña por una segura:
```javascript
admin: {
  password: 'tu-contraseña-segura-aqui'
}
```

### Paso 3: (Opcional) Configurar Webhook de Discord

Si quieres recibir notificaciones de visitantes en Discord:

1. En tu servidor de Discord, ve a Configuración del Canal > Integraciones > Webhooks
2. Crea un nuevo Webhook y copia la URL
3. En `config.js`:
   ```javascript
   webhook: {
     enabled: true,
     url: 'https://discord.com/api/webhooks/...'
   }
   ```

---

## 📁 Estructura de Archivos

```
rests.info_mejorada/
├── index.html       # Página principal
├── admin.html       # Panel de administración
├── styles.css       # Estilos CSS
├── script.js        # JavaScript principal
├── config.js        # ⚠️ CONFIGURACIÓN (editar este archivo)
├── logo.jpg         # Tu foto de perfil
├── pomodoro.png     # Imagen proyecto
└── img/
    ├── ciberseguridad.jpg
    └── nmap-escaneo.png
```

---

## 🚀 Despliegue

### Opción 1: GitHub Pages (Gratis)
1. Sube los archivos a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona "Deploy from a branch" > "main" > "/ (root)"
4. Tu sitio estará en: `https://tu-usuario.github.io/tu-repo`

### Opción 2: Netlify (Gratis)
1. Ve a [netlify.com](https://www.netlify.com/)
2. Arrastra la carpeta del proyecto
3. ¡Listo! Te dan un dominio automático

### Opción 3: Tu propio dominio
Simplemente sube los archivos a tu hosting

---

## ⚠️ Notas Importantes

1. **Los datos de visitantes se guardan en el navegador del visitante** (localStorage). Esto significa:
   - Cada visitante solo puede ver sus propios datos
   - Los datos del admin se guardan en TU navegador
   - Si limpias el navegador, pierdes los datos

2. **Para un tracking más avanzado**, considera usar:
   - Google Analytics (gratuito)
   - Plausible Analytics (de pago, más privado)
   - Un backend propio con base de datos

3. **Seguridad**:
   - La contraseña del admin se guarda en el código (no es seguro para producción seria)
   - Para mayor seguridad, considera un backend real

---

## 🐛 Solución de Problemas

### Los emails no se envían
1. Verifica que las credenciales de EmailJS estén correctas
2. Revisa la consola del navegador (F12) para ver errores
3. Asegúrate de haber verificado tu email en EmailJS

### No veo visitantes en el admin
1. Primero visita tu página normal (index.html) para generar datos
2. Luego ve al admin para verlos
3. Los datos se guardan en el navegador donde se visualizan

### El mapa no carga
- Asegúrate de tener conexión a internet
- Leaflet necesita cargar tiles de OpenStreetMap

---

## 📞 Soporte

Si tienes problemas, puedes:
1. Revisar la consola del navegador (F12 > Console)
2. Verificar que todos los archivos estén correctamente subidos
3. Asegurarte de que `config.js` tenga la configuración correcta

---

¡Disfruta tu nuevo portfolio! 🎉
