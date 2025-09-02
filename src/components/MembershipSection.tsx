"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function MembershipSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoClick = () => {
    setIsPlaying(true);
    // Use setTimeout to ensure the video element is rendered before playing
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(error => {
          console.error("Error auto-playing video:", error);
        });
      }
    }, 100);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          {/* Background outline text */}
          <div className="absolute w-full text-center opacity-10 pointer-events-none overflow-hidden">
            <h2 className="font-bold text-[4.1rem] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] tracking-tight uppercase px-4">MEMBERSHIP</h2>
          </div>
          
          {/* Foreground text */}
          <h2 className="section-title text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight relative z-10 px-4">
            BECOME A MEMBER
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mt-8 font-light max-w-3xl mx-auto">
            Join our community of believers.
          </p>
        </div>

        {/* Clickable Video Card - Sized like the slideshow */}
        <div className="relative max-w-5xl mx-auto overflow-hidden">
          <div 
            className={`relative w-full aspect-[9/16] sm:aspect-[9/16] md:h-[550px] bg-[#0F1E2C] rounded-xl overflow-hidden border border-[#2c5a7a] ${!isPlaying ? 'cursor-pointer group' : ''}`}
            onClick={!isPlaying ? handleVideoClick : undefined}
          >
            {!isPlaying ? (
              <>
                {/* Thumbnail with play button */}
                <div className="absolute inset-0 bg-black">
                  <Image
                    src="/images/WEB/brothers/5.png"
                    alt="USIC Membership Video Thumbnail"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-80"
                    style={{
                      objectPosition: 'center'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1219]/50 to-[#18384D] z-10"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-20 h-20 rounded-full bg-blue-500/80 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-white tracking-tight">USIC MEMBERSHIP HIGHLIGHTS</h3>
                  <p className="font-body text-blue-100 mb-4 max-w-2xl text-lg">
                    Join USIC to become part of our community and enjoy exclusive benefits and opportunities.
                  </p>
                  <p className="font-body text-blue-200 text-sm">Click to watch video</p>
                </div>
              </>
            ) : (
              /* Video player with proper aspect ratio handling */
              <div className="flex items-center justify-center w-full h-full bg-black">
                <video 
                  ref={videoRef}
                  className="h-full max-h-full object-contain" 
                  controls 
                  src="/usichighlights.mp4"
                  poster="/images/WEB/1.png"
                  style={{
                    // Maintain natural aspect ratio when in fullscreen
                    maxWidth: "100%",
                    maxHeight: "100%"
                  }}
                >
                  <source src="/usichighlights.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>

        {/* Large CTA Button */}
        <div className="text-center mt-12">
          <p className="text-lg md:text-xl text-blue-100 mb-8 font-light max-w-2xl mx-auto">
            The path to brotherhood and spiritual growth
            <span className="font-bold block mt-2">begins with a single step.</span>
          </p>
          
          <a 
            href="https://su.sheffield.ac.uk/activities/view/islamic-circle-society" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 text-lg"
          >
            JOIN USIC NOW
          </a>
        </div>
      </div>
    </section>
  );
} 