export interface FAQItem {
  question: string;
  answer?: string;
  button?: {
    text: string;
    url: string;
  };
}

export interface FAQCategory {
  events: FAQItem[];
  membership: FAQItem[];
}

export const faqData: FAQCategory = {
  events: [
    {
      question: "How do I register for USIC events?",
      answer: "Click the signup links provided for each event or contact our events team directly for registration assistance."
    },
    {
      question: "Are USIC events open to non-Muslim students?",
      answer: "Yes, many of our events are open to all students who want to learn about Islamic culture and community."
    },
    {
      question: "What types of events does USIC organize?",
      answer: "We host weekly Islamic lessons, sports activities, charity events, annual retreats, and social gatherings."
    },
    {
      question: "Do I need to be a USIC member to attend events?",
      answer: "Most events are open to all students, but members get priority access and exclusive discounts."
    },
    {
      question: "Where are USIC events held on campus?",
      answer: "Events are held in various campus locations including lecture theatres, sports facilities, and prayer rooms."
    },
    {
      question: "How can I stay updated about upcoming events?",
      answer: "Follow our social media accounts, check this events page regularly, or join our WhatsApp groups."
    },
    {
      question: "Are there separate events for brothers and sisters?",
      answer: "Some events like football and welfare sessions are gender-specific, while others are open to all members."
    }
  ],
  membership: [
    {
      question: "How much does USIC membership cost?",
      answer: "USIC membership costs £12 for one year or £30 for a lifetime membership."
    },
    {
      question: "What benefits do USIC members receive?",
      answer: "Members get exclusive discounts on events, priority ticket access, a personal membership card, and discounts in sponsor stores around Sheffield."
    },
    {
      question: "Do I need to be Muslim to join USIC?",
      answer: "No, USIC welcomes all students interested in learning about Islamic culture and community, regardless of faith."
    },
    {
      question: "How do I become a USIC member?",
      button: {
        text: "Click Here",
        url: "https://su.sheffield.ac.uk/activities/view/islamic-circle-society"
      }
    },
    {
      question: "Can postgraduate students join USIC?",
      answer: "Yes, USIC membership is open to all University of Sheffield students including undergraduates and postgraduates."
    },
    {
      question: "What happens after I join USIC?",
      answer: "You'll receive your membership card and access to member benefits."
    },
    {
      question: "Is USIC membership valid for the entire academic year?",
      answer: "Yes, your USIC membership is valid for the full academic year and can be renewed annually or you can purchase a lifetime membership."
    }
  ]
};
