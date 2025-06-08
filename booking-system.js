// Main booking system functionality
document.addEventListener("DOMContentLoaded", function() {
  // Find all "Book Now" buttons on the page
  const bookButtons = document.querySelectorAll('.vehicle-card .btn-primary');
  
  // Add click event listener to each "Book Now" button
  bookButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the parent vehicle card
      const vehicleCard = this.closest('.vehicle-card');
      
      // Extract vehicle information
      const vehicleName = vehicleCard.querySelector('h3').textContent;
      const vehiclePrice = vehicleCard.querySelector('.vehicle-price h4').textContent;
      const vehicleImage = vehicleCard.querySelector('.vehicle-image img').src;
      
      // Determine if it's a car or bike based on the presence of specific elements
      const isBike = vehicleCard.querySelector('.spec-item i.fas.fa-motorcycle') !== null;
      const vehicleType = isBike ? 'bike' : 'car';
      
      // Create vehicle data object
      const vehicleData = {
        name: vehicleName,
        price: vehiclePrice,
        image: vehicleImage,
        type: vehicleType,
        bookingDate: new Date().toISOString()
      };
      
      // Store the selected vehicle data in localStorage
      localStorage.setItem('selectedVehicle', JSON.stringify(vehicleData));
      
      // Show a confirmation message
      const confirmMessage = document.createElement('div');
      confirmMessage.className = 'booking-confirmation';
      confirmMessage.innerHTML = `
        <div class="confirmation-content">
          <i class="fas fa-check-circle"></i>
          <p>${vehicleName} has been selected!</p>
          <button class="btn btn-primary view-booking-btn">View Booking</button>
        </div>
      `;
      
      // Style the confirmation message
      confirmMessage.style.position = 'fixed';
      confirmMessage.style.top = '50%';
      confirmMessage.style.left = '50%';
      confirmMessage.style.transform = 'translate(-50%, -50%)';
      confirmMessage.style.backgroundColor = 'white';
      confirmMessage.style.padding = '20px';
      confirmMessage.style.borderRadius = '8px';
      confirmMessage.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
      confirmMessage.style.zIndex = '9999';
      confirmMessage.style.textAlign = 'center';
      
      // Add styles to the icon
      const icon = confirmMessage.querySelector('i');
      icon.style.color = '#28a745';
      icon.style.fontSize = '48px';
      icon.style.marginBottom = '10px';
      
      // Add styles to the button
      const viewButton = confirmMessage.querySelector('.view-booking-btn');
      viewButton.style.marginTop = '15px';
      
      // Add a semi-transparent overlay
      const overlay = document.createElement('div');
      overlay.className = 'booking-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '9998';
      
      // Add to the document
      document.body.appendChild(overlay);
      document.body.appendChild(confirmMessage);
      
      // Add click event to the "View Booking" button
      viewButton.addEventListener('click', function() {
        // Redirect to the booked page
        window.location.href = 'Booked.html';
      });
      
      // Automatically redirect after 3 seconds
      setTimeout(() => {
        window.location.href = 'Booked.html';
      }, 3000);
    });
  });
  
  // Check if we're on the Booked page and load the vehicle data
  if (window.location.pathname.includes('Booked.html')) {
    loadBookedVehicleData();
  }
});

// Function to load vehicle data on the booked page
function loadBookedVehicleData() {
  const vehicleDataString = localStorage.getItem('selectedVehicle');
  
  if (!vehicleDataString) {
    console.log("No vehicle data found in localStorage");
    return;
  }
  
  try {
    const vehicleData = JSON.parse(vehicleDataString);
    updateBookedPage(vehicleData);
  } catch (error) {
    console.error("Error parsing vehicle data:", error);
  }
}

// Function to update the booked page with vehicle data
function updateBookedPage(vehicleData) {
  // Update vehicle name
  const vehicleNameElement = document.getElementById('selected-vehicle-name');
  if (vehicleNameElement) {
    vehicleNameElement.textContent = vehicleData.name;
  }
  
  // Update vehicle price
  const vehiclePriceElement = document.getElementById('selected-vehicle-price');
  if (vehiclePriceElement) {
    vehiclePriceElement.innerHTML = vehicleData.price;
  }
  
  // Update base rate in the summary
  const baseRateElement = document.getElementById('base-rate');
  if (baseRateElement) {
    baseRateElement.textContent = vehicleData.price;
  }
  
  // Update vehicle image
  const vehicleImageElement = document.getElementById('selected-vehicle-image');
  if (vehicleImageElement) {
    vehicleImageElement.src = vehicleData.image;
    vehicleImageElement.alt = vehicleData.name;
  }
  
  // Update thumbnails
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach(thumbnail => {
    thumbnail.setAttribute('data-image', vehicleData.image);
    const thumbnailImg = thumbnail.querySelector('img');
    if (thumbnailImg) {
      thumbnailImg.src = vehicleData.image;
      thumbnailImg.alt = vehicleData.name;
    }
  });
  
  // Update page title
  document.title = `${vehicleData.name} Booking | Xos Rental`;
  
  // Initialize the booking summary
  updateBookingSummary();
}

