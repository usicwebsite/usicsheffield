"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Hook for predictive image preloading based on scroll direction
function usePredictiveImagePreloading(images: Array<{id: number, imagePath: string}>, containerRef: React.RefObject<HTMLDivElement | null>) {
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const preloadPromisesRef = useRef<Map<number, Promise<void>>>(new Map());

  // Aggressive preload function for critical images
  const preloadCriticalImages = useCallback(async (startIndex: number, count: number = 10) => {
    const preloadPromises: Promise<void>[] = [];

    for (let i = 0; i < count; i++) {
      const imageIndex = (startIndex + i) % images.length;
      const image = images[imageIndex];

      if (preloadPromisesRef.current.has(image.id)) continue; // Already preloading

      const preloadPromise = new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, image.id]));
          resolve();
        };
        img.onerror = () => {
          setFailedImages(prev => new Set([...prev, image.id]));
          resolve(); // Resolve even on error
        };
        img.src = image.imagePath;
      });

      preloadPromisesRef.current.set(image.id, preloadPromise);
      preloadPromises.push(preloadPromise);
    }

    await Promise.all(preloadPromises);
  }, [images]);

  // Preload images based on scroll position and direction
  const preloadBasedOnScroll = useCallback((scrollLeft: number, containerWidth: number) => {
    if (!containerRef.current) return;

    const totalWidth = containerRef.current.scrollWidth / 3; // Account for tripling
    const imagesPerRow = Math.ceil(containerWidth / 200); // Approximate images visible
    const currentImageIndex = Math.floor((scrollLeft / totalWidth) * images.length);

    // Preload current visible images + next batch
    preloadCriticalImages(currentImageIndex, imagesPerRow * 2);
  }, [images.length, preloadCriticalImages, containerRef]);

  return {
    preloadedImages,
    failedImages,
    preloadCriticalImages,
    preloadBasedOnScroll,
    getImageLoadingState: (id: number) => {
      if (preloadedImages.has(id)) return 'loaded';
      if (failedImages.has(id)) return 'failed';
      return 'loading';
    }
  };
}

