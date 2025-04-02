/**
 * AI conversation functionality for the Talk2Learn application
 */

// Conversation history
let conversationHistory = [];

/**
 * Process user input and generate AI response
 * @param {string} userInput - The user's spoken input
 */
async function processUserInput(userInput) {
    if (!userInput || userInput.trim() === '') return;
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        message: userInput
    });
    
    // Show the AI is thinking
    showAiThinking();
    
    try {
        // Get AI response
        const aiResponse = await generateAiResponse(userInput);
        
        // Add AI response to conversation
        addMessage('ai', aiResponse);
        
        // Speak the response
        await speakLongText(aiResponse);
        
        // Add to conversation history
        conversationHistory.push({
            role: 'ai',
            message: aiResponse
        });
        
        // Analyze the user's speech and provide feedback
        analyzeUserSpeech(userInput);
    } catch (error) {
        console.error('Error processing user input:', error);
        showToast('Sorry, there was an error processing your input.');
    }
}

/**
 * Generate AI response based on user input and context
 * @param {string} userInput - The user's spoken input
 * @returns {Promise<string>} The AI response
 */
async function generateAiResponse(userInput) {
    // In a real app, this would call an API
    // For this demo, we'll simulate responses
    
    // Get current topic if any
    const currentTopic = window.currentTopic;
    
    if (!currentTopic) {
        return "Please select a topic first so we can have a more focused conversation.";
    }
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple conversation logic (this would be replaced with actual API call)
    if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
        return "Hello! It's nice to talk with you. " + getRandomPrompt();
    }
    
    if (userInput.toLowerCase().includes('name')) {
        return "I'm your English conversation assistant. I'm here to help you practice your English speaking skills. What's your name?";
    }
    
    if (userInput.toLowerCase().includes('thank')) {
        return "You're welcome! Is there anything else you'd like to talk about related to " + currentTopic.title + "?";
    }
    
    if (userInput.length < 10) {
        return "Could you please elaborate more? Try to speak in complete sentences to get more practice.";
    }
    
    // Topic-specific responses
    switch (currentTopic.id) {
        case 'personal-info':
            if (userInput.toLowerCase().includes('from')) {
                return "That's interesting! How long have you lived there? What do you like most about your hometown?";
            }
            if (userInput.toLowerCase().includes('work') || userInput.toLowerCase().includes('job')) {
                return "Your job sounds interesting. What does a typical day at work look like for you?";
            }
            break;
            
        case 'free-time':
            if (userInput.toLowerCase().includes('hobby') || userInput.toLowerCase().includes('free time')) {
                return "Those are great hobbies! How often do you get to practice them? Do you prefer indoor or outdoor activities?";
            }
            if (userInput.toLowerCase().includes('music') || userInput.toLowerCase().includes('movie')) {
                return "I see you're interested in entertainment. What's the last movie you watched or song you listened to that you really enjoyed?";
            }
            break;
            
        case 'experiences':
            if (userInput.toLowerCase().includes('travel') || userInput.toLowerCase().includes('trip')) {
                return "Traveling is so enriching! Have you ever experienced culture shock or tried unusual foods during your travels?";
            }
            if (userInput.toLowerCase().includes('never')) {
                return "There's always time to try new things in the future. What's something you'd really like to experience someday?";
            }
            break;
    }
    
    // Default: ask a follow-up from the topic's prompt list
    return "I see. " + getRandomPrompt();
}

/**
 * Analyze user speech for pronunciation and grammar feedback
 * @param {string} userInput - The user's spoken input
 */
