/**
 * Enhanced Speech Handler with improved voice quality for mobile devices
 * This version has better voice selection and natural speech parameters
 */

class SpeechHandler {
  constructor() {
    // State variables
    this.isInitialized = false;
    this.isListening = false;
    this.isSpeaking = false; 
    this.isMuted = false;
    this.transcript = "";
    this.finalTranscript = "";
    this.interimTranscript = "";

    // Increase pause timeout to 5.5 seconds for better natural pause detection
    this.pauseTimeout = 5500;
    this.pauseTimer = null;

    // Add new variable to track if we've received any speech
    this.hasSpeechDetected = false;

    // Add a minimum speech duration before accepting
    this.minSpeechDuration = 1500; // 1.5 seconds
    this.speechStartTime = null;

    this.preferredVoice = null;
    
    // Speech parameters for more natural sound
    this.speechRate = 0.92; // Slightly slower for more natural rhythm
    this.speechPitch = 1.02; // Slightly higher pitch can sound more natural on mobile
    this.speechVolume = 1.0;
    
    // Platform detection
    this.isMobileDevice = this.detectMobileDevice();
    
    // Speech chunking for better mobile performance
    this.maxSpeechChunkLength = 120; // Max characters per chunk

    // Event handlers
    this.onStartCallback = null;
    this.onResultCallback = null;
    this.onEndCallback = null;
    this.onErrorCallback = null;
    this.customResultHandler = null;

    // Initialize components
    this.initSpeechComponents();
  }
  
  detectMobileDevice() {
    // Detect if the device is mobile
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
    console.log("Device detected as:", isMobile ? "mobile" : "desktop");
    return isMobile;
  }

  initSpeechComponents() {
    console.log("Initializing speech components...");

    // Initialize speech recognition if available
    this.initSpeechRecognition();

    // Initialize speech synthesis if available
    this.initSpeechSynthesis();

    // Mark as initialized if either component is working
    this.isInitialized = this.recognitionSupported || this.synthesisSupported;

    if (this.isInitialized) {
      console.log(
        "Speech handler initialized successfully with:",
        this.recognitionSupported ? "recognition" : "no recognition",
        this.synthesisSupported ? "synthesis" : "no synthesis"
      );
    } else {
      console.error("Failed to initialize speech components!");
      this.showError(
        "Your browser doesn't support speech features. Please try Chrome, Edge, or Safari."
      );
    }
  }

  initSpeechRecognition() {
    // Check for speech recognition support
    this.recognitionSupported = false;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported by this browser");
      return;
    }

