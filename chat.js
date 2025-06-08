document.addEventListener("DOMContentLoaded", () => {
  // Chat Widget Functionality
  const chatButton = document.getElementById("chat-button");
  const chatContainer = document.getElementById("chat-container");
  const minimizeChat = document.getElementById("minimize-chat");
  const closeChat = document.getElementById("close-chat");
  const chatInput = document.getElementById("chat-input");
  const sendMessage = document.getElementById("send-message");
  const chatBody = document.getElementById("chat-body");
  const quickResponseButtons = document.querySelectorAll(".quick-response-btn");
  
  // Bot responses database
  const botResponses = {
    "hello": "Hello! How can I help you today?",
    "hi": "Hi there! How can I assist you with your vehicle rental needs?",
    "help": "I'd be happy to help! You can ask me about our vehicles, rental process, pricing, or required documents.",
    "bye": "Thank you for chatting with us! Feel free to reach out if you have more questions.",
    "thanks": "You're welcome! Is there anything else I can help you with?",
    "thank you": "You're welcome! Is there anything else I can help you with?",
    
    // Rental related responses
    "rent a car": "Great! We have a wide selection of cars available for rent. You can browse our collection on the 'Cars' page. Would you like me to help you find a specific type of car?",
    "rent a bike": "Excellent choice! Our bike collection includes sport bikes, cruisers, and adventure bikes. You can see all options on the 'Bikes' page. What type of bike are you interested in?",
    "i want to rent a car": "Great! We have a wide selection of cars available for rent. You can browse our collection on the 'Cars' page. Would you like me to help you find a specific type of car?",
    "i want to rent a bike": "Excellent choice! Our bike collection includes sport bikes, cruisers, and adventure bikes. You can see all options on the 'Bikes' page. What type of bike are you interested in?",
    
    // Document related responses
    "what documents do i need": "To rent a vehicle, you'll need:\n- Valid driver's license\n- Credit card in your name\n- Proof of insurance\n\nFor motorcycle rentals, you'll also need a valid motorcycle license or endorsement.",
    "what documents do i need?": "To rent a vehicle, you'll need:\n- Valid driver's license\n- Credit card in your name\n- Proof of insurance\n\nFor motorcycle rentals, you'll also need a valid motorcycle license or endorsement.",
    "required documents": "To rent a vehicle, you'll need:\n- Valid driver's license\n- Credit card in your name\n- Proof of insurance\n\nFor motorcycle rentals, you'll also need a valid motorcycle license or endorsement.",
    
    // Pricing related responses
    "pricing": "Our pricing varies based on the vehicle type and rental duration. We offer Economy, Premium, and Luxury plans. You can find detailed pricing information in the 'Pricing' section of our website.",
    "how much": "Our pricing varies based on the vehicle type and rental duration. Economy plans start at $45/day, Premium at $85/day, and Luxury at $150/day. Would you like more specific pricing for a particular vehicle?",
    "price": "Our pricing varies based on the vehicle type and rental duration. Economy plans start at $45/day, Premium at $85/day, and Luxury at $150/day. Would you like more specific pricing for a particular vehicle?",
    
    // Default response
    "default": "Thank you for your message. I'm not sure I understand. Could you please rephrase or ask about our vehicles, rental process, pricing, or required documents?"
  };
  
  // Toggle chat widget
  chatButton.addEventListener("click", () => {
    chatContainer.classList.toggle("active");
    // Remove notification when chat is opened
    const notification = chatButton.querySelector(".chat-notification");
    if (notification) {
      notification.style.display = "none";
    }
  });
  
  // Minimize chat
  minimizeChat.addEventListener("click", () => {
    chatContainer.classList.remove("active");
  });
  
  // Close chat
  closeChat.addEventListener("click", () => {
    chatContainer.classList.remove("active");
    // Reset chat to initial state
    resetChat();
  });
  
  // Send message when button is clicked
  sendMessage.addEventListener("click", () => {
    sendUserMessage();
  });
  
  // Send message when Enter key is pressed
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendUserMessage();
    }
  });
  
  // Quick response buttons
  quickResponseButtons.forEach(button => {
    button.addEventListener("click", () => {
      const responseText = button.getAttribute("data-response");
      chatInput.value = responseText;
      sendUserMessage();
    });
  });
  
  // Function to send user message
  function sendUserMessage() {
    const message = chatInput.value.trim();
    if (message === "") return;
    
    // Add user message to chat
    addMessage(message, "user");
    chatInput.value = "";
    
    // Simulate typing indicator
    addTypingIndicator();
    
    // Simulate bot response after a delay
    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = getBotResponse(message.toLowerCase());
      addMessage(botResponse, "bot");
      
      // Scroll to bottom
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }
  
  // Function to add message to chat
  function addMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${sender}`;
    
    const bubbleElement = document.createElement("div");
    bubbleElement.className = "chat-bubble";
    
    // Handle newlines in messages
    const formattedMessage = message.replace(/\n/g, "<br>");
    bubbleElement.innerHTML = `<p>${formattedMessage}</p>`;
    
    const timeElement = document.createElement("span");
    timeElement.className = "chat-time";
    timeElement.textContent = getCurrentTime();
    
    messageElement.appendChild(bubbleElement);
    messageElement.appendChild(timeElement);
    
    chatBody.appendChild(messageElement);
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  // Function to add typing indicator
  function addTypingIndicator() {
    const typingElement = document.createElement("div");
    typingElement.className = "chat-message bot typing-indicator";
    typingElement.innerHTML = `
      <div class="chat-bubble">
        <div class="typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    chatBody.appendChild(typingElement);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  // Function to remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.querySelector(".typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // Function to get bot response
  function getBotResponse(message) {
    // Check for exact matches
    if (botResponses[message]) {
      return botResponses[message];
    }
    
    // Check for partial matches
    for (const key in botResponses) {
      if (message.includes(key)) {
        return botResponses[key];
      }
    }
    
    // Return default response if no match found
    return botResponses["default"];
  }
  
  // Function to get current time
  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes} ${ampm}`;
  }
  
  // Function to reset chat
  function resetChat() {
    // Clear all messages except the first one
    const messages = chatBody.querySelectorAll(".chat-message");
    for (let i = 1; i < messages.length; i++) {
      messages[i].remove();
    }
    
    // Reset input
    chatInput.value = "";
    
    // Show notification again
    const notification = chatButton.querySelector(".chat-notification");
    if (notification) {
      notification.style.display = "flex";
    }
  }
  
  // Add CSS for typing indicator
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .typing {
      display: flex;
      align-items: center;
      gap: 5px;
      height: 20px;
    }
    
    .typing span {
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: #ccc;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out both;
    }
    
    .typing span:nth-child(1) {
      animation-delay: 0s;
    }
    
    .typing span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    [data-theme="dark"] .typing span {
      background-color: #999;
    }
    
    @keyframes typing {
      0%, 100% {
        transform: scale(0.6);
        opacity: 0.6;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(styleElement);
});