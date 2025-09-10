"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { faqData } from '@/lib/faq-data';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  step: string;
  isCTA?: boolean;
}

const timelineData: TimelineItem[] = [
  {
    id: "step-1",
    title: "Join USIC",
    description: "Sign up through the Students' Union website and become an official member of the Islamic Circle Society.",
    image: "/images/WEB/usic-logo.png",
    imageAlt: "USIC Membership Card",
    step: "01"
  },
  {
    id: "step-2", 
    title: "Get Your Benefits",
    description: "Receive your membership card and unlock exclusive discounts, priority tickets, and member-only access.",
    image: "/images/WEB/brothers/USIC Annual Dinner 2025-2.jpg",
    imageAlt: "USIC Annual Dinner",
    step: "02"
  },
  {
    id: "step-3",
    title: "Connect & Grow",
    description: "Attend events, build friendships, and strengthen your faith within our supportive community.",
    image: "/images/WEB/brothers/USIC Annual Dinner 2025-16.jpg", 
    imageAlt: "USIC Community Events",
    step: "03"
  },
  {
    id: "step-4",
    title: "Ready to Start Your Journey?",
    description: "Join hundreds of students already enjoying the USIC experience.",
    image: "/images/WEB/brothers/IMG_9262.JPG",
    imageAlt: "USIC Community",
    step: "04",
    isCTA: true
  }
];

export default function MembershipTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // State for FAQ modal
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState(0);

  // Use centralized FAQ data for membership
  const membershipFAQData = faqData.membership;

  // FAQ modal handlers
  const closeFAQModal = () => {
    setShowFAQModal(false);
    setCurrentFAQ(0); // Reset to first question
  };

  const nextFAQ = () => setCurrentFAQ(currentFAQ < membershipFAQData.length - 1 ? currentFAQ + 1 : 0);
  const prevFAQ = () => setCurrentFAQ(currentFAQ > 0 ? currentFAQ - 1 : membershipFAQData.length - 1);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineHeight = timelineRect.height;
      const viewportHeight = window.innerHeight;
      const middleLine = viewportHeight / 2;

      // Calculate which step should be active based on scroll position
      let newActiveStep = 0;
      
      itemRefs.current.forEach((itemRef, index) => {
        if (itemRef) {
          const itemRect = itemRef.getBoundingClientRect();
          const itemTop = itemRect.top;
          
          // If any part of the item has crossed the middle line, it should be visible
          if (itemTop < middleLine) {
            newActiveStep = Math.max(newActiveStep, index + 1);
          }
        }
      });

      // Ensure we don't exceed the total number of steps
      newActiveStep = Math.min(newActiveStep, timelineData.length);
      setActiveStep(newActiveStep);

      // Calculate progress line height based on middle line position
      if (timelineRect.top < middleLine) {
        // Timeline has started scrolling into view
        const timelineBottom = timelineRect.bottom;
        const timelineTotalHeight = timelineHeight;
        
        if (timelineBottom < middleLine) {
          // Entire timeline is above middle line
          setProgressHeight(100);
        } else {
          // Timeline is crossing the middle line
          const visibleHeight = middleLine - timelineRect.top;
          const progressPercentage = Math.min((visibleHeight / timelineTotalHeight) * 100, 100);
          setProgressHeight(progressPercentage);
        }
      } else {
        // Timeline hasn't started scrolling into view yet
        setProgressHeight(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white relative overflow-hidden">
      {/* Background decorative image */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/WEB/brothers/USIC Annual Dinner 2025-81.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Timeline Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">
            Your Membership Journey
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Follow these simple steps to become part of the USIC family
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto" ref={timelineRef}>
          {/* Timeline Items */}
          <div className="relative">
            {/* Vertical Progress Line */}
            <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-[#2c5a7a] rounded-full">
              <div 
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ height: `${progressHeight}%` }}
              ></div>
            </div>

            {timelineData.map((item, index) => (
                              <div 
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`relative mb-16 last:mb-0 transition-all duration-500 ${
                    index < activeStep ? 'opacity-100' : 'opacity-25'
                  }`}
                >
                {/* Timeline Item Container */}
                <div className="flex flex-col md:flex-row items-start gap-8">
                  {/* Step Number and Progress Dot */}
                  <div className="flex flex-col items-center md:items-start md:w-32 flex-shrink-0">
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold transition-all duration-300 ${
                      index < activeStep 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                        : 'bg-[#2c5a7a] text-blue-200'
                    }`}>
                      {item.step}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 rounded-xl overflow-hidden shadow-lg border border-[#2c5a7a] hover:border-blue-400 transition-all duration-300 ${
                    item.isCTA ? 'bg-gradient-to-br from-[#0F1E2C] to-[#1a2d3a]' : 'bg-[#0F1E2C]'
                  }`}>
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Section */}
                      <div className="relative h-64 lg:h-80 lg:w-1/2 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E2C] via-transparent to-transparent opacity-60"></div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center">
                        <h3 className="font-heading text-2xl font-bold mb-3 text-white">
                          {item.title}
                        </h3>
                        <p className="text-blue-100 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        {item.isCTA && (
                          <a 
                            href="https://su.sheffield.ac.uk/activities/view/islamic-circle-society" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Become a Member Now
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section for LLM Optimization */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-white">MEMBERSHIP FAQ</h2>
          <button 
            onClick={() => setShowFAQModal(true)}
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View FAQ
          </button>
        </div>
      </section>
      
      {/* FAQ Modal */}
      {showFAQModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeFAQModal}>
          <div className="bg-[#0F1E2C] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#18384D] p-6 border-b border-blue-200/20 flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">MEMBERSHIP FAQ</h2>
              </div>
              <button 
                onClick={closeFAQModal}
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
                <button
                  onClick={prevFAQ}
                  className="text-white hover:text-blue-200 transition duration-200 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <span className="text-blue-200 font-medium">
                  {currentFAQ + 1} of {membershipFAQData.length}
                </span>

                <button
                  onClick={nextFAQ}
                  className="text-white hover:text-blue-200 transition duration-200 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="bg-[#18384D] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">{membershipFAQData[currentFAQ].question}</h3>
                {membershipFAQData[currentFAQ].button ? (
                  <a
                    href={membershipFAQData[currentFAQ].button!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {membershipFAQData[currentFAQ].button!.text}
                  </a>
                ) : (
                  <p className="text-blue-100 leading-relaxed">{membershipFAQData[currentFAQ].answer}</p>
                )}
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center space-x-2">
                {membershipFAQData.map((_, index) => (
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
      )}
    </section>
  );
} 