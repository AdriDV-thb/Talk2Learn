/**
 * Topic data for the English conversation practice app
 */
const topicsData = [
    {
        id: 'personal-info',
        title: 'Personal Information',
        description: 'Practice introducing yourself, sharing your age, nationality, and profession.',
        icon: 'fa-user',
        prompts: [
            "Can you tell me a bit about yourself?",
            "What's your name and where are you from?",
            "What do you do for a living?",
            "How old are you?",
            "Are you a student or do you work?"
        ],
        vocabulary: [
            "name", "age", "nationality", "occupation", "profession", "student", 
            "introduction", "personal details", "background", "hometown"
        ],
        grammar: ["present simple", "possessive adjectives", "to be", "subject pronouns"]
    },
    {
        id: 'free-time',
        title: 'Free Time & Hobbies',
        description: 'Discuss activities you enjoy, sports, and how you spend your leisure time.',
        icon: 'fa-gamepad',
        prompts: [
            "What do you like to do in your free time?",
            "Do you play any sports or have any hobbies?",
            "How often do you go to the movies?",
            "What kind of music do you listen to?",
            "Did you do anything interesting last weekend?"
        ],
        vocabulary: [
            "hobby", "leisure", "pastime", "interest", "activity", "sport", 
            "music", "movie", "book", "travel", "photography", "cooking"
        ],
        grammar: ["present simple", "frequency adverbs", "like + verb-ing", "past simple"]
    },
    {
        id: 'experiences',
        title: 'Life Experiences',
        description: 'Share memorable experiences using present perfect tense.',
        icon: 'fa-globe',
        prompts: [
            "Have you ever traveled to another country?",
            "What's the most exciting thing you've ever done?",
            "Have you ever tried exotic food?",
            "Have you ever met someone famous?",
            "How long have you been learning English?"
        ],
        vocabulary: [
            "experience", "adventure", "travel", "memory", "achievement", "journey", 
            "challenge", "opportunity", "lifetime", "memorable", "unforgettable"
        ],
        grammar: ["present perfect", "ever/never", "already/yet", "for/since", "been vs. gone"]
    },
    {
        id: 'daily-routine',
        title: 'Daily Routine',
        description: 'Talk about your typical day, schedule, and habits.',
        icon: 'fa-clock',
        prompts: [
            "What time do you usually wake up?",
            "Can you describe your morning routine?",
            "What do you usually have for breakfast?",
            "How do you get to work or school?",
            "What time do you go to bed?"
        ],
        vocabulary: [
            "routine", "schedule", "habit", "daily", "morning", "afternoon", "evening", 
            "wake up", "get up", "commute", "breakfast", "lunch", "dinner"
        ],
        grammar: ["present simple", "frequency adverbs", "time expressions", "prepositions of time"]
    },
    {
        id: 'future-plans',
        title: 'Future Plans',
        description: 'Discuss your goals, ambitions, and what you plan to do.',
        icon: 'fa-calendar',
        prompts: [
            "What are your plans for this weekend?",
            "Where do you see yourself in five years?",
            "Are you planning to travel soon?",
            "What would you like to achieve in the future?",
            "Do you have any career goals?"
        ],
        vocabulary: [
            "future", "plan", "goal", "ambition", "dream", "aspiration", "career", 
            "success", "achievement", "objective", "target", "intention"
        ],
        grammar: ["going to", "will", "present continuous for future", "would like to", "hope to"]
    },
    {
        id: 'food-drinks',
        title: 'Food & Drinks',
        description: 'Talk about your favorite foods, cooking, and dining experiences.',
        icon: 'fa-utensils',
        prompts: [
            "What's your favorite food?",
            "Do you know how to cook?",
            "What's a typical dish from your country?",
            "Do you prefer eating at home or at restaurants?",
            "Have you ever tried food from other countries?"
        ],
        vocabulary: [
            "food", "dish", "meal", "restaurant", "cuisine", "recipe", "ingredient", 
            "cooking", "taste", "flavor", "spicy", "sweet", "sour", "bitter"
        ],
        grammar: ["countable/uncountable nouns", "quantifiers", "food vocabulary", "like/dislike"]
    }
];

/**
 * Function to initialize topics in the UI
 */
function initializeTopics() {
    const topicsGrid = document.getElementById('topicsGrid');
    
    // Clear existing topics
    topicsGrid.innerHTML = '';
    
    // Add each topic card
    topicsData.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card';
        topicCard.dataset.topicId = topic.id;
        
        topicCard.innerHTML = `
            <div class="topic-icon">
                <i class="fas ${topic.icon}"></i>
            </div>
            <h3 class="topic-title">${topic.title}</h3>
            <p class="topic-description">${topic.description}</p>
        `;
        
        topicCard.addEventListener('click', () => selectTopic(topic.id));
        topicsGrid.appendChild(topicCard);
    });
}

/**
 * Function to select a topic
 * @param {string} topicId - The ID of the selected topic
 */
function selectTopic(topicId) {
    // Remove selected class from all topic cards
    document.querySelectorAll('.topic-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to the clicked topic card
    const selectedCard = document.querySelector(`.topic-card[data-topic-id="${topicId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Find the selected topic data
    const topic = topicsData.find(t => t.id === topicId);
    if (!topic) return;
    
    // Update the conversation title
    document.getElementById('currentTopic').textContent = topic.title;
    
    // Clear previous conversation
    const conversationBody = document.getElementById('conversationBody');
    conversationBody.innerHTML = '';
    
    // Add AI initial message
    addMessage('ai', getTopicIntroduction(topic), true);
    
    // Show toast notification
    showToast(`Topic selected: ${topic.title}`);
    
    // Set current topic in global state
    window.currentTopic = topic;
}

/**
 * Generate an introduction message for a topic
 * @param {Object} topic - The topic object
 * @returns {string} Introduction message
 */
function getTopicIntroduction(topic) {
    const level = document.getElementById('levelSelect').value;
    let intro = '';
    
    switch(topic.id) {
        case 'personal-info':
            intro = "Let's practice talking about personal information. Could you tell me a bit about yourself? For example, your name, where you're from, and what you do.";
            break;
        case 'free-time':
            intro = "I'd love to hear about your free time activities and hobbies. What do you enjoy doing when you're not working or studying?";
            break;
        case 'experiences':
            intro = "Let's talk about your life experiences using present perfect tense. Have you ever traveled to a foreign country? What interesting experiences have you had?";
            break;
        case 'daily-routine':
            intro = "I'd like to know about your daily routine. Could you describe what you do on a typical day, from morning to evening?";
            break;
        case 'future-plans':
            intro = "Let's discuss your future plans and goals. What are you planning to do in the near future? Do you have any long-term goals?";
            break;
        case 'food-drinks':
            intro = "I'm curious about your food preferences. What's your favorite type of food? Do you enjoy cooking or eating out more?";
            break;
        default:
            intro = "Let's have a conversation about " + topic.title + ". " + topic.prompts[0];
    }
    
    // Adjust complexity based on level
    if (level === 'beginner') {
        intro = intro.replace(/complex words/g, 'simple words').replace(/\bcomplex\b/g, 'easy');
    } else if (level === 'advanced') {
        intro += " Try to use more advanced vocabulary and complex sentence structures in your response.";
    }
    
    return intro;
}

/**
 * Get a random follow-up question for the current topic
 * @returns {string} A follow-up question
 */
function getRandomPrompt() {
    if (!window.currentTopic) return "Could you tell me more about that?";
    
    const prompts = window.currentTopic.prompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}