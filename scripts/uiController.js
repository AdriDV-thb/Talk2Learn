/**
 * UI Controller - Manages the user interface
 */

class UIController {
  constructor(speechHandler) {
    this.speechHandler = speechHandler || window.speechHandler;
    console.log(
      "UI Controller initializing with speech handler:",
      !!this.speechHandler
    );

    // DOM Elements
    this.topicSelectorPanel = document.querySelector(".topic-selector-panel");
    this.conversationPanel = document.querySelector(".conversation-panel");
    this.helpPanel = document.getElementById("help-panel");
    this.helpContent = document.getElementById("help-content");
    this.chatMessages = document.getElementById("chat-messages");
    this.voiceStatus = document.getElementById("voice-status");
    this.voiceWave = document.getElementById("voice-wave");
    this.popup = document.getElementById("popup");

    // Buttons
    this.helpButton = document.getElementById("help-button");
    this.closeHelpButton = document.getElementById("close-help");
    this.micButton = document.getElementById("mic-btn");
    this.backButton = document.getElementById("back-btn");
    this.repeatButton = document.getElementById("repeat-btn");
    this.popupButton = document.getElementById("popup-btn");

    // App state
    this.currentTopic = null;
    this.activeBotModule = null;
    this.lastBotMessage = "";
    this.messageQueue = [];
    this.isProcessingQueue = false;

    if (this.speechHandler) {
      // Set up speech handler callbacks
      console.log("Setting up speech handler callbacks");

      this.speechHandler.setOnStart(() => {
        console.log("Recognition started callback");
        if (this.voiceWave) this.voiceWave.classList.add("recording");
        if (this.voiceStatus) this.voiceStatus.textContent = "Listening...";
        if (this.micButton)
          this.micButton.querySelector("i").className = "fas fa-stop";
      });

      this.speechHandler.setOnResult((interim, final) => {
        // Show interim results
        if (interim && this.voiceStatus) {
          this.voiceStatus.textContent = interim;
        }
      });

      this.speechHandler.setOnEnd((finalTranscript) => {
        console.log(
          "Recognition ended callback with transcript:",
          finalTranscript
        );
        if (this.voiceWave) this.voiceWave.classList.remove("recording");
        if (this.voiceStatus)
          this.voiceStatus.textContent = "Ready to listen...";
        if (this.micButton)
          this.micButton.querySelector("i").className = "fas fa-microphone";

        if (finalTranscript && this.activeBotModule) {
          // Add user message to chat
          this.addMessage(finalTranscript, "user");

          // Process with bot module
          const botResponse =
            this.activeBotModule.processUserInput(finalTranscript);

          // Queue bot response if there is one
          if (botResponse) {
            this.queueBotResponse(botResponse);
          }
        }
      });

      this.speechHandler.setOnError((error) => {
        console.log("Recognition error callback:", error);
        if (this.voiceWave) this.voiceWave.classList.remove("recording");
        if (this.voiceStatus) this.voiceStatus.textContent = "Error: " + error;
        if (this.micButton)
          this.micButton.querySelector("i").className = "fas fa-microphone";

        // Add fallback message if no speech detected
        if (error === "no-speech" && this.activeBotModule) {
          const fallbackResponse = this.activeBotModule.getFallbackResponse();
          this.queueBotResponse(fallbackResponse);
        }
      });
    } else {
      console.warn("No speech handler available");
    }

    // Setup event listeners for buttons
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Help panel toggle - Direct approach without checking
    const helpButton = document.getElementById("help-button");
    if (helpButton) {
      console.log("Setting up help button listener");
      helpButton.addEventListener("click", () => {
        console.log("Help button clicked");
        const helpPanel = document.getElementById("help-panel");
        if (helpPanel) {
          helpPanel.classList.toggle("hidden");
          console.log("Help panel visibility toggled");
          
          // Update grammar help content if panel is now visible
          if (!helpPanel.classList.contains("hidden") && this.activeBotModule) {
            console.log("Updating grammar help content on panel show");
            this.updateGrammarHelp();
          }
        } else {
          console.error("Help panel element not found on click!");
        }
      });
    } else {
      console.error("Help button element not found during setup!");
    }

    if (this.closeHelpButton) {
      this.closeHelpButton.addEventListener("click", () => {
        console.log("Close help button clicked");
        const helpPanel = document.getElementById("help-panel");
        if (helpPanel) {
          helpPanel.classList.add("hidden");
          console.log("Help panel hidden");
        }
      });
    }

    // Back button
    if (this.backButton) {
      this.backButton.addEventListener("click", () => {
        this.endConversation();
      });
    }

    // Repeat button
    if (this.repeatButton) {
      this.repeatButton.addEventListener("click", () => {
        console.log(
          "Repeat button clicked, last message:",
          this.lastBotMessage
        );
        if (this.lastBotMessage && this.speechHandler) {
          this.speechHandler.speak(this.lastBotMessage);
        }
      });
    }

    // Popup button
    if (this.popupButton && this.popup) {
      this.popupButton.addEventListener("click", () => {
        this.popup.classList.add("hidden");
      });
    }
  }

startConversation(topic) {
  console.log("Starting conversation with topic:", topic);
  this.currentTopic = topic;

  // Obtenemos referencias frescas a los elementos críticos de la UI
  this.topicSelectorPanel = document.querySelector(".topic-selector-panel");
  this.conversationPanel = document.querySelector(".conversation-panel");
  this.chatMessages = document.getElementById("chat-messages");

  // Verificar que los elementos DOM existen
  console.log("topicSelectorPanel exists:", !!this.topicSelectorPanel);
  console.log("conversationPanel exists:", !!this.conversationPanel);
  console.log("chatMessages exists:", !!this.chatMessages);

  // Hide topic selector, show conversation panel
  if (this.topicSelectorPanel)
    this.topicSelectorPanel.classList.add("hidden");
  if (this.conversationPanel)
    this.conversationPanel.classList.remove("hidden");

  // Clear previous messages
  if (this.chatMessages) {
    this.chatMessages.innerHTML = "";
    console.log("Cleared chat messages");
  }

    // Get the bot module for this topic
    let botModule;
    switch (topic) {
      case "personalInfo":
        botModule = new PersonalInfoBot();
        break;
      case "freeTime":
        botModule = new FreeTimeBot();
        break;
      case "pastActivities":
        if (typeof PastActivitiesBot !== "undefined") {
          botModule = new PastActivitiesBot();
        } else {
          botModule = new GenericBot("Past Activities");
        }
        break;
      case "experiences":
        if (typeof ExperiencesBot !== "undefined") {
          botModule = new ExperiencesBot();
        } else {
          botModule = new GenericBot("Experiences");
        }
        break;
      case "futurePlans":
        if (typeof FuturePlansBot !== "undefined") {
          botModule = new FuturePlansBot();
        } else {
          botModule = new GenericBot("Future Plans");
        }
        break;
      case "recommendations":
        if (typeof RecommendationsBot !== "undefined") {
          botModule = new RecommendationsBot();
        } else {
          botModule = new GenericBot("Recommendations");
        }
        break;
      case "imaginarySituations":
        if (typeof ImaginarySituationsBot !== "undefined") {
          botModule = new ImaginarySituationsBot();
        } else {
          botModule = new GenericBot("Imaginary Situations");
        }
        break;
      default:
        console.error("Unknown topic:", topic);
        botModule = new GenericBot("Conversation");
    }

    this.activeBotModule = botModule;

    // Initialize grammar help
    this.updateGrammarHelp();

    // Start conversation with initial greeting
    const greeting = this.activeBotModule.getInitialGreeting();
    this.addMessage(greeting, "bot");
    this.lastBotMessage = greeting;

    // Speak the greeting if speech handler exists
    if (this.speechHandler) {
      console.log("Speaking initial greeting");
      this.speechHandler.speak(greeting, () => {
        // Start listening after greeting
        console.log("Initial greeting completed, starting listening");
        setTimeout(() => {
          this.speechHandler.startListening();
        }, 500);
      });
    } else {
      console.warn("No speech handler to speak greeting");
    }
  }

