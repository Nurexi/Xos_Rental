document.addEventListener("DOMContentLoaded", () => {
  // Dark Mode Toggle Functionality
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme");
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Set initial theme
  if (savedTheme) {
    htmlElement.setAttribute("data-theme", savedTheme);
  } else if (prefersDarkMode) {
    htmlElement.setAttribute("data-theme", "dark");
  }
  
  // Toggle theme when button is clicked
  darkModeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Add animation effect
    document.body.style.transition = "background-color 0.5s ease";
    
    // Animate elements when theme changes
    const animateElements = document.querySelectorAll(".vehicle-card, .product-card, .step, .pricing-card, .testimonial");
    animateElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
        element.style.transform = "translateY(-5px)";
        setTimeout(() => {
          element.style.transform = "";
        }, 300);
      }, index * 50);
    });
  });
  
  // Update theme-specific elements
  function updateThemeElements() {
    const currentTheme = htmlElement.getAttribute("data-theme") || "light";
    
    // Update preloader color
    const preloaderSVG = document.querySelector(".preloader svg");
    if (preloaderSVG) {
      const strokeColor = currentTheme === "dark" ? "#ff7f50" : "#FF6B35";
      const paths = preloaderSVG.querySelectorAll("path, ellipse, circle");
      paths.forEach(path => {
        if (path.getAttribute("stroke")) {
          path.setAttribute("stroke", strokeColor);
        }
      });
    }
    
    // Update logo color
    const logoSVG = document.querySelector(".logo-icon");
    if (logoSVG) {
      const strokeColor = currentTheme === "dark" ? "#ff7f50" : "#FF6B35";
      const fillColor = currentTheme === "dark" ? "#ff7f50" : "#FF6B35";
      const paths = logoSVG.querySelectorAll("path, circle");
      paths.forEach(path => {
        if (path.getAttribute("stroke")) {
          path.setAttribute("stroke", strokeColor);
        }
        if (path.getAttribute("fill") && path.getAttribute("fill") !== "none") {
          path.setAttribute("fill", fillColor);
        }
      });
    }
  }
  
  // Call initially and when theme changes
  updateThemeElements();
  darkModeToggle.addEventListener("click", updateThemeElements);
  
  // Add smooth transitions for theme changes
  const elementsToTransition = [
    "body", ".header", ".vehicle-card", ".product-card", ".step", 
    ".pricing-card", ".testimonial", ".form-group input", 
    ".form-group select", ".form-group textarea", ".btn"
  ];
  
  const styleElement = document.createElement("style");
  styleElement.textContent = elementsToTransition.join(", ") + 
    " { transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease; }";
  document.head.appendChild(styleElement);
});