/**
 * Future Plans Conversation Bot
 * Topic: Talking about future plans using 'going to'
 */

class FuturePlansBot {
  constructor() {
    this.conversationState = {
      currentStep: 0,
      userWeekendPlans: "",
      userSummerPlans: "",
      userCareerPlans: "",
      userTravelPlans: "",
      userSkillPlans: "",
      userLifeChangePlans: "",
    };

    this.questionSequence = [
      "What are you going to do this weekend?",
      "What are you going to do this summer?",
      "What kind of job are you going to have in the future?",
      "Where are you going to travel next?",
      "What new skill are you going to learn in the next year?",
      "Are you going to make any big changes in your life soon?",
    ];

    this.followUps = {
      0: (weekendPlans) => {
        this.conversationState.userWeekendPlans = weekendPlans;

        // Check for proper 'going to' usage
        if (weekendPlans.toLowerCase().includes("going to")) {
          return "Excellent use of 'going to' to talk about your future plans! Those sound like interesting weekend plans.";
        } else {
          return "Remember to use 'going to' when talking about future plans. For example, 'I'm going to visit my friend.' Your weekend plans sound interesting!";
        }
      },
      1: (summerPlans) => {
        this.conversationState.userSummerPlans = summerPlans;
        if (
          this.containsKeywords(summerPlans, [
            "travel",
            "visit",
            "trip",
            "vacation",
            "holiday",
          ])
        ) {
          return "Traveling during summer can be wonderful! Have you already booked your tickets or accommodation?";
        } else if (
          this.containsKeywords(summerPlans, [
            "work",
            "study",
            "internship",
            "job",
          ])
        ) {
          return "That sounds productive! It's great to use your summer for personal or professional development.";
        } else if (
          this.containsKeywords(summerPlans, ["relax", "rest", "home", "chill"])
        ) {
          return "Sometimes a relaxing summer at home is exactly what we need! Do you have any specific relaxation plans?";
        } else {
          return "Summer is a great time for new experiences! Your plans sound interesting.";
        }
      },
      2: (careerPlans) => {
        this.conversationState.userCareerPlans = careerPlans;
        return "That's an interesting career path! What skills do you think are most important for that job?";
      },
      3: (travelPlans) => {
        this.conversationState.userTravelPlans = travelPlans;
        if (
          this.containsKeywords(travelPlans, [
            "don't know",
            "not sure",
            "maybe",
            "perhaps",
            "possibly",
          ])
        ) {
          return "It's okay not to have specific travel plans yet! Is there a dream destination you'd like to visit someday?";
        } else {
          return "That sounds like an exciting destination! What are you most looking forward to seeing or doing there?";
        }
      },
      4: (skillPlans) => {
        this.conversationState.userSkillPlans = skillPlans;
        return "Learning new skills is so important in our changing world! What made you choose that particular skill?";
      },
      5: (lifeChangePlans) => {
        this.conversationState.userLifeChangePlans = lifeChangePlans;
        return "Life changes can be both exciting and challenging! Thank you for sharing your future plans with me today. You've done a great job practicing with 'going to' to discuss future intentions.";
      },
    };

    this.fallbackResponses = [
      "I didn't quite catch your weekend plans. What are you going to do this weekend?",
      "I'm sorry, I didn't hear your summer plans. What are you going to do this summer?",
      "I didn't understand your career plans. What kind of job are you going to have in the future?",
      "I didn't catch your travel plans. Where are you going to travel next?",
      "I'm sorry, I didn't hear what skill you plan to learn. What new skill are you going to learn?",
      "I didn't understand if you're planning any life changes. Are you going to make any big changes soon?",
    ];
  }

  getInitialGreeting() {
    return "Hi there! I'm Taylor, and today we're going to talk about future plans using 'going to.' Let's start with something simple: What are you going to do this weekend?";
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
        title: "Going To for Future Plans",
        description:
          "We use 'going to' + base verb to talk about future plans and intentions.",
        examples: [
          "I <b>am going to study</b> medicine after school.",
          "She <b>is going to travel</b> to Japan next year.",
          "They <b>are going to buy</b> a new car soon.",
        ],
      },
      {
        title: "Questions with Going To",
        description: "To form questions, put 'am/is/are' before the subject:",
        examples: [
          "<b>Are you going to</b> attend the party?",
          "<b>Is he going to</b> finish the project today?",
          "<b>What are</b> they <b>going to</b> do tomorrow?",
        ],
      },
      {
        title: "Negatives with Going To",
        description: "For negative statements, add 'not' after am/is/are:",
        examples: [
          "I <b>am not going to</b> watch that movie.",
          "She <b>isn't going to</b> apply for that job.",
          "They <b>aren't going to</b> sell their house.",
        ],
      },
      {
        title: "Going To vs. Will",
        description:
          "'Going to' is used for planned intentions. 'Will' is often for spontaneous decisions or predictions.",
        examples: [
          "Going to (plan): I <b>am going to</b> study abroad next year.",
          "Will (spontaneous): I think I <b>will</b> have the fish. (deciding at a restaurant)",
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
