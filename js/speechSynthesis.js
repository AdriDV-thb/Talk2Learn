/**
 * Speech synthesis functionality for the Talk2Learn application
 * Enhanced for consistent English pronunciation across devices
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
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`).join(', '));
    
    // First priority: Try to find specific high-quality English voices
    preferredVoice = voices.find(voice => 
        (voice.name.includes('Google UK English Female') || 
        voice.name.includes('Microsoft Zira') ||
        voice.name.includes('Samantha')) && 
        voice.lang.startsWith('en-')
    );
    
    // Second priority: Find any English female voice
    if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en-') && 
            (voice.name.includes('Female') || voice.name.includes('Woman'))
        );
    }
    
    // Third priority: Find any English voice
    if (!preferredVoice) {
        preferredVoice = voices.find(voice => voice.lang.startsWith('en-'));
    }
    
    // Last resort: use the first available voice but force English language
    if (!preferredVoice && voices.length > 0) {
        preferredVoice = voices[0];
    }
    
    console.log('Selected voice:', preferredVoice ? `${preferredVoice.name} (${preferredVoice.lang})` : 'None available');
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
        
        // Create utterance with explicit English language setting
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Explicitly set English language
        utterance.lang = 'en-US';
        
        // Set voice if available
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Set properties - slightly slower rate for mobile clarity
        utterance.rate = 0.95; // Slightly slower for better clarity
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
        
        // Fix for Android Chrome cutting off speech
        if (/Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent)) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }
        
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
    // Maximum characters per chunk (shorter for mobile devices)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const maxChunkLength = isMobile ? 150 : 200;
    
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
        
        // Add a small pause between chunks for natural speech flow
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Fix for mobile browsers that may pause speech synthesis
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }
    }
}
