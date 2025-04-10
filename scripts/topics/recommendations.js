/**
 * Recommendations Conversation Bot
 * Topic: Giving recommendations using should/shouldn't
 */

class RecommendationsBot {
  constructor() {
    this.conversationState = {
      currentStep: 0,
      userName: "",
    };

    this.questionSequence = [
      "Let's talk about recommendations! If someone wants to learn English quickly, what should they do?",
      "What advice would you give to someone who wants to stay healthy? What should they do?",
      "What about bad habits? What shouldn't students do if they want to succeed in school?",
      "Imagine I'm visiting your country for the first time. What should I do and see while I'm there?",
      "What should people do to protect the environment? And what shouldn't they do?",
      "Now let's imagine your friend is feeling stressed and anxious. What advice would you give them? What should and shouldn't they do?",
      "Finally, what recommendations would you give to someone learning to use technology safely? What should and shouldn't they do online?"
    ];

    // Feedback for each question
    this.followUps = {
      0: (input) => {
        const hasShould = input.toLowerCase().includes("should");
        
        if (hasShould) {
          return "Great job! Those are excellent recommendations for language learning.";
        } else {
          return "Those are good ideas for learning English! Try using 'should' in your recommendations, like 'They should practice every day.'";
        }
      },
      1: (input) => {
        const hasShould = input.toLowerCase().includes("should");
        
        if (hasShould) {
          return "Excellent use of 'should' for health advice! Those are great recommendations.";
        } else {
          return "Those are good health tips! Remember to use 'should' in your recommendations, like 'People should exercise regularly.'";
        }
      },
      2: (input) => {
        const hasShouldnt = input.toLowerCase().includes("shouldn't") || input.toLowerCase().includes("should not");
        
        if (hasShouldnt) {
          return "Perfect use of 'shouldn't' for negative recommendations! Those are important points about study habits.";
        } else {
          return "Those are important points about study habits! Try using 'shouldn't' in your answer, like 'Students shouldn't procrastinate.'";
        }
      },
      3: (input) => {
        const hasShould = input.toLowerCase().includes("should");
        
        if (hasShould) {
          return "Great use of 'should' for tourist recommendations! That sounds like a wonderful itinerary for visitors.";
        } else {
          return "That sounds like a wonderful recommendation for visitors! Try using 'should' in your advice, like 'You should visit...'";
        }
      },
      4: (input) => {
        const hasShould = input.toLowerCase().includes("should");
        const hasShouldnt = input.toLowerCase().includes("shouldn't") || input.toLowerCase().includes("should not");
        
        if (hasShould && hasShouldnt) {
          return "Excellent! You used both 'should' and 'shouldn't' correctly in your environmental recommendations.";
        } else if (hasShould) {
          return "Good positive recommendations! Can you also tell me what people shouldn't do for the environment?";
        } else if (hasShouldnt) {
          return "Good negative recommendations! Can you also tell me what people should do for the environment?";
        } else {
          return "Those are important points about the environment. Try to use 'should' and 'shouldn't' in your recommendations.";
        }
      },
      5: (input) => {
        const hasShould = input.toLowerCase().includes("should");
        const hasShouldnt = input.toLowerCase().includes("shouldn't") || input.toLowerCase().includes("should not");
        
        if (hasShould && hasShouldnt) {
          return "Excellent use of both 'should' and 'shouldn't' in your advice! That's thoughtful advice for someone who's feeling stressed.";
        } else if (hasShould || hasShouldnt) {
          return "Good advice! Try to use both 'should' and 'shouldn't' to give balanced recommendations.";
        } else {
          return "That's thoughtful advice for someone who's feeling stressed. Remember to practice using 'should' and 'shouldn't'.";
        }
      },
      6: (input) => {
        const hasShould = input.toLowerCase().includes("should");
        const hasShouldnt = input.toLowerCase().includes("shouldn't") || input.toLowerCase().includes("should not");
        
        let response = "Those are excellent recommendations for online safety! ";
        
        if (hasShould && hasShouldnt) {
          response += "You've mastered using both 'should' and 'shouldn't' to give balanced advice.";
        } else {
          response += "Remember to use both 'should' and 'shouldn't' when giving comprehensive recommendations.";
        }
        
        response += " Thank you for practicing recommendations with me today. You did a great job using 'should' and 'shouldn't' to give advice!";
        
        return response;
      }
    };

    this.fallbackResponses = [
      "I didn't catch that. Could you tell me what people should do to learn English quickly?",
      "I didn't hear your advice clearly. What should people do to stay healthy?",
      "I'm sorry, I didn't understand. What shouldn't students do if they want to succeed?",
      "I didn't catch your recommendations. What should tourists do in your country?",
      "I didn't hear what you said about the environment. What should and shouldn't people do to protect it?",
      "I didn't catch your advice for someone feeling stressed. What should and shouldn't they do?",
      "I didn't hear your recommendations about technology. What should and shouldn't people do online?"
    ];
  }

