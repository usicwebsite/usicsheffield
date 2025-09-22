"use client";

import { useEffect, useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BROTHERS_IMAGES, SISTERS_IMAGES } from '../lib/about-data';
import { optimizeCloudinaryUrls } from '../lib/cloudinary-optimizer';

// Removed predictive preloading hook - Next.js Image component handles all optimization

export default function EventsSection() {

  // Optimize images at runtime using useMemo
  const optimizedBrothersImages = useMemo(() => {
    return optimizeCloudinaryUrls(BROTHERS_IMAGES, 'events');
  }, []);

  const optimizedSistersImages = useMemo(() => {
    return optimizeCloudinaryUrls(SISTERS_IMAGES, 'events');
  }, []);

  // Function to generate event images alternating between brothers and sisters
  const generateEventImages = () => {
    const brothersImages = optimizedBrothersImages.map((imagePath, index) => ({
      id: index + 1,
      title: "USIC Brothers",
      imagePath,
      alt: "USIC brothers community"
    }));

    const sistersImages = optimizedSistersImages.map((imagePath, index) => ({
      id: optimizedBrothersImages.length + index + 1,
      title: "USIC Sisters",
      imagePath,
      alt: "USIC sisters community"
    }));

    // Alternate between brothers and sisters images
    const alternatingImages = [];
    const maxLength = Math.max(brothersImages.length, sistersImages.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < brothersImages.length) {
        alternatingImages.push(brothersImages[i]);
      }
      if (i < sistersImages.length) {
        alternatingImages.push(sistersImages[i]);
      }
    }

    return alternatingImages;
  };

  // Generate alternating event images for top row
  const alternatingImages = useMemo(() => generateEventImages(), [optimizedBrothersImages, optimizedSistersImages]);

  // Top row: starts with brother, then sister, brother, sister, etc.
  const eventImages = alternatingImages;

  // Bottom row: randomized order to avoid same images appearing on top of each other
  // Use state to avoid hydration mismatch from Math.random()
  const [bottomSliderImages, setBottomSliderImages] = useState(alternatingImages);

  useEffect(() => {
    // Only randomize on client side to avoid SSR hydration mismatch
    const shuffled = [...alternatingImages].sort(() => Math.random() - 0.5);
    setBottomSliderImages(shuffled);
  }, [alternatingImages]);

  // Create references for the scrolling rows
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  // Removed predictive preloading - let Next.js Image component handle optimization

  // Removed intersection observer - Next.js Image handles lazy loading automatically
  
  // Let Next.js Image component handle loading optimization - removed manual preloading

  // Auto-scroll effect with constant speed and predictive preloading
  useEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;

    if (!topRow || !bottomRow) {
      return;
    }

    // Browser detection for debugging
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isChrome = /chrome/i.test(navigator.userAgent);

    // Speed in pixels per frame
    const SCROLL_SPEED = 0.3;
    
    let topAnimationFrame: number | null = null;
    let bottomAnimationFrame: number | null = null;
    let isTopPaused = false;
    let isBottomPaused = false;
    let isInitialized = false;
    let retryCount = 0;
    let topFrameCount = 0;
    let bottomFrameCount = 0;
    let topTransformX = 0; // For Safari workaround
    let bottomTransformX = 0; // For Safari workaround
    let useTransformForTop = isSafari; // Start with Safari detection, may change for Chrome fallback
    let useTransformForBottom = isSafari; // Use same approach for both sliders
    
    // Function to check if DOM is ready and has proper dimensions
    const isDOMReady = () => {
      const topWidth = topRow.scrollWidth;
      const bottomWidth = bottomRow.scrollWidth;
      const ready = topWidth > 0 && bottomWidth > 0;
      return ready;
    };
    
    // Top row animation (left to right)
    const animateTopRow = () => {
      if (!topRow || !isInitialized) {
        return;
      }
      
      if (isTopPaused) {
        topAnimationFrame = requestAnimationFrame(animateTopRow);
        return;
      }
      
      try {
        if (useTransformForTop) {
          // Transform approach for Safari and Chrome fallback
          topTransformX += SCROLL_SPEED;
          const maxScroll = topRow.scrollWidth / 2; // Reset at midpoint (after first set)

          if (topTransformX >= maxScroll) {
            topTransformX = 0;
          }

          // Use margin-left instead of transform to avoid clipping issues
          topRow.style.marginLeft = `-${topTransformX}px`;
        } else {
          // Standard approach for other browsers
          const beforeScrollLeft = topRow.scrollLeft;
          topRow.scrollLeft += SCROLL_SPEED;

          // Chrome fallback: If scrollLeft didn't change, switch to margin-left
          if (topRow.scrollLeft === beforeScrollLeft && topFrameCount > 60) {
            useTransformForTop = true;
            topTransformX = beforeScrollLeft;
            topRow.style.marginLeft = `-${topTransformX}px`;
          }
        }

        topFrameCount++;

        // Reset when reaching the midpoint (after first set of images)
        if (!useTransformForTop) {
          const halfWidth = topRow.scrollWidth / 2;
          if (topRow.scrollLeft >= halfWidth) {
            topRow.scrollLeft = 0;
          }
        }
      } catch {
        return;
      }
      
      topAnimationFrame = requestAnimationFrame(animateTopRow);
    };
    
    // Bottom row animation (right to left)
    const animateBottomRow = () => {
      if (!bottomRow || !isInitialized) {
        return;
      }
      
      if (isBottomPaused) {
        bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
        return;
      }
      
      try {
        if (useTransformForBottom) {
          // Transform approach for Safari and Chrome fallback
          bottomTransformX -= SCROLL_SPEED;

          if (bottomTransformX <= 0) {
            bottomTransformX = bottomRow.scrollWidth / 2; // Reset to start of second set
          }

          // Use margin-left instead of transform to avoid clipping issues
          bottomRow.style.marginLeft = `-${bottomTransformX}px`;
        } else {
          // Standard approach for other browsers
          const beforeScrollLeft = bottomRow.scrollLeft;
          bottomRow.scrollLeft -= SCROLL_SPEED;

          // Chrome fallback: If scrollLeft didn't change, switch to margin-left
          if (bottomRow.scrollLeft === beforeScrollLeft && bottomFrameCount > 60) {
            useTransformForBottom = true;
            bottomTransformX = beforeScrollLeft;
            bottomRow.style.marginLeft = `-${bottomTransformX}px`;
          }
        }

        bottomFrameCount++;

        // Reset when reaching the beginning - Chrome/other browsers
        if (!useTransformForBottom) {
          if (bottomRow.scrollLeft <= 0) {
            bottomRow.scrollLeft = bottomRow.scrollWidth / 2; // Reset to start of second set
          }
        }
      } catch {
        return;
      }
      
      bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
    };
    
    // Initialize animations with proper DOM readiness check
    const initializeAnimations = () => {
      if (!isDOMReady()) {
        // Retry after a short delay if DOM isn't ready (max 10 retries)
        if (retryCount < 10) {
          retryCount++;
          setTimeout(initializeAnimations, 50);
          return;
        } else {
          return;
        }
      }
      
      try {
        // Initialize positions
        if (useTransformForTop) {
          // Margin approach: Initialize margin for top row
          topTransformX = 0;
          topRow.style.marginLeft = '0px';
        } else {
          // Standard approach for other browsers
          topRow.scrollLeft = 0;
        }

        // Bottom row starts at the beginning of the second set (for leftward scrolling)
        const bottomStartPosition = bottomRow.scrollWidth / 2;
        if (useTransformForBottom) {
          // Margin approach: Initialize margin for bottom row
          bottomTransformX = bottomStartPosition;
          bottomRow.style.marginLeft = `-${bottomTransformX}px`;
        } else {
          // Standard approach for other browsers
          bottomRow.scrollLeft = bottomStartPosition;
        }
        
        // Mark as initialized
        isInitialized = true;
        
        // Start animations
        topAnimationFrame = requestAnimationFrame(animateTopRow);
        bottomAnimationFrame = requestAnimationFrame(animateBottomRow);
      } catch {
        // Try to recover by reinitializing after a delay
        setTimeout(() => {
          if (!isInitialized) {
            initializeAnimations();
          }
        }, 1000);
      }
    };
    
    // Start initialization with a small delay to ensure DOM is ready
    // Use longer delay for Chrome to avoid race conditions
    const initDelay = isChrome ? 300 : 150;
    const initTimeout = setTimeout(initializeAnimations, initDelay);
    
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
      // Clear initialization timeout
      clearTimeout(initTimeout);
      
      // Cancel animation frames
      if (topAnimationFrame !== null) {
        cancelAnimationFrame(topAnimationFrame);
      }
      if (bottomAnimationFrame !== null) {
        cancelAnimationFrame(bottomAnimationFrame);
      }
      
      // Remove event listeners
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
      <div className="w-full mb-8">
        {/* Top row - scrolls right with JavaScript animation */}
        <div
          ref={topRowRef}
          className="flex overflow-x-auto whitespace-nowrap mb-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            willChange: 'transform' // Optimize for Safari transform animations
          }}
        >
          {/* First set of images */}
          {eventImages.map((image) => {
            return (
              <div
                key={`top-1-${image.id}`}
                className="inline-block w-[200px] h-[150px] sm:w-[280px] sm:h-[200px] md:w-[350px] md:h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
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
                  // Quality now optimized by Cloudinary URL transformations
                  onError={(e) => {
                    // Fallback to logo if image fails to load
                    if (e.currentTarget.src !== 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png') {
                      e.currentTarget.src = 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png';
                    }
                  }}
                />
              </div>
            );
          })}
          {/* Second set of images for seamless loop */}
          {eventImages.map((image) => {
            return (
              <div
                key={`top-2-${image.id}`}
                className="inline-block w-[200px] h-[150px] sm:w-[280px] sm:h-[200px] md:w-[350px] md:h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
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
                  // Quality now optimized by Cloudinary URL transformations
                  onError={(e) => {
                    // Fallback to logo if image fails to load
                    if (e.currentTarget.src !== 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png') {
                      e.currentTarget.src = 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png';
                    }
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom row - scrolls left with JavaScript animation */}
        <div
          ref={bottomRowRef}
          className="flex overflow-x-auto whitespace-nowrap"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* First set of images */}
          {bottomSliderImages.map((image) => {
            return (
              <div
                key={`bottom-1-${image.id}`}
                className="inline-block w-[200px] h-[150px] sm:w-[280px] sm:h-[200px] md:w-[350px] md:h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
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
                  // Quality now optimized by Cloudinary URL transformations
                  onError={(e) => {
                    // Fallback to logo if image fails to load
                    if (e.currentTarget.src !== 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png') {
                      e.currentTarget.src = 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png';
                    }
                  }}
                />
              </div>
            );
          })}
          {/* Second set of images for seamless loop */}
          {bottomSliderImages.map((image) => {
            return (
              <div
                key={`bottom-2-${image.id}`}
                className="inline-block w-[200px] h-[150px] sm:w-[280px] sm:h-[200px] md:w-[350px] md:h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
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
                  // Quality now optimized by Cloudinary URL transformations
                  onError={(e) => {
                    // Fallback to logo if image fails to load
                    if (e.currentTarget.src !== 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png') {
                      e.currentTarget.src = 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png';
                    }
                  }}
                />
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