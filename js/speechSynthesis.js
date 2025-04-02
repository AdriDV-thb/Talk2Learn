/**
 * Speech synthesis functionality for the Talk2Learn application
 */

// Speech synthesis voices
let voices = [];
let preferredVoice = null;

/**
 * Initialize speech synthesis
 */
function initializeSpeechSynthesis() {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported');
        showToast('Your browser does not support speech synthesis. Some features may not work.');
        return;
    }
    
    // Load available voices
    loadVoices();
    
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

/**
 * Load available voices and select a preferred English voice
 */
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    
    // Try to find a good English voice
    preferredVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') || 
        voice.name.includes('Microsoft Zira')
    );
    
    // If no specific voice found, find any English voice
    if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
            voice.lang.includes('en-') && voice.name.includes('Female')
        );
    }
    
    // Fall back to any English voice
    if (!preferredVoice) {
        preferredVoice = voices.find(voice => voice.lang.includes('en-'));
    }
    
    // Last resort: use the first available voice
    if (!preferredVoice && voices.length > 0) {
        preferredVoice = voices[0];
    }
    
    console.log('Selected voice:', preferredVoice ? preferredVoice.name : 'None available');
}

/**
 * Speak text using speech synthesis
 * @param {string} text - The text to speak
 * @returns {Promise} A promise that resolves when speaking is complete
 */
function speakText(text) {
    return new Promise((resolve, reject) => {
        // Check if synthesis is supported and text is provided
        if (!('speechSynthesis' in window)) {
            reject('Speech synthesis not supported');
            return;
        }
        
        if (!text || text.trim() === '') {
            resolve();
            return;
        }
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice if available
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Set properties
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Set event handlers
        utterance.onend = () => {
            console.log('Speech synthesis finished');
            resolve();
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            reject(event);
        };
        
        // Speak the utterance
        window.speechSynthesis.speak(utterance);
    });
}

/**
 * Split long text into speakable chunks
 * Speech synthesis can sometimes cut off for very long texts
 * @param {string} text - The long text to split
 * @returns {string[]} Array of text chunks
 */
function splitTextIntoChunks(text) {
    // Maximum characters per chunk
    const maxChunkLength = 200;
    
    // Split by sentence endings
    const sentenceBreaks = text.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentenceBreaks) {
        if (currentChunk.length + sentence.length <= maxChunkLength) {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk);
            }
            currentChunk = sentence;
        }
    }
    
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    
    return chunks;
}

/**
 * Speak long text by breaking it into chunks
 * @param {string} text - The long text to speak
 * @returns {Promise} A promise that resolves when all speaking is complete
 */
async function speakLongText(text) {
    const chunks = splitTextIntoChunks(text);
    
    for (const chunk of chunks) {
        await speakText(chunk);
    }
}