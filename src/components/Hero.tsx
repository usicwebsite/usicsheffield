"use client";

import React, { useCallback, useRef } from 'react';
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
  const swiperImages = staticData.homepage.slideshow.slides.map(slide => slide.thumbnailImage);
  const eventImages = staticData.homepage.eventImages;
  const { currentImageIndex, shouldRenderImage, getImageLoadingState } = useImageSlideshow({
    images,
    preloadCount: 3, // Reduced preload count to minimize re-renders
    swiperImages,
    eventImages
  });

  // Use refs to prevent loading state changes from causing re-renders
  const loadingStatesRef = useRef<Map<number, string>>(new Map());

  // Stable loading state getter that caches results to prevent re-renders
  const getStableLoadingState = useCallback((index: number) => {
    const cached = loadingStatesRef.current.get(index);
    if (cached !== undefined) return cached;

    const current = getImageLoadingState(index);
    loadingStatesRef.current.set(index, current);
    return current;
  }, [getImageLoadingState]);

  // Update cached loading states only when current image changes
  React.useEffect(() => {
    loadingStatesRef.current.clear(); // Clear cache on image change
  }, [currentImageIndex]);

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
      {/* Image slideshow background */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => {
          if (!shouldRenderImage(index)) return null;

          const loadingState = getStableLoadingState(index);
          const isCurrentImage = index === currentImageIndex;
          const imageSrc = loadingState === 'failed' ? fallbackImage : image;

          return (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                isCurrentImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={imageSrc}
                alt={`Slideshow image ${index + 1}`}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  filter: loadingState === 'failed' ? 'brightness(0.3)' : 'brightness(0.5)'
                }}
                priority={index < 3} // Prioritize first 3 images
                loading={index < 3 ? 'eager' : 'lazy'}
                quality={85}
                onError={(e) => {
                  // Fallback to logo if image fails to load
                  if (e.currentTarget.src !== fallbackImage) {
                    e.currentTarget.src = fallbackImage;
                  }
                }}
              />
              {/* Show subtle loading indicator for current image if not loaded */}
              {isCurrentImage && loadingState === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
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