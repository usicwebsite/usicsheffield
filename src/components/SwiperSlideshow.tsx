"use client";

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { staticData } from '@/lib/static-data';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function SwiperSlideshow() {
  const { slideshow } = staticData.homepage;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  // Preload all slideshow images immediately
  useEffect(() => {
    slideshow.slides.forEach((slide) => {
      if (slide.thumbnailImage) {
        const img = new window.Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, slide.thumbnailImage]));
        };
        img.src = slide.thumbnailImage;
      }
    });
  }, []);

  // Set initial pagination active state
  useEffect(() => {
    const timer = setTimeout(() => {
      const paginationEl = document.querySelector('.swiper-pagination');
      if (paginationEl) {
        const bullets = paginationEl.querySelectorAll('span');
        if (bullets.length > 0) {
          bullets[0].classList.add('swiper-pagination-bullet-active');
        }
      }
    }, 100); // Small delay to ensure swiper has rendered

    return () => clearTimeout(timer);
  }, []);


  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlideIndex(swiper.realIndex);

    // Update pagination active state manually
    // Map duplicate slides to their corresponding original bullets
    const mappedIndex = swiper.realIndex % 4;

    // Remove active class from all bullets
    const paginationEl = document.querySelector('.swiper-pagination');
    if (paginationEl) {
      const bullets = paginationEl.querySelectorAll('span');
      bullets.forEach((bullet, index) => {
        bullet.classList.remove('swiper-pagination-bullet-active');
        // Add active class to the correct bullet
        if (index === mappedIndex) {
          bullet.classList.add('swiper-pagination-bullet-active');
        }
      });
    }
  };


  const renderSlideContent = (slide: typeof slideshow.slides[0]) => {

    switch (slide.type) {
      case 'spotify':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <a
              href={slide.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full group cursor-pointer"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                {preloadedImages.has(slide.thumbnailImage) ? (
                  <img
                    src={slide.thumbnailImage}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = slide.fallbackImage;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        );
      
      case 'youtube':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <a
              href={slide.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full group cursor-pointer"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                {preloadedImages.has(slide.thumbnailImage) ? (
                  <img
                    src={slide.thumbnailImage}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = slide.fallbackImage;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        );
      
      case 'instagram':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <a
              href={slide.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full group cursor-pointer"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                {preloadedImages.has(slide.thumbnailImage) ? (
                  <img
                    src={slide.thumbnailImage}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = slide.fallbackImage;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                    <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        );
      
      case 'newsletter':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <a
              href={slide.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full group cursor-pointer"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                {preloadedImages.has(slide.thumbnailImage) ? (
                  <img
                    src={slide.thumbnailImage}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = slide.fallbackImage;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={slide.fallbackImage}
              alt={slide.title}
              width={300}
              height={200}
              className="object-cover rounded-lg"
            />
          </div>
        );
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center relative">
          {/* Background outline text */}
          <div className="absolute w-full text-center opacity-10 pointer-events-none overflow-hidden">
            <h2 className="font-bold text-[4.1rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] tracking-tight uppercase px-4 whitespace-nowrap -ml-2 sm:-ml-1 md:ml-0">
              {slideshow.title} {slideshow.subtitle}
            </h2>
          </div>
          
          {/* Foreground text */}
          <h2 className="section-title text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight relative z-10 px-4">
            {slideshow.title} {slideshow.subtitle}
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mt-4 mb-12 font-light max-w-2xl mx-auto px-4">
            Stay connected with our latest content and community updates.
          </p>
        </div>
      </div>

      {/* Full-width Swiper Container with Navigation */}
      <div className="relative w-full overflow-hidden">
        {/* Custom Navigation Buttons - Full Width */}
        <div className="swiper-button-next">
          <svg width="31" height="49" viewBox="0 0 31 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.7231 48.774L30.2647 24.6681L5.7231 0.562256L0 6.18857L18.8136 24.6681L0 43.1477L5.7231 48.774Z" fill="white"></path>
          </svg>
        </div>
        <div className="swiper-button-prev">
          <svg width="31" height="49" viewBox="0 0 31 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.5415 0.610405L-5.72205e-05 24.7163L24.5415 48.8221L30.2646 43.1958L11.4511 24.7163L30.2646 6.23672L24.5415 0.610405Z" fill="white"></path>
          </svg>
        </div>

        {/* Swiper Container */}
        <div className="container mx-auto px-4">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={true}
            spaceBetween={30}
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              el: '.swiper-pagination',
              clickable: true,
              renderBullet: function (index, className) {
                // Only render bullets for first 4 slides
                if (index >= 4) return '';

                return `<span class="${className}" data-slide-index="${index}">${slideshow.slides[index].title}</span>`;
              },
            }}
            modules={[EffectCoverflow, Navigation, Pagination]}
            className="mySwiper"
            onSlideChange={handleSlideChange}
            style={{
              paddingBottom: '45px',
              paddingLeft: '60px',
              paddingRight: '60px',
            }}
          >
            {slideshow.slides.map((slide) => (
              <SwiperSlide key={slide.id} className="swiper-slide">
                <div className="relative w-full h-full bg-[#0F1E2C] rounded-lg overflow-hidden shadow-2xl">
                  {renderSlideContent(slide)}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="swiper-pagination"></div>
        </div>
      </div>

      {/* Mobile Slide Title - Only visible on small screens */}
      <div className="block md:hidden text-center mt-4 px-4">
        <h3 className="text-white text-lg font-semibold">
          {slideshow.slides[currentSlideIndex]?.title}
        </h3>
      </div>

      <style jsx global>{`
        .swiper {
          width: 100%;
          padding-bottom: 45px;
          overflow: visible;
        }
        
        .swiper-slide {
          background-position: center;
          background-size: cover;
          max-width: 500px;
          width: 80%;
          aspect-ratio: 1 / 1;
          height: auto;
          margin: 0 auto;
        }
        
        .swiper-slide img {
          display: block;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border: 1px solid #fff;
        }
        
        .swiper-button-next, .swiper-button-prev {
          color: #fff !important;
        }
        
        .swiper-button-next {
          top: 0 !important;
          right: 0 !important;
          height: 100% !important;
          width: 120px !important;
          margin-top: 0 !important;
          background: linear-gradient(-90deg, rgb(10 18 25) 0%, rgb(10 18 25 / 70%) 60%, rgb(10 18 25 / 20%) 100%);
          margin-right: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          padding-right: 35px !important;
        }
        
        .swiper-button-prev {
          top: 0 !important;
          left: 0 !important;
          height: 100% !important;
          width: 120px !important;
          margin-top: 0 !important;
          background: linear-gradient(90deg, rgb(10 18 25) 0%, rgb(10 18 25 / 70%) 60%, rgb(10 18 25 / 20%) 100%);
          margin-left: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          padding-left: 35px !important;
        }
        
        .swiper-button-next:hover, .swiper-button-prev:hover {
          transform: none !important;
        }
        
        .swiper-pagination {
          position: relative;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          column-gap: 32px;
          margin-top: 20px;
        }
        
        @media (max-width: 767px) {
          .swiper-pagination {
            display: none !important;
          }
        }
        
        .swiper-pagination span {
          font-size: 18px;
          width: fit-content;
          height: auto;
          border-radius: inherit;
          background: transparent;
          color: #fff;
          opacity: 0.5;
        }

        
        .swiper-pagination-bullet-active {
          border-bottom: 2px solid #cc334f;
          opacity: 1;
          font-weight: bold;
        }
        
        .swiper-slide:hover {
          box-shadow: none !important;
        }
        
        .swiper-button-prev svg, .swiper-button-next svg {
          width: 30px;
        }
        
        .swiper-button-prev:after, .swiper-button-next:after {
          display: none;
        }
        
        @media (max-width: 767px) {
          .swiper-button-next {
            top: 0 !important;
            right: 0 !important;
            width: 80px !important;
            padding-right: 15px !important;
          }
          .swiper-button-prev {
            top: 0 !important;
            left: 0 !important;
            width: 80px !important;
            padding-left: 15px !important;
          }
          .swiper {
            padding-bottom: 20px;
          }
          .swiper-slide {
            max-width: 330px;
            width: 90%;
            aspect-ratio: 1 / 1;
          }
          .swiper-button-prev svg, .swiper-button-next svg {
            width: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .swiper-slide {
            max-width: 260px;
            width: 85%;
            aspect-ratio: 1 / 1;
          }
          .swiper-button-next {
            top: 0 !important;
            right: 0 !important;
            width: 60px !important;
            background: linear-gradient(-90deg, rgb(10 18 25 / 90%) 0%, rgb(10 18 25 / 70%) 60%, rgb(10 18 25 / 25%) 100%);
            padding-right: 15px !important;
          }
          .swiper-button-prev {
            top: 0 !important;
            left: 0 !important;
            width: 60px !important;
            background: linear-gradient(90deg, rgb(10 18 25 / 90%) 0%, rgb(10 18 25 / 70%) 60%, rgb(10 18 25 / 25%) 100%);
            padding-left: 15px !important;
          }
        }
      `}</style>
    </section>
  );
}
