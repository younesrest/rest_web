class NotificationSystem {
  constructor() {
    this.container = document.getElementById("notification-container")
    this.notifications = []
  }

  show(title, message, type = "info", duration = 5000) {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`

    const icon = this.getIcon(type)

    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `

    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => this.remove(notification))

    this.container.appendChild(notification)
    this.notifications.push(notification)

    if (duration > 0) {
      setTimeout(() => this.remove(notification), duration)
    }

    return notification
  }

  getIcon(type) {
    const icons = {
      success: "✓",
      info: "ℹ",
      warning: "⚠",
      error: "✕",
    }
    return icons[type] || icons.info
  }

  remove(notification) {
    notification.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
      const index = this.notifications.indexOf(notification)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    }, 300)
  }
}

// Initialize notification system
const notifications = new NotificationSystem()

// Canvas Background and Portfolio Functionality
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("background-canvas")
  const ctx = canvas.getContext("2d")

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 2 + 1
      this.speedX = (Math.random() - 0.5) * 0.3
      this.speedY = (Math.random() - 0.5) * 0.3

      const isDarkTheme = document.documentElement.classList.contains("dark-theme")
      this.color = isDarkTheme
        ? `rgba(96, 165, 250, ${Math.random() * 0.4 + 0.1})`
        : `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY

      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX
      }

      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY
      }
    }

    draw() {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 12000))
  let particles = []

  function createParticles() {
    particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
  }

  createParticles()

  function connectParticles() {
    const maxDistance = 150
    const isDarkTheme = document.documentElement.classList.contains("dark-theme")

    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance
          const strokeColor = isDarkTheme
            ? `rgba(96, 165, 250, ${opacity * 0.15})`
            : `rgba(59, 130, 246, ${opacity * 0.12})`

          ctx.strokeStyle = strokeColor
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const particle of particles) {
      particle.update()
      particle.draw()
    }

    connectParticles()
    requestAnimationFrame(animate)
  }

  animate()

  // Theme Toggle
  const themeToggle = document.getElementById("theme-toggle")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme.matches)) {
    document.documentElement.classList.add("dark-theme")
  } else {
    document.documentElement.classList.remove("dark-theme")
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      document.documentElement.classList.toggle("dark-theme")

      const isDarkTheme = document.documentElement.classList.contains("dark-theme")
      localStorage.setItem("theme", isDarkTheme ? "dark" : "light")

      createParticles()

      notifications.show("Theme Changed", `Switched to ${isDarkTheme ? "dark" : "light"} mode`, "success", 3000)
    })
  }

  // Navigation
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section")
      const section = document.getElementById(sectionId)

      if (section) {
        window.scrollTo({
          top: section.offsetTop - 100,
          behavior: "smooth",
        })
      }
    })
  })

  function handleScroll() {
    const scrollPosition = window.scrollY + 200
    const sections = document.querySelectorAll("section")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const sectionId = section.getAttribute("id")

        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("data-section") === sectionId) {
            link.classList.add("active")
          }
        })
      }
    })
  }

  window.addEventListener("scroll", handleScroll)

  const mapElement = document.getElementById("map")
  const L = window.L // Declare the L variable here
  if (mapElement && L) {
    // Check if L is defined
    // Madrid, Spain coordinates
    const madridCoords = [40.4168, -3.7038]

    const map = L.map("map", {
      center: madridCoords,
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    // Use dark or light map tiles based on theme
    const isDarkTheme = document.documentElement.classList.contains("dark-theme")
    const tileLayer = isDarkTheme
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

    L.tileLayer(tileLayer, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Custom marker
    const marker = L.marker(madridCoords).addTo(map)
    marker.bindPopup("<b>Madrid, Spain</b><br>I'm based here!").openPopup()

    // Update map tiles when theme changes
    const originalThemeToggle = themeToggle.onclick
    themeToggle.addEventListener("click", () => {
      setTimeout(() => {
        const isDark = document.documentElement.classList.contains("dark-theme")
        const newTileLayer = isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

        map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            map.removeLayer(layer)
          }
        })

        L.tileLayer(newTileLayer, {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map)

        marker.addTo(map)
      }, 300)
    })
  }

  const githubLink = document.getElementById("github-link")
  if (githubLink) {
    let clickCount = 0
    const messages = [
      { title: "🎉 Awesome!", message: "Check out my latest projects on GitHub!" },
      { title: "🚀 Thanks!", message: "Star my repos if you find them useful!" },
      { title: "💻 Cool!", message: "Open source contributions welcome!" },
      { title: "⭐ Nice!", message: "Follow me for more interesting projects!" },
      { title: "🔥 Great!", message: "Let's build something amazing together!" },
    ]

    githubLink.addEventListener("click", (e) => {
      const message = messages[clickCount % messages.length]
      notifications.show(message.title, message.message, "info", 4000)
      clickCount++
    })
  }

  // Show welcome notification
  setTimeout(() => {
    notifications.show(
      "👋 Welcome!",
      "Thanks for visiting my portfolio. Check out my GitHub for cool projects!",
      "info",
      6000,
    )
  }, 1000)

  // Random GitHub reminder notifications
  setInterval(() => {
    if (Math.random() > 0.7) {
      const reminders = [
        { title: "💡 Tip", message: "Don't forget to check my GitHub profile!" },
        { title: "🎯 Reminder", message: "New projects added on GitHub regularly!" },
        { title: "✨ Hey!", message: "Star my repos if you like them!" },
      ]
      const reminder = reminders[Math.floor(Math.random() * reminders.length)]
      notifications.show(reminder.title, reminder.message, "info", 5000)
    }
  }, 30000) // Every 30 seconds

  // Contact form
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      }

      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        notifications.show("Error", "Please fill in all fields.", "warning", 4000)
        return
      }

      const submitButton = contactForm.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent

      submitButton.textContent = "Sending..."
      submitButton.disabled = true

      // Simulate sending
      setTimeout(() => {
        notifications.show("✓ Message Sent!", "Thanks for reaching out! I'll get back to you soon.", "success", 5000)
        contactForm.reset()
        submitButton.textContent = originalText
        submitButton.disabled = false
      }, 1500)
    })
  }

  // Set current year
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Listen for system theme changes
  prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        document.documentElement.classList.add("dark-theme")
      } else {
        document.documentElement.classList.remove("dark-theme")
      }
      createParticles()
    }
  })

  // Visitor Tracking System - Fetch real IP and geolocation data
  async function fetchVisitorInfo() {
    try {
      // Fetch IP and location data from ipapi.co (free API)
      const response = await fetch("https://ipapi.co/json/")
      const data = await response.json()

      // Update IP Address
      const ipElement = document.getElementById("visitor-ip")
      if (ipElement) {
        ipElement.textContent = data.ip || "N/A"
      }

      // Update Location
      const locationElement = document.getElementById("visitor-location")
      if (locationElement) {
        locationElement.textContent = `${data.city || "Unknown"}, ${data.country_name || "Unknown"}`
      }

      console.log("[v0] Visitor info fetched:", data)
    } catch (error) {
      console.error("[v0] Error fetching visitor info:", error)
      document.getElementById("visitor-ip").textContent = "Unable to detect"
      document.getElementById("visitor-location").textContent = "Unable to detect"
    }
  }

  function detectBrowser() {
    const userAgent = navigator.userAgent
    let browserName = "Unknown"

    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox"
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
      browserName = "Samsung Internet"
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      browserName = "Opera"
    } else if (userAgent.indexOf("Trident") > -1) {
      browserName = "IE"
    } else if (userAgent.indexOf("Edge") > -1) {
      browserName = "Edge Legacy"
    } else if (userAgent.indexOf("Edg") > -1) {
      browserName = "Edge"
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Chrome"
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari"
    }

    return browserName
  }

  function detectOS() {
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    let osName = "Unknown"

    if (userAgent.indexOf("Win") !== -1) osName = "Windows"
    else if (userAgent.indexOf("Mac") !== -1) osName = "macOS"
    else if (userAgent.indexOf("Linux") !== -1) osName = "Linux"
    else if (userAgent.indexOf("Android") !== -1) osName = "Android"
    else if (userAgent.indexOf("like Mac") !== -1) osName = "iOS"

    return osName
  }

  fetchVisitorInfo()

  const browserElement = document.getElementById("visitor-browser")
  if (browserElement) {
    browserElement.textContent = detectBrowser()
  }

  const osElement = document.getElementById("visitor-os")
  if (osElement) {
    osElement.textContent = detectOS()
  }
})
