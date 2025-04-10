/**
 * Free Time Conversation Bot
 * Topic: Hobbies, sports, leisure activities
 */

class FreeTimeBot {
  constructor() {
    this.conversationState = {
      currentStep: 0,
      userHobbies: [],
      userSports: [],
      userWeekendActivity: "",
      userMusicPreference: "",
      userMoviePreference: "",
      userTravelPreference: "",
    };

    this.questionSequence = [
      "What hobbies do you enjoy in your free time?",
      "Do you play any sports? Which ones?",
      "What do you usually do on weekends?",
      "What kind of music do you like to listen to?",
      "Do you enjoy watching movies or TV series? What kind?",
      "Do you like traveling? Where would you like to go next?",
    ];

    this.followUps = {
      0: (hobbies) => {
        this.conversationState.userHobbies = hobbies;
        if (this.containsKeywords(hobbies, ["read", "book", "novel"])) {
          return "Reading is a wonderful hobby! I love books too. What kind of books do you enjoy reading?";
        } else if (
          this.containsKeywords(hobbies, ["game", "play", "gaming", "video"])
        ) {
          return "Video games can be so much fun! What games do you play the most?";
        } else if (
          this.containsKeywords(hobbies, [
            "music",
            "sing",
            "play",
            "instrument",
          ])
        ) {
          return "Music is such a beautiful way to express yourself! Do you play any instruments?";
        } else {
          return "That sounds like a great way to spend your free time!";
        }
      },
      1: (sports) => {
        this.conversationState.userSports = sports;
        if (this.containsKeywords(sports, ["football", "soccer"])) {
          return "Football is so popular worldwide! Are you a fan of any particular team?";
        } else if (
          this.containsKeywords(sports, ["basketball", "tennis", "volleyball"])
        ) {
          return "That's a great sport for fitness and teamwork! Do you play regularly?";
        } else if (this.containsKeywords(sports, ["don't", "not", "no"])) {
          return "That's perfectly fine! Sports aren't for everyone.";
        } else {
          return "That sounds like a fun way to stay active!";
        }
      },
      2: (weekendActivity) => {
        this.conversationState.userWeekendActivity = weekendActivity;
        if (this.containsKeywords(weekendActivity, ["friend", "hang", "out"])) {
          return "Spending time with friends is always fun! What do you usually do together?";
        } else if (
          this.containsKeywords(weekendActivity, [
            "relax",
            "rest",
            "sleep",
            "chill",
          ])
        ) {
          return "It's important to take time to relax! Weekends are perfect for that.";
        } else if (
          this.containsKeywords(weekendActivity, ["study", "homework", "work"])
        ) {
          return "It's good to be productive, but make sure you take some time for yourself too!";
        } else {
          return "That sounds like a nice way to spend your weekends!";
        }
      },
      3: (music) => {
        this.conversationState.userMusicPreference = music;
        return "Music can really influence our mood and feelings. Do you have a favorite artist or band?";
      },
      4: (movies) => {
        this.conversationState.userMoviePreference = movies;
        if (
          this.containsKeywords(movies, ["action", "adventure", "thriller"])
        ) {
          return "Those genres can be so exciting! They really get your heart racing, don't they?";
        } else if (this.containsKeywords(movies, ["comedy", "funny"])) {
          return "Comedies are great for lifting your spirits! Everyone needs a good laugh sometimes.";
        } else if (this.containsKeywords(movies, ["drama", "romance"])) {
          return "Those stories can be so emotional and captivating!";
        } else {
          return "It's interesting to hear about your taste in films!";
        }
      },
      5: (travel) => {
        this.conversationState.userTravelPreference = travel;
        return "Travel opens our minds to new cultures and experiences! Thank you for sharing your preferences with me. You've done a great job talking about your free time activities in English!";
      },
    };

    this.fallbackResponses = [
      "I didn't quite catch your hobbies. What do you enjoy doing in your free time?",
      "I didn't hear what sports you play. Could you tell me again, please?",
      "I'm sorry, I didn't understand what you do on weekends. Could you explain again?",
      "I didn't catch what kind of music you like. Could you tell me again?",
      "I didn't hear what kind of movies you enjoy. Could you share that again?",
      "I didn't catch where you'd like to travel. Could you tell me once more?",
    ];
  }

  getInitialGreeting() {
    return "Hi there! I'm Sam, and today we're going to chat about free time activities and hobbies. What hobbies do you enjoy in your free time?";
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
        title: "Present Simple for Regular Activities",
        description:
          "We use present simple to talk about regular activities, hobbies, and habits.",
        examples: [
          "I play basketball every weekend.",
          "She reads books in her free time.",
          "They don't watch TV very often.",
        ],
      },
      {
        title: "Frequency Adverbs",
        description: "Use frequency adverbs to say how often you do something:",
        examples: [
          "I <b>always</b> go running in the morning.",
          "She <b>usually</b> listens to music while studying.",
          "They <b>sometimes</b> play video games together.",
          "He <b>rarely</b> watches action movies.",
          "I <b>never</b> play football.",
        ],
      },
      {
        title: "Like + Verb-ing",
        description:
          "Use 'like/love/enjoy/hate' + verb-ing to talk about preferences:",
        examples: [
          "I <b>like swimming</b> in the sea.",
          "She <b>loves playing</b> the piano.",
          "They <b>enjoy watching</b> comedies.",
          "He <b>hates getting up</b> early.",
        ],
      },
    ];
  }

  // Helper method to check for keywords in user input
  containsKeywords(input, keywords) {
    if (!input || typeof input !== "string") {
        console.error("Invalid input for keyword check:", input);
        return false;
    }
    input = input.toLowerCase();
    return keywords.some((keyword) => input.includes(keyword.toLowerCase()));
  }
}
