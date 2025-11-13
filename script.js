// Canvas Galaxy Background
class GalaxyCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId)
    if (!this.canvas) return

    this.ctx = this.canvas.getContext("2d")
    this.width = this.canvas.width = window.innerWidth
    this.height = this.canvas.height = window.innerHeight
    this.particles = []
    this.particleCount = options.particleCount || 100
    this.withConstellations = options.withConstellations !== false

    this.init()
    this.animate()

    window.addEventListener("resize", () => this.handleResize())
  }

  init() {
    this.particles = []
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
      })
    }
  }

  handleResize() {
    this.width = this.canvas.width = window.innerWidth
    this.height = this.canvas.height = window.innerHeight
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.fillStyle = `rgba(6, 182, 212, ${particle.opacity})`
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      this.ctx.fill()
    })
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.velocityX
      particle.y += particle.velocityY

      if (particle.x < 0) particle.x = this.width
      if (particle.x > this.width) particle.x = 0
      if (particle.y < 0) particle.y = this.height
      if (particle.y > this.height) particle.y = 0
    })
  }

  drawConstellations() {
    if (!this.withConstellations) return

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          this.ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 * (1 - distance / 150)})`
          this.ctx.lineWidth = 0.5
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.stroke()
        }
      }
    }
  }

  animate() {
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.1)"
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.updateParticles()
    this.drawConstellations()
    this.drawParticles()

    requestAnimationFrame(() => this.animate())
  }
}

// Initialize canvas
document.addEventListener("DOMContentLoaded", () => {
  // Initialize galaxy canvases
  new GalaxyCanvas("galaxyCanvas", { particleCount: 100, withConstellations: true })
  new GalaxyCanvas("aboutCanvas", { particleCount: 80, withConstellations: true })
  new GalaxyCanvas("projectsCanvas", { particleCount: 100, withConstellations: false })
  new GalaxyCanvas("servicesCanvas", { particleCount: 90, withConstellations: true })

  // Navigation
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll("section")

  const updateActiveNav = () => {
    let current = "home"

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.dataset.section === current) {
        link.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", updateActiveNav)

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const sectionId = link.dataset.section
      const section = document.getElementById(sectionId)

      if (section) {
        window.scrollTo({
          top: section.offsetTop - 60,
          behavior: "smooth",
        })
      }
    })
  })

  // Contact Modal
  const contactBtn = document.getElementById("contactBtn")
  const contactModal = document.getElementById("contactModal")
  const closeBtn = document.querySelector(".close-modal")
  const contactForm = document.getElementById("contactForm")
  const formMessage = document.getElementById("formMessage")

  contactBtn.addEventListener("click", () => {
    contactModal.classList.add("show")
  })

  closeBtn.addEventListener("click", () => {
    contactModal.classList.remove("show")
  })

  window.addEventListener("click", (e) => {
    if (e.target === contactModal) {
      contactModal.classList.remove("show")
    }
  })

  // Form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: "YOUR_SERVICE_ID",
          template_id: "YOUR_TEMPLATE_ID",
          user_id: "YOUR_USER_ID",
          template_params: {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: "tu_email@gmail.com",
          },
        }),
      })

      if (response.ok) {
        formMessage.textContent = "¡Mensaje enviado correctamente!"
        formMessage.classList.add("success")
        contactForm.reset()

        setTimeout(() => {
          contactModal.classList.remove("show")
          formMessage.classList.remove("success")
        }, 3000)
      }
    } catch (error) {
      formMessage.textContent = "Error al enviar el mensaje. Intenta de nuevo."
      formMessage.classList.add("error")
      console.error("Error:", error)
    }
  })
})
