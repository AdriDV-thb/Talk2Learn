/**
 * Main application script for the Talk2Learn English practice app
 * Initializes and connects all components
 */

// Global application state
let isAppInitialized = false;

// DOM elements
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeModalBtn = document.querySelector('.close-modal');
const resetBtn = document.getElementById('resetBtn');
const levelSelect = document.getElementById('levelSelect');

/**
 * Initialize the application
 */
function initializeApp() {
    if (isAppInitialized) return;
    
    console.log('Initializing Talk2Learn application...');
    
    // Check browser compatibility
    checkBrowserCompatibility();
    
    // Initialize components
    initializeTopics();
    initializeSpeechRecognition();
    initializeSpeechSynthesis();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('Application initialized');
    isAppInitialized = true;
}

/**
 * Check browser compatibility for required features
 */
function checkBrowserCompatibility() {
    // Check speech recognition support
    if (!isSpeechRecognitionSupported()) {
        showToast('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
        console.error('Speech recognition not supported');
    }
    
    // Check speech synthesis support
    if (!('speechSynthesis' in window)) {
        showToast('Your browser does not support speech synthesis. Some features may not work.');
        console.error('Speech synthesis not supported');
    }
    
    // Check for microphone
    checkMicrophonePermission()
        .then(hasPermission => {
            if (!hasPermission) {
                showToast('Microphone access is required for this application.');
            }
        });
}

/**
 * Set up application event listeners
 */
function setupEventListeners() {
    // Help button and modal
    if (helpBtn && helpModal && closeModalBtn) {
        helpBtn.addEventListener('click', () => {
            helpModal.classList.add('active');
        });
        
        closeModalBtn.addEventListener('click', () => {
            helpModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        helpModal.addEventListener('click', (event) => {
            if (event.target === helpModal) {
                helpModal.classList.remove('active');
            }
        });
    }
    
    // Reset conversation button
    if (resetBtn) {
        resetBtn.addEventListener('click', resetConversation);
    }
    
    // Level selection
    if (levelSelect) {
        levelSelect.addEventListener('change', () => {
            // If a topic is selected, reinitialize conversation with new level
            if (window.currentTopic) {
                resetConversation();
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Space bar to toggle speech recognition
        if (event.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
            event.preventDefault();
            toggleListening();
        }
        
        // Escape key to close modal
        if (event.code === 'Escape' && helpModal.classList.contains('active')) {
            helpModal.classList.remove('active');
        }
    });
}

/**
 * Handle errors gracefully
 * @param {Error} error - The error object
 * @param {string} context - Where the error occurred
 */
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    showToast(`Something went wrong. Please try again.`);
}

/**
 * Application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeApp();
    } catch (error) {
        handleError(error, 'application initialization');
    }
});

// Add window listener for unhandled errors
window.addEventListener('error', (event) => {
    handleError(event.error, 'unhandled error');
});

// Expose necessary functions to window for debugging
window.debugApp = {
    reloadTopics: initializeTopics,
    checkSpeech: isSpeechRecognitionSupported,
    checkMic: checkMicrophonePermission
};