  endConversation() {
    // Cancel any speech or recognition
    if (this.speechHandler) {
      this.speechHandler.cancelSpeech();
      this.speechHandler.stopListening();
    }

    // Clear message queue
    this.messageQueue = [];
    this.isProcessingQueue = false;

    // Hide conversation panel, show topic selector
    if (this.conversationPanel) this.conversationPanel.classList.add("hidden");
    if (this.topicSelectorPanel)
      this.topicSelectorPanel.classList.remove("hidden");

    // Reset state
    this.currentTopic = null;
    this.activeBotModule = null;
    this.lastBotMessage = "";
  }

  addMessage(text, sender) {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) {
        console.error("Chat messages container not found!");
        return;
    }

    console.log(`Adding ${sender} message:`, text);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble");
    messageBubble.textContent = text;

    const messageTime = document.createElement("div");
    messageTime.classList.add("message-time");

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    messageTime.textContent = `${hours}:${minutes}`;

    messageBubble.appendChild(messageTime);
    messageDiv.appendChild(messageBubble);
    chatMessages.appendChild(messageDiv);

    // Ensure the new message is visible
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === "bot") {
        this.lastBotMessage = text;
    }
  }

  queueBotResponse(response) {
    // Add to queue
    console.log("Queueing bot response:", response);
    this.messageQueue.push(response);

    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processMessageQueue();
    }
  }

