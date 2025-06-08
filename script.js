document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // === Initializations ===
  // ======================
  
  // Initialize AOS animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  // Initialize Swipers
  initSwipers();

  // ======================
  // === Core Functions ===
  // ======================

  /**
   * Initialize all Swiper sliders
   */
  function initSwipers() {
    // Testimonial Swiper
    if (document.querySelector(".testimonial-swiper")) {
      new Swiper(".testimonial-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    }

    // Featured Vehicles Swiper
    if (document.querySelector(".featured-swiper")) {
      new Swiper(".featured-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    }
  }

  // ======================
  // === UI Components ===
  // ======================

  // Preloader
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    });
  }

  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // Smooth Scrolling
  setupSmoothScrolling();

  /**
   * Setup smooth scrolling for navigation links
   */
  function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        if (href !== "#") {
          e.preventDefault();
          scrollToSection(href);
        }
      });
    });
  }

  /**
   * Scroll to section with offset for header
   * @param {string} selector - The selector to scroll to
   */
  function scrollToSection(selector) {
    const targetElement = document.querySelector(selector);
    if (targetElement) {
      const headerHeight = document.querySelector("header").offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (navLinks && navLinks.classList.contains("active")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      }
    }
  }

  /**
   * Scroll to category section
   * @param {string} categoryId - The ID of the category section to scroll to
   */
  function scrollToCategory(categoryId) {
    const section = document.getElementById(categoryId);
    if (section) {
      const headerHeight = document.querySelector("header").offsetHeight;
      const targetPosition = section.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      // Close mobile menu if open
      const navLinks = document.querySelector(".nav-links");
      const hamburger = document.querySelector(".hamburger");
      if (navLinks && navLinks.classList.contains("active")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      }
    }
  }

  // Add click event listeners to category cards for better mobile touch support
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      scrollToCategory(`${category}-cars`);
    });
  });

  // Vehicle Filtering
  setupVehicleFiltering();

  /**
   * Setup vehicle filtering functionality
   */
  function setupVehicleFiltering() {
    const filterButtons = document.querySelectorAll(".featured-tabs .tab-btn, .category-tabs .tab-btn");

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons in the same tab group
        const tabGroup = this.closest(".featured-tabs, .category-tabs");
        const buttons = tabGroup.querySelectorAll(".tab-btn");
        buttons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        // Get filter attribute (data-filter or data-category)
        const filterAttr = this.hasAttribute("data-filter") ? "data-filter" : "data-category";
        const filterValue = this.getAttribute(filterAttr);

        // Get corresponding attribute in cards
        const cardAttr = filterAttr === "data-filter" ? "data-type" : "data-category";

        // Filter vehicles
        filterVehicleCards(filterValue, cardAttr);
      });
    });
  }

  /**
   * Filter vehicle cards based on criteria
   * @param {string} filterValue - The value to filter by
   * @param {string} cardAttr - The attribute to check on cards
   */
  function filterVehicleCards(filterValue, cardAttr) {
    const vehicleCards = document.querySelectorAll(".vehicle-card");

    vehicleCards.forEach((card) => {
      if (
        filterValue === "all" ||
        card.getAttribute(cardAttr) === filterValue ||
        (card.getAttribute(cardAttr) && card.getAttribute(cardAttr).includes(filterValue))
      ) {
        card.style.display = "";
        card.style.animation = "fadeIn 0.5s ease forwards";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Pricing Plan Toggle
  setupPricingTabs();

  /**
   * Setup pricing plan toggle functionality
   */
  function setupPricingTabs() {
    const pricingTabs = document.querySelectorAll(".pricing-tabs .tab-btn");
    const prices = document.querySelectorAll(".price");

    if (pricingTabs.length === 0) return;

    pricingTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        pricingTabs.forEach((t) => t.classList.remove("active"));

        // Add active class to clicked tab
        this.classList.add("active");

        const planType = this.getAttribute("data-plan");

        // Update prices and periods
        updatePrices(planType, prices);
      });
    });
  }

  /**
   * Update prices based on selected plan type
   * @param {string} planType - The plan type (daily, weekly, monthly)
   * @param {NodeList} prices - The price elements to update
   */
  function updatePrices(planType, prices) {
    prices.forEach((price) => {
      const amount = price.getAttribute(`data-${planType}`);
      const amountElement = price.querySelector(".amount");
      const periodElement = price.querySelector(".period");

      if (amount && amountElement && periodElement) {
        // Add animation
        amountElement.style.animation = "fadeIn 0.5s ease";

        // Update content
        amountElement.textContent = amount;

        // Update period text
        const periodText = {
          daily: "/day",
          weekly: "/week",
          monthly: "/month",
        }[planType];

        periodElement.textContent = periodText;

        // Remove animation after it completes
        setTimeout(() => {
          amountElement.style.animation = "";
        }, 500);
      }
    });
  }

  // FAQ Accordion
  setupFAQAccordion();

  /**
   * Setup FAQ accordion functionality
   */
  function setupFAQAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");

      question.addEventListener("click", () => {
        // Close all other items
        closeOtherFAQItems(item);

        // Toggle current item
        toggleFAQItem(item);
      });
    });
  }

  /**
   * Close all FAQ items except the specified one
   * @param {HTMLElement} currentItem - The item to keep open
   */
  function closeOtherFAQItems(currentItem) {
    document.querySelectorAll(".faq-item").forEach((item) => {
      if (item !== currentItem && item.classList.contains("active")) {
        item.classList.remove("active");
        const answer = item.querySelector(".faq-answer");
        answer.style.maxHeight = null;
      }
    });
  }

  /**
   * Toggle FAQ item open/close state
   * @param {HTMLElement} item - The FAQ item to toggle
   */
  function toggleFAQItem(item) {
    item.classList.toggle("active");

    // Add slide animation
    const answer = item.querySelector(".faq-answer");
    if (item.classList.contains("active")) {
      answer.style.display = "block";
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
      setTimeout(() => {
        answer.style.display = "none";
      }, 300);
    }
  }

  // Form Validation
  setupFormValidation();

  /**
   * Setup form validation for contact and search forms
   */
  function setupFormValidation() {
    const contactForm = document.getElementById("contact-form");
    const searchForm = document.getElementById("search-form");

    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        validateContactForm(contactForm);
      });
    }

    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        validateSearchForm(searchForm);
      });
    }
  }

  /**
   * Validate contact form
   * @param {HTMLFormElement} form - The contact form element
   */
  function validateContactForm(form) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    let isValid = true;

    // Validate name
    if (!name.value.trim()) {
      isValid = false;
      highlightError(name);
    } else {
      removeError(name);
    }

    // Validate email
    if (!email.value.trim() || !isValidEmail(email.value)) {
      isValid = false;
      highlightError(email);
    } else {
      removeError(email);
    }

    // Validate message
    if (!message.value.trim()) {
      isValid = false;
      highlightError(message);
    } else {
      removeError(message);
    }

    // If valid, show success message
    if (isValid) {
      showMessage("Your message has been sent successfully!", "success");
      form.reset();
    }
  }

  /**
   * Validate search form
   * @param {HTMLFormElement} form - The search form element
   */
  function validateSearchForm(form) {
    const pickupLocation = document.getElementById("pickup-location");
    const pickupDate = document.getElementById("pickup-date");
    const returnDate = document.getElementById("return-date");

    let isValid = true;

    // Validate pickup location
    if (!pickupLocation.value.trim()) {
      isValid = false;
      highlightError(pickupLocation);
    } else {
      removeError(pickupLocation);
    }

    // Validate pickup date
    if (!pickupDate.value) {
      isValid = false;
      highlightError(pickupDate);
    } else {
      removeError(pickupDate);
    }

    // Validate return date
    if (!returnDate.value) {
      isValid = false;
      highlightError(returnDate);
    } else if (new Date(returnDate.value) <= new Date(pickupDate.value)) {
      isValid = false;
      highlightError(returnDate);
      showMessage("Return date must be after pickup date", "error");
    } else {
      removeError(returnDate);
    }

    // If valid, redirect to vehicles section
    if (isValid) {
      const vehiclesSection = document.querySelector("#vehicles");
      if (vehiclesSection) {
        scrollToSection("#vehicles");
        showMessage("Vehicles found for your search criteria!", "success");
      }
    }
  }

  /**
   * Highlight form field with error
   * @param {HTMLElement} input - The input element to highlight
   */
  function highlightError(input) {
    input.style.borderColor = "#dc3545";
    input.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.2)";

    // Add error message
    const parent = input.parentElement;
    let errorMessage = parent.querySelector(".error-message");

    if (!errorMessage) {
      errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.style.color = "#dc3545";
      errorMessage.style.fontSize = "12px";
      errorMessage.style.marginTop = "5px";
      parent.appendChild(errorMessage);
    }

    errorMessage.textContent = input.dataset.errorMessage || "This field is required";
  }

  /**
   * Remove error highlighting from form field
   * @param {HTMLElement} input - The input element to clear
   */
  function removeError(input) {
    input.style.borderColor = "";
    input.style.boxShadow = "";

    // Remove error message
    const parent = input.parentElement;
    const errorMessage = parent.querySelector(".error-message");
    if (errorMessage) {
      parent.removeChild(errorMessage);
    }
  }

  /**
   * Check if email is valid
   * @param {string} email - The email to validate
   * @returns {boolean} - True if email is valid
   */
  function isValidEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Show message to user
   * @param {string} message - The message to display
   * @param {string} type - The message type (success, error)
   */
  function showMessage(message, type) {
    // Create message element
    const messageElement = document.createElement("div");
    messageElement.className = `alert alert-${type}`;
    messageElement.textContent = message;
    messageElement.style.padding = "10px 15px";
    messageElement.style.borderRadius = "4px";
    messageElement.style.marginBottom = "15px";
    messageElement.style.animation = "fadeIn 0.3s ease";

    if (type === "success") {
      messageElement.style.backgroundColor = "#d4edda";
      messageElement.style.color = "#155724";
      messageElement.style.border = "1px solid #c3e6cb";
    } else if (type === "error") {
      messageElement.style.backgroundColor = "#f8d7da";
      messageElement.style.color = "#721c24";
      messageElement.style.border = "1px solid #f5c6cb";
    }

    // Find form to append message to
    const form = document.querySelector(".contact-form") || document.querySelector(".search-container");

    if (form) {
      // Insert at top of form
      form.insertBefore(messageElement, form.firstChild);

      // Remove after 5 seconds
      setTimeout(() => {
        messageElement.style.opacity = "0";
        setTimeout(() => {
          messageElement.remove();
        }, 300);
      }, 5000);
    }
  }

  // Sticky Header
  setupStickyHeader();

  /**
   * Setup sticky header functionality
   */
  function setupStickyHeader() {
    const header = document.querySelector("header");
    if (!header) return;

    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 50) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }

      lastScrollTop = scrollTop;
    });
  }

  // Back to Top Button
  setupBackToTopButton();

  /**
   * Setup back to top button functionality
   */
  function setupBackToTopButton() {
    const backToTopButton = document.querySelector(".back-to-top");
    if (!backToTopButton) return;

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("active");
      } else {
        backToTopButton.classList.remove("active");
      }
    });

    backToTopButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Cookie Consent
  setupCookieConsent();

  /**
   * Setup cookie consent functionality
   */
  function setupCookieConsent() {
    const cookieConsent = document.querySelector(".cookie-consent");
    const cookieAcceptBtn = document.querySelector(".cookie-accept-btn");
    const cookieSettingsBtn = document.querySelector(".cookie-settings-btn");

    if (!cookieConsent || !cookieAcceptBtn) return;

    // Check if user has already accepted cookies
    if (!localStorage.getItem("cookiesAccepted")) {
      // Show cookie consent after 2 seconds
      setTimeout(() => {
        cookieConsent.classList.add("active");
      }, 2000);
    }

    cookieAcceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      cookieConsent.classList.remove("active");
    });

    if (cookieSettingsBtn) {
      cookieSettingsBtn.addEventListener("click", () => {
        alert("Cookie settings functionality would be implemented here");
      });
    }
  }

  // Modals
  setupModals();

  /**
   * Setup modal functionality (quick view, compare, share, etc.)
   */
  function setupModals() {
    // Quick View Modal
    setupQuickViewModal();

    // Compare Modal
    setupCompareModal();

    // Share Modal
    setupShareModal();

    // Video Modal
    setupVideoModal();

    // Close modals
    setupModalCloseHandlers();
  }

  /**
   * Setup quick view modal functionality
   */
  function setupQuickViewModal() {
    const quickViewButtons = document.querySelectorAll(".quick-view, .quick-view-btn");
    const quickViewModal = document.getElementById("quickViewModal");

    if (quickViewButtons.length === 0 || !quickViewModal) return;

    quickViewButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        if (e) e.preventDefault();

        const card = this.closest(".vehicle-card, .product-card");
        const modalBody = quickViewModal.querySelector(".modal-body");

        // Show loading state
        modalBody.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
        quickViewModal.style.display = "block";
        document.body.style.overflow = "hidden";

        // Simulate loading (replace with actual data fetch)
        setTimeout(() => {
          populateQuickViewModal(card, modalBody);
        }, 800);
      });
    });
  }

  /**
   * Populate quick view modal with content
   * @param {HTMLElement} card - The card element to get data from
   * @param {HTMLElement} modalBody - The modal body element to populate
   */
  function populateQuickViewModal(card, modalBody) {
    const isProduct = card.classList.contains("product-card");

    if (isProduct) {
      // Product quick view
      const productImage = card.querySelector(".product-image img").src;
      const productTitle = card.querySelector(".product-title").textContent;
      const productPrice = card.querySelector(".product-price").textContent;
      const productRating = card.querySelector(".product-rating").innerHTML;

      modalBody.innerHTML = `
        <div class="quick-view-grid">
          <div class="quick-view-image">
            <img src="${productImage}" alt="${productTitle}">
          </div>
          <div class="quick-view-details">
            <h2>${productTitle}</h2>
            <div class="quick-view-rating">${productRating}</div>
            <div class="quick-view-price">${productPrice}</div>
            <p class="quick-view-description">High-quality auto spare part designed for optimal performance and durability. Compatible with most vehicle models.</p>
            <div class="quick-view-actions">
              <button class="btn btn-primary full-width">Add to Cart</button>
              <button class="btn btn-secondary full-width" style="margin-top: 10px;">Add to Wishlist</button>
            </div>
          </div>
        </div>
      `;
    } else {
      // Vehicle quick view
      modalBody.innerHTML = `
        <div class="modal-grid">
          <div class="modal-image">
            <img src="${card.querySelector("img").src}" alt="${card.querySelector("h3").textContent}">
          </div>
          <div class="modal-details">
            <h2>${card.querySelector("h3").textContent}</h2>
            <div class="rating">
              ${card.querySelector(".rating").innerHTML}
            </div>
            <div class="modal-specs">
              ${card.querySelector(".vehicle-specs").innerHTML}
            </div>
            <div class="vehicle-description">
              <p>${card.querySelector(".vehicle-description")?.textContent || ""}</p>
            </div>
            <div class="modal-price">
              ${card.querySelector(".vehicle-price").innerHTML}
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary full-width" style="margin-top: 10px;">Add to Compare</button>
            </div>
          </div>
        </div>
      `;

      // Update book button
      const bookButton = modalBody.querySelector(".btn-primary");
      if (bookButton) {
        bookButton.className = "btn btn-primary full-width";
      }
    }
  }

  /**
   * Setup compare modal functionality
   */
  function setupCompareModal() {
    const compareButtons = document.querySelectorAll(".compare-btn");
    const compareModal = document.getElementById("compareModal");

    if (compareButtons.length === 0 || !compareModal) return;

    const compareList = [];

    compareButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent triggering quick view

        const card = this.closest(".vehicle-card");
        const vehicleName = card.querySelector("h3").textContent;
        const vehicleImage = card.querySelector("img").src;

        // Check if vehicle is already in compare list
        const existingIndex = compareList.findIndex((item) => item.name === vehicleName);

        if (existingIndex === -1) {
          // Add to compare list if not already there
          if (compareList.length < 3) {
            compareList.push({
              name: vehicleName,
              image: vehicleImage,
              specs: Array.from(card.querySelectorAll(".spec-item")).map((spec) => {
                return {
                  icon: spec.querySelector("i").className,
                  label: spec.querySelector("span").textContent,
                };
              }),
              price: card.querySelector(".vehicle-price h4").textContent,
            });

            // Update button style
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.backgroundColor = "#28a745";
            button.style.color = "white";

            // Show notification
            showToast(`${vehicleName} added to comparison`);
          } else {
            showToast("You can compare up to 3 vehicles at a time", "warning");
          }
        } else {
          // Remove from compare list
          compareList.splice(existingIndex, 1);

          // Reset button style
          button.innerHTML = '<i class="fas fa-exchange-alt"></i>';
          button.style.backgroundColor = "";
          button.style.color = "";

          showToast(`${vehicleName} removed from comparison`);
        }

        // Update compare button state
        updateCompareButtonState(compareList);
      });
    });

    /**
     * Update compare floating button state
     * @param {Array} compareList - The current comparison list
     */
    function updateCompareButtonState(compareList) {
      const compareBtn = document.querySelector(".compare-floating-btn");

      if (compareList.length > 0) {
        if (!compareBtn) {
          createCompareButton(compareList.length);
        } else {
          compareBtn.innerHTML = `Compare Vehicles (${compareList.length})`;
        }
      } else if (compareBtn) {
        compareBtn.remove();
      }
    }

    /**
     * Create floating compare button
     * @param {number} count - Number of items in comparison
     */
    function createCompareButton(count) {
      const btn = document.createElement("button");
      btn.className = "compare-floating-btn";
      btn.innerHTML = `Compare Vehicles (${count})`;
      btn.style.position = "fixed";
      btn.style.bottom = "30px";
      btn.style.left = "30px";
      btn.style.backgroundColor = "var(--primary-color)";
      btn.style.color = "white";
      btn.style.padding = "12px 20px";
      btn.style.borderRadius = "30px";
      btn.style.border = "none";
      btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      btn.style.cursor = "pointer";
      btn.style.zIndex = "999";
      btn.style.transition = "all 0.3s ease";
      document.body.appendChild(btn);

      btn.addEventListener("click", () => openCompareModal(compareList));
      btn.addEventListener("mouseover", () => {
        btn.style.backgroundColor = "var(--primary-dark)";
        btn.style.transform = "translateY(-5px)";
        btn.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.2)";
      });
      btn.addEventListener("mouseout", () => {
        btn.style.backgroundColor = "var(--primary-color)";
        btn.style.transform = "translateY(0)";
        btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      });
    }

    /**
     * Open compare modal with current comparison
     * @param {Array} compareList - The current comparison list
     */
    function openCompareModal(compareList) {
      if (compareList.length < 2) {
        showToast("Please select at least 2 vehicles to compare", "warning");
        return;
      }

      const compareModal = document.getElementById("compareModal");
      const compareVehiclesContainer = compareModal.querySelector(".compare-vehicles");
      const compareTableBody = compareModal.querySelector(".compare-table tbody");

      // Clear previous content
      compareVehiclesContainer.innerHTML = "";
      compareTableBody.innerHTML = "";

      // Add vehicle headers
      const headerRow = document.createElement("tr");
      headerRow.innerHTML = "<th>Feature</th>";

      compareList.forEach((vehicle) => {
        // Add to vehicles container
        const vehicleDiv = document.createElement("div");
        vehicleDiv.className = "compare-vehicle";
        vehicleDiv.innerHTML = `
          <img src="${vehicle.image}" alt="${vehicle.name}">
          <h4>${vehicle.name}</h4>
          <p>${vehicle.price}</p>
        `;
        compareVehiclesContainer.appendChild(vehicleDiv);

        // Add to table header
        headerRow.innerHTML += `<th>${vehicle.name}</th>`;
      });

      // Add header row to table
      const thead = compareModal.querySelector(".compare-table thead");
      thead.innerHTML = "";
      thead.appendChild(headerRow);

      // Create rows for each specification
      const allSpecs = [];

      // Collect all unique specs
      compareList.forEach((vehicle) => {
        vehicle.specs.forEach((spec) => {
          if (!allSpecs.includes(spec.label)) {
            allSpecs.push(spec.label);
          }
        });
      });

      // Create a row for each spec
      allSpecs.forEach((specLabel) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${specLabel}</td>`;

        // Add spec value for each vehicle
        compareList.forEach((vehicle) => {
          const spec = vehicle.specs.find((s) => s.label === specLabel);
          if (spec) {
            row.innerHTML += `<td><i class="${spec.icon}"></i> ${spec.label}</td>`;
          } else {
            row.innerHTML += "<td>-</td>";
          }
        });

        compareTableBody.appendChild(row);
      });

      // Add price row
      const priceRow = document.createElement("tr");
      priceRow.innerHTML = "<td><strong>Price</strong></td>";

      compareList.forEach((vehicle) => {
        priceRow.innerHTML += `<td><strong>${vehicle.price}</strong></td>`;
      });

      compareTableBody.appendChild(priceRow);

      // Show modal
      compareModal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  }

  /**
   * Setup share modal functionality
   */
  function setupShareModal() {
    const shareButtons = document.querySelectorAll(".share-btn");
    const shareModal = document.getElementById("shareModal");

    if (shareButtons.length === 0 || !shareModal) return;

    shareButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent triggering quick view

        const card = this.closest(".vehicle-card");
        const vehicleName = card.querySelector("h3").textContent;
        const vehicleImage = card.querySelector("img").src;

        // Populate share modal
        const shareVehicleInfo = shareModal.querySelector(".share-vehicle-info");
        shareVehicleInfo.innerHTML = `
          <img src="${vehicleImage}" alt="${vehicleName}">
          <div>
            <h3>${vehicleName}</h3>
            <p>Share this vehicle with your friends</p>
          </div>
        `;

        // Set share URL
        const shareUrl = document.getElementById("share-url");
        shareUrl.value = `${window.location.origin}${window.location.pathname}?vehicle=${encodeURIComponent(vehicleName)}`;

        // Show modal
        shareModal.style.display = "block";
        document.body.style.overflow = "hidden";
      });
    });

    // Copy link functionality
    const copyLinkBtn = document.querySelector(".copy-link-btn");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", function () {
        const shareUrl = document.getElementById("share-url");
        shareUrl.select();
        document.execCommand("copy");

        // Show copied message
        this.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
      });
    }

    // Share options functionality
    const shareOptions = document.querySelectorAll(".share-option");
    shareOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault();

        const platform = this.getAttribute("data-platform");
        const url = document.getElementById("share-url").value;
        const text = `Check out this awesome vehicle on WheelsOnDemand!`;

        let shareUrl;

        switch (platform) {
          case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
          case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
          case "whatsapp":
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
            break;
          case "email":
            shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
            break;
        }

        if (shareUrl) {
          window.open(shareUrl, "_blank");
        }
      });
    });
  }

  /**
   * Setup video modal functionality
   */
  function setupVideoModal() {
    const videoButtons = document.querySelectorAll(".video-btn");
    const videoModal = document.getElementById("videoModal");

    if (videoButtons.length === 0 || !videoModal) return;

    videoButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent triggering quick view

        const videoSrc = this.getAttribute("data-video");
        const vehicle = this.closest(".vehicle-card").querySelector("h3").textContent;

        // Set modal title
        videoModal.querySelector(".modal-header h2").textContent = `${vehicle} Video`;

        // Set video source
        const video = videoModal.querySelector("video");
        video.querySelector("source").src = videoSrc;
        video.load();

        // Show modal
        videoModal.style.display = "block";
        document.body.style.overflow = "hidden";
      });
    });
  }

  /**
   * Setup modal close handlers
   */
  function setupModalCloseHandlers() {
    const closeModalButtons = document.querySelectorAll(".close-modal");

    if (closeModalButtons.length === 0) return;

    closeModalButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const modal = this.closest(".modal");
        modal.style.display = "none";
        document.body.style.overflow = ""; // Re-enable scrolling
      });
    });

    // Close when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
        document.body.style.overflow = ""; // Re-enable scrolling
      }
    });
  }

  // Favorites Functionality
  setupFavorites();

  /**
   * Setup favorites functionality
   */
  function setupFavorites() {
    const favoriteButtons = document.querySelectorAll(".favorite-btn");

    if (favoriteButtons.length === 0) return;

    // Load favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Update favorite buttons state
    updateFavoriteButtonsState(favorites);

    favoriteButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent triggering quick view

        const card = this.closest(".vehicle-card");
        const vehicleName = card.querySelector("h3").textContent;

        // Check if vehicle is already in favorites
        const existingIndex = favorites.findIndex((item) => item === vehicleName);

        if (existingIndex === -1) {
          // Add to favorites
          favorites.push(vehicleName);
          localStorage.setItem("favorites", JSON.stringify(favorites));

          // Update button
          this.innerHTML = '<i class="fas fa-heart"></i>';
          this.style.backgroundColor = "#dc3545";
          this.style.color = "white";

          showToast(`${vehicleName} added to favorites`);
        } else {
          // Remove from favorites
          favorites.splice(existingIndex, 1);
          localStorage.setItem("favorites", JSON.stringify(favorites));

          // Update button
          this.innerHTML = '<i class="far fa-heart"></i>';
          this.style.backgroundColor = "";
          this.style.color = "";

          showToast(`${vehicleName} removed from favorites`);
        }

        // Update favorites count in header
        updateFavoritesCount(favorites);
      });
    });
  }

  /**
   * Update favorite buttons state
   * @param {Array} favorites - The current favorites list
   */
  function updateFavoriteButtonsState(favorites) {
    const favoriteButtons = document.querySelectorAll(".favorite-btn");

    favoriteButtons.forEach((button) => {
      const card = button.closest(".vehicle-card");
      const vehicleName = card.querySelector("h3").textContent;

      if (favorites.includes(vehicleName)) {
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.backgroundColor = "#dc3545";
        button.style.color = "white";
      }
    });

    // Update favorites count in header
    updateFavoritesCount(favorites);
  }

  /**
   * Update favorites count in header
   * @param {Array} favorites - The current favorites list
   */
  function updateFavoritesCount(favorites) {
    const favoritesCount = document.querySelector(".favorites-count");

    if (favorites.length > 0) {
      if (!favoritesCount) {
        createFavoritesCountElement(favorites.length);
      } else {
        favoritesCount.querySelector("span").textContent = favorites.length;
      }
    } else if (favoritesCount) {
      favoritesCount.remove();
    }
  }

  /**
   * Create favorites count element in header
   * @param {number} count - Number of favorites
   */
  function createFavoritesCountElement(count) {
    const headerCta = document.querySelector(".cta-buttons");

    if (headerCta) {
      const favCount = document.createElement("div");
      favCount.className = "favorites-count";
      favCount.style.display = "flex";
      favCount.style.alignItems = "center";
      favCount.style.gap = "5px";
      favCount.style.cursor = "pointer";
      favCount.style.marginRight = "15px";
      favCount.style.color = "var(--primary-color)";
      favCount.innerHTML = `<i class="fas fa-heart"></i> <span>${count}</span>`;
      headerCta.prepend(favCount);

      favCount.addEventListener("click", () => {
        alert("Favorites functionality would be implemented here");
      });
    }
  }

  // Newsletter Form
  setupNewsletterForm();

  /**
   * Setup newsletter form functionality
   */
  function setupNewsletterForm() {
    const newsletterForms = document.querySelectorAll(".newsletter-form");

    newsletterForms.forEach((form) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && isValidEmail(emailInput.value)) {
          showNewsletterSuccess(this);
        } else if (emailInput) {
          highlightError(emailInput);
          emailInput.dataset.errorMessage = "Please enter a valid email address";
        }
      });
    });
  }

  /**
   * Show newsletter success message
   * @param {HTMLFormElement} form - The newsletter form
   */
  function showNewsletterSuccess(form) {
    const successMessage = document.createElement("div");
    successMessage.className = "alert alert-success";
    successMessage.style.marginTop = "10px";
    successMessage.style.padding = "10px";
    successMessage.style.backgroundColor = "#d4edda";
    successMessage.style.color = "#155724";
    successMessage.style.borderRadius = "4px";
    successMessage.style.opacity = "1";
    successMessage.style.transition = "opacity 0.3s ease";
    successMessage.textContent = "Thank you for subscribing to our newsletter!";

    // Add message after form
    form.parentNode.insertBefore(successMessage, form.nextSibling);

    // Reset form
    form.reset();

    // Remove message after 5 seconds
    setTimeout(() => {
      successMessage.style.opacity = "0";
      setTimeout(() => {
        successMessage.remove();
      }, 300);
    }, 5000);
  }

  // Vehicle Configurator
  setupVehicleConfigurator();

  /**
   * Setup vehicle configurator functionality
   */
  function setupVehicleConfigurator() {
    const vehicleSelect = document.getElementById("vehicle-select");
    const durationRange = document.getElementById("duration-range");
    const durationDays = document.getElementById("duration-days");
    const basePrice = document.getElementById("base-price");
    const featuresPrice = document.getElementById("features-price");
    const durationPrice = document.getElementById("duration-price");
    const totalPrice = document.getElementById("total-price");
    const configuratorImage = document.getElementById("configurator-image");
    const colorOptions = document.querySelectorAll(".color-option");
    const featureCheckboxes = document.querySelectorAll(".feature-checkbox");

    if (!vehicleSelect || !durationRange || !configuratorImage) return;

    // Base prices for vehicles
    const vehiclePrices = {
      porsche: 180,
      tesla: 120,
      ducati: 150,
      "range-rover": 160,
    };

    // Vehicle images
    const vehicleImages = {
      porsche: "https://images.pexels.com/photos/3778769/pexels-photo-3778769.jpeg",
      tesla: "https://images.pexels.com/photos/12317988/pexels-photo-12317988.jpeg",
      ducati: "https://images.pexels.com/photos/2393816/pexels-photo-2393816.jpeg",
      "range-rover": "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
    };

    // Vehicle color variants
    const vehicleColors = {
      porsche: {
        red: "https://images.pexels.com/photos/3778769/pexels-photo-3778769.jpeg",
        blue: "https://images.pexels.com/photos/12795789/pexels-photo-12795789.jpeg",
        silver: "https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg",
        black: "https://images.pexels.com/photos/9866478/pexels-photo-9866478.jpeg",
        white: "https://images.pexels.com/photos/13607080/pexels-photo-13607080.jpeg",
      },
      tesla: {
        red: "https://images.pexels.com/photos/12317988/pexels-photo-12317988.jpeg",
        blue: "https://images.pexels.com/photos/11046326/pexels-photo-11046326.jpeg",
        silver: "https://images.pexels.com/photos/13579366/pexels-photo-13579366.jpeg",
        black: "https://images.pexels.com/photos/13942016/pexels-photo-13942016.jpeg",
        white: "https://images.pexels.com/photos/13835592/pexels-photo-13835592.jpeg",
      },
      ducati: {
        red: "https://images.pexels.com/photos/2393816/pexels-photo-2393816.jpeg",
        black: "https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg",
        white: "https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg",
      },
      "range-rover": {
        silver: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
        black: "https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg",
        white: "https://images.pexels.com/photos/9047361/pexels-photo-9047361.jpeg",
      },
    };

    // Feature prices
    const featurePrices = {
      "premium-sound": 15,
      "leather-seats": 10,
      navigation: 8,
      "driver-assist": 20,
    };

    // Event listeners
    vehicleSelect.addEventListener("change", updateConfigurator);
    durationRange.addEventListener("input", updateConfigurator);

    featureCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateConfigurator);
    });

    colorOptions.forEach((option) => {
      option.addEventListener("click", () => {
        // Remove active class from all color options
        colorOptions.forEach((opt) => opt.classList.remove("active"));

        // Add active class to clicked option
        option.classList.add("active");

        // Update vehicle image with selected color
        const selectedVehicle = vehicleSelect.value;
        const selectedColor = option.getAttribute("data-color");

        if (vehicleColors[selectedVehicle] && vehicleColors[selectedVehicle][selectedColor]) {
          configuratorImage.src = vehicleColors[selectedVehicle][selectedColor];
        }
      });
    });

    // Initial update
    updateConfigurator();

    /**
     * Update configurator based on current selections
     */
    function updateConfigurator() {
      const selectedVehicle = vehicleSelect.value;
      const basePriceValue = vehiclePrices[selectedVehicle];
      const days = Number.parseInt(durationRange.value);

      // Update base price
      basePrice.textContent = `$${basePriceValue}/day`;

      // Update duration
      durationDays.textContent = days;
      durationPrice.textContent = `${days} days`;

      // Calculate features price
      let featuresTotal = 0;
      featureCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          featuresTotal += featurePrices[checkbox.id];
        }
      });
      featuresPrice.textContent = `$${featuresTotal}/day`;

      // Calculate total price
      const totalAmount = (basePriceValue + featuresTotal) * days;
      totalPrice.textContent = `$${totalAmount}`;

      // Update vehicle image
      configuratorImage.src = vehicleImages[selectedVehicle];

      // Update vehicle color (if colors are available for this vehicle)
      const activeColor = document.querySelector(".color-option.active");
      if (activeColor && vehicleColors[selectedVehicle][activeColor.getAttribute("data-color")]) {
        configuratorImage.src = vehicleColors[selectedVehicle][activeColor.getAttribute("data-color")];
      }

      // Show/hide color options based on available colors for the vehicle
      updateColorOptions(selectedVehicle);
    }

    /**
     * Update available color options based on selected vehicle
     * @param {string} selectedVehicle - The currently selected vehicle
     */
    function updateColorOptions(selectedVehicle) {
      colorOptions.forEach((option) => {
        const color = option.getAttribute("data-color");
        const hasColor = vehicleColors[selectedVehicle] && vehicleColors[selectedVehicle][color];

        // Only show color options that are available for the selected vehicle
        option.style.display = hasColor ? "block" : "none";

        // If the currently active color is no longer available, select the first available color
        if (option.classList.contains("active") && !hasColor) {
          option.classList.remove("active");
          const firstAvailableColor = document.querySelector(`.color-option[data-color][style="display: block"]`);
          if (firstAvailableColor) {
            firstAvailableColor.classList.add("active");
            if (vehicleColors[selectedVehicle][firstAvailableColor.getAttribute("data-color")]) {
              configuratorImage.src = vehicleColors[selectedVehicle][firstAvailableColor.getAttribute("data-color")];
            }
          }
        }
      });
    }
  }

  // Product Card Hover Effects
  setupProductCardHover();

  /**
   * Setup product card hover effects
   */
  function setupProductCardHover() {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.classList.add("hover");
        const buyBtn = this.querySelector(".buy-now-btn");
        const viewDetails = this.querySelector(".view-details");

        // Animate button and link
        buyBtn.style.transform = "translateY(-5px)";
        viewDetails.style.opacity = "1";
      });

      card.addEventListener("mouseleave", function () {
        this.classList.remove("hover");
        const buyBtn = this.querySelector(".buy-now-btn");
        const viewDetails = this.querySelector(".view-details");

        // Reset animations
        buyBtn.style.transform = "translateY(0)";
        viewDetails.style.opacity = "0.7";
      });
    });
  }

  // Product Rating Stars
  setupProductRatings();

  /**
   * Setup product rating stars
   */
  function setupProductRatings() {
    const ratingContainers = document.querySelectorAll(".product-rating");

    ratingContainers.forEach((container) => {
      const ratingValue = Number.parseFloat(container.getAttribute("data-rating"));
      const starsHtml = generateStars(ratingValue);
      const reviewCount = container.getAttribute("data-reviews");

      container.innerHTML = `${starsHtml} <span class="review-count">(${reviewCount} Reviews)</span>`;
    });
  }

  /**
   * Generate star rating HTML
   * @param {number} rating - The rating value (0-5)
   * @returns {string} - HTML string of stars
   */
  function generateStars(rating) {
    let stars = "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }

    return stars;
  }

  // ======================
  // === Helper Functions ===
  // ======================

  /**
   * Show toast notification
   * @param {string} message - The message to display
   * @param {string} type - The message type (success, warning, error)
   */
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "white";
    toast.style.color = "#333";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "4px";
    toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    toast.style.zIndex = "9999";
    toast.style.transform = "translateY(100px)";
    toast.style.opacity = "0";
    toast.style.transition = "all 0.3s ease";
    toast.innerHTML = `
      <div class="toast-content" style="display: flex; align-items: center; gap: 10px;">
        <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}" style="color: ${
      type === "success" ? "#28a745" : "#ffc107"
    }"></i>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity = "1";
    }, 100);

    // Hide and remove toast after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateY(100px)";
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
});