  getInitialGreeting() {
    return "Hi there! Today we'll practice giving recommendations using 'should' and 'shouldn't'. I'll ask you questions, and you can respond with your recommendations.";
  }

  processUserInput(input) {
    const currentStep = this.conversationState.currentStep;
    
    // Process the user's answer to the current question
    const followUpResponse = this.followUps[currentStep](input);
    
    // Move to the next question
    this.conversationState.currentStep++;
    
    // If we have reached the end of questions, we wrap up
    if (this.conversationState.currentStep >= this.questionSequence.length) {
      return followUpResponse; // Final response
    }
    
    // Otherwise, add the next question
    return `${followUpResponse} ${this.questionSequence[this.conversationState.currentStep]}`;
  }

  getFallbackResponse() {
    const currentStep = this.conversationState.currentStep;
    if (currentStep < this.fallbackResponses.length) {
      return this.fallbackResponses[currentStep];
    }
    return "I'm sorry, I didn't catch that. Could you say it again, please?";
  }

  getGrammarHelp() {
    return [
      {
        title: "Using 'Should' for Recommendations",
        description:
          "We use 'should' to give advice or make recommendations about what is good or right to do.",
        examples: [
          "You <b>should exercise</b> every day.",
          "Students <b>should practice</b> English regularly.",
          "People <b>should eat</b> more vegetables.",
        ],
      },
      {
        title: "Using 'Shouldn't' for Negative Recommendations",
        description:
          "We use 'shouldn't' (should not) to advise against something or recommend not doing something.",
        examples: [
          "You <b>shouldn't stay</b> up too late.",
          "Children <b>shouldn't spend</b> too much time on video games.",
          "We <b>shouldn't waste</b> water.",
        ],
      },
      {
        title: "Should Questions",
        description: "To form questions with 'should':",
        examples: [
          "<b>Should I</b> take an umbrella?",
          "<b>What should</b> we do this weekend?",
          "<b>Where should</b> they go on vacation?",
        ],
      },
      {
        title: "Giving Reasons with Should/Shouldn't",
        description: "It's helpful to explain why you're giving a recommendation:",
        examples: [
          "You <b>should drink</b> water because it's good for your health.",
          "You <b>shouldn't eat</b> too much sugar because it can cause health problems.",
          "She <b>should apply</b> for that job because she has the right qualifications.",
        ],
      },
      {
        title: "Other Expressions for Recommendations",
        description:
          "Besides 'should', there are other ways to give recommendations:",
        examples: [
          "I <b>recommend</b> learning a new language.",
          "I <b>suggest</b> getting some exercise.",
          "It's <b>a good idea to</b> save money for the future.",
          "You <b>ought to</b> apologize to your friend.",
        ],
      },
    ];
  }

  containsKeywords(input, keywords) {
    input = input.toLowerCase();
    return keywords.some((keyword) => input.includes(keyword.toLowerCase()));
  }
}