export default function EventsSection() {
  const [criticalImagesLoaded, setCriticalImagesLoaded] = useState(false);

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

  // Initialize predictive preloading for both sliders
  const topSliderPreloader = usePredictiveImagePreloading(eventImages, topRowRef);
  const bottomSliderPreloader = usePredictiveImagePreloading(bottomSliderImages, bottomRowRef);

  // Intersection Observer for lazy loading (kept for potential future use)
  const imageObserver = useCallback((node: HTMLDivElement) => {
    if (node) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // No longer setting visibleImages since we use criticalImagesLoaded logic
            observer.unobserve(entry.target);
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
  
  // Monitor when critical images are loaded
  useEffect(() => {
    const checkCriticalImagesLoaded = () => {
      const topLoaded = topSliderPreloader.preloadedImages.size >= 6;
      const bottomLoaded = bottomSliderPreloader.preloadedImages.size >= 6;
      if (topLoaded && bottomLoaded && !criticalImagesLoaded) {
        setCriticalImagesLoaded(true);
      }
    };

    // Check immediately and then every 100ms
    checkCriticalImagesLoaded();
    const interval = setInterval(checkCriticalImagesLoaded, 100);

    return () => clearInterval(interval);
  }, [topSliderPreloader.preloadedImages.size, bottomSliderPreloader.preloadedImages.size, criticalImagesLoaded]);

  // Start preloading after 1 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Start preloading first 6 images per slider
      topSliderPreloader.preloadCriticalImages(0, 6);
      bottomSliderPreloader.preloadCriticalImages(0, 6);
    }, 1000); // 1 second delay to prioritize hero loading

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll effect with constant speed and predictive preloading
  // Only start animation when critical images are loaded to prevent flickering
  useEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;

    if (!topRow || !bottomRow || !criticalImagesLoaded) {
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
          const maxScroll = topRow.scrollWidth / 3;
          
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

        // Predictive preloading every 30 frames (less aggressive)
        if (topFrameCount % 30 === 0) {
          const scrollPos = useTransformForTop ? topTransformX : topRow.scrollLeft;
          topSliderPreloader.preloadBasedOnScroll(scrollPos, topRow.clientWidth);
        }

        // Reset when reaching the end (accounting for the tripled content) - Chrome/other browsers
        if (!useTransformForTop) {
          const maxScroll = topRow.scrollWidth / 3; // Since we have 3 copies
          if (topRow.scrollLeft >= maxScroll) {
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
          const maxScroll = bottomRow.scrollWidth / 3;
          
          if (bottomTransformX <= 0) {
            bottomTransformX = maxScroll;
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

        // Predictive preloading every 30 frames (less aggressive)
        if (bottomFrameCount % 30 === 0) {
          const scrollPos = useTransformForBottom ? bottomTransformX : bottomRow.scrollLeft;
          bottomSliderPreloader.preloadBasedOnScroll(scrollPos, bottomRow.clientWidth);
        }

        // Reset when reaching the beginning - Chrome/other browsers
        if (!useTransformForBottom) {
          if (bottomRow.scrollLeft <= 0) {
            const maxScroll = bottomRow.scrollWidth / 3; // Since we have 3 copies
            bottomRow.scrollLeft = maxScroll;
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
        
        const maxScroll = bottomRow.scrollWidth / 3;
        if (useTransformForBottom) {
          // Margin approach: Initialize margin for bottom row
          bottomTransformX = maxScroll;
          bottomRow.style.marginLeft = `-${bottomTransformX}px`;
        } else {
          // Standard approach for other browsers
          bottomRow.scrollLeft = maxScroll;
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
  }, [criticalImagesLoaded]);

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
        {/* Top row - scrolls right */}
        <div 
          ref={topRowRef}
          className="flex overflow-x-auto whitespace-nowrap mb-1"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            willChange: 'transform' // Optimize for Safari transform animations
          }}
        >
          {/* Triple the images for continuous scrolling effect */}
          {[...eventImages, ...eventImages, ...eventImages].map((image, index) => {
            const originalIndex = index % eventImages.length;
            const loadingState = topSliderPreloader.getImageLoadingState(image.id);
            const fallbackImage = '/images/WEB/usic-logo.png';
            const imageSrc = loadingState === 'failed' ? fallbackImage : image.imagePath;

            return (
              <div
                key={`top-${image.id}-${index}`}
                ref={index < eventImages.length ? imageObserver : undefined}
                data-image-index={originalIndex}
                className="inline-block w-[200px] h-[150px] sm:w-[280px] sm:h-[200px] md:w-[350px] md:h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
                {loadingState === 'loaded' && criticalImagesLoaded ? (
                  <Image
                    src={imageSrc}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, 350px"
                    style={{
                      objectFit: 'cover'
                    }}
                    className="transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    quality={80}
                    onError={(e) => {
                      // Fallback to logo if image fails to load
                      if (e.currentTarget.src !== fallbackImage) {
                        e.currentTarget.src = fallbackImage;
                      }
                    }}
                  />
                ) : (
                  // During loading or failed state - show consistent placeholder
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    {!criticalImagesLoaded ? (
                      // Loading state - show spinner
                      <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      // Failed or not loaded - show fallback
                      <Image
                        src={fallbackImage}
                        alt="USIC logo fallback"
                        width={40}
                        height={40}
                        className="opacity-50"
                      />
                    )}
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
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {/* Triple the images for continuous scrolling effect */}
          {[...bottomSliderImages, ...bottomSliderImages, ...bottomSliderImages].map((image, index) => {
            const originalIndex = index % bottomSliderImages.length;
            const loadingState = bottomSliderPreloader.getImageLoadingState(image.id);
            const fallbackImage = '/images/WEB/usic-logo.png';
            const imageSrc = loadingState === 'failed' ? fallbackImage : image.imagePath;

            return (
              <div
                key={`bottom-${image.id}-${index}`}
                ref={index < bottomSliderImages.length ? imageObserver : undefined}
                data-image-index={originalIndex}
                className="inline-block w-[200px] h-[150px] sm:w-[280px] sm:h-[200px] md:w-[350px] md:h-[250px] relative flex-shrink-0 mx-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 z-10"></div>
                {loadingState === 'loaded' && criticalImagesLoaded ? (
                  <Image
                    src={imageSrc}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, 350px"
                    style={{
                      objectFit: 'cover'
                    }}
                    className="transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    quality={80}
                    onError={(e) => {
                      // Fallback to logo if image fails to load
                      if (e.currentTarget.src !== fallbackImage) {
                        e.currentTarget.src = fallbackImage;
                      }
                    }}
                  />
                ) : (
                  // During loading or failed state - show consistent placeholder
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    {!criticalImagesLoaded ? (
                      // Loading state - show spinner
                      <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      // Failed or not loaded - show fallback
                      <Image
                        src={fallbackImage}
                        alt="USIC logo fallback"
                        width={40}
                        height={40}
                        className="opacity-50"
                      />
                    )}
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