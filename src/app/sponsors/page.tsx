'use client';

import { useState, useEffect } from 'react';

export default function SponsorsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  // Auto-rotate slides every 10 seconds (increased from 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const sponsors = [
    {
      id: 0,
      name: "UNIT Sheffield",
      description: "The best place for halal gourmet burgers, Philly cheese-steaks, freakshakes and more.",
      image: "/images/unitsheffield.jpg",
      url: "https://www.unitsheffield.com/",
      gradientFrom: "from-slate-900/90",
      gradientTo: "to-gray-900/90",
      textGradient: "from-white to-gray-300",
      shadowColor: "shadow-slate-900/30"
    },
    {
      id: 1,
      name: "IQRA Store",
      description: "Premium lifestyle store for modest clothing, scarves, perfumes books, gifts and more.",
      image: "/images/iqrastore.jpg",
      url: "https://abayabyiqra.co.uk/",
      gradientFrom: "from-slate-900/90",
      gradientTo: "to-gray-900/90",
      textGradient: "from-white to-gray-300",
      shadowColor: "shadow-slate-900/30"
    },
    {
      id: 2,
      name: "Rockingham House",
      description: "A fantastic accommodation for the best student life experience!",
      image: "/images/rockinghamhouse.jpg",
      url: "https://wearehomesforstudents.com/student-accommodation/sheffield/rockingham-house",
      gradientFrom: "from-slate-900/90",
      gradientTo: "to-gray-900/90",
      textGradient: "from-white to-gray-300",
      shadowColor: "shadow-slate-900/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">OUR SPONSORS</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100 mb-8">
            Each sponsor focuses on different aspects of community support and student services
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 relative">
        {/* Current partners section */}
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">CURRENT PARTNERS</h2>
        
        {/* Slideshow container with relative positioning */}
        <div className="max-w-6xl mx-auto relative h-[36rem] md:h-[30rem]">
          {/* Left arrow navigation indicator - positioned higher */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-[50%] transform -translate-y-1/2 opacity-60 hover:opacity-100 transition cursor-pointer z-20"
            aria-label="Previous slide"
          >
            <div className="bg-black/40 rounded-full p-3 backdrop-blur-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          
          {/* Right arrow navigation indicator - positioned higher */}
          <button 
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-[50%] transform -translate-y-1/2 opacity-60 hover:opacity-100 transition cursor-pointer z-20"
            aria-label="Next slide"
          >
            <div className="bg-black/40 rounded-full p-3 backdrop-blur-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Slide transition container */}
          <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
            {sponsors.map((sponsor, index) => (
              <div 
                key={sponsor.id} 
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform 
                  ${index === currentSlide ? 'opacity-100 translate-x-0 z-10' : 
                    index < currentSlide ? 'opacity-0 -translate-x-full z-0' : 'opacity-0 translate-x-full z-0'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${sponsor.gradientFrom} ${sponsor.gradientTo} opacity-90 z-10`}></div>
                <div className="grid md:grid-cols-2 items-center h-full relative z-20">
                  <div className="p-10 md:p-12 order-2 md:order-1">
                    <div className="inline-block p-2 bg-black/30 backdrop-blur-md rounded-lg mb-6">
                      <h2 className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${sponsor.textGradient}`}>
                        {sponsor.name}
                      </h2>
                    </div>
                    <p className="text-lg text-gray-200 mb-8 backdrop-blur-sm">
                      {sponsor.description}
                    </p>
                    <a 
                      href={sponsor.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-black/30 backdrop-blur-md rounded-full font-medium text-white hover:bg-black/50 transition duration-300"
                    >
                      Visit {sponsor.name.split(' ')[0]} <span className="ml-2 group-hover:ml-3 transition-all">→</span>
                    </a>
                  </div>
                  <div className="h-full md:h-full overflow-hidden order-1 md:order-2">
                    <a 
                      href={sponsor.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block h-full cursor-pointer transition-transform duration-300 hover:scale-105"
                    >
                      <img 
                        src={sponsor.image} 
                        alt={`${sponsor.name}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation dots */}
        <div className="flex justify-center mt-6 space-x-3">
          {sponsors.map((_, index) => (
            <button 
              key={index} 
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-12 bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
        
        {/* Become a partner section */}
        <div className="mt-24 max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 blur-3xl -z-10 bg-gradient-to-r from-gray-900/20 to-slate-900/20 rounded-full transform -translate-y-1/4"></div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">BECOME A PARTNER</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join our network of partners and connect with our community. Contact us to learn about partnership opportunities.
          </p>
          <a 
            href="mailto:islam.circle@sheffield.ac.uk" 
            className="inline-flex items-center justify-center px-8 py-4 bg-black/40 hover:bg-black/60 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            Contact Us <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </div>
  );
} 