processMessageQueue() {
    if (this.messageQueue.length === 0) {
        this.isProcessingQueue = false;
        return;
    }

    this.isProcessingQueue = true;
    const message = this.messageQueue.shift();

    this.addMessage(message, "bot");

    if (this.speechHandler) {
        console.log("Speaking bot response");
        this.speechHandler.speak(message, () => {
            setTimeout(() => {
                this.processMessageQueue();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            this.processMessageQueue();
        }, 1000);
    }
}

  toggleHelpPanel() {
    // Simple direct approach - get fresh reference
    const helpPanel = document.getElementById("help-panel");
    console.log("toggleHelpPanel called, helpPanel found:", !!helpPanel);
    
    if (helpPanel) {
      // Toggle the visibility
      helpPanel.classList.toggle("hidden");
      console.log("Help panel visibility toggled");
      
      // Update grammar help content if panel is now visible
      if (!helpPanel.classList.contains("hidden") && this.activeBotModule) {
        console.log("Updating grammar help content");
        this.updateGrammarHelp();
      }
    } else {
      console.error("Help panel element not found!");
    }
  }

  updateGrammarHelp() {
    const helpContent = document.getElementById("help-content");
    if (!helpContent) {
      console.error("Help content element not found!");
      return;
    }
    
    if (!this.activeBotModule) {
      console.warn("No active bot module to get grammar help from");
      return;
    }

    console.log("Updating grammar help content");
    let grammarHelp;
    
    try {
      grammarHelp = this.activeBotModule.getGrammarHelp();
      console.log("Grammar help retrieved:", grammarHelp);
    } catch (e) {
      console.error("Error getting grammar help:", e);
      grammarHelp = [
        {
          title: "Grammar Help Unavailable",
          description: "Sorry, grammar help for this topic is currently unavailable.",
          examples: []
        }
      ];
    }
    
    helpContent.innerHTML = "";

    for (const section of grammarHelp) {
      const card = document.createElement("div");
      card.classList.add("grammar-card");

      const title = document.createElement("h3");
      title.textContent = section.title;
      card.appendChild(title);

      const description = document.createElement("p");
      description.innerHTML = section.description;
      card.appendChild(description);

      if (section.examples && section.examples.length > 0) {
        const examplesDiv = document.createElement("div");
        examplesDiv.classList.add("example");

        section.examples.forEach((example) => {
          const examplePara = document.createElement("p");
          examplePara.innerHTML = `<span class="grammar-example">${example}</span>`;
          examplesDiv.appendChild(examplePara);
        });

        card.appendChild(examplesDiv);
      }

      helpContent.appendChild(card);
    }
  }

  showError(message) {
    console.error("UI error:", message);
    if (this.popup) {
      const popupTitle = document.getElementById("popup-title");
      const popupMessage = document.getElementById("popup-message");

      if (popupTitle) popupTitle.textContent = "Error";
      if (popupMessage) popupMessage.textContent = message;
      this.popup.classList.remove("hidden");
    } else {
      // Fallback to alert if popup element doesn't exist
      alert(`Error: ${message}`);
    }
  }
}

// Create a generic bot for topics without specific implementations
class GenericBot {
  constructor(topicName) {
    this.topicName = topicName;
    this.conversationState = {
      currentStep: 0,
    };

    this.questionSequence = [
      "Can you tell me more about that?",
      "How do you feel about that?",
      "What's your experience with this topic?",
      "Would you like to learn more about this topic?",
    ];
  }

  getInitialGreeting() {
    return `Welcome to the ${
      this.topicName
    } conversation! Let's practice English by discussing this topic. What would you like to talk about related to ${this.topicName.toLowerCase()}?`;
  }

  processUserInput(input) {
    const currentStep = this.conversationState.currentStep;

    // Simple response based on current step
    let response = "That's interesting! ";

    // Move to next question
    this.conversationState.currentStep =
      (this.conversationState.currentStep + 1) % this.questionSequence.length;

    // Add next question
    response += this.questionSequence[this.conversationState.currentStep];

    return response;
  }

  getFallbackResponse() {
    return "I'm sorry, I didn't catch that. Could you please try again?";
  }

  getGrammarHelp() {
    return [
      {
        title: "Conversation Basics",
        description: "Here are some useful phrases for conversation:",
        examples: [
          "I think that...",
          "In my opinion...",
          "I agree/disagree because...",
          "How about you?",
        ],
      },
      {
        title: "Asking Questions",
        description: "Different ways to ask questions:",
        examples: [
          "What do you think about...?",
          "How do you feel about...?",
          "Have you ever...?",
          "Why do you like...?",
        ],
      },
    ];
  }
}

// Initialize UI Controller instance globally
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing UI Controller");

  // Wait a bit for speech handler to initialize first
  setTimeout(() => {
    // Global instance for access from other scripts
    window.uiController = new UIController(window.speechHandler);
    console.log("UI Controller initialized");
    
    // Direct binding to help button as a backup
    const helpButton = document.getElementById("help-button");
    const helpPanel = document.getElementById("help-panel");
    
    if (helpButton && helpPanel) {
      console.log("Adding direct event listener to help button");
      helpButton.onclick = function() {
        console.log("Help button clicked (direct handler)");
        helpPanel.classList.toggle("hidden");
        console.log("Help panel is now:", helpPanel.classList.contains("hidden") ? "hidden" : "visible");
        
        // Update grammar help content if panel is now visible
        if (!helpPanel.classList.contains("hidden") && window.uiController && window.uiController.activeBotModule) {
          console.log("Updating grammar help from direct handler");
          window.uiController.updateGrammarHelp();
        }
      };
    }
  }, 500);
});
