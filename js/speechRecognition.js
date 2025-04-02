/**
 * Speech recognition functionality for the Talk2Learn application
 */

// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Configure speech recognition
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

// DOM elements
let micButton;
let listeningIndicator;
let speechStatus;
let conversationBody;

// Speech recognition state
let isListening = false;

/**
 * Initialize speech recognition components
 */
function initializeSpeechRecognition() {
    micButton = document.getElementById('micButton');
    listeningIndicator = document.getElementById('listeningIndicator');
    speechStatus = document.getElementById('speechStatus');
    conversationBody = document.getElementById('conversationBody');
    
    if (!micButton || !listeningIndicator || !speechStatus) {
        console.error('Speech recognition elements not found');
        return;
    }
    
    // Set up event listeners
    micButton.addEventListener('click', toggleListening);
    
    // Set up recognition events
    recognition.onstart = handleRecognitionStart;
    recognition.onresult = handleRecognitionResult;
    recognition.onerror = handleRecognitionError;
    recognition.onend = handleRecognitionEnd;
}

/**
 * Toggle listening state
 */
function toggleListening() {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

/**
 * Start speech recognition
 */
function startListening() {
    try {
        recognition.start();
        isListening = true;
    } catch (error) {
        console.error('Error starting speech recognition:', error);
        showToast('Error starting speech recognition. Please try again.');
    }
}

/**
 * Stop speech recognition
 */
function stopListening() {
    try {
        recognition.stop();
        isListening = false;
    } catch (error) {
        console.error('Error stopping speech recognition:', error);
    }
}

/**
 * Handle recognition start event
 */
function handleRecognitionStart() {
    // Update UI to show listening state
    micButton.classList.add('listening');
    listeningIndicator.classList.add('active');
    speechStatus.textContent = 'Listening...';
}

/**
 * Handle recognition result event
 * @param {SpeechRecognitionEvent} event - The speech recognition result event
 */
function handleRecognitionResult(event) {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    
    console.log(`Recognized: ${transcript} (Confidence: ${confidence.toFixed(2)})`);
    
    // Add user message to conversation
    addMessage('user', transcript);
    
    // Process the user input
    processUserInput(transcript);
}

/**
 * Handle recognition error event
 * @param {SpeechRecognitionError} event - The speech recognition error event
 */
function handleRecognitionError(event) {
    console.error('Speech recognition error:', event.error);
    
    let errorMessage = 'There was an error with speech recognition. ';
    
    switch (event.error) {
        case 'no-speech':
            errorMessage += 'No speech was detected.';
            break;
        case 'aborted':
            errorMessage += 'Speech recognition was aborted.';
            break;
        case 'audio-capture':
            errorMessage += 'No microphone was found or microphone is disabled.';
            break;
        case 'network':
            errorMessage += 'Network error occurred.';
            break;
        case 'not-allowed':
            errorMessage += 'Microphone permission was denied.';
            break;
        case 'service-not-allowed':
            errorMessage += 'Speech recognition service is not allowed.';
            break;
        default:
            errorMessage += 'Please try again.';
    }
    
    showToast(errorMessage);
    stopListening();
}

/**
 * Handle recognition end event
 */
function handleRecognitionEnd() {
    // Update UI to show not listening state
    micButton.classList.remove('listening');
    listeningIndicator.classList.remove('active');
    speechStatus.textContent = 'Click the mic to start speaking';
    isListening = false;
}

/**
 * Check if the browser supports speech recognition
 * @returns {boolean} Whether speech recognition is supported
 */
function isSpeechRecognitionSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Check microphone permissions
 * @returns {Promise<boolean>} Promise resolving to whether microphone is available
 */
async function checkMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.error('Microphone permission error:', error);
        return false;
    }
}