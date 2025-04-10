/**
 * Past Activities Conversation Bot
 * Topic: Talking about past activities using past simple
 */

class PastActivitiesBot {
  constructor() {
    this.conversationState = {
      currentStep: 0,
      userWeekend: "",
      userYesterday: "",
      userLastMeal: "",
      userLastHoliday: "",
      userChildhood: "",
      userSchool: "",
    };

    this.questionSequence = [
      "What did you do last weekend?",
      "What did you do yesterday?",
      "What did you eat for your last meal?",
      "Where did you go on your last holiday or vacation?",
      "What games did you play when you were a child?",
      "What was your favorite subject at school when you were younger?",
    ];

    this.followUps = {
      0: (weekend) => {
        this.conversationState.userWeekend = weekend;
        if (
          this.containsKeywords(weekend, [
            "stayed",
            "home",
            "watched",
            "slept",
            "relaxed",
          ])
        ) {
          return "Sometimes relaxing at home is the best way to spend a weekend! Did you enjoy it?";
        } else if (
          this.containsKeywords(weekend, ["went", "visited", "traveled", "saw"])
        ) {
          return "That sounds like an active weekend! Was the weather nice?";
        } else {
          return "That sounds interesting! Did you enjoy your weekend?";
        }
      },
      1: (yesterday) => {
        this.conversationState.userYesterday = yesterday;

        // Check if user used past tense properly
        const pastTenseVerbs = [
          "went",
          "did",
          "was",
          "were",
          "had",
          "ate",
          "saw",
          "watched",
          "played",
          "studied",
          "worked",
          "visited",
        ];
        const usedPastTense = pastTenseVerbs.some((verb) =>
          yesterday.toLowerCase().includes(verb)
        );

        if (usedPastTense) {
          return "Great job using the past tense! Your English is very good.";
        } else {
          return "Remember to use past tense verbs when talking about yesterday. For example, 'I went' instead of 'I go'.";
        }
      },
      2: (meal) => {
        this.conversationState.userLastMeal = meal;
        if (
          this.containsKeywords(meal, ["burger", "pizza", "fries", "fast food"])
        ) {
          return "Fast food can be delicious as an occasional treat! Was it tasty?";
        } else if (
          this.containsKeywords(meal, [
            "salad",
            "vegetables",
            "healthy",
            "fruit",
          ])
        ) {
          return "That sounds like a healthy choice! Do you usually eat healthy food?";
        } else {
          return "That sounds delicious! Did you cook it yourself or did someone else prepare it?";
        }
      },
      3: (holiday) => {
        this.conversationState.userLastHoliday = holiday;
        if (this.containsKeywords(holiday, ["beach", "sea", "ocean", "swim"])) {
          return "Beach holidays are wonderful! Did you swim in the sea?";
        } else if (
          this.containsKeywords(holiday, [
            "mountain",
            "hiking",
            "camping",
            "nature",
          ])
        ) {
          return "Nature holidays can be so refreshing! Did you take any beautiful photos?";
        } else if (
          this.containsKeywords(holiday, ["city", "museum", "shopping"])
        ) {
          return "City breaks are great for exploring culture! What was your favorite thing you saw?";
        } else {
          return "That sounds like a lovely holiday! Would you go there again?";
        }
      },
      4: (childhood) => {
        this.conversationState.userChildhood = childhood;
        return "Childhood games hold such special memories! It's interesting how games are different around the world but also sometimes very similar.";
      },
      5: (subject) => {
        this.conversationState.userSchool = subject;
        return "School subjects often give us clues about our interests and strengths! Thank you for sharing your memories with me. You did a great job using past tense to talk about previous activities!";
      },
    };

    this.fallbackResponses = [
      "I didn't quite catch what you did last weekend. Could you tell me again?",
      "I'm sorry, I didn't hear what you did yesterday. Could you repeat that?",
      "I didn't understand what you ate for your last meal. Could you tell me again?",
      "I didn't catch where you went on your last holiday. Could you share that again?",
      "I'm sorry, I didn't hear what games you played as a child. Could you repeat that?",
      "I didn't catch your favorite school subject. Could you tell me once more?",
    ];
  }

  getInitialGreeting() {
    return "Hello! I'm Alex, your English conversation partner. Today we're going to practice talking about past activities using the past simple tense. What did you do last weekend?";
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
        title: "Past Simple Tense",
        description:
          "We use the past simple tense to talk about finished actions or situations in the past.",
        examples: [
          "I <b>watched</b> a movie last night.",
          "She <b>visited</b> her grandmother last weekend.",
          "We <b>went</b> to the beach last summer.",
        ],
      },
      {
        title: "Regular vs. Irregular Verbs",
        description:
          "Regular verbs add -ed in the past simple. Irregular verbs have special past forms:",
        examples: [
          "Regular: work → worked, play → played, study → studied",
          "Irregular: go → went, eat → ate, see → saw, have → had",
        ],
      },
      {
        title: "Past Simple Questions",
        description:
          "Questions in the past simple use 'did' + subject + base form of verb:",
        examples: [
          "What <b>did</b> you <b>do</b> yesterday?",
          "Where <b>did</b> they <b>go</b> on holiday?",
          "How <b>did</b> you <b>travel</b> to school?",
        ],
      },
      {
        title: "Past Simple Negatives",
        description:
          "Negatives in the past simple use 'did not' (didn't) + base form of verb:",
        examples: [
          "I <b>didn't go</b> to the party.",
          "She <b>didn't watch</b> the film.",
          "They <b>didn't play</b> football.",
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
