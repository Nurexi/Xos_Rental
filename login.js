document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const tabBtns = document.querySelectorAll(".tab-btn")
  const switchFormLinks = document.querySelectorAll(".switch-form")
  const togglePasswordBtns = document.querySelectorAll(".toggle-password")
  const passwordInputs = document.querySelectorAll('input[type="password"]')
  const signupPassword = document.getElementById("signup-password")
  const signupConfirmPassword = document.getElementById("signup-confirm-password")

  // Check URL parameters for direct signup access
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("signup") === "true") {
    showForm("signup")
  }

  // Tab Button Click Event
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const formType = this.getAttribute("data-form")
      showForm(formType)
    })
  })

  // Switch Form Links Click Event
  switchFormLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetForm = this.getAttribute("data-target")
      showForm(targetForm)
    })
  })

  // Toggle Password Visibility
  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.previousElementSibling
      const icon = this.querySelector("i")

      if (input.type === "password") {
        input.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        input.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })

  // Password Strength Indicator
  if (signupPassword) {
    // Create password strength elements
    const strengthContainer = document.createElement("div")
    strengthContainer.className = "password-strength"

    const strengthMeter = document.createElement("div")
    strengthMeter.className = "strength-meter"

    const strengthText = document.createElement("div")
    strengthText.className = "strength-text"

    strengthContainer.appendChild(strengthMeter)
    signupPassword.parentElement.parentElement.appendChild(strengthContainer)
    signupPassword.parentElement.parentElement.appendChild(strengthText)

    // Password input event
    signupPassword.addEventListener("input", function () {
      const password = this.value
      const strength = checkPasswordStrength(password)

      // Update strength meter
      strengthMeter.className = "strength-meter"
      strengthText.className = "strength-text"

      if (password.length === 0) {
        strengthMeter.style.width = "0"
        strengthText.textContent = ""
      } else {
        switch (strength) {
          case 1:
            strengthMeter.classList.add("weak")
            strengthText.classList.add("weak")
            strengthText.textContent = "Weak"
            break
          case 2:
            strengthMeter.classList.add("medium")
            strengthText.classList.add("medium")
            strengthText.textContent = "Medium"
            break
          case 3:
            strengthMeter.classList.add("strong")
            strengthText.classList.add("strong")
            strengthText.textContent = "Strong"
            break
          case 4:
            strengthMeter.classList.add("very-strong")
            strengthText.classList.add("very-strong")
            strengthText.textContent = "Very Strong"
            break
        }
      }
    })
  }

  // Form Validation
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const email = document.getElementById("login-email")
    const password = document.getElementById("login-password")
    let isValid = true

    // Reset error messages
    resetErrors()

    // Validate email
    if (!validateEmail(email.value)) {
      showError(email, "Please enter a valid email address")
      isValid = false
    }

    // Validate password
    if (password.value.trim() === "") {
      showError(password, "Password is required")
      isValid = false
    }

    if (isValid) {
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      submitBtn.classList.add("loading")

      // Simulate API call
      setTimeout(() => {
        submitBtn.classList.remove("loading")

        // Show success message
        showToast("Success", "Login successful! Redirecting...", "success")

        // Redirect after a delay
        setTimeout(() => {
          window.location.href = "index.html"
        }, 2000)
      }, 1500)
    } else {
      // Shake the form for invalid input
      this.classList.add("shake")
      setTimeout(() => {
        this.classList.remove("shake")
      }, 600)
    }
  })

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const name = document.getElementById("signup-name")
    const email = document.getElementById("signup-email")
    const password = document.getElementById("signup-password")
    const confirmPassword = document.getElementById("signup-confirm-password")
    const terms = document.getElementById("terms")
    let isValid = true

    // Reset error messages
    resetErrors()

    // Validate name
    if (name.value.trim() === "") {
      showError(name, "Name is required")
      isValid = false
    }

    // Validate email
    if (!validateEmail(email.value)) {
      showError(email, "Please enter a valid email address")
      isValid = false
    }

    // Validate password
    if (password.value.trim() === "") {
      showError(password, "Password is required")
      isValid = false
    } else if (password.value.length < 8) {
      showError(password, "Password must be at least 8 characters")
      isValid = false
    }

    // Validate confirm password
    if (confirmPassword.value !== password.value) {
      showError(confirmPassword, "Passwords do not match")
      isValid = false
    }

    // Validate terms
    if (!terms.checked) {
      showError(terms, "You must agree to the Terms of Service")
      isValid = false
    }

    if (isValid) {
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      submitBtn.classList.add("loading")

      // Simulate API call
      setTimeout(() => {
        submitBtn.classList.remove("loading")

        // Show success message
        showToast("Success", "Account created successfully! Redirecting...", "success")

        // Redirect after a delay
        setTimeout(() => {
          window.location.href = "index.html"
        }, 2000)
      }, 1500)
    } else {
      // Shake the form for invalid input
      this.classList.add("shake")
      setTimeout(() => {
        this.classList.remove("shake")
      }, 600)
    }
  })

  // Helper Functions
  function showForm(formType) {
    const activeForm = document.querySelector(".auth-form.active")
    const targetForm = formType === "login" ? loginForm : signupForm

    // Update tab buttons
    tabBtns.forEach((btn) => {
      if (btn.getAttribute("data-form") === formType) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })

    // Determine animation direction
    let outAnimation, inAnimation
    if (activeForm === loginForm && targetForm === signupForm) {
      outAnimation = "slide-out-left"
      inAnimation = "slide-in-right"
    } else if (activeForm === signupForm && targetForm === loginForm) {
      outAnimation = "slide-out-right"
      inAnimation = "slide-in-left"
    } else {
      // Default animations if no active form
      outAnimation = "slide-out-left"
      inAnimation = "slide-in-right"
    }

    // Animate form transition
    if (activeForm) {
      activeForm.classList.add(outAnimation)

      setTimeout(() => {
        activeForm.classList.remove("active", outAnimation)
        targetForm.classList.add("active", inAnimation)

        setTimeout(() => {
          targetForm.classList.remove(inAnimation)
        }, 500)
      }, 400)
    } else {
      targetForm.classList.add("active")
    }

    // Reset forms and errors
    loginForm.reset()
    signupForm.reset()
    resetErrors()
  }

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  function showError(input, message) {
    const formGroup = input.closest(".form-group")
    const errorElement = formGroup.querySelector(".error-message")

    input.classList.add("error")
    errorElement.textContent = message
    errorElement.classList.add("show")
  }

  function resetErrors() {
    const errorInputs = document.querySelectorAll(".error")
    const errorMessages = document.querySelectorAll(".error-message")

    errorInputs.forEach((input) => input.classList.remove("error"))
    errorMessages.forEach((message) => {
      message.textContent = ""
      message.classList.remove("show")
    })
  }

  function checkPasswordStrength(password) {
    // 0: no password, 1: weak, 2: medium, 3: strong, 4: very strong
    if (password.length === 0) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1

    // Character variety check
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return Math.min(4, Math.floor(strength / 2))
  }

  function showToast(title, message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.className = "toast-container"
      document.body.appendChild(toastContainer)
    }

    // Create toast element
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    // Set icon based on type
    let icon
    switch (type) {
      case "success":
        icon = "fa-check-circle"
        break
      case "error":
        icon = "fa-exclamation-circle"
        break
      default:
        icon = "fa-info-circle"
    }

    // Create toast content
    toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `

    // Add toast to container
    toastContainer.appendChild(toast)

    // Show toast with animation
    setTimeout(() => {
      toast.classList.add("show")
    }, 10)

    // Add close button event
    const closeBtn = toast.querySelector(".toast-close")
    closeBtn.addEventListener("click", () => {
      toast.classList.remove("show")
      setTimeout(() => {
        toast.remove()
      }, 300)
    })

    // Auto close after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove("show")
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  // Initialize any additional features
  function initializeAdditionalFeatures() {
    // Add floating labels effect
    const inputs = document.querySelectorAll(".input-group input")
    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused")
      })

      input.addEventListener("blur", function () {
        if (this.value === "") {
          this.parentElement.classList.remove("focused")
        }
      })

      // Check if input already has value (e.g., on page refresh)
      if (input.value !== "") {
        input.parentElement.classList.add("focused")
      }
    })
  }

  // Call initialization function
  initializeAdditionalFeatures()
})
