/**
 * Imaginary Situations Conversation Bot
 * Topic: Second conditional (imaginary situations)
 */

class ImaginarySituationsBot {
  constructor() {
    this.conversationState = {
      currentStep: 0,
      userName: "",
    };

    this.questionSequence = [
      "Let's talk about imaginary situations using the second conditional! If you could have any superpower, what would it be and what would you do with it?",
      "If you had a time machine, which period in history would you visit and why?",
      "If you were the president or leader of your country, what changes would you make?",
      "If animals could talk, which animal would you want to have a conversation with and what would you ask them?",
      "If you didn't have to go to school or work, how would you spend your time?",
      "If you could live anywhere in the world, where would you choose and why?",
      "If you won a million dollars tomorrow, what would you do with the money?"
    ];

    // Feedback for each question
    this.followUps = {
      0: (input) => {
        // Check for conditional structure
        const hasIf = input.toLowerCase().includes("if");
        const hasWould = input.toLowerCase().includes("would");
        
        if (hasIf && hasWould) {
          return "Excellent use of the second conditional! That's a creative superpower choice.";
        } else if (hasWould) {
          return "Good use of 'would', but remember to include 'if' at the beginning. That's an interesting superpower!";
        } else {
          return "Interesting choice! Remember to practice using 'If I could... I would...' structure.";
        }
      },
      1: (input) => {
        const hasIf = input.toLowerCase().includes("if");
        const hasWould = input.toLowerCase().includes("would");
        
        if (hasIf && hasWould) {
          return "Great job using the second conditional! That would be an amazing time travel adventure.";
        } else {
          return "That sounds like a fascinating period in history! Try using the structure: 'If I had a time machine, I would...'";
        }
      },
      2: (input) => {
        const hasIf = input.toLowerCase().includes("if");
        const hasWould = input.toLowerCase().includes("would");
        
        if (hasIf && hasWould) {
          return "That's excellent use of the second conditional! You'd make some interesting changes as a leader.";
        } else {
          return "Those are interesting ideas! Remember to use the structure: 'If I were the leader, I would...'";
        }
      },
      3: (input) => {
        const hasIf = input.toLowerCase().includes("if");
        const hasWould = input.toLowerCase().includes("would");
        
        if (hasIf && hasWould) {
          return "Perfect use of the second conditional! That would be a fascinating conversation with an animal.";
        } else {
          return "That would be an interesting animal to talk with! Try using 'If animals could talk, I would...'";
        }
      },
      4: (input) => {
        const hasIf = input.toLowerCase().includes("if");
        const hasWould = input.toLowerCase().includes("would");
        
        if (hasIf && hasWould) {
          return "Great job using the second conditional! That sounds like an interesting way to spend your free time.";
        } else {
          return "That sounds enjoyable! Try to answer using the structure: 'If I didn't have to go to school/work, I would...'";
        }
      },
      5: (input) => {
        const hasIf = input.toLowerCase().includes("if");
        const hasWould = input.toLowerCase().includes("would");
        
        if (hasIf && hasWould) {
          return "Excellent use of the second conditional! That sounds like a wonderful place to live.";
        } else {
          return "That sounds like a great place! Remember to practice using 'If I could live anywhere, I would...'";
        }
      },
      6: (input) => {
        const hasIf = input.toLowerCase().includes("if");
        const hasWould = input.toLowerCase().includes("would");
        
        if (hasIf && hasWould) {
          return "Excellent use of the second conditional! Those sound like great plans for your million dollars. Thank you for practicing imaginary situations with me today. You've done a great job with the second conditional!";
        } else if (hasWould) {
          return "Good use of 'would' in your answer! Remember the full structure is 'If I won..., I would...' Thank you for practicing imaginary situations with me today. You've done a great job with the second conditional!";
        } else {
          return "Those are interesting ideas for spending money! Remember to practice the structure: 'If I won a million dollars, I would...' Thank you for practicing imaginary situations with me today. You've done a great job!";
        }
      }
    };

    this.fallbackResponses = [
      "I didn't catch that. Could you tell me what superpower you would choose if you could have one?",
      "I didn't hear your answer clearly. If you had a time machine, where would you go?",
      "I'm sorry, I didn't understand. What changes would you make if you were the leader?",
      "I didn't catch that. Which animal would you talk to if animals could speak?",
      "I didn't hear your response. How would you spend your time if you didn't have to work or study?",
      "I didn't catch where you would live. If you could live anywhere, where would you choose?",
      "I didn't hear what you would do with the money. If you won a million dollars, what would you do?"
    ];
  }

  getInitialGreeting() {
    return "Hi there! Today we'll practice talking about imaginary situations using the second conditional. I'll ask you questions about different hypothetical scenarios, and you can respond using 'If... would...' structures.";
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
        title: "Second Conditional Basic Structure",
        description:
          "We use the second conditional to talk about hypothetical or imaginary situations in the present or future.",
        examples: [
          "If I <b>had</b> more time, I <b>would learn</b> to play the piano.",
          "If she <b>lived</b> near the beach, she <b>would go</b> swimming every day.",
          "I <b>would travel</b> more if I <b>had</b> more vacation days.",
        ],
      },
      {
        title: "Using 'Were' Instead of 'Was'",
        description:
          "In formal English, we use 'were' instead of 'was' for all subjects in the second conditional:",
        examples: [
          "If I <b>were</b> you, I <b>would</b> accept the job offer.",
          "If he <b>were</b> taller, he <b>would play</b> basketball.",
          "What would you do if you <b>were</b> in my situation?",
        ],
      },
      {
        title: "Second Conditional Questions",
        description: "To form questions with the second conditional:",
        examples: [
          "<b>What would you do</b> if you won the lottery?",
          "<b>Where would you live</b> if you could choose any place?",
          "<b>Would you change</b> your job if you <b>had</b> the opportunity?",
        ],
      },
      {
        title: "Negative Forms in Second Conditional",
        description: "We can use negative forms in either or both parts of the sentence:",
        examples: [
          "If I <b>didn't have</b> to work, I <b>would travel</b> the world.",
          "If you <b>studied</b> more, you <b>wouldn't fail</b> the exam.",
          "If there <b>weren't</b> so many people, I <b>wouldn't feel</b> so anxious.",
        ],
      },
      {
        title: "Differences from First Conditional",
        description:
          "First conditional is for real possibilities; second conditional is for imaginary situations:",
        examples: [
          "First conditional (real): If it <b>rains</b> tomorrow, I <b>will stay</b> home.",
          "Second conditional (imaginary): If I <b>were</b> a bird, I <b>would fly</b> to Paris.",
        ],
      },
    ];
  }

  containsKeywords(input, keywords) {
    if (!input || typeof input !== "string") {
        console.error("Invalid input for keyword check:", input);
        return false;
    }
    input = input.toLowerCase();
    return keywords.some((keyword) => input.includes(keyword.toLowerCase()));
  }
}