    try {
      // Create recognition instance
      this.recognition = new SpeechRecognition();

      // Change to continuous mode to prevent auto-stopping on pauses
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";
      this.recognition.maxAlternatives = 1;

      // Setup recognition event listeners
      this.setupRecognitionListeners();
      this.recognitionSupported = true;
      console.log("Speech recognition initialized successfully");

      // Request microphone permission explicitly
      this.checkMicrophonePermission();
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      this.showError(
        "Failed to initialize speech recognition: " + error.message
      );
    }
  }

  initSpeechSynthesis() {
    // Check for speech synthesis support
    this.synthesisSupported = false;

    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported by this browser");
      return;
    }

    try {
      // Initialize speech synthesis
      this.synth = window.speechSynthesis;
      this.synthesisSupported = true;

      // Setup event listeners for voices loaded
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          console.log("Voices loaded through onvoiceschanged event");
          this.findPreferredVoice();
        };
      }

      // Try loading voices in multiple ways for better compatibility
      this.findPreferredVoice();
      setTimeout(() => this.findPreferredVoice(), 500);
      setTimeout(() => this.findPreferredVoice(), 1500);
      
      // Extra attempt specifically for mobile
      if (this.isMobileDevice) {
        setTimeout(() => {
          console.log("Extra voice loading attempt for mobile");
          this.findPreferredVoice();
        }, 3000);
      }

      console.log("Speech synthesis initialized successfully");
    } catch (error) {
      console.error("Error initializing speech synthesis:", error);
      this.showError("Failed to initialize speech synthesis: " + error.message);
    }
  }

  checkMicrophonePermission() {
    // Request microphone access explicitly to prompt the permission dialog
    console.log("Requesting microphone permissions...");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          console.log("Microphone permission granted");
          // Stop all tracks to release microphone
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch((error) => {
          console.error("Microphone permission denied:", error);
          this.showError(
            "Microphone access denied. Please allow microphone access to use the conversation feature."
          );
        });
    } else {
      console.warn("getUserMedia not supported");
    }
  }

  setupRecognitionListeners() {
    if (!this.recognition) return;

    // Handle recognition start
    this.recognition.onstart = () => {
      console.log("Speech recognition started");
      this.isListening = true;
      this.finalTranscript = "";
      this.interimTranscript = "";
      this.hasSpeechDetected = false;
      this.speechStartTime = null;

      if (this.onStartCallback) this.onStartCallback();
    };

    // Handle recognition results
    this.recognition.onresult = (event) => {
      // Mark that we've detected speech
      if (!this.hasSpeechDetected) {
        this.hasSpeechDetected = true;
        this.speechStartTime = Date.now();
        console.log("Speech detected, starting timer");
      }

      this.interimTranscript = "";
      let hasFinalResult = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript;
          hasFinalResult = true;
          console.log(
            "Final transcript segment:",
            event.results[i][0].transcript
          );
        } else {
          this.interimTranscript += event.results[i][0].transcript;
        }
      }

      this.transcript = this.finalTranscript + this.interimTranscript;
      console.log("Current transcript:", this.transcript);

      // Reset pause timer if it exists
      if (this.pauseTimer) {
        clearTimeout(this.pauseTimer);
        this.pauseTimer = null;
      }

      // Only set the pause timer if we have detected speech
      // and the transcript isn't empty
      if (this.hasSpeechDetected && this.transcript.trim() !== "") {
        console.log("Setting pause timer for", this.pauseTimeout, "ms");

        // Set new pause timer
        this.pauseTimer = setTimeout(() => {
          const speechDuration = Date.now() - this.speechStartTime;
          console.log("Pause detected. Speech duration:", speechDuration, "ms");

          // Only stop if we've had a minimum duration of speech
          if (speechDuration >= this.minSpeechDuration) {
            console.log(
              "Pause timeout, stopping recognition after sufficient duration"
            );
            this.stopListening();
          } else {
            console.log("Speech duration too short, continuing to listen");
          }
        }, this.pauseTimeout);
      }

      // Use custom handler if set and we have final transcript
      if (this.customResultHandler && hasFinalResult) {
        this.customResultHandler(this.finalTranscript);
        return;
      }

      // Otherwise use default callback
      if (this.onResultCallback) {
        this.onResultCallback(this.interimTranscript, this.finalTranscript);
      }
    };

    // Handle recognition end
    this.recognition.onend = () => {
      console.log("Speech recognition ended");
      if (this.pauseTimer) {
        clearTimeout(this.pauseTimer);
        this.pauseTimer = null;
      }

      this.isListening = false;

      if (this.hasSpeechDetected && this.transcript.trim() !== "") {
        if (this.onEndCallback) {
          const finalText = this.finalTranscript;
          this.finalTranscript = "";
          this.interimTranscript = "";
          this.transcript = "";
          this.onEndCallback(finalText);
        }
      } else {
        console.log("No speech detected, restarting recognition");
        setTimeout(() => this.startListening(), 300);
      }
    };

    // Handle recognition errors
    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "no-speech") {
        console.log("No speech detected");
      } else if (event.error === "audio-capture") {
        this.showError("No microphone was found or microphone is disabled.");
      } else if (event.error === "not-allowed") {
        this.showError(
          "Microphone permission denied. Please allow microphone access to use this app."
        );
      } else if (event.error === "network") {
        this.showError(
          "Network error occurred. Please check your internet connection."
        );
      } else if (event.error === "aborted") {
        console.log("Speech recognition aborted");
      } else {
        this.showError("Speech recognition error: " + event.error);
      }

      this.isListening = false;
      if (this.onErrorCallback) this.onErrorCallback(event.error);
    };

    // Add new handler for speech end
    this.recognition.onspeechend = () => {
      console.log("Speech ended event detected");
      // Don't stop immediately to allow for pauses
      // Instead, rely on the pause timer
    };

    // Add new handler for no match
    this.recognition.onnomatch = () => {
      console.log("No match detected");
    };

    // Add new handler for audio end
    this.recognition.onaudioend = () => {
      console.log("Audio capture ended");
    };
  }

  findPreferredVoice() {
    if (!this.synth) return;

    // Get available voices
    const voices = this.synth.getVoices();
    
    if (voices.length === 0) {
      // If no voices loaded yet, schedule another attempt
      console.log("No voices available yet, will try again later");
      return;
    }

    console.log(`Found ${voices.length} voices`);

    // Log all available voices with detailed info for debugging
    voices.forEach((voice, i) => {
      const voiceDetails = {
        index: i,
        name: voice.name,
        lang: voice.lang,
        default: voice.default || false,
        localService: voice.localService || false,
        voiceURI: voice.voiceURI
      };
      console.log("Voice details:", voiceDetails);
    });

    // Different voice priorities for mobile vs desktop
    const mobilePreferredVoices = [
      // iOS high-quality voices
      "Samantha",
      "Daniel",
      "Karen",
      "Moira",
      "Tessa",
      
      // Android high-quality voices
      "Google UK English Female",
      "Google UK English Male",
      "en-GB-Standard-A",
      "en-GB-Standard-B",
      "en-GB-Standard-C",
      "en-GB-Standard-D",
      
      // General high-quality voices that work well on mobile
      "Microsoft Hazel",
      "Microsoft Sonia",
      "Microsoft Zira",
      "English United Kingdom",
      "Microsoft Lucy",
      "Microsoft David"
    ];
    
    const desktopPreferredVoices = [
      "Google UK English Female",
      "Microsoft Hazel - English (United Kingdom)",
      "Microsoft Sonia",
      "Microsoft Zira - English (United States)",
      "Microsoft Lucy",
      "Microsoft David",
      "Apple Samantha",
      "Google UK English Male",
      "English United Kingdom"
    ];
    
    const preferredVoiceNames = this.isMobileDevice ? mobilePreferredVoices : desktopPreferredVoices;

    // Try to find one of our preferred voices using partial name matching
    for (const name of preferredVoiceNames) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) {
        this.preferredVoice = voice;
        console.log(`Using preferred voice: ${voice.name} (${voice.lang})`);
        return;
      }
    }

    // Try to find an English voice with localService=true (better performance on mobile)
    if (this.isMobileDevice) {
      const localEnglishVoice = voices.find(v => 
        v.lang.includes("en") && 
        v.localService === true
      );
      
      if (localEnglishVoice) {
        this.preferredVoice = localEnglishVoice;
        console.log(`Using local English voice: ${localEnglishVoice.name} (${localEnglishVoice.lang})`);
        return;
      }
    }

    // Fallback to any English voice
    const englishVoice = voices.find(v => v.lang.includes("en"));
    if (englishVoice) {
      this.preferredVoice = englishVoice;
      console.log(`Using fallback English voice: ${englishVoice.name} (${englishVoice.lang})`);
      return;
    }

    // Last resort - use default voice or first available
    const defaultVoice = voices.find(v => v.default === true);
    if (defaultVoice) {
      this.preferredVoice = defaultVoice;
      console.log(`Using default system voice: ${defaultVoice.name}`);
    } else if (voices.length > 0) {
      this.preferredVoice = voices[0];
      console.log(`Using first available voice: ${voices[0].name}`);
    }
  }

  startListening() {
    if (!this.recognitionSupported) {
      console.warn("Speech recognition not supported");
      this.showError("Speech recognition is not supported by your browser.");
      return false;
    }

    if (!this.isListening && this.recognition) {
      try {
        console.log("Starting speech recognition");
        // Reset speech tracking variables
        this.hasSpeechDetected = false;
        this.speechStartTime = null;
        this.recognition.start();
        return true;
      } catch (error) {
        console.error("Error starting recognition:", error);

        // If already started, stop and restart
        if (error.name === "InvalidStateError") {
          console.log("Recognition already started, stopping and restarting");
          this.recognition.stop();
          setTimeout(() => this.startListening(), 300);
        } else {
          this.showError("Failed to start listening: " + error.message);
        }
        return false;
      }
    }
    return this.isListening;
  }

  stopListening() {
    if (this.isListening && this.recognition) {
      console.log("Stopping speech recognition");
      try {
        this.recognition.stop();
        return true;
      } catch (error) {
        console.error("Error stopping recognition:", error);
        return false;
      }
    }
    return !this.isListening;
  }

  // Split text into chunks for better mobile speech synthesis
  splitTextIntoChunks(text) {
    if (!this.isMobileDevice || text.length <= this.maxSpeechChunkLength) {
        return [text];
    }
    if (!text || typeof text !== "string") {
        console.error("Invalid text input for splitting:", text);
        return [];
    }
    if (!this.isMobileDevice || text.length <= this.maxSpeechChunkLength) {
        return [text];
    }
    
    const chunks = [];
    let currentChunk = "";
    
    // Split by sentences first for more natural breaks
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    for (const sentence of sentences) {
      // If the sentence itself is too long, split it further
      if (sentence.length > this.maxSpeechChunkLength) {
        // Find a good break point (after a comma or space)
        let start = 0;
        while (start < sentence.length) {
          let end = start + this.maxSpeechChunkLength;
          if (end >= sentence.length) {
            chunks.push(sentence.slice(start));
            break;
          }
          
          // Look for comma or space to break at
          let breakPoint = sentence.lastIndexOf(',', end);
          if (breakPoint <= start) {
            breakPoint = sentence.lastIndexOf(' ', end);
          }
          
          // If no good break point, just break at max length
          if (breakPoint <= start) {
            breakPoint = end;
          }
          
          chunks.push(sentence.slice(start, breakPoint + 1));
          start = breakPoint + 1;
        }
      } else {
        // Check if adding this sentence would make current chunk too long
        if (currentChunk.length + sentence.length > this.maxSpeechChunkLength) {
          if (currentChunk.length > 0) {
            chunks.push(currentChunk);
          }
          currentChunk = sentence;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
      }
    }
    
    // Add the last chunk if not empty
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    
    console.log(`Split text into ${chunks.length} chunks for better speech synthesis`);
    return chunks;
  }

  speak(text, callback = null) {
    if (!this.synthesisSupported) {
        if (callback) setTimeout(callback, 100);
        return false;
    }
    if (!text || typeof text !== "string") {
        console.error("Invalid text input for speaking:", text);
        if (callback) setTimeout(callback, 100);
        return false;
    }
    if (!this.synthesisSupported) {
      console.warn("Speech synthesis not supported");
      if (callback) setTimeout(callback, 100);
      return false;
    }

    // If muted, just run the callback
    if (this.isMuted) {
      if (callback) setTimeout(callback, 100);
      return false;
    }

    console.log("Speaking:", text);

    // Cancel any ongoing speech
    this.cancelSpeech();
    
    // Split text into chunks for better mobile performance
    const textChunks = this.splitTextIntoChunks(text);
    console.log(`Speaking text in ${textChunks.length} chunks`);
    
    // Track progress through chunks
    let currentChunkIndex = 0;
    
    const speakNextChunk = () => {
      if (currentChunkIndex >= textChunks.length) {
        // All chunks spoken
        if (callback) setTimeout(callback, 100);
        return;
      }
      
      const chunkText = textChunks[currentChunkIndex];
      currentChunkIndex++;
      
      try {
        // Create utterance for this chunk
        const utterance = new SpeechSynthesisUtterance(chunkText);

        // Set preferred voice if available
        if (this.preferredVoice) {
          utterance.voice = this.preferredVoice;
          console.log(`Using voice: ${this.preferredVoice.name} for chunk ${currentChunkIndex}`);
        }

        // Use optimized speech parameters
        // Slightly different settings for mobile
        if (this.isMobileDevice) {
          utterance.rate = this.speechRate;
          utterance.pitch = this.speechPitch;
          
          // Add slight variations for more natural sound on mobile
          if (currentChunkIndex % 2 === 0) {
            utterance.pitch *= 1.01; // Slight variation between chunks
          }
        } else {
          // Desktop settings
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
        }
        
        utterance.volume = this.speechVolume;

        // Set callbacks
        utterance.onstart = () => {
          console.log(`Speech chunk ${currentChunkIndex}/${textChunks.length} started`);
          this.isSpeaking = true;
        };

        utterance.onend = () => {
          console.log(`Speech chunk ${currentChunkIndex}/${textChunks.length} ended`);
          
          // If all chunks are done
          if (currentChunkIndex >= textChunks.length) {
            this.isSpeaking = false;
            if (callback) setTimeout(callback, 100);
          } else {
            // Speak next chunk with a slight pause for natural rhythm
            setTimeout(speakNextChunk, 50);
          }
        };

        utterance.onerror = (event) => {
          console.error(`Speech synthesis error in chunk ${currentChunkIndex}:`, event);
          
          // Try to continue with next chunk on error
          if (currentChunkIndex < textChunks.length) {
            setTimeout(speakNextChunk, 50);
          } else {
            this.isSpeaking = false;
            if (callback) setTimeout(callback, 100);
          }
        };

        // Apply platform-specific workarounds
        if (this.isMobileDevice) {
          // iOS and some Android devices need these tricks
          this.applyMobileWorkarounds(utterance);
        }

        // Speak the chunk
        this.synth.speak(utterance);
        
        // Single chunk case - just return
        if (textChunks.length === 1) {
          return true;
        }
        
      } catch (error) {
        console.error(`Error speaking chunk ${currentChunkIndex}:`, error);
        
        // Try to continue with next chunk on error
        if (currentChunkIndex < textChunks.length) {
          setTimeout(speakNextChunk, 50);
        } else {
          this.isSpeaking = false;
          if (callback) setTimeout(callback, 100);
        }
      }
    };
    
    // Start speaking the first chunk
    speakNextChunk();
    return true;
  }
  
  applyMobileWorkarounds(utterance) {
    // iOS specific workarounds
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
      // iOS needs these speech parameters within specific ranges
      utterance.rate = Math.max(0.1, Math.min(utterance.rate, 1.0));
      utterance.pitch = Math.max(0.5, Math.min(utterance.pitch, 2.0));
      
      // iOS often cuts off utterances - add a small silence at the end
      utterance.text += " ";
    }
    
    // Android specific workarounds
    const isAndroid = /Android/.test(navigator.userAgent);
    if (isAndroid) {
      // Some Android browsers need rate adjusted
      utterance.rate = Math.max(0.1, Math.min(utterance.rate, 1.0));
      
      // Voice instability workaround for some Android versions
      if (!utterance.voice && this.preferredVoice) {
        console.log("Reapplying voice for Android compatibility");
        utterance.voice = this.preferredVoice;
      }
    }
  }

  cancelSpeech() {
    if (this.synthesisSupported && this.synth) {
      console.log("Cancelling any ongoing speech");
      this.synth.cancel();
      this.isSpeaking = false;
      return true;
    }
    return false;
  }

  toggleListening() {
    if (this.isListening) {
      return this.stopListening();
    } else {
      return this.startListening();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.cancelSpeech();
    }
    return this.isMuted;
  }

  setOnStart(callback) {
    this.onStartCallback = callback;
  }

  setOnResult(callback) {
    this.onResultCallback = callback;
  }

  setOnEnd(callback) {
    this.onEndCallback = callback;
  }

  setOnError(callback) {
    this.onErrorCallback = callback;
  }

  setCustomResultHandler(handler) {
    this.customResultHandler = handler;
  }

  resetCustomResultHandler() {
    this.customResultHandler = null;
  }

  showError(message) {
    console.error("Speech handler error:", message);
    const popup = document.getElementById("popup");
    if (popup) {
      const popupTitle = document.getElementById("popup-title");
      const popupMessage = document.getElementById("popup-message");

      if (popupTitle) popupTitle.textContent = "Speech Error";
      if (popupMessage) popupMessage.textContent = message;
      popup.classList.remove("hidden");
    } else {
      // Fallback to alert if popup element doesn't exist
      alert(`Speech Error: ${message}`);
    }
  }
}