async function analyzeUserSpeech(userInput) {
    try {
        // In a real app, this would call an API like the one mentioned in requirements
        // For this demo, we'll simulate basic feedback
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const feedbackPanel = document.getElementById('feedbackPanel');
        
        // Get current topic for relevant feedback
        const currentTopic = window.currentTopic;
        if (!currentTopic) return;
        
        // Simple evaluation (in real app, use the API)
        const wordCount = userInput.split(/\s+/).length;
        const hasTopic = currentTopic.vocabulary.some(word => 
            userInput.toLowerCase().includes(word.toLowerCase())
        );
        
        // Generate feedback
        let feedback = '';
        
        // For demo purposes, provide some random feedback
        const feedbackOptions = [
            {
                type: 'pronunciation',
                text: 'Try to practice the "th" sound more carefully.',
                correction: '"thing" should be pronounced with your tongue between your teeth.'
            },
            {
                type: 'grammar',
                text: 'Watch for verb tenses in your sentences.',
                correction: 'Consider using present perfect when talking about experiences.'
            },
            {
                type: 'vocabulary',
                text: 'Good use of topic-related vocabulary!',
                correction: 'Keep incorporating words like: ' + 
                    currentTopic.vocabulary.slice(0, 3).join(', ')
            },
            {
                type: 'fluency',
                text: 'Your speech had good rhythm and flow.',
                correction: 'Continue practicing natural pauses between thoughts.'
            }
        ];
        
        // Select 1-2 feedback items randomly
        const numFeedback = wordCount > 20 ? 2 : 1;
        const selectedFeedback = [];
        
        while (selectedFeedback.length < numFeedback && feedbackOptions.length > 0) {
            const index = Math.floor(Math.random() * feedbackOptions.length);
            selectedFeedback.push(feedbackOptions[index]);
            feedbackOptions.splice(index, 1);
        }
        
        // Build feedback HTML
        feedbackPanel.innerHTML = `
            <h4>Feedback on your English:</h4>
            <div class="feedback-items">
                ${selectedFeedback.map(item => `
                    <div class="feedback-item">
                        <div class="feedback-icon">
                            <i class="fas ${item.type === 'pronunciation' ? 'fa-volume-high' : 
                                           item.type === 'grammar' ? 'fa-book' : 
                                           item.type === 'vocabulary' ? 'fa-spell-check' : 'fa-comments'}"></i>
                        </div>
                        <div class="feedback-text">
                            <strong>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}:</strong> ${item.text}
                            <div class="feedback-correction">${item.correction}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Show the feedback panel
        feedbackPanel.classList.add('active');
        
    } catch (error) {
        console.error('Error analyzing speech:', error);
    }
}

/**
 * Add a message to the conversation
 * @param {string} sender - 'user' or 'ai'
 * @param {string} text - The message text
 * @param {boolean} [isInitial=false] - Whether this is the initial message
 */
function addMessage(sender, text, isInitial = false) {
    const conversationBody = document.getElementById('conversationBody');
    
    // Clear welcome message if it exists
    if (isInitial) {
        conversationBody.innerHTML = '';
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    // Get current time
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Set HTML content
    messageElement.innerHTML = `
        <div class="message-avatar ${sender}-avatar">
            <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="message-content ${sender}">
            <div class="message-text">${text}</div>
            <div class="message-metadata">
                <span class="message-sender">${sender === 'user' ? 'You' : 'Assistant'}</span>
                <span class="message-time">${timeString}</span>
            </div>
        </div>
    `;
    
    // Add to conversation
    conversationBody.appendChild(messageElement);
    
    // Scroll to bottom
    conversationBody.scrollTop = conversationBody.scrollHeight;
}

/**
 * Show that the AI is thinking with animated dots
 */
function showAiThinking() {
    const conversationBody = document.getElementById('conversationBody');
    
    // Create thinking element
    const thinkingElement = document.createElement('div');
    thinkingElement.className = 'message ai-thinking-container';
    thinkingElement.id = 'aiThinking';
    
    thinkingElement.innerHTML = `
        <div class="message-avatar ai-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content ai">
            <div class="message-text">
                <span class="ai-thinking">Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>
            </div>
        </div>
    `;
    
    // Add to conversation
    conversationBody.appendChild(thinkingElement);
    
    // Scroll to bottom
    conversationBody.scrollTop = conversationBody.scrollHeight;
}

/**
 * Remove the AI thinking animation
 */
function removeAiThinking() {
    const thinkingElement = document.getElementById('aiThinking');
    if (thinkingElement) {
        thinkingElement.remove();
    }
}

/**
 * Reset the conversation for the current topic
 */
function resetConversation() {
    // Clear conversation history
    conversationHistory = [];
    
    // Get current topic
    const currentTopic = window.currentTopic;
    if (!currentTopic) return;
    
    // Clear conversation display
    const conversationBody = document.getElementById('conversationBody');
    conversationBody.innerHTML = '';
    
    // Add initial message
    addMessage('ai', getTopicIntroduction(currentTopic), true);
    
    // Hide feedback panel
    const feedbackPanel = document.getElementById('feedbackPanel');
    feedbackPanel.classList.remove('active');
    
    // Show toast
    showToast('Conversation reset');
}