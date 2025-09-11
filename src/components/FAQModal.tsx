"use client";

import { useState } from 'react';
import { FAQItem } from '@/lib/faq-data';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faqData: FAQItem[];
  title: string;
}

export default function FAQModal({ isOpen, onClose, faqData, title }: FAQModalProps) {
  const [currentFAQ, setCurrentFAQ] = useState(0);

  if (!isOpen) return null;

  const nextFAQ = () => setCurrentFAQ(currentFAQ < faqData.length - 1 ? currentFAQ + 1 : 0);
  const prevFAQ = () => setCurrentFAQ(currentFAQ > 0 ? currentFAQ - 1 : faqData.length - 1);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#0F1E2C] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#18384D] p-6 border-b border-blue-200/20 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-200 transition duration-200 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* FAQ Slideshow */}
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <button onClick={prevFAQ} className="text-white hover:text-blue-200 transition duration-200 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-blue-200 font-medium">
              {currentFAQ + 1} of {faqData.length}
            </span>

            <button onClick={nextFAQ} className="text-white hover:text-blue-200 transition duration-200 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="bg-[#18384D] rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">{faqData[currentFAQ].question}</h3>
            {faqData[currentFAQ].button ? (
              <a
                href={faqData[currentFAQ].button!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {faqData[currentFAQ].button!.text}
              </a>
            ) : (
              <p className="text-blue-100 leading-relaxed">{faqData[currentFAQ].answer}</p>
            )}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2">
            {faqData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFAQ(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFAQ ? 'bg-blue-400' : 'bg-blue-200/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
