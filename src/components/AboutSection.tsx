"use client";

import { useState, useEffect, useRef } from 'react';

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle card active
  const totalCards = 3;
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoRotateInterval = 5000; // Auto rotate every 5 seconds
  
  // Set up auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      nextCard();
    }, autoRotateInterval);
    
    return () => clearInterval(interval); // Clean up on unmount
  }, [activeIndex]); // Reset the timer when activeIndex changes
  
  // Pause auto-rotation when user interacts with carousel
  const pauseAutoRotation = () => {
    // This function is attached to user interactions
    // The timer will restart after the next activeIndex change
  };

  // Card content data
  const cards = [
    {
      id: 0,
      title: "Our Aspirations",
      icon: (
        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
        </svg>
      ),
      content: (
        <ul className="space-y-3 text-gray-700 font-body">
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span>Provide a forum for Muslim students to meet and form bonds of brotherhood & sisterhood</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span>Organize events for both Muslims and non-Muslims to gain deeper knowledge of Islam</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span>Look out for the welfare of Muslim students on campus</span>
          </li>
        </ul>
      )
    },
    {
      id: 1,
      title: "Our Values",
      icon: (
        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
        </svg>
      ),
      content: (
        <ul className="space-y-3 text-gray-700 font-body">
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span><strong>Faith:</strong> Unwavering connection with our Creator</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span><strong>Brotherhood & Sisterhood:</strong> Fostering familial bonds</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span><strong>Knowledge:</strong> Commitment to intellectual growth</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#18384D] mr-2 text-xl">•</span>
            <span><strong>Service:</strong> Uplifting the broader community</span>
          </li>
        </ul>
      )
    },
    {
      id: 2,
      title: "Our Vision",
      icon: (
        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-700 mb-4 font-body">
            To foster an Islamic environment that promotes:
          </p>
          <ul className="space-y-3 text-gray-700 font-body">
            <li className="flex items-start">
              <span className="text-[#18384D] mr-2 text-xl">•</span>
              <span>Personal Development</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#18384D] mr-2 text-xl">•</span>
              <span>Brotherhood and Sisterhood</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#18384D] mr-2 text-xl">•</span>
              <span>Unity</span>
            </li>
          </ul>
        </>
      )
    }
  ];
  
  // Handle next/prev card selection
  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  };
  
  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <section className="py-16 bg-[#18384D] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          {/* Background outline text (similar to OUR MEMBERS?) */}
          <div className="absolute w-full text-center opacity-10 pointer-events-none">
            <h2 className="font-bold text-[7rem] md:text-[10rem] tracking-tight uppercase">WHO WE ARE</h2>
          </div>
          
          {/* Foreground text (like the "WHO ARE OUR MEMBERS?") */}
          <h2 className="section-title text-white mb-2 text-4xl md:text-6xl font-black uppercase tracking-tight relative z-10">
            WHO WE ARE
          </h2>
          
          <p className="section-description text-blue-100 max-w-3xl mx-auto mt-8 text-xl md:text-2xl font-light">
            Founded in 1964, USIC represents Muslim students on campus and beyond by providing social and welfare support.
          </p>
        </div>

        {/* Carousel container */}
        <div className="relative mt-12 px-4 overflow-hidden">
          {/* Carousel navigation */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 z-20 w-full flex justify-between px-4">
            <button 
              onClick={() => {
                prevSlide();
                pauseAutoRotation();
              }}
              className="bg-white text-[#18384D] rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-100 transition-all"
              aria-label="Previous card"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => {
                nextCard();
                pauseAutoRotation();
              }}
              className="bg-white text-[#18384D] rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-100 transition-all"
              aria-label="Next card"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Cards */}
          <div 
            className="flex items-center justify-center gap-8 py-16 transition-all duration-700 ease-in-out"
            ref={carouselRef}
          >
            {cards.map((card, index) => {
              // Calculate card position (relative to active)
              const position = (index - activeIndex + totalCards) % totalCards;
              // -1: left, 0: center, 1: right
              
              return (
                <div
                  key={card.id}
                  className={`
                    relative rounded-xl p-0 overflow-hidden
                    transition-all duration-700 ease-in-out
                    ${position === 0 ? 
                      'z-10 scale-110 shadow-2xl -translate-y-6 transform-gpu' : 
                      'scale-85 opacity-70 hover:opacity-90 transform-gpu shadow-lg'}
                    ${position === 1 ? 'order-last translate-x-4' : position === totalCards - 1 ? 'order-first -translate-x-4' : ''}
                    flex-1 min-w-64 max-w-md cursor-pointer
                  `}
                  onClick={() => {
                    setActiveIndex(index);
                    pauseAutoRotation();
                  }}
                >
                  {/* Card top gradient bar */}
                  <div className="h-2 w-full bg-white"></div>
                  
                  {/* Card content */}
                  <div className="bg-white p-8">
                    {/* Icon with gradient background */}
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[#18384D] text-white transform transition-all duration-500">
                      <div className={`transition-all duration-500 ${position === 0 ? 'scale-110' : ''}`}>
                        {card.icon}
                      </div>
                    </div>
                    
                    {/* Title with underline accent */}
                    <div className="mb-6">
                      <h3 className="font-subheading text-2xl font-bold mb-2 transition-all duration-500 text-[#18384D]">
                        {card.title}
                      </h3>
                      <div className={`h-1 w-16 bg-[#18384D] rounded-full transition-all duration-500 ${position === 0 ? 'w-24' : 'w-16'}`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="transition-all duration-500">
                      {card.content}
                    </div>
                  </div>
                  
                  {/* Card bottom decoration */}
                  {position === 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#18384D]"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  pauseAutoRotation();
                }}
                className={`h-3 rounded-full transition-all duration-500 ${
                  index === activeIndex 
                  ? 'w-8 bg-white' 
                  : 'w-3 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 