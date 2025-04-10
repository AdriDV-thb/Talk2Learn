/**
 * Personal Information Conversation Bot
 * Topic: Basic personal information (name, age, nationality, etc.)
 */

class PersonalInfoBot {
  constructor() {
    this.conversationState = {
      currentStep: 0,
      userName: "",
      userAge: null,
      userNationality: "",
      userOccupation: "",
      userFamily: "",
      userCity: "",
    };

    this.questionSequence = [
      "What's your name?",
      "How old are you?",
      "Where are you from? I mean, what's your nationality?",
      "What do you do? Are you a student or do you work?",
      "Tell me about your family. Do you have any brothers or sisters?",
      "Where do you live? Which city or town?",
    ];

    this.followUps = {
      0: (name) => {
        this.conversationState.userName = name;
        return `Nice to meet you, ${name}! That's a lovely name.`;
      },
      1: (age) => {
        const ageNum = this.extractNumber(age);
        this.conversationState.userAge = ageNum;

        if (ageNum < 18) {
          return `${ageNum}? You're quite young! Do you enjoy school?`;
        } else if (ageNum < 30) {
          return `${ageNum} is a great age! You have so many opportunities ahead.`;
        } else {
          return `${ageNum}? That's a wonderful age with plenty of experience!`;
        }
      },
      2: (nationality) => {
        this.conversationState.userNationality = nationality;
        return `Oh, ${nationality}! I'd love to learn more about your culture.`;
      },
      3: (occupation) => {
        this.conversationState.userOccupation = occupation;
        if (occupation.toLowerCase().includes("student")) {
          return `Being a student is great! What subjects do you enjoy the most?`;
        } else if (occupation.toLowerCase().includes("work")) {
          return `That sounds like an interesting job! Do you enjoy it?`;
        } else {
          return `That's interesting! Tell me more about that sometime.`;
        }
      },
      4: (family) => {
        this.conversationState.userFamily = family;
        return `Families are important in our lives. Thank you for sharing that with me.`;
      },
      5: (city) => {
        this.conversationState.userCity = city;
        if (this.conversationState.userName) {
          return `${city} sounds like a nice place! It was great getting to know you, ${this.conversationState.userName}. We've covered all the basic personal information now. You did really well with these conversation topics!`;
        } else {
          return `${city} sounds like a nice place! It was great getting to know you. We've covered all the basic personal information now. You did really well with these conversation topics!`;
        }
      },
    };

    this.fallbackResponses = [
      "I didn't catch that. Could you tell me your name, please?",
      "I didn't hear your age clearly. How old are you?",
      "I'm sorry, I didn't understand your nationality. Where are you from?",
      "I didn't quite get that. Are you a student or do you work?",
      "I didn't catch what you said about your family. Do you have any siblings?",
      "I didn't hear where you live. Which city or town do you live in?",
    ];
  }

  getInitialGreeting() {
    return "Hi there! I'm Emily, your English conversation partner. Today we're going to practice talking about personal information. Let's get to know each other! First, what's your name?";
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
    return `${followUpResponse} ${
      this.questionSequence[this.conversationState.currentStep]
    }`;
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
        title: "Personal Information Questions",
        description:
          "Questions about personal information usually use the verb <b>to be</b> or question words like <b>what</b>, <b>where</b>, <b>how</b>, etc.",
        examples: [
          "What's your name? / I'm [name].",
          "How old are you? / I'm [age] years old.",
          "Where are you from? / I'm from [country].",
        ],
      },
      {
        title: "Present Simple Tense",
        description:
          "We use present simple to talk about facts, habits, and routines.",
        examples: [
          "I live in [city/town].",
          "I work as a [job].",
          "I study at [school/university].",
        ],
      },
      {
        title: "Family Vocabulary",
        description: "Common words to describe family members:",
        examples: [
          "Parents: mother/mom, father/dad",
          "Siblings: brother, sister",
          "Extended family: grandparents, aunt, uncle, cousin",
        ],
      },
    ];
  }

  // Helper method to extract numbers from strings
  extractNumber(text) {
    const numbers = text.match(/\d+/);
    return numbers ? parseInt(numbers[0]) : 14; // Default age if extraction fails
  }
}
