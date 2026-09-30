"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { staticData } from '@/lib/static-data';
import {
  findNonSkippedIndex,
  useImageSlideshow,
} from '@/hooks/useImageSlideshow';
import { cloudinaryLoader } from '@/lib/cloudinary-optimizer';
import CTAButton from '@/components/ui/CTAButton';
import ScrollArrow from '@/components/ui/ScrollArrow';

const FALLBACK_IMAGE =
  'https://res.cloudinary.com/derjeh0m2/image/upload/v1758530952/usic-logo_rhs375.png';

interface HeroSlideProps {
  index: number;
  src: string;
  isCurrentImage: boolean;
  markReady: (index: number, src: string) => void;
  markUnready: (index: number) => void;
  markSkipped: (index: number) => void;
  onRequestFallback: (index: number) => void;
}

function HeroSlide({
  index,
  src,
  isCurrentImage,
  markReady,
  markUnready,
  markSkipped,
  onRequestFallback,
}: HeroSlideProps) {
  // Drop stale readiness when this mounted image unmounts or its src changes
  useEffect(() => {
    return () => {
      markUnready(index);
    };
  }, [index, src, markUnready]);

  return (
    <div
      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
        isCurrentImage
          ? 'opacity-100 blur-0'
          : 'opacity-0 blur-sm'
      }`}
    >
      <Image
        src={src}
        alt={`Slideshow image ${index + 1}`}
        fill
        sizes="100vw"
        loader={cloudinaryLoader}
        style={{
          objectFit: 'cover',
          filter: 'brightness(0.5)'
        }}
        priority={index === 0}
        loading="eager"
        fetchPriority={index === 0 ? 'high' : 'auto'}
        onLoad={() => {
          markReady(index, src);
        }}
        onError={() => {
          if (src === FALLBACK_IMAGE) {
            markSkipped(index);

            return;
          }

          onRequestFallback(index);
        }}
      />
    </div>
  );
}

/**
 * Hero component for the USIC landing page with optimized image slideshow
 */
export default function Hero() {
  const images = staticData.homepage.hero.images;
  const [imageSources, setImageSources] = useState(images);

  const {
    currentImageIndex,
    skippedIndices,
    markReady,
    markUnready,
    markSkipped,
  } = useImageSlideshow({
    images: imageSources,
  });

  const previousIndex = findNonSkippedIndex(
    currentImageIndex,
    -1,
    imageSources.length,
    skippedIndices
  );

  const nextIndex = findNonSkippedIndex(
    currentImageIndex,
    1,
    imageSources.length,
    skippedIndices
  );

  // Scroll to next section
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const handleRequestFallback = (index: number) => {
    markUnready(index);
    setImageSources((prev) => {
      if (prev[index] === FALLBACK_IMAGE) {
        return prev;
      }

      const next = [...prev];
      next[index] = FALLBACK_IMAGE;

      return next;
    });
  };

  return (
    <div className="relative overflow-hidden w-full h-screen">
      {/* Image slideshow background - skeleton first, images appear seamlessly */}
      <div className="absolute inset-0 z-0">
        {/* Skeleton background - instant loading */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1219] via-[#18384D] to-[#0F1E2C]" />

        {/* Smooth slideshow with blur + fade transitions */}
        {images.map((originalImage, index) => {
          if (
            index !== previousIndex &&
            index !== currentImageIndex &&
            index !== nextIndex
          ) {
            return null;
          }

          return (
            <HeroSlide
              key={originalImage}
              index={index}
              src={imageSources[index]}
              isCurrentImage={index === currentImageIndex}
              markReady={markReady}
              markUnready={markUnready}
              markSkipped={markSkipped}
              onRequestFallback={handleRequestFallback}
            />
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
            src="https://res.cloudinary.com/derjeh0m2/image/upload/v1758531352/Assalamu-aleykum-black_tmoewl.svg"
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
        <div className="w-full flex flex-col sm:flex-row gap-8 justify-center items-center">
          <CTAButton href="/about" className="w-full sm:w-auto min-w-[200px]">Learn More</CTAButton>
          <CTAButton href="https://su.sheffield.ac.uk/activities/view/islamic-circle-society" external className="w-full sm:w-auto min-w-[200px]">
            Become a Member
          </CTAButton>
        </div>

        {/* Scroll down arrow */}
        <ScrollArrow onClick={scrollToNextSection} />
      </div>
    </div>
  );
}
