// Main application controller
document.addEventListener("DOMContentLoaded", function() {
  console.log("Initializing app...");
  if (window.uiController) {
    console.log("UI Controller initialized successfully");
  } else {
    console.error("UI Controller not found!");
  }

  // Set up topic buttons
  document.querySelectorAll(".topic-btn").forEach(button => {
    button.addEventListener("click", function() {
      const topicKey = this.getAttribute("data-topic");
      console.log("Topic clicked:", topicKey);
      
      if (window.uiController) {
        window.uiController.startConversation(topicKey);
      } else {
        console.error("UI Controller not initialized");
      }
    });
  });
  
  // Set up help button - Direct approach
  const helpButton = document.getElementById("help-button");
  const helpPanel = document.getElementById("help-panel");
  
  if (helpButton && helpPanel) {
    console.log("Setting up help button in app.js");
    helpButton.addEventListener("click", function() {
      console.log("Help button clicked in app.js handler");
      helpPanel.classList.toggle("hidden");
      console.log("Help panel visibility toggled:", !helpPanel.classList.contains("hidden"));
    });
  } else {
    console.error("Help button or help panel not found in app.js", {
      helpButton: !!helpButton,
      helpPanel: !!helpPanel
    });
  }
  
  // Set up close help button
  const closeHelpButton = document.getElementById("close-help");
  if (closeHelpButton && helpPanel) {
    closeHelpButton.addEventListener("click", function() {
      console.log("Close help button clicked");
      helpPanel.classList.add("hidden");
    });
  }
  
  // Set up back button
  const backButton = document.getElementById("back-btn");
  const topicSelectorPanel = document.querySelector(".topic-selector-panel");
  const conversationPanel = document.querySelector(".conversation-panel");
  
  if (backButton && topicSelectorPanel && conversationPanel) {
    backButton.addEventListener("click", function() {
      conversationPanel.classList.add("hidden");
      topicSelectorPanel.classList.remove("hidden");
    });
  }
  
  // Set up popup button
  const popupButton = document.getElementById("popup-btn");
  const popup = document.getElementById("popup");
  
  if (popupButton && popup) {
    popupButton.addEventListener("click", function() {
      popup.classList.add("hidden");
    });
  }
  
  console.log("App initialized successfully");
  
  // Additional debugging to verify elements
  setTimeout(() => {
    const helpButtonCheck = document.getElementById("help-button");
    const helpPanelCheck = document.getElementById("help-panel");
    console.log("Help button element check:", helpButtonCheck ? "exists" : "missing");
    console.log("Help panel element check:", helpPanelCheck ? "exists" : "missing");
    
    if (helpButtonCheck) {
      console.log("Help button listeners:", window.getEventListeners ? 
        window.getEventListeners(helpButtonCheck).click?.length || "not accessible" : 
        "event listeners not accessible");
    }
  }, 1000);
});