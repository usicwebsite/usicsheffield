'use client';

import { useState } from 'react';
import { faqData } from '@/lib/faq-data';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'events' | 'membership'>('events');

  // Use centralized FAQ data

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
              {faq.button ? (
                <a
                  href={faq.button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {faq.button.text}
                </a>
              ) : (
                <p className="text-blue-100">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
