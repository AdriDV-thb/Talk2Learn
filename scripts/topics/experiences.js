/**
 * Experiences Conversation Bot
 * Topic: Talking about life experiences using present perfect
 */

class ExperiencesBot {
  constructor() {
    this.conversationState = {
      currentStep: 0,
      userCountries: "",
      userCuisines: "",
      userSports: "",
      userInstruments: "",
      userMovies: "",
      userBooks: "",
    };

    this.questionSequence = [
      "Have you ever visited a foreign country? Which ones?",
      "Have you ever tried any unusual foods or cuisines?",
      "Have you ever played any interesting sports or activities?",
      "Have you ever learned to play a musical instrument?",
      "Have you ever seen a film that really changed how you think?",
      "Have you ever read a book that has stayed with you for a long time?",
    ];

    this.followUps = {
      0: (countries) => {
        this.conversationState.userCountries = countries;
        if (
          this.containsKeywords(countries, [
            "yes",
            "been to",
            "visited",
            "traveled",
          ])
        ) {
          return "Travel is such a wonderful way to learn about different cultures! What was your favorite place you've visited?";
        } else if (
          this.containsKeywords(countries, ["no", "haven't", "never"])
        ) {
          return "That's okay! There's always time to travel in the future. Is there any country you would really like to visit someday?";
        } else {
          return "Thank you for sharing that with me! Travel experiences can be so enriching.";
        }
      },
      1: (cuisines) => {
        this.conversationState.userCuisines = cuisines;
        if (
          this.containsKeywords(cuisines, ["yes", "tried", "eaten", "tasted"])
        ) {
          return "How adventurous! Food is such an important part of culture. Did you enjoy it?";
        } else if (
          this.containsKeywords(cuisines, [
            "no",
            "haven't",
            "never",
            "don't like",
          ])
        ) {
          return "That's completely understandable. We all have different tastes! Is there any food you'd like to try someday?";
        } else {
          return "Food experiences can be quite memorable! Thank you for sharing that.";
        }
      },
      2: (sports) => {
        this.conversationState.userSports = sports;

        // Check for proper present perfect usage
        const perfectMarkers = ["have", "has", "'ve", "'s", "never", "ever"];
        const usedPresentPerfect = perfectMarkers.some((marker) =>
          sports.toLowerCase().includes(marker)
        );

        if (usedPresentPerfect) {
          return "Great job using the present perfect tense! That's exactly what we're practicing today.";
        } else {
          return "When talking about life experiences, try using 'have' or 'has' with the past participle. For example, 'I have played' or 'I have never tried'.";
        }
      },
      3: (instruments) => {
        this.conversationState.userInstruments = instruments;
        if (
          this.containsKeywords(instruments, [
            "yes",
            "play",
            "learned",
            "studied",
          ])
        ) {
          return "Music is such a wonderful skill to develop! How long have you been playing?";
        } else if (
          this.containsKeywords(instruments, [
            "no",
            "haven't",
            "never",
            "don't",
          ])
        ) {
          return "Learning an instrument takes a lot of dedication. Is there an instrument you'd like to learn someday?";
        } else {
          return "Music can bring so much joy to our lives! Thanks for sharing your experience.";
        }
      },
      4: (movies) => {
        this.conversationState.userMovies = movies;
        return "Films can have such a powerful impact on how we see the world! It's fascinating how stories can change our perspectives.";
      },
      5: (books) => {
        this.conversationState.userBooks = books;
        return "Books have a special way of staying with us long after we've finished reading them. Thank you for sharing your experiences with me today! You've done an excellent job using the present perfect tense to talk about your life experiences.";
      },
    };

    this.fallbackResponses = [
      "I didn't quite catch that. Have you ever visited any foreign countries?",
      "I'm sorry, I didn't understand. Have you ever tried any unusual foods or cuisines?",
      "I didn't hear that clearly. Have you ever played any interesting sports or activities?",
      "I didn't catch that. Have you ever learned to play a musical instrument?",
      "I'm sorry, I didn't hear your answer. Have you ever seen a film that changed how you think?",
      "I didn't understand that. Have you ever read a book that has stayed with you?",
    ];
  }

  getInitialGreeting() {
    return "Hello there! I'm Jordan, and today we're going to practice talking about life experiences using the present perfect tense. Have you ever visited a foreign country? Which ones?";
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
        title: "Present Perfect Tense",
        description:
          "We use the present perfect tense to talk about experiences that happened at an unspecified time in the past.",
        examples: [
          "I <b>have visited</b> France three times.",
          "She <b>has tried</b> sushi before.",
          "They <b>have never played</b> basketball.",
        ],
      },
      {
        title: "Form of Present Perfect",
        description:
          "The present perfect is formed with has/have + past participle:",
        examples: [
          "I/You/We/They <b>have</b> + past participle",
          "He/She/It <b>has</b> + past participle",
        ],
      },
      {
        title: "Ever and Never",
        description:
          "'Ever' is used in questions, and 'never' is used in negative statements:",
        examples: [
          "<b>Have you ever</b> climbed a mountain?",
          "I <b>have never</b> eaten snails.",
          "<b>Has she ever</b> been to London?",
        ],
      },
      {
        title: "Present Perfect vs. Past Simple",
        description:
          "Present Perfect: for experiences at unspecified times. Past Simple: for specific, completed events.",
        examples: [
          "Present Perfect: I <b>have visited</b> Paris. (sometime in my life)",
          "Past Simple: I <b>visited</b> Paris last summer. (specific time)",
        ],
      },
    ];
  }

  // Helper method to check for keywords in user input
  containsKeywords(input, keywords) {
    input = input.toLowerCase();
    return keywords.some((keyword) => input.includes(keyword.toLowerCase()));
  }
}
