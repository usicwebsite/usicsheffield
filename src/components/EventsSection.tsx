"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsSection() {
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  // const [loadedImages] = useState<Set<number>>(new Set());
  
  // Event images data - alternating between brothers and sisters
  const eventImages = [
    {
      id: 1,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister3.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 2,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother1.jpeg",
      alt: "USIC brothers community"
    },
    {
      id: 3,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother2.jpeg",
      alt: "USIC brothers gathering"
    },
    {
      id: 4,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister6.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 5,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother3.jpeg",
      alt: "USIC brothers community"
    },
    {
      id: 6,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister7.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 7,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother4.jpeg",
      alt: "USIC brothers gathering"
    },
    {
      id: 8,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister8.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 9,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother5.jpeg",
      alt: "USIC brothers community"
    },
    {
      id: 10,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister9.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 11,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-2.jpg",
      alt: "USIC Annual Dinner 2025 celebration"
    },
    {
      id: 12,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister10.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 13,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-6.jpg",
      alt: "USIC Annual Dinner 2025 gathering"
    },
    {
      id: 14,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister11.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 15,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister12.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 16,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-16.jpg",
      alt: "USIC Annual Dinner 2025 event"
    },
    {
      id: 17,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister24.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 18,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-21.jpg",
      alt: "USIC Annual Dinner 2025 celebration"
    },
    {
      id: 19,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister25.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 20,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-25.jpg",
      alt: "USIC Annual Dinner 2025 event"
    },
    {
      id: 21,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister26.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 22,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-45.jpg",
      alt: "USIC Annual Dinner 2025 celebration"
    },
    {
      id: 23,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister27.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 24,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-55.jpg",
      alt: "USIC Annual Dinner 2025 gathering"
    },
    {
      id: 25,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-81.jpg",
      alt: "USIC Annual Dinner 2025 event"
    },
    {
      id: 26,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-107.jpg",
      alt: "USIC Annual Dinner 2025 celebration"
    },
    {
      id: 27,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/IMG_0006.JPG",
      alt: "USIC community gathering"
    },
    {
      id: 28,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/IMG_0028.JPG",
      alt: "USIC community activity"
    },
    {
      id: 29,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/IMG_9262.JPG",
      alt: "USIC community celebration"
    },
    {
      id: 30,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/IMG_9980.JPG",
      alt: "USIC community gathering"
    }
  ];

  // Different order for bottom slider - shuffled to create visual variety
  const bottomSliderImages = [
    {
      id: 1,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/IMG_9262.JPG",
      alt: "USIC community celebration"
    },
    {
      id: 2,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister10.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 3,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-107.jpg",
      alt: "USIC Annual Dinner 2025 celebration"
    },
    {
      id: 4,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister6.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 5,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother4.jpeg",
      alt: "USIC brothers gathering"
    },
    {
      id: 6,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister25.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 7,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-21.jpg",
      alt: "USIC Annual Dinner 2025 celebration"
    },
    {
      id: 8,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister3.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 9,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother2.jpeg",
      alt: "USIC brothers gathering"
    },
    {
      id: 10,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister27.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 11,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-6.jpg",
      alt: "USIC Annual Dinner 2025 gathering"
    },
    {
      id: 12,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister8.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 13,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/IMG_0006.JPG",
      alt: "USIC community gathering"
    },
    {
      id: 14,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister11.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 15,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister12.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 16,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-45.jpg",
      alt: "USIC Annual Dinner 2025 celebration"
    },
    {
      id: 17,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister24.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 18,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother5.jpeg",
      alt: "USIC brothers community"
    },
    {
      id: 19,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister7.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 20,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-25.jpg",
      alt: "USIC Annual Dinner 2025 event"
    },
    {
      id: 21,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister26.jpeg",
      alt: "USIC sisters community"
    },
    {
      id: 22,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother1.jpeg",
      alt: "USIC brothers community"
    },
    {
      id: 23,
      title: "USIC Sisters",
      imagePath: "/images/WEB/sisters/sister9.jpeg",
      alt: "USIC sisters gathering"
    },
    {
      id: 24,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-55.jpg",
      alt: "USIC Annual Dinner 2025 gathering"
    },
    {
      id: 25,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/IMG_0028.JPG",
      alt: "USIC community activity"
    },
    {
      id: 26,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-2.jpg",
      alt: "USIC Annual Dinner 2025 celebration"
    },
    {
      id: 27,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/brother3.jpeg",
      alt: "USIC brothers community"
    },
    {
      id: 28,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-81.jpg",
      alt: "USIC Annual Dinner 2025 event"
    },
    {
      id: 29,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/USIC Annual Dinner 2025-16.jpg",
      alt: "USIC Annual Dinner 2025 event"
    },
    {
      id: 30,
      title: "USIC Brothers",
      imagePath: "/images/WEB/brothers/IMG_9980.JPG",
      alt: "USIC community gathering"
    }
  ];
  
  // Create references for the scrolling rows
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer for lazy loading
  const imageObserver = useCallback((node: HTMLDivElement) => {
    if (node) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const imageIndex = parseInt(entry.target.getAttribute('data-image-index') || '0');
              setVisibleImages(prev => new Set([...prev, imageIndex]));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image comes into view
          threshold: 0.1
        }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, []);
  
  // Auto-scroll effect with constant speed
  useEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;
    
    if (!topRow || !bottomRow) {
      return;
    }
    
    // Speed in pixels per frame
    const SCROLL_SPEED = 0.3;
    
    let topAnimationFrame: number;
    let bottomAnimationFrame: number;
    let isTopPaused = false;
    let isBottomPaused = false;
    
    // Top row animation (left to right)
    const animateTopRow = () => {
      if (!topRow) {
        return;
      }
      
      if (isTopPaused) {
        topAnimationFrame = requestAnimationFrame(animateTopRow);
        return;
      }
      
      topRow.scrollLeft += SCROLL_SPEED;
      
      // Reset when reaching the end (accounting for the tripled content)
      const maxScroll = topRow.scrollWidth / 3; // Since we have 3 copies
      if (topRow.scrollLeft >= maxScroll) {
        topRow.scrollLeft = 0;
      }
      
      topAnimationFrame = requestAnimationFrame(animateTopRow);
    };
    
    // Bottom row animation (right to left)
    const animateBottomRow = () => {
      if (!bottomRow) {
        return;
      }
      
      if (isBottomPaused) {
        bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
        return;
      }
      
      bottomRow.scrollLeft -= SCROLL_SPEED;
      
      // Reset when reaching the beginning
      if (bottomRow.scrollLeft <= 0) {
        const maxScroll = bottomRow.scrollWidth / 3; // Since we have 3 copies
        bottomRow.scrollLeft = maxScroll;
      }
      
      bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
    };
    
    // Initialize positions with delay to ensure DOM is ready
    setTimeout(() => {
      topRow.scrollLeft = 0;
      const maxScroll = bottomRow.scrollWidth / 3;
      bottomRow.scrollLeft = maxScroll;
      
      // Start animations
      topAnimationFrame = requestAnimationFrame(animateTopRow);
      bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
    }, 100);
    
    // Pause/resume functions for top row
    const pauseTopScrolling = () => {
      isTopPaused = true;
    };
    
    const resumeTopScrolling = () => {
      isTopPaused = false;
    };
    
    // Pause/resume functions for bottom row
    const pauseBottomScrolling = () => {
      isBottomPaused = true;
    };
    
    const resumeBottomScrolling = () => {
      isBottomPaused = false;
    };
    
    // Add event listeners
    topRow.addEventListener('mouseenter', pauseTopScrolling);
    topRow.addEventListener('mouseleave', resumeTopScrolling);
    bottomRow.addEventListener('mouseenter', pauseBottomScrolling);
    bottomRow.addEventListener('mouseleave', resumeBottomScrolling);
    
    return () => {
      cancelAnimationFrame(topAnimationFrame);
      cancelAnimationFrame(bottomAnimationFrame);
      
      if (topRow) {
        topRow.removeEventListener('mouseenter', pauseTopScrolling);
        topRow.removeEventListener('mouseleave', resumeTopScrolling);
      }
      if (bottomRow) {
        bottomRow.removeEventListener('mouseenter', pauseBottomScrolling);
        bottomRow.removeEventListener('mouseleave', resumeBottomScrolling);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Title section with container */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center relative">
          {/* Background outline text */}
          <div className="absolute w-full text-center opacity-10 pointer-events-none overflow-hidden">
            <h2 className="font-bold text-[4.1rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] tracking-tight uppercase px-4">OUR EVENTS</h2>
          </div>
          
          {/* Foreground text */}
          <h2 className="section-title text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight relative z-10 px-4">
            OUR EVENTS
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mt-4 mb-12 font-light max-w-2xl mx-auto px-4">
            Who said university life as a Muslim is boring?
            <span className="font-bold block mt-2">Be a part of a brotherhood and sisterhood like no other.</span>
          </p>
        </div>
      </div>

      {/* Full-width image rows with no container constraints */}
      <div className="w-full overflow-hidden mb-8">
        {/* Top row - scrolls right */}
        <div 
          ref={topRowRef}
          className="flex overflow-x-auto whitespace-nowrap mb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Triple the images for continuous scrolling effect */}
          {[...eventImages, ...eventImages, ...eventImages].map((image, index) => {
            const originalIndex = index % eventImages.length;
            const isVisible = visibleImages.has(originalIndex);
            
            return (
              <div 
                key={`top-${image.id}-${index}`} 
                ref={index < eventImages.length ? imageObserver : undefined}
                data-image-index={originalIndex}
                className="inline-block w-[200px] h-[150px] sm:w-[280px] sm:h-[200px] md:w-[350px] md:h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
                {isVisible ? (
                  <Image
                    src={image.imagePath}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, 350px"
                    style={{ 
                      objectFit: 'cover'
                    }}
                    className="transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    quality={80}
                    onLoad={() => {}}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Bottom row - scrolls left */}
        <div 
          ref={bottomRowRef}
          className="flex overflow-x-auto whitespace-nowrap"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Triple the images for continuous scrolling effect */}
          {[...bottomSliderImages, ...bottomSliderImages, ...bottomSliderImages].map((image, index) => {
            const originalIndex = index % bottomSliderImages.length;
            const isVisible = visibleImages.has(originalIndex);
            
            return (
              <div 
                key={`bottom-${image.id}-${index}`} 
                ref={index < bottomSliderImages.length ? imageObserver : undefined}
                data-image-index={originalIndex}
                className="inline-block w-[200px] h-[150px] sm:w-[280px] sm:h-[200px] md:w-[350px] md:h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
                {isVisible ? (
                  <Image
                    src={image.imagePath}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, 350px"
                    style={{ 
                      objectFit: 'cover'
                    }}
                    className="transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    quality={80}
                    onLoad={() => {}}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer content with container */}
      <div className="container mx-auto px-4">
        {/* Divider line */}
        <div className="flex justify-center my-12">
          <div className="w-16 h-1 bg-white/70"></div>
        </div>
        
        {/* Final statement */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
            Join us for our upcoming events
          </h3>
          
          <Link 
            href="/events" 
            className="inline-block bg-white text-[#18384D] hover:bg-white/90 px-10 py-4 rounded-md font-bold transition duration-300 text-lg"
          >
            VIEW ALL EVENTS
          </Link>
        </div>
      </div>
    </section>
  );
} 