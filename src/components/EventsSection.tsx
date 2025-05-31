"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsSection() {
  // Event images data - adding more images for scrolling effect
  const eventImages = [
    {
      id: 1,
      title: "Annual Charity Hike",
      imagePath: "/images/3.png",
      alt: "Group hiking in the Peak District"
    },
    {
      id: 2,
      title: "Weekly Qur'an Circle",
      imagePath: "/images/8.png",
      alt: "Students gathered for Qur'an study"
    },
    {
      id: 3,
      title: "Annual Dinner",
      imagePath: "/images/12.png",
      alt: "USIC annual formal dinner"
    },
    {
      id: 4,
      title: "Sports Tournament",
      imagePath: "/images/5.png",
      alt: "Students playing sports"
    },
    {
      id: 5,
      title: "Speaker Event",
      imagePath: "/images/2.png",
      alt: "Guest speaker at USIC event"
    },
    {
      id: 6,
      title: "Community Iftar",
      imagePath: "/images/9.png",
      alt: "Community breaking fast together"
    },
    {
      id: 7,
      title: "Eid Celebration",
      imagePath: "/images/1.png",
      alt: "Eid celebration with students"
    },
    {
      id: 8,
      title: "Islamic Awareness Week",
      imagePath: "/images/4.png",
      alt: "Islamic Awareness Week activities"
    },
    {
      id: 9,
      title: "Campus Prayer",
      imagePath: "/images/6.png",
      alt: "Students praying on campus"
    },
    {
      id: 10,
      title: "Charity Fundraiser",
      imagePath: "/images/7.png",
      alt: "Charity fundraising event"
    }
  ];
  
  // Create references for the scrolling rows
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll effect with constant speed
  useEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;
    
    if (!topRow || !bottomRow) return;
    
    // Set initial position for top row to start at the beginning
    topRow.scrollLeft = 0;
    
    // Set initial position for bottom row to appear to scroll from right to left
    bottomRow.scrollLeft = bottomRow.scrollWidth - bottomRow.clientWidth;
    
    // Use requestAnimationFrame for smoother scrolling
    let topLastTimestamp = 0;
    let bottomLastTimestamp = 0;
    
    // Speed in pixels per second - will be converted to pixels per frame in the animation
    const SCROLL_SPEED = 10; 
    
    // Top row animation (left to right)
    const animateTopRow = (timestamp: number) => {
      if (!topRow) return;
      
      if (!topLastTimestamp) topLastTimestamp = timestamp;
      const elapsed = timestamp - topLastTimestamp;
      
      // Calculate how many pixels to move this frame
      const pixelsToMove = (SCROLL_SPEED * elapsed) / 1000;
      
      if (pixelsToMove > 0) {
        topRow.scrollLeft += pixelsToMove;
        topLastTimestamp = timestamp;
        
        // Reset when reaching the end
        if (topRow.scrollLeft >= (topRow.scrollWidth - topRow.clientWidth)) {
          topRow.scrollLeft = 0;
        }
      }
      
      topAnimationFrame = requestAnimationFrame(animateTopRow);
    };
    
    // Bottom row animation (right to left)
    const animateBottomRow = (timestamp: number) => {
      if (!bottomRow) return;
      
      if (!bottomLastTimestamp) bottomLastTimestamp = timestamp;
      const elapsed = timestamp - bottomLastTimestamp;
      
      // Calculate how many pixels to move this frame
      const pixelsToMove = (SCROLL_SPEED * elapsed) / 1000;
      
      if (pixelsToMove > 0) {
        bottomRow.scrollLeft -= pixelsToMove;
        bottomLastTimestamp = timestamp;
        
        // Reset when reaching the beginning
        if (bottomRow.scrollLeft <= 0) {
          bottomRow.scrollLeft = bottomRow.scrollWidth - bottomRow.clientWidth;
        }
      }
      
      bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
    };
    
    let topAnimationFrame = requestAnimationFrame(animateTopRow);
    let bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
    
    // Pause scrolling when hovering
    const pauseScrolling = () => {
      cancelAnimationFrame(topAnimationFrame);
      cancelAnimationFrame(bottomAnimationFrame);
    };
    
    // Resume scrolling
    const resumeScrolling = () => {
      // Reset timestamps to avoid jumps
      topLastTimestamp = 0;
      bottomLastTimestamp = 0;
      
      topAnimationFrame = requestAnimationFrame(animateTopRow);
      bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
    };
    
    topRow.addEventListener('mouseenter', pauseScrolling);
    bottomRow.addEventListener('mouseenter', pauseScrolling);
    
    topRow.addEventListener('mouseleave', resumeScrolling);
    bottomRow.addEventListener('mouseleave', resumeScrolling);
    
    return () => {
      cancelAnimationFrame(topAnimationFrame);
      cancelAnimationFrame(bottomAnimationFrame);
      
      if (topRow) {
        topRow.removeEventListener('mouseenter', pauseScrolling);
        topRow.removeEventListener('mouseleave', resumeScrolling);
      }
      if (bottomRow) {
        bottomRow.removeEventListener('mouseenter', pauseScrolling);
        bottomRow.removeEventListener('mouseleave', resumeScrolling);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-[#18384D] text-white">
      {/* Title section with container */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center relative">
          {/* Background outline text */}
          <div className="absolute w-full text-center opacity-10 pointer-events-none">
            <h2 className="font-bold text-[7rem] md:text-[10rem] tracking-tight uppercase">OUR EVENTS</h2>
          </div>
          
          {/* Foreground text */}
          <h2 className="section-title text-white mb-2 text-4xl md:text-6xl font-black uppercase tracking-tight relative z-10">
            OUR EVENTS
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 mt-4 mb-12 font-light max-w-2xl mx-auto">
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
          className="flex overflow-x-hidden whitespace-nowrap mb-1"
        >
          {/* Duplicate the images for continuous scrolling effect */}
          {[...eventImages, ...eventImages, ...eventImages].map((image, index) => (
            <div 
              key={`top-${image.id}-${index}`} 
              className="inline-block w-[350px] h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
              <Image
                src={image.imagePath}
                alt={image.alt}
                fill
                sizes="350px"
                style={{ 
                  objectFit: 'cover'
                }}
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
        
        {/* Bottom row - scrolls left */}
        <div 
          ref={bottomRowRef}
          className="flex overflow-x-hidden whitespace-nowrap"
        >
          {/* Duplicate the images in reverse order for continuous scrolling effect */}
          {[...eventImages.slice().reverse(), ...eventImages.slice().reverse(), ...eventImages.slice().reverse()].map((image, index) => (
            <div 
              key={`bottom-${image.id}-${index}`} 
              className="inline-block w-[350px] h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
              <Image
                src={image.imagePath}
                alt={image.alt}
                fill
                sizes="350px"
                style={{ 
                  objectFit: 'cover'
                }}
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
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