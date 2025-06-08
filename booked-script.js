document.addEventListener("DOMContentLoaded", () => {
  // Get URL parameters to load vehicle details
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleName = urlParams.get('vehicle');
  const vehiclePrice = urlParams.get('price');
  const vehicleImage = urlParams.get('image');
  const vehicleType = urlParams.get('type');
  
  // If URL parameters exist, load the vehicle details
  if (vehicleName && vehiclePrice && vehicleImage) {
    loadVehicleDetails(vehicleName, vehiclePrice, vehicleImage, vehicleType);
  }
  
  // Enhanced thumbnail image gallery with hover effects
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('selected-vehicle-image');
  
  thumbnails.forEach(thumbnail => {
    // Add hover animation
    thumbnail.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        this.style.transform = 'translateY(-3px)';
      }
    });
    
    thumbnail.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        this.style.transform = '';
      }
    });
    
    thumbnail.addEventListener('click', function() {
      // Remove active class and reset transform from all thumbnails
      thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        thumb.style.transform = '';
      });
      
      // Add active class to clicked thumbnail
      this.classList.add('active');
      this.style.transform = 'scale(1.05)';
      
      // Update main image with fade effect
      mainImage.style.opacity = '0';
      setTimeout(() => {
        const imageUrl = this.getAttribute('data-image');
        mainImage.src = imageUrl;
        mainImage.style.opacity = '1';
      }, 300);
    });
  });
  
  // Enhanced main image interaction
  const mainImageContainer = document.querySelector('.main-image');
  
  mainImageContainer.addEventListener('click', function() {
    // Create a lightbox effect for the image
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    lightbox.style.display = 'flex';
    lightbox.style.alignItems = 'center';
    lightbox.style.justifyContent = 'center';
    lightbox.style.zIndex = '9999';
    lightbox.style.opacity = '0';
    lightbox.style.transition = 'opacity 0.3s ease';
    
    const lightboxImg = document.createElement('img');
    lightboxImg.src = mainImage.src;
    lightboxImg.style.maxWidth = '90%';
    lightboxImg.style.maxHeight = '90%';
    lightboxImg.style.borderRadius = '8px';
    lightboxImg.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
    lightboxImg.style.transform = 'scale(0.9)';
    lightboxImg.style.transition = 'transform 0.3s ease';
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '30px';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '40px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.transition = 'transform 0.3s ease';
    
    closeBtn.addEventListener('mouseover', function() {
      this.style.transform = 'rotate(90deg)';
    });
    
    closeBtn.addEventListener('mouseout', function() {
      this.style.transform = '';
    });
    
    closeBtn.addEventListener('click', function() {
      lightbox.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(lightbox);
      }, 300);
    });
    
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Fade in lightbox
    setTimeout(() => {
      lightbox.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 10);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(lightbox);
        }, 300);
      }
    });
  });
  
  // Date picker validation and calculation with enhanced feedback
  const pickupDateInput = document.getElementById('pickup-date');
  const returnDateInput = document.getElementById('return-date');
  const rentalDurationElement = document.getElementById('rental-duration');
  const basePriceElement = document.getElementById('base-rate');
  const additionalOptionsElement = document.getElementById('additional-options');
  const taxesFeesElement = document.getElementById('taxes-fees');
  const totalPriceElement = document.getElementById('total-price');
  
  // Set minimum date to today
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  pickupDateInput.min = formatDate(today);
  returnDateInput.min = formatDate(tomorrow);
  
  // Add visual feedback for date selection
  pickupDateInput.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });
  
  pickupDateInput.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
  });
  
  returnDateInput.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });
  
  returnDateInput.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
  });
  
  // Update return date min value when pickup date changes with animation
  pickupDateInput.addEventListener('change', function() {
    if (this.value) {
      const nextDay = new Date(this.value);
      nextDay.setDate(nextDay.getDate() + 1);
      returnDateInput.min = formatDate(nextDay);
      
      // If return date is before new pickup date + 1, reset it
      if (returnDateInput.value && new Date(returnDateInput.value) <= new Date(this.value)) {
        returnDateInput.value = formatDate(nextDay);
        
        // Add animation to highlight the change
        returnDateInput.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
        setTimeout(() => {
          returnDateInput.style.backgroundColor = '';
        }, 1000);
      }
      
      updateBookingSummary(true);
    }
  });
  
  returnDateInput.addEventListener('change', function() {
    updateBookingSummary(true);
  });
  
  // Rental plan change with animation
  const rentalPlanSelect = document.getElementById('rental-plan');
  rentalPlanSelect.addEventListener('change', function() {
    // Add animation to highlight the change
    this.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
    setTimeout(() => {
      this.style.backgroundColor = '';
    }, 1000);
    
    updateBookingSummary(true);
  });
  
  // Additional options checkboxes with enhanced interaction
  const additionalOptions = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
  additionalOptions.forEach(option => {
    option.addEventListener('change', function() {
      // Add animation to the parent element
      const parent = this.closest('.checkbox-item');
      
      if (this.checked) {
        parent.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
        parent.style.transform = 'translateX(5px)';
      } else {
        parent.style.backgroundColor = '';
        parent.style.transform = '';
      }
      
      updateBookingSummary(true);
    });
  });
  
  // Payment method selection with enhanced interaction
  const paymentOptions = document.querySelectorAll('input[name="payment"]');
  const creditCardForm = document.getElementById('credit-card-form');
  
  paymentOptions.forEach(option => {
    option.addEventListener('change', function() {
      // Reset all labels
      paymentOptions.forEach(opt => {
        const label = opt.nextElementSibling;
        label.style.transform = '';
        label.style.boxShadow = '';
      });
      
      // Style the selected label
      const selectedLabel = this.nextElementSibling;
      selectedLabel.style.transform = 'translateY(-5px)';
      selectedLabel.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
      
      if (this.id === 'credit-card') {
        // Show credit card form with animation
        creditCardForm.style.display = 'block';
        creditCardForm.style.opacity = '0';
        creditCardForm.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          creditCardForm.style.opacity = '1';
          creditCardForm.style.transform = 'translateY(0)';
        }, 10);
      } else {
        // Hide credit card form with animation
        creditCardForm.style.opacity = '0';
        creditCardForm.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          creditCardForm.style.display = 'none';
        }, 300);
      }
    });
  });
  
  // Enhanced credit card input formatting
  const cardNumberInput = document.getElementById('card-number');
  const expiryDateInput = document.getElementById('expiry-date');
  const cvvInput = document.getElementById('cvv');
  
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      // Remove non-digits
      let value = this.value.replace(/\D/g, '');
      
      // Add spaces after every 4 digits
      if (value.length > 0) {
        value = value.match(/.{1,4}/g).join(' ');
      }
      
      // Limit to 19 characters (16 digits + 3 spaces)
      this.value = value.substring(0, 19);
    });
  }
  
  if (expiryDateInput) {
    expiryDateInput.addEventListener('input', function(e) {
      // Remove non-digits
      let value = this.value.replace(/\D/g, '');
      
      // Add slash after first 2 digits
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      
      // Limit to 5 characters (MM/YY)
      this.value = value.substring(0, 5);
    });
  }
  
  if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
      // Remove non-digits
      let value = this.value.replace(/\D/g, '');
      
      // Limit to 3 or 4 digits
      this.value = value.substring(0, 4);
    });
  }
  
  // Booking form submission with enhanced animation
  const bookingForm = document.getElementById('booking-form');
  const bookingConfirmationModal = document.getElementById('bookingConfirmationModal');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  const viewBookingsBtn = document.getElementById('viewBookings');
  const backToHomeBtn = document.getElementById('backToHome');
  
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateBookingForm()) {
      return;
    }
    
    // Show loading animation
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate random booking reference
      const bookingReference = generateBookingReference();
      document.getElementById('booking-reference').textContent = bookingReference;
      
      // Reset button
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      
      // Show confirmation modal with animation
      bookingConfirmationModal.style.display = 'block';
      bookingConfirmationModal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
      
      // Add confetti effect
      createConfetti();
    }, 1500);
  });
  
  // Close modal buttons with enhanced animation
  closeModalButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'rotate(90deg)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
    
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.classList.remove('show');
      
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
      }, 300);
    });
  });
  
  // Close when clicking outside with enhanced animation
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.classList.remove('show');
      
      setTimeout(() => {
        event.target.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
      }, 300);
    }
  });
  
  // View Bookings button with enhanced animation
  viewBookingsBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
  });
  
  viewBookingsBtn.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
  });
  
  viewBookingsBtn.addEventListener('click', function() {
    // Redirect to bookings page (would be implemented in a real application)
    alert('This would redirect to the bookings page in a real application.');
    bookingConfirmationModal.classList.remove('show');
    
    setTimeout(() => {
      bookingConfirmationModal.style.display = 'none';
      document.body.style.overflow = ''; // Re-enable scrolling
    }, 300);
  });
  
  // Back to Home button with enhanced animation
  backToHomeBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.3)';
  });
  
  backToHomeBtn.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
  });
  
  backToHomeBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
  
  // Enhanced recommended vehicles with dynamic icon change
  const recommendedVehicles = document.querySelectorAll('.recommended-vehicle');
  
  recommendedVehicles.forEach(vehicle => {
    const viewButton = vehicle.querySelector('.quick-add-btn');
    const originalIcon = viewButton.querySelector('i').className;
    
    vehicle.addEventListener('mouseenter', function() {
      // Change icon on hover
      viewButton.querySelector('i').className = 'fas fa-car';
      
      // Add pulse animation to the price
      const price = this.querySelector('.recommended-price');
      price.style.animation = 'pulse 1s infinite';
    });
    
    vehicle.addEventListener('mouseleave', function() {
      // Restore original icon
      viewButton.querySelector('i').className = originalIcon;
      
      // Remove pulse animation
      const price = this.querySelector('.recommended-price');
      price.style.animation = '';
    });
  });
  
  const recommendedButtons = document.querySelectorAll('.quick-add-btn');
  
  recommendedButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      // Change icon and text on hover
      this.innerHTML = '<i class="fas fa-bolt"></i> Quick Book';
    });
    
    button.addEventListener('mouseleave', function() {
      // Restore original icon and text
      const name = this.getAttribute('data-name');
      this.innerHTML = '<i class="fas fa-eye"></i> View Details';
    });
    
    button.addEventListener('click', function() {
      const name = this.getAttribute('data-name');
      const price = this.getAttribute('data-price');
      const image = this.getAttribute('data-image');
      
      // Add loading animation
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      
      // Simulate loading delay
      setTimeout(() => {
        // Redirect to booked page with new vehicle details
        window.location.href = `booked.html?vehicle=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&image=${encodeURIComponent(image)}`;
      }, 500);
    });
  });
  
  // Add hover effects to summary rows
  const summaryRows = document.querySelectorAll('.summary-row');
  
  summaryRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
      if (!this.classList.contains('total')) {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        this.style.transform = 'translateX(5px)';
      } else {
        this.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
      }
    });
    
    row.addEventListener('mouseleave', function() {
      this.style.backgroundColor = '';
      this.style.transform = '';
    });
  });
  
  // Add hover effects to vehicle specs
  const specItems = document.querySelectorAll('.spec-item');
  
  specItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      const icon = this.querySelector('i');
      icon.style.transform = 'scale(1.2)';
      this.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
    });
    
    item.addEventListener('mouseleave', function() {
      const icon = this.querySelector('i');
      icon.style.transform = '';
      this.style.backgroundColor = '';
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
  
  // Add hover effects to vehicle features
  const featureItems = document.querySelectorAll('.vehicle-features li');
  
  featureItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      const icon = this.querySelector('i');
      icon.style.transform = 'scale(1.2)';
      this.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
      this.style.transform = 'translateX(5px)';
    });
    
    item.addEventListener('mouseleave', function() {
      const icon = this.querySelector('i');
      icon.style.transform = '';
      this.style.backgroundColor = '';
      this.style.transform = '';
    });
  });
  
  // Helper functions
  function loadVehicleDetails(name, price, image, type) {
    document.getElementById('selected-vehicle-name').textContent = name;
    document.getElementById('selected-vehicle-price').innerHTML = `$${price}<span>/day</span>`;
    document.getElementById('selected-vehicle-image').src = image;
    document.getElementById('base-rate').textContent = `$${price}/day`;
    
    // Update page title
    document.title = `${name} Booking | Xos Rental`;
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
      thumbnail.setAttribute('data-image', image);
      thumbnail.querySelector('img').src = image;
    });
    
    // Update vehicle specs based on type (car or bike)
    if (type === 'bike') {
      document.getElementById('selected-vehicle-specs').innerHTML = `
        <div class="spec-item">
          <i class="fas fa-motorcycle"></i>
          <span>Engine</span>
        </div>
        <div class="spec-item">
          <i class="fas fa-tachometer-alt"></i>
          <span>Power</span>
        </div>
        <div class="spec-item">
          <i class="fas fa-weight-hanging"></i>
          <span>Weight</span>
        </div>
        <div class="spec-item">
          <i class="fas fa-road"></i>
          <span>Type</span>
        </div>
        <div class="spec-item">
          <i class="fas fa-gas-pump"></i>
          <span>Fuel Capacity</span>
        </div>
        <div class="spec-item">
          <i class="fas fa-tachometer-alt"></i>
          <span>Top Speed</span>
        </div>
      `;
    }
    
    // Add animation to vehicle name
    const vehicleName = document.getElementById('selected-vehicle-name');
    vehicleName.style.opacity = '0';
    vehicleName.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      vehicleName.style.opacity = '1';
      vehicleName.style.transform = 'translateY(0)';
    }, 300);
  }
  
  function updateBookingSummary(animate = false) {
    // Get base price from the displayed vehicle price
    const basePrice = parseFloat(document.getElementById('selected-vehicle-price').textContent.replace('$', ''));
    
    // Calculate rental duration
    let rentalDuration = 0;
    if (pickupDateInput.value && returnDateInput.value) {
      const pickupDate = new Date(pickupDateInput.value);
      const returnDate = new Date(returnDateInput.value);
      rentalDuration = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
    }
    
    // Update rental duration display with animation
    if (animate) {
      rentalDurationElement.style.color = 'var(--primary-color)';
      setTimeout(() => {
        rentalDurationElement.style.color = '';
      }, 1000);
    }
    
    rentalDurationElement.textContent = `${rentalDuration} days`;
    
    // Calculate additional options cost
    let additionalOptionsCost = 0;
    if (document.getElementById('gps').checked) additionalOptionsCost += 10;
    if (document.getElementById('additional-driver').checked) additionalOptionsCost += 15;
    if (document.getElementById('child-seat').checked) additionalOptionsCost += 8;
    if (document.getElementById('full-insurance').checked) additionalOptionsCost += 25;
    
    // Apply rental plan adjustments
    let adjustedBasePrice = basePrice;
    const selectedPlan = rentalPlanSelect.value;
    if (selectedPlan === 'premium') {
      adjustedBasePrice += 20; // Premium plan costs $20 more per day
    } else if (selectedPlan === 'luxury') {
      adjustedBasePrice += 50; // Luxury plan costs $50 more per day
    }
    
    // Update base rate display with animation
    if (animate) {
      basePriceElement.style.color = 'var(--primary-color)';
      setTimeout(() => {
        basePriceElement.style.color = '';
      }, 1000);
    }
    basePriceElement.textContent = `$${adjustedBasePrice}/day`;
    
    // Calculate total additional options cost for the entire rental period
    const totalAdditionalOptionsCost = additionalOptionsCost * rentalDuration;
    
    // Update additional options display with animation
    if (animate) {
      additionalOptionsElement.style.color = 'var(--primary-color)';
      setTimeout(() => {
        additionalOptionsElement.style.color = '';
      }, 1000);
    }
    additionalOptionsElement.textContent = `$${totalAdditionalOptionsCost}`;
    
    // Calculate taxes and fees (assuming 10% of subtotal)
    const subtotal = (adjustedBasePrice * rentalDuration) + totalAdditionalOptionsCost;
    const taxesAndFees = subtotal * 0.1;
    
    // Update taxes and fees display with animation
    if (animate) {
      taxesFeesElement.style.color = 'var(--primary-color)';
      setTimeout(() => {
        taxesFeesElement.style.color = '';
      }, 1000);
    }
    taxesFeesElement.textContent = `$${taxesAndFees.toFixed(2)}`;
    
    // Calculate total price
    const totalPrice = subtotal + taxesAndFees;
    
    // Update total price display with animation
    if (animate) {
      totalPriceElement.style.color = 'var(--primary-color)';
      totalPriceElement.style.transform = 'scale(1.05)';
      setTimeout(() => {
        totalPriceElement.style.color = '';
        totalPriceElement.style.transform = '';
      }, 1000);
    }
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  }
  
  function validateBookingForm() {
    let isValid = true;
    
    // Check pickup date
    if (!pickupDateInput.value) {
      highlightError(pickupDateInput, 'Please select a pickup date');
      isValid = false;
    } else {
      removeError(pickupDateInput);
    }
    
    // Check return date
    if (!returnDateInput.value) {
      highlightError(returnDateInput, 'Please select a return date');
      isValid = false;
    } else {
      removeError(returnDateInput);
    }
    
    // Check pickup location
    const pickupLocation = document.getElementById('pickup-location');
    if (!pickupLocation.value) {
      highlightError(pickupLocation, 'Please select a pickup location');
      isValid = false;
    } else {
      removeError(pickupLocation);
    }
    
    // Check terms and conditions
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
      const termsContainer = termsCheckbox.closest('.checkbox-item');
      termsContainer.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
      termsContainer.style.padding = '10px';
      termsContainer.style.borderRadius = '4px';
      
      setTimeout(() => {
        termsContainer.style.backgroundColor = '';
        termsContainer.style.padding = '8px';
      }, 2000);
      
      isValid = false;
    }
    
    // Check payment method if credit card is selected
    if (document.getElementById('credit-card').checked) {
      const cardNumber = document.getElementById('card-number');
      const cardName = document.getElementById('card-name');
      const expiryDate = document.getElementById('expiry-date');
      const cvv = document.getElementById('cvv');
      
      if (!cardNumber.value || cardNumber.value.replace(/\s/g, '').length < 16) {
        highlightError(cardNumber, 'Please enter a valid card number');
        isValid = false;
      } else {
        removeError(cardNumber);
      }
      
      if (!cardName.value) {
        highlightError(cardName, 'Please enter the cardholder name');
        isValid = false;
      } else {
        removeError(cardName);
      }
      
      if (!expiryDate.value || expiryDate.value.length < 5) {
        highlightError(expiryDate, 'Please enter a valid expiry date');
        isValid = false;
      } else {
        removeError(expiryDate);
      }
      
      if (!cvv.value || cvv.value.length < 3) {
        highlightError(cvv, 'Please enter a valid CVV');
        isValid = false;
      } else {
        removeError(cvv);
      }
    }
    
    return isValid;
  }
  
  function highlightError(input, message) {
    input.style.borderColor = '#dc3545';
    input.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
    
    // Add shake animation
    input.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      input.style.animation = '';
    }, 500);
    
    // Add error message
    const parent = input.parentElement;
    let errorMessage = parent.querySelector('.error-message');
    
    if (!errorMessage) {
      errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.style.color = '#dc3545';
      errorMessage.style.fontSize = '12px';
      errorMessage.style.marginTop = '5px';
      errorMessage.style.animation = 'fadeIn 0.3s ease';
      parent.appendChild(errorMessage);
    }
    
    errorMessage.textContent = message;
  }
  
  function removeError(input) {
    input.style.borderColor = '';
    input.style.backgroundColor = '';
    
    // Remove error message
    const parent = input.parentElement;
    const errorMessage = parent.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        parent.removeChild(errorMessage);
      }, 300);
    }
  }
  
  function generateBookingReference() {
    const prefix = 'XOS';
    const randomNum1 = Math.floor(10000 + Math.random() * 90000);
    const randomNum2 = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${randomNum1}-${randomNum2}`;
  }
  
  function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#ff6b35', '#2a2d34', '#4ecdc4', '#f7fff7', '#ff9f1c'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.position = 'absolute';
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 5 + 5}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '-10px';
      confetti.style.opacity = Math.random() + 0.5;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      
      confettiContainer.appendChild(confetti);
      
      // Animate confetti
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;
      
      confetti.style.animation = `confettiFall ${duration}s ease ${delay}s forwards`;
    }
    
    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.remove();
        }, 5000);
      }
    });