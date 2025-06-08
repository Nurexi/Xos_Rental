document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: false,
    mirror: true,
    offset: 50,
    delay: 100,
    anchorPlacement: "top-bottom",
  })

  // Form validation
  const contactForm = document.getElementById("contact-form")
  const formSuccessMessage = document.querySelector(".form-success-message")
  const sendAnotherBtn = document.querySelector(".send-another")

  if (contactForm) {
    // Form field validation
    const validateField = (field) => {
      const value = field.value.trim()
      let isValid = true
      let errorMessage = ""

      // Check if field is required and empty
      if (field.hasAttribute("required") && value === "") {
        isValid = false
        errorMessage = "This field is required"
      } else {
        // Email validation
        if (field.type === "email" && value !== "") {
          const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (!emailRegex.test(value.toLowerCase())) {
            isValid = false
            errorMessage = "Please enter a valid email address"
          }
        }
      }

      // Update field styling and error message
      if (isValid) {
        field.classList.remove("error")
        field.classList.add("success")
        field.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "none"
      } else {
        field.classList.remove("success")
        field.classList.add("error")
        const errorElement = field.nextElementSibling.nextElementSibling.nextElementSibling
        errorElement.textContent = errorMessage
        errorElement.style.display = "block"
      }

      return isValid
    }

    // Add blur event listeners to all form fields
    const formFields = contactForm.querySelectorAll("input, textarea")
    formFields.forEach((field) => {
      field.addEventListener("blur", () => {
        validateField(field)
      })

      // Clear error on input
      field.addEventListener("input", () => {
        field.classList.remove("error", "success")
        field.nextElementSibling.nextElementSibling.nextElementSibling.style.display = "none"
      })
    })

    // Form submission
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate all fields
      let isFormValid = true
      formFields.forEach((field) => {
        if (!validateField(field)) {
          isFormValid = false
        }
      })

      // Check privacy policy checkbox
      const privacyCheckbox = document.getElementById("privacy-policy")
      if (privacyCheckbox && !privacyCheckbox.checked) {
        isFormValid = false
        const errorElement = privacyCheckbox.parentElement.nextElementSibling
        errorElement.textContent = "You must agree to the Privacy Policy"
        errorElement.style.display = "block"
      }

      if (isFormValid) {
        // Show loading state
        const submitButton = contactForm.querySelector("button[type='submit']")
        submitButton.classList.add("loading")
        submitButton.disabled = true

        // Simulate form submission (replace with actual form submission)
        setTimeout(() => {
          // Hide loading state
          submitButton.classList.remove("loading")
          submitButton.disabled = false

          // Show success message
          formSuccessMessage.classList.add("active")

          // Reset form
          contactForm.reset()
          formFields.forEach((field) => {
            field.classList.remove("success")
          })
        }, 2000)
      } else {
        // Scroll to the first error
        const firstError = contactForm.querySelector(".error")
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" })
          firstError.focus()
        }
      }
    })

    // Send another message button
    if (sendAnotherBtn) {
      sendAnotherBtn.addEventListener("click", () => {
        formSuccessMessage.classList.remove("active")
      })
    }
  }

  // FAQ accordion
  const faqItems = document.querySelectorAll(".faq-item")

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")

      question.addEventListener("click", () => {
        // Close all other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active")
          }
        })

        // Toggle current item
        item.classList.toggle("active")
      })
    })
  }

  // Initialize Map
  const initMap = () => {
    const mapElement = document.getElementById("contact-map")

    if (mapElement) {
      // Create map centered on New York
      const map = L.map("contact-map").setView([40.7128, -74.006], 13)

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add marker for New York location
      const nyMarker = L.marker([40.7128, -74.006])
        .addTo(map)
        .bindPopup("<strong>Xos Rental - New York</strong><br>123 Rental Avenue, NY 10001")
        .openPopup()

      // Store markers for different locations
      const markers = {
        "new-york": nyMarker,
        "los-angeles": L.marker([34.0522, -118.2437]).bindPopup(
          "<strong>Xos Rental - Los Angeles</strong><br>456 Motor Drive, LA 90210",
        ),
        chicago: L.marker([41.8781, -87.6298]).bindPopup(
          "<strong>Xos Rental - Chicago</strong><br>789 Lake Street, Chicago 60601",
        ),
        miami: L.marker([25.7617, -80.1918]).bindPopup(
          "<strong>Xos Rental - Miami</strong><br>101 Ocean Drive, Miami 33139",
        ),
      }

      // Location tabs functionality
      const locationTabs = document.querySelectorAll(".location-tab")
      const locationDetails = document.querySelectorAll(".location-detail")

      if (locationTabs.length > 0) {
        locationTabs.forEach((tab) => {
          tab.addEventListener("click", () => {
            // Remove active class from all tabs
            locationTabs.forEach((t) => t.classList.remove("active"))

            // Add active class to clicked tab
            tab.classList.add("active")

            // Get location data
            const location = tab.getAttribute("data-location")
            const lat = Number.parseFloat(tab.getAttribute("data-lat"))
            const lng = Number.parseFloat(tab.getAttribute("data-lng"))

            // Update map view
            map.setView([lat, lng], 13)

            // Remove all markers from map
            Object.values(markers).forEach((marker) => {
              map.removeLayer(marker)
            })

            // Add selected marker to map
            markers[location].addTo(map).openPopup()

            // Update location details
            locationDetails.forEach((detail) => {
              detail.classList.remove("active")
              if (detail.getAttribute("data-location") === location) {
                detail.classList.add("active")
              }
            })
          })
        })
      }
    }
  }

  // Initialize map
  initMap()

  // Animated text reveal
  const animateTextElements = document.querySelectorAll(".animated-text")

  if (animateTextElements.length > 0) {
    animateTextElements.forEach((element) => {
      const text = element.textContent
      element.textContent = ""

      for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span")
        span.textContent = text[i]
        span.style.opacity = "0"
        span.style.transition = `opacity 0.1s ease ${i * 0.05}s`
        element.appendChild(span)
      }

      setTimeout(() => {
        Array.from(element.children).forEach((span) => {
          span.style.opacity = "1"
        })
      }, 500)
    })
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const emailInput = newsletterForm.querySelector("input[type='email']")
      const emailValue = emailInput.value.trim()

      // Simple email validation
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (emailValue === "" || !emailRegex.test(emailValue.toLowerCase())) {
        // Show error
        emailInput.classList.add("error")

        // Shake animation
        emailInput.style.animation = "shake 0.5s ease"
        setTimeout(() => {
          emailInput.style.animation = ""
        }, 500)
      } else {
        // Show success
        const submitButton = newsletterForm.querySelector("button[type='submit']")
        submitButton.classList.add("loading")
        submitButton.disabled = true

        // Simulate submission
        setTimeout(() => {
          // Create success message
          const successMessage = document.createElement("div")
          successMessage.className = "newsletter-success"
          successMessage.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <p>Thank you for subscribing to our newsletter!</p>
          `
          successMessage.style.cssText = `
            background-color: rgba(40, 167, 69, 0.1);
            color: #28a745;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 20px;
            animation: fadeIn 0.5s ease;
          `

          // Replace form with success message
          newsletterForm.style.display = "none"
          newsletterForm.parentNode.appendChild(successMessage)
        }, 1500)
      }
    })
  }

  // Add shake animation
  const style = document.createElement("style")
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `
  document.head.appendChild(style)

  // Smooth scrolling for anchor links
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]')

  if (smoothScrollLinks.length > 0) {
    smoothScrollLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href")

        if (href !== "#") {
          e.preventDefault()

          const targetElement = document.querySelector(href)
          if (targetElement) {
            const headerHeight = document.querySelector("header").offsetHeight
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            })
          }
        }
      })
    })
  }

  // Back to top button
  const backToTopButton = document.querySelector(".back-to-top")

  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("active")
      } else {
        backToTopButton.classList.remove("active")
      }
    })

    backToTopButton.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
})
