// Add this code to your existing script.js file

// Enhanced hover effects for vehicle cards
document.addEventListener("DOMContentLoaded", () => {
  // Add 3D tilt effect to vehicle cards
  const vehicleCards = document.querySelectorAll(".vehicle-card")

  vehicleCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const cardRect = card.getBoundingClientRect()
      const cardCenterX = cardRect.left + cardRect.width / 2
      const cardCenterY = cardRect.top + cardRect.height / 2

      const mouseX = e.clientX
      const mouseY = e.clientY

      // Calculate rotation based on mouse position
      const rotateY = (mouseX - cardCenterX) / 20
      const rotateX = (cardCenterY - mouseY) / 20

      // Apply rotation
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
    })

    // Reset on mouse leave
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)"
      setTimeout(() => {
        card.style.transition = "transform 0.5s ease"
      }, 100)
    })

    // Remove transition on mouse enter for smooth movement
    card.addEventListener("mouseenter", () => {
      card.style.transition = "none"
    })
  })

  // Fix quick view positioning
  const quickViewButtons = document.querySelectorAll(".quick-view")

  quickViewButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation() // Prevent event bubbling
    })
  })

  // Enhanced animation for action buttons
  const actionButtons = document.querySelectorAll(".action-btn")

  actionButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.1)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = ""
    })
  })
})
