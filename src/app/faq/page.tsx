'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'events' | 'membership'>('events');

  // FAQ data for both categories
  const faqData = {
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
        answer: "USIC membership is free for all University of Sheffield students through the Students' Union."
      },
      {
        question: "What benefits do USIC members receive?",
        answer: "Members get exclusive discounts on events, priority ticket access, member-only socials, and a personal membership card."
      },
      {
        question: "Do I need to be Muslim to join USIC?",
        answer: "No, USIC welcomes all students interested in learning about Islamic culture and community, regardless of faith."
      },
      {
        question: "How do I become a USIC member?",
        answer: "Simply visit the Students' Union website and sign up for the Islamic Circle Society through the activities section."
      },
      {
        question: "Can postgraduate students join USIC?",
        answer: "Yes, USIC membership is open to all University of Sheffield students including undergraduates and postgraduates."
      },
      {
        question: "What happens after I join USIC?",
        answer: "You'll receive your membership card, access to member benefits, and invitations to exclusive events and socials."
      },
      {
        question: "Is USIC membership valid for the entire academic year?",
        answer: "Yes, your USIC membership is valid for the full academic year and can be renewed annually."
      }
    ]
  };

  const currentData = faqData[activeCategory];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Find answers to common questions about USIC events and membership
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setActiveCategory('events');
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 uppercase text-sm tracking-wider ${
              activeCategory === 'events'
                ? 'bg-white text-[#18384D] shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Events FAQ
          </button>
          <button
            onClick={() => {
              setActiveCategory('membership');
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 uppercase text-sm tracking-wider ${
              activeCategory === 'membership'
                ? 'bg-white text-[#18384D] shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Membership FAQ
          </button>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 max-w-4xl">
        {/* All Questions List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">All {activeCategory === 'events' ? 'Events' : 'Membership'} Questions</h3>
          {currentData.map((faq, index) => (
            <div 
              key={index}
              className="bg-[#0F1E2C] rounded-lg p-6 hover:bg-[#1a2d3a] transition-all duration-300"
            >
              <h4 className="text-lg font-semibold text-white mb-2">{faq.question}</h4>
              <p className="text-blue-100">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
