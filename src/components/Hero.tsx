"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Hero component for the USIC landing page with optimized image slideshow
 */
export default function Hero() {
  // Define slideshow images alternating between brothers and sisters
  const images = useMemo(() => [
    '/images/WEB/brothers/IMG_9262.JPG',
    '/images/WEB/brothers/IMG_9980.JPG',
    '/images/WEB/sisters/sister3.jpeg',
    '/images/WEB/brothers/brother1.jpeg',
    '/images/WEB/brothers/brother2.jpeg',
    '/images/WEB/sisters/sister6.jpeg',
    '/images/WEB/brothers/brother3.jpeg',
    '/images/WEB/sisters/sister7.jpeg',
    '/images/WEB/brothers/brother4.jpeg',
    '/images/WEB/sisters/sister8.jpeg',
    '/images/WEB/brothers/brother5.jpeg',
    '/images/WEB/sisters/sister9.jpeg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-2.jpg',
    '/images/WEB/sisters/sister10.jpeg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-6.jpg',
    '/images/WEB/sisters/sister11.jpeg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-16.jpg',
    '/images/WEB/sisters/sister12.jpeg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-21.jpg',
    '/images/WEB/sisters/sister24.jpeg',
    '/images/WEB/sisters/sister25.jpeg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-25.jpg',
    '/images/WEB/sisters/sister26.jpeg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-45.jpg',
    '/images/WEB/sisters/sister27.jpeg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-55.jpg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-81.jpg',
    '/images/WEB/brothers/USIC Annual Dinner 2025-107.jpg',
    '/images/WEB/brothers/IMG_0006.JPG',
    '/images/WEB/brothers/IMG_0028.JPG',
  ], []);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [loadedImages] = useState<Set<number>>(new Set([0])); // Track loaded images
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set()); // Track preloaded images

  // Progressive image loading effect
  useEffect(() => {
    // Preload next 2 images after current image loads
    const preloadNextImages = (currentIndex: number) => {
      const nextIndices = [
        (currentIndex + 1) % images.length,
        (currentIndex + 2) % images.length
      ];
      
      nextIndices.forEach(index => {
        if (!preloadedImages.has(index)) {
          const img = new window.Image();
          img.onload = () => {
            setPreloadedImages(prev => new Set([...prev, index]));
          };
          img.src = images[index];
        }
      });
    };

    // Initial preload of next images
    preloadNextImages(0);
  }, [images, preloadedImages]);

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        // Preload next images when changing
        const preloadNextImages = (currentIndex: number) => {
          const nextIndices = [
            (currentIndex + 1) % images.length,
            (currentIndex + 2) % images.length
          ];
          
          nextIndices.forEach(index => {
            if (!preloadedImages.has(index)) {
              const img = new window.Image();
              img.onload = () => {
                setPreloadedImages(prev => new Set([...prev, index]));
              };
              img.src = images[index];
            }
          });
        };
        preloadNextImages(nextIndex);
        return nextIndex;
      });
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [images, preloadedImages]);

  // Scroll to next section
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative overflow-hidden w-full h-screen">
      {/* Image slideshow background */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => {
          // Only render current image and next 2 preloaded images
          const shouldRender = index === currentImageIndex || 
                              (preloadedImages.has(index) && Math.abs(index - currentImageIndex) <= 2);
          
          if (!shouldRender) return null;
          
          return (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`Slideshow image ${index + 1}`}
                  fill
                  sizes="100vw"
                  style={{ 
                    objectFit: 'cover',
                    filter: 'brightness(0.5)'
                  }}
                  priority={index === 0} // Load first image with priority
                  loading={index === 0 ? 'eager' : 'lazy'}
                  quality={85} // Optimize quality for better performance
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlay gradient */}
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-b from-[#0A1219]/60 via-[#0A1219]/40 to-[#18384D]/80"
      ></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        {/* SVG heading */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl mb-6 px-4">
          <Image
            src="/Assalamu-aleykum-black.svg"
            alt="Assalamu Aleykum"
            width={720}
            height={280}
            className="w-full h-auto"
            style={{ filter: 'invert(1)' }} // Make the black SVG white
          />
        </div>
        
        {/* Subheading */}
        <p className="font-subheading text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 text-white max-w-3xl tracking-wide font-bold">
          University of Sheffield Islamic Circle
        </p>

        <p className="font-body text-lg sm:text-xl mb-10 text-white/90 max-w-2xl italic">
          &apos;A sanctuary from the trials of university life.&apos;
        </p>

        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">Join The Islamic Circle for a vibrant community, spiritual growth, and unforgettable experiences. Don&apos;t miss out on <span className="text-white font-semibold">Sheffield&apos;s premier Islamic society!</span></p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/about" 
            className="bg-white text-[#18384D] hover:bg-white/90 px-8 py-4 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
          >
            Learn More
          </Link>
          <a 
            href="https://su.sheffield.ac.uk/activities/view/islamic-circle-society"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#18384D] hover:bg-white/90 px-8 py-4 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
          >
            Become a Member
          </a>
        </div>

        {/* Scroll down arrow */}
        <button 
          onClick={scrollToNextSection}
          className="absolute bottom-8 left-2/5 transform -translate-x-1/2 text-white cursor-pointer animate-bounce"
          aria-label="Scroll down"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 