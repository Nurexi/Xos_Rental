document.addEventListener("DOMContentLoaded", function() {
  // Initialize AOS animations if not already initialized
  if (typeof AOS !== 'undefined' && AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  // Counter animation function
  function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the faster
    
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      
      // Calculate increment based on target value
      const increment = target > 1000 ? Math.ceil(target / (speed / 2)) : Math.ceil(target / speed);
      
      // Only start animation when element is in viewport
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const updateCount = () => {
            count += increment;
            
            // Format number with commas for thousands
            const formattedCount = count.toLocaleString();
            counter.innerText = formattedCount;
            
            if (count < target) {
              setTimeout(updateCount, 1);
            } else {
              counter.innerText = target.toLocaleString();
            }
          };
          
          updateCount();
          observer.unobserve(counter);
        }
      }, { threshold: 0.5 });
      
      observer.observe(counter);
    });
  }
  
  // Add visual effects to stat icons
  function enhanceStatIcons() {
    const statIcons = document.querySelectorAll('.stat-icon');
    
    statIcons.forEach(icon => {
      // Create particle elements for each icon
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('span');
        particle.className = 'icon-particle';
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = 'rgba(255, 107, 53, 0.7)';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animation = `float ${2 + Math.random() * 3}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.opacity = '0';
        particle.style.zIndex = '-1';
        
        icon.appendChild(particle);
      }
      
      // Add keyframes for floating animation
      if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
          @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-20px) translateX(10px); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }
  
  // Add hover effects to timeline items
  function enhanceTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const dot = item.querySelector('.timeline-dot');
        const icon = item.querySelector('.timeline-icon');
        
        // Animate the dot
        dot.style.transform = 'scale(1.5)';
        dot.style.transition = 'transform 0.3s ease';
        
        // Animate the icon
        icon.style.transform = 'rotate(360deg) scale(1.2)';
        icon.style.transition = 'transform 0.5s ease';
      });
      
      item.addEventListener('mouseleave', () => {
        const dot = item.querySelector('.timeline-dot');
        const icon = item.querySelector('.timeline-icon');
        
        // Reset animations
        dot.style.transform = 'scale(1)';
        icon.style.transform = 'rotate(0) scale(1)';
      });
    });
  }
  
  // Initialize all animations and effects
  animateCounters();
  enhanceStatIcons();
  enhanceTimeline();
  
  // Reinitialize on window resize for responsive behavior
  window.addEventListener('resize', () => {
    if (typeof AOS !== 'undefined' && AOS) {
      AOS.refresh();
    }
  });
  
  // Add 3D tilt effect to team member cards
  const teamMembers = document.querySelectorAll('.team-member');
  
  teamMembers.forEach(member => {
    member.addEventListener('mousemove', (e) => {
      const card = member;
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      // Calculate mouse position relative to card center
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      
      // Calculate rotation (max 10 degrees)
      const rotateY = mouseX / (cardRect.width / 2) * 5;
      const rotateX = -mouseY / (cardRect.height / 2) * 5;
      
      // Apply transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    
    member.addEventListener('mouseleave', () => {
      member.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      member.style.transition = 'transform 0.5s ease';
    });
  });
});