// Initialize SpeechHandler as a global instance
let speechHandler;

document.addEventListener("DOMContentLoaded", function () {
  // Create speech handler
  console.log("Creating speech handler");
  speechHandler = new SpeechHandler();
  window.speechHandler = speechHandler; // Make it globally accessible

  // Set up voice status indicators and UI connections
  const setupUI = () => {
    const voiceStatusElement = document.getElementById("voice-status");
    const voiceWaveElement = document.getElementById("voice-wave");

    // Setup event listeners for mic button
    const micButton = document.getElementById("mic-btn");
    if (micButton) {
      micButton.addEventListener("click", function () {
        console.log(
          "Mic button clicked, current state:",
          speechHandler.isListening
        );
        if (speechHandler.isListening) {
          speechHandler.stopListening();
          if (voiceStatusElement)
            voiceStatusElement.textContent = "Ready to listen...";
          if (voiceWaveElement) voiceWaveElement.classList.remove("recording");
          micButton.querySelector("i").className = "fas fa-microphone";
        } else {
          speechHandler.startListening();
          if (voiceStatusElement)
            voiceStatusElement.textContent = "Listening...";
          if (voiceWaveElement) voiceWaveElement.classList.add("recording");
          micButton.querySelector("i").className = "fas fa-stop";
        }
      });
    }

    // Set up repeat button
    const repeatButton = document.getElementById("repeat-btn");
    if (repeatButton) {
      repeatButton.addEventListener("click", function () {
        const chatMessages = document.getElementById("chat-messages");
        if (chatMessages) {
          const lastBotMessage = chatMessages.querySelector(
            ".bot:last-child .message-bubble"
          );
          if (lastBotMessage) {
            const messageText = lastBotMessage.textContent
              .replace(/\d{1,2}:\d{2}$/, "")
              .trim();
            if (messageText) {
              speechHandler.speak(messageText);
            }
          }
        }
      });
    }
  };

  // Setup UI with slight delay to ensure DOM is ready
  setTimeout(setupUI, 500);

  // Debug information 
  setTimeout(() => {
    console.log("Speech handler status after initialization:");
    console.log("- Recognition supported:", speechHandler.recognitionSupported);
    console.log("- Synthesis supported:", speechHandler.synthesisSupported);
    console.log("- Is initialized:", speechHandler.isInitialized);
    console.log("- Device type:", speechHandler.isMobileDevice ? "mobile" : "desktop");
    console.log("- Selected voice:", speechHandler.preferredVoice ? 
        speechHandler.preferredVoice.name : "none yet");

    // Test speech synthesis with a longer phrase that demonstrates voice quality
    if (speechHandler.synthesisSupported) {
      console.log("Testing speech synthesis...");
      speechHandler.speak("", () => {
        console.log("Test speech completed");
      });
    }
    
    // Ensure that voices get reloaded on mobile devices
    if (speechHandler.isMobileDevice && speechHandler.synthesisSupported) {
      console.log("Setting up additional voice reload for mobile devices");
      // Additional attempts for mobile devices
      [4000, 8000].forEach(delay => {
        setTimeout(() => {
          if (!speechHandler.preferredVoice) {
            console.log(`Mobile voice reload attempt at ${delay}ms`);
            speechHandler.findPreferredVoice();
          }
        }, delay);
      });
    }
  }, 2000);
});