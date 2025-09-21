"use client";

import React from 'react';
import Image from 'next/image';
import { staticData } from '@/lib/static-data';
import { useImageSlideshow } from '@/hooks/useImageSlideshow';
import CTAButton from '@/components/ui/CTAButton';
import ScrollArrow from '@/components/ui/ScrollArrow';

/**
 * Hero component for the USIC landing page with optimized image slideshow
 */
export default function Hero() {
  const images = staticData.homepage.hero.images;
  const { currentImageIndex } = useImageSlideshow({
    images
  });

  // Scroll to next section
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  // Fallback image for failed loads
  const fallbackImage = '/images/WEB/usic-logo.png';

  return (
    <div className="relative overflow-hidden w-full h-screen">
      {/* Image slideshow background - skeleton first, images appear seamlessly */}
      <div className="absolute inset-0 z-0">
        {/* Skeleton background - instant loading */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1219] via-[#18384D] to-[#0F1E2C]" />

        {/* Smooth slideshow with scale + fade transitions */}
        {images.map((image, index) => {
          const isCurrentImage = index === currentImageIndex;

          return (
            <div
              key={image}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isCurrentImage 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <Image
                src={image}
                alt={`Slideshow image ${index + 1}`}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  filter: 'brightness(0.5)'
                }}
                priority={index < 5} // Prioritize first 5 hero images for above-the-fold content
                loading="eager" // Let Next.js optimize loading based on priority
                quality={85}
                onError={(e) => {
                  // Fallback to logo if image fails to load
                  if (e.currentTarget.src !== fallbackImage) {
                    e.currentTarget.src = fallbackImage;
                  }
                }}
              />
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
          <CTAButton href="/about">Learn More</CTAButton>
          <CTAButton href="https://su.sheffield.ac.uk/activities/view/islamic-circle-society" external>
            Become a Member
          </CTAButton>
        </div>

        {/* Scroll down arrow */}
        <ScrollArrow onClick={scrollToNextSection} />
      </div>
    </div>
  );
} 