// Function to update the booking summary
function updateBookingSummary() {
  // Get elements
  const pickupDateInput = document.getElementById('pickup-date');
  const returnDateInput = document.getElementById('return-date');
  const rentalDurationElement = document.getElementById('rental-duration');
  const basePriceElement = document.getElementById('base-rate');
  const additionalOptionsElement = document.getElementById('additional-options');
  const taxesFeesElement = document.getElementById('taxes-fees');
  const totalPriceElement = document.getElementById('total-price');
  
  // Calculate rental duration
  let rentalDuration = 0;
  if (pickupDateInput && returnDateInput && pickupDateInput.value && returnDateInput.value) {
    const pickupDate = new Date(pickupDateInput.value);
    const returnDate = new Date(returnDateInput.value);
    rentalDuration = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
  }
  
  // Update rental duration display
  if (rentalDurationElement) {
    rentalDurationElement.textContent = `${rentalDuration} days`;
  }
  
  // Get base price from the displayed vehicle price
  let basePrice = 0;
  if (basePriceElement) {
    const basePriceText = basePriceElement.textContent;
    basePrice = parseFloat(basePriceText.replace(/[^0-9.]/g, ''));
  }
  
  // Calculate additional options cost
  let additionalOptionsCost = 0;
  if (document.getElementById('gps') && document.getElementById('gps').checked) additionalOptionsCost += 10;
  if (document.getElementById('additional-driver') && document.getElementById('additional-driver').checked) additionalOptionsCost += 15;
  if (document.getElementById('child-seat') && document.getElementById('child-seat').checked) additionalOptionsCost += 8;
  if (document.getElementById('full-insurance') && document.getElementById('full-insurance').checked) additionalOptionsCost += 25;
  
  // Update additional options display
  if (additionalOptionsElement) {
    additionalOptionsElement.textContent = `$${additionalOptionsCost * rentalDuration}`;
  }
  
  // Calculate taxes and fees (assuming 10% of subtotal)
  const subtotal = (basePrice * rentalDuration) + (additionalOptionsCost * rentalDuration);
  const taxesAndFees = subtotal * 0.1;
  
  // Update taxes and fees display
  if (taxesFeesElement) {
    taxesFeesElement.textContent = `$${taxesAndFees.toFixed(2)}`;
  }
  
  // Calculate total price
  const totalPrice = subtotal + taxesAndFees;
  
  // Update total price display
  if (totalPriceElement) {
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  }
}

// Add event listeners for form elements that affect the booking summary
document.addEventListener("DOMContentLoaded", function() {
  const formElements = [
    document.getElementById("pickup-date"),
    document.getElementById("return-date"),
    document.getElementById("rental-plan"),
    document.getElementById("gps"),
    document.getElementById("additional-driver"),
    document.getElementById("child-seat"),
    document.getElementById("full-insurance")
  ];
  
  formElements.forEach(element => {
    if (element) {
      element.addEventListener("change", updateBookingSummary);
    }
  });
  
  // Add event listener for booking form submission
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Show loading animation
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled = true;
      
      // Simulate processing delay
      setTimeout(() => {
        // Generate random booking reference
        const bookingReference = generateBookingReference();
        const bookingReferenceElement = document.getElementById("booking-reference");
        if (bookingReferenceElement) {
          bookingReferenceElement.textContent = bookingReference;
        }
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Show confirmation modal
        const bookingConfirmationModal = document.getElementById("bookingConfirmationModal");
        if (bookingConfirmationModal) {
          bookingConfirmationModal.style.display = "block";
          document.body.style.overflow = "hidden"; // Prevent scrolling
        }
        
        // Clear localStorage after successful booking
        localStorage.removeItem("selectedVehicle");
      }, 1500);
    });
  }
});

// Function to generate a random booking reference
function generateBookingReference() {
  const prefix = "XOS";
  const randomNum1 = Math.floor(10000 + Math.random() * 90000);
  const randomNum2 = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum1}-${randomNum2}`;
}