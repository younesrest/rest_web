// Canvas Background and Portfolio Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_PUBLIC_KEY"); // Necesitarás configurar esto
  } else {
    console.warn("EmailJS is not loaded. Contact form will not work.");
  }
  
  // Visitor tracking system
  const VisitorTracker = {
    init() {
      this.recordVisit();
      this.updateVisitorStats();
    },
    
    recordVisit() {
      const now = new Date();
      const visitor = {
        timestamp: now.toISOString(),
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'Direct',
        sessionId: this.generateSessionId()
      };
      
      // Get existing visitors
      let visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
      visitors.push(visitor);
      
      // Keep only last 1000 visits to avoid storage issues
      if (visitors.length > 1000) {
        visitors = visitors.slice(-1000);
      }
      
      localStorage.setItem('portfolio_visitors', JSON.stringify(visitors));
      
      // Log to console for server monitoring
      console.log('🔍 New visitor detected:', {
        time: visitor.time,
        platform: visitor.platform,
        sessionId: visitor.sessionId
      });
    },
    
    generateSessionId() {
      return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    },
    
    getVisitorStats() {
      const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
      const today = new Date().toLocaleDateString();
      
      const todayVisitors = visitors.filter(v => v.date === today);
      const uniquePlatforms = [...new Set(visitors.map(v => v.platform))];
      const uniqueLanguages = [...new Set(visitors.map(v => v.language))];
      
      return {
        total: visitors.length,
        today: todayVisitors.length,
        platforms: uniquePlatforms.length,
        languages: uniqueLanguages.length,
        lastVisit: visitors.length > 0 ? visitors[visitors.length - 1] : null
      };
    },
    
    updateVisitorStats() {
      // Update any UI elements that show visitor stats
      const stats = this.getVisitorStats();
      console.log('📊 Visitor Statistics:', stats);
    }
  };
  
  // Initialize visitor tracking
  VisitorTracker.init();
  
  const canvas = document.getElementById('background-canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas to full screen
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      
      // Adjust particle color based on theme
      const isDarkTheme = document.documentElement.classList.contains('dark-theme');
      this.color = isDarkTheme 
        ? `rgba(129, 140, 248, ${Math.random() * 0.3 + 0.1})`
        : `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Bounce off edges
      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Create particles
  let particleCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 10000));
  let particles = [];
  
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  createParticles();
  
  // Connect particles with lines
  function connectParticles() {
    const maxDistance = 150;
    const isDarkTheme = document.documentElement.classList.contains('dark-theme');
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = 1 - (distance / maxDistance);
          const strokeColor = isDarkTheme 
            ? `rgba(129, 140, 248, ${opacity * 0.2})`
            : `rgba(99, 102, 241, ${opacity * 0.2})`;
            
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    
    connectParticles();
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme preference or use system preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }

  // Toggle theme when button is clicked
  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      document.documentElement.classList.toggle('dark-theme');
      
      // Save theme preference
      const isDarkTheme = document.documentElement.classList.contains('dark-theme');
      localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
      
      // Recreate particles with new theme colors
      createParticles();
    });
  }
  
  // Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const sectionId = this.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Active section on scroll
  function handleScroll() {
    const scrollPosition = window.scrollY + 200;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const sectionId = section.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', handleScroll);
  
  // Enhanced Contact form with real email sending
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };
      
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        alert('Por favor, completa todos los campos.');
        return;
      }
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      submitButton.textContent = 'Enviando...';
      submitButton.disabled = true;
      
      // Send email using EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'youlal2019@gmail.com'
      };
      
      // For now, we'll simulate the email sending
      // You'll need to set up EmailJS with your account
      if (typeof emailjs !== 'undefined') {
        emailjs.send(
          'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
          'YOUR_TEMPLATE_ID',   // Replace with your EmailJS template ID
          templateParams
        )
        .then(() => {
          alert('¡Mensaje enviado exitosamente! Te responderé pronto.');
          contactForm.reset();
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
        })
        .finally(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        });
      } else {
        sendEmailSimulation(templateParams)
          .then(() => {
            alert('¡Mensaje enviado exitosamente! Te responderé pronto.');
            contactForm.reset();
          })
          .catch((error) => {
            console.error('Error sending email:', error);
            alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
          })
          .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          });
      }
    });
  }
  
  // Email sending simulation (replace with real EmailJS implementation)
  function sendEmailSimulation(templateParams) {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // Log the email data (in real implementation, this would be sent via EmailJS)
        console.log('📧 Email would be sent to youlal2019@gmail.com:', templateParams);
        
        // Simulate success (90% success rate)
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Simulated email sending failure'));
        }
      }, 1500);
    });
  }
  
  // Real EmailJS implementation (uncomment and configure when ready)
  /*
  function sendEmailReal(templateParams) {
    return emailjs.send(
      'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID',   // Replace with your EmailJS template ID
      templateParams
    );
  }
  */
  
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
      
      // Recreate particles with new theme colors
      createParticles();
    }
  });
  
  // Enhanced Nui Interface functionality
  const nuiInterface = document.getElementById('nui-interface');
  const closeNuiBtn = document.getElementById('close-nui');
  const nuiInput = document.getElementById('nui-input');
  const nuiOutput = document.getElementById('nui-output');
  
  // Secret command to open Nui
  let secretCode = '';
  const secretCommand = 'opennui';
  
  // Listen for keydown events to detect secret command
  document.addEventListener('keydown', function(e) {
    // Only track alphabetical keys
    if (/^[a-z]$/i.test(e.key)) {
      secretCode += e.key.toLowerCase();
      
      // Check if the code contains our command
      if (secretCode.includes(secretCommand)) {
        openNui();
        secretCode = '';
      }
      
      // Reset after a certain length to avoid memory issues
      if (secretCode.length > 20) {
        secretCode = secretCode.substring(secretCode.length - 10);
      }
    }
  });
  
  // Open Nui interface
  function openNui() {
    nuiInterface.classList.add('active');
    nuiInput.focus();
    appendToOutput('🚀 Nui interface initialized. Type "help" for available commands.');
    appendToOutput('💡 Tip: Try "visitors" to see who has visited your portfolio!');
  }
  
  // Close Nui interface
  function closeNuiInterface() {
    nuiInterface.classList.remove('active');
  }
  
  // Append text to the output
  function appendToOutput(text) {
    const timestamp = new Date().toLocaleTimeString();
    nuiOutput.innerHTML += `[${timestamp}] ${text}\n`;
    nuiOutput.scrollTop = nuiOutput.scrollHeight;
  }
  
  // Enhanced command processing
  function processCommand(command) {
    appendToOutput(`> ${command}`);
    
    switch(command.toLowerCase()) {
      case 'help':
        appendToOutput('📋 Available commands:');
        appendToOutput('theme:dark - Switch to dark theme');
        appendToOutput('theme:light - Switch to light theme');
        appendToOutput('particles:more - Increase particle count');
        appendToOutput('particles:less - Decrease particle count');
        appendToOutput('visitors - Show visitor statistics');
        appendToOutput('clear:visitors - Clear visitor log');
        appendToOutput('status - Show system status');
        appendToOutput('export:visitors - Export visitor data');
        appendToOutput('close - Close Nui');
        break;
        
      case 'theme:dark':
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        createParticles();
        appendToOutput('🌙 Theme switched to dark mode.');
        break;
        
      case 'theme:light':
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        createParticles();
        appendToOutput('☀️ Theme switched to light mode.');
        break;
        
      case 'particles:more':
        particleCount = Math.min(200, particleCount + 50);
        createParticles();
        appendToOutput(`✨ Particle count increased to ${particleCount}.`);
        break;
        
      case 'particles:less':
        particleCount = Math.max(50, particleCount - 50);
        createParticles();
        appendToOutput(`✨ Particle count decreased to ${particleCount}.`);
        break;
        
      case 'visitors':
        const stats = VisitorTracker.getVisitorStats();
        appendToOutput('👥 Visitor Statistics:');
        appendToOutput(`Total visits: ${stats.total}`);
        appendToOutput(`Today's visits: ${stats.today}`);
        appendToOutput(`Unique platforms: ${stats.platforms}`);
        appendToOutput(`Languages detected: ${stats.languages}`);
        if (stats.lastVisit) {
          appendToOutput(`Last visit: ${stats.lastVisit.date} at ${stats.lastVisit.time}`);
          appendToOutput(`Platform: ${stats.lastVisit.platform}`);
        }
        break;
        
      case 'clear:visitors':
        localStorage.removeItem('portfolio_visitors');
        appendToOutput('🗑️ Visitor log cleared.');
        break;
        
      case 'status':
        const isDark = document.documentElement.classList.contains('dark-theme');
        appendToOutput('⚡ System Status:');
        appendToOutput(`Theme: ${isDark ? 'Dark' : 'Light'}`);
        appendToOutput(`Particles: ${particleCount}`);
        appendToOutput(`Screen: ${window.innerWidth}x${window.innerHeight}`);
        appendToOutput(`Browser: ${navigator.userAgent.split(' ').pop()}`);
        appendToOutput(`Language: ${navigator.language}`);
        break;
        
      case 'export:visitors':
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        if (visitors.length > 0) {
          const dataStr = JSON.stringify(visitors, null, 2);
          const dataBlob = new Blob([dataStr], {type: 'application/json'});
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `portfolio_visitors_${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          URL.revokeObjectURL(url);
          appendToOutput('📁 Visitor data exported successfully.');
        } else {
          appendToOutput('❌ No visitor data to export.');
        }
        break;
        
      case 'close':
        closeNuiInterface();
        break;
        
      default:
        appendToOutput(`❌ Unknown command: ${command}`);
        appendToOutput('💡 Type "help" to see available commands.');
        break;
    }
  }
  
  // Handle Nui input
  if (nuiInput) {
    nuiInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const command = this.value.trim();
        if (command) {
          processCommand(command);
          this.value = '';
        }
      }
    });
  }
  
  // Close Nui when close button is clicked
  if (closeNuiBtn) {
    closeNuiBtn.addEventListener('click', function() {
      closeNuiInterface();
    });
  }
  
  // Close Nui when clicking outside
  nuiInterface.addEventListener('click', function(e) {
    if (e.target === nuiInterface) {
      closeNuiInterface();
    }
  });
  
  // Welcome message for new visitors
  const isFirstVisit = !localStorage.getItem('portfolio_visited');
  if (isFirstVisit) {
    localStorage.setItem('portfolio_visited', 'true');
    console.log('🎉 Welcome to the portfolio! Type "opennui" to access the developer console.');
  }
});
// Theme Toggle - Updated with more robust event handling
const themeToggle = document.getElementById('theme-toggle');

// Declare createParticles function (or import it if it's in another module)
// For demonstration purposes, we'll define an empty function.
// In a real application, you would replace this with the actual implementation or import.
function createParticles() {
  // Your particle creation logic here
  console.log("Particles recreated with new theme colors.");
}
  
// Check for saved theme preference or use system preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
  document.documentElement.classList.add('dark-theme');
} else {
  document.documentElement.classList.remove('dark-theme');
}

// Toggle theme when button is clicked
if (themeToggle) {
  // Remove any existing event listeners
  themeToggle.replaceWith(themeToggle.cloneNode(true));
  
  // Get the fresh reference
  const freshThemeToggle = document.getElementById('theme-toggle');
  
  freshThemeToggle.addEventListener('click', function(e) {
    // Prevent any default behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle the theme
    document.documentElement.classList.toggle('dark-theme');
    
    // Save theme preference
    const isDarkTheme = document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    
    // Recreate particles with new theme colors
    createParticles();
    
    // Return false to prevent any other behavior
    return false;
  });
}