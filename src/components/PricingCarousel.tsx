"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { staticData } from '@/lib/static-data';
import CTAButton from '@/components/ui/CTAButton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function PricingCarousel() {
  const { pricing } = staticData;

  // Function to determine if a tier should be highlighted on mobile
  const shouldHighlightOnMobile = (tier: typeof pricing.tiers[0]) => {
    // Don't highlight Lifetime card on mobile screens
    if (tier.name === 'Lifetime') return false;
    return tier.highlighted;
  };

  return (
    <div className="relative w-full">
      {/* Navigation buttons */}
      <div className="swiper-button-prev-custom absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-blue-600/80 rounded-full flex items-center justify-center shadow-lg md:hover:bg-blue-600">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div className="swiper-button-next-custom absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-blue-600/80 rounded-full flex items-center justify-center shadow-lg md:hover:bg-blue-600">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className} w-3 h-3 bg-gray-400 rounded-full transition-all duration-300"></span>`;
          },
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        className="pb-12"
        style={{
          paddingLeft: '40px',
          paddingRight: '40px',
        }}
      >
        {pricing.tiers.map((tier, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <div
              className={`relative flex flex-col h-full w-full max-w-sm ${
                shouldHighlightOnMobile(tier)
                  ? 'bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-indigo-900/80 border-2 border-blue-400/70 shadow-2xl shadow-blue-500/20 scale-105'
                  : 'bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-slate-900/70 border-2 border-gray-600/40 shadow-xl shadow-gray-900/30'
              } backdrop-blur-md rounded-3xl p-8 transition-all duration-500 pricing-card ${
                shouldHighlightOnMobile(tier)
                  ? 'md:hover:scale-110 md:hover:shadow-3xl md:hover:shadow-blue-500/30 md:hover:border-blue-300/80'
                  : 'md:hover:scale-105 md:hover:shadow-2xl md:hover:shadow-gray-800/40 md:hover:border-gray-500/60 md:hover:bg-gradient-to-br md:hover:from-gray-700/80 md:hover:via-gray-800/60 md:hover:to-slate-800/80'
              }`}
            >
              {/* Recommended Badge */}
              {tier.popular && (
                <div className="absolute -top-3 sm:-top-4 md:-top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-2xl shadow-amber-500/30 border-2 border-amber-300/50">
                    RECOMMENDED
                  </div>
                </div>
              )}

              <div className="text-center mb-6 flex-shrink-0">
                <h3 className="font-heading text-2xl font-bold mb-2 text-white">
                  {tier.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4 font-medium">
                  {tier.description}
                </p>
                <div className="mb-6">
                  <div className="text-5xl font-bold mb-1 text-white">
                    {tier.price}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">
                    {tier.period}
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full ${
                      tier.name === 'Non-Member'
                        ? 'bg-red-500/20 border-2 border-red-500/50'
                        : shouldHighlightOnMobile(tier)
                        ? 'bg-amber-400/20 border-2 border-amber-400/60'
                        : 'bg-emerald-500/20 border-2 border-emerald-500/50'
                    } flex items-center justify-center mt-0.5 backdrop-blur-sm`}>
                      <div className={`w-2 h-2 rounded-full ${
                        tier.name === 'Non-Member'
                          ? 'bg-red-400'
                          : shouldHighlightOnMobile(tier)
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}></div>
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-auto flex justify-center">
                <CTAButton
                  href={
                    tier.name === '1 Year'
                      ? 'https://su.sheffield.ac.uk/shop/product/29923-'
                      : tier.name === 'Lifetime'
                      ? 'https://su.sheffield.ac.uk/shop/product/29924-'
                      : '/membership'
                  }
                  external={tier.name === '1 Year' || tier.name === 'Lifetime'}
                  className={`w-full text-center font-bold px-4 py-3 rounded-lg shadow-lg md:hover:shadow-xl transition-all duration-300 md:transform md:hover:scale-105 text-sm pricing-button ${
                    tier.name === 'Non-Member'
                      ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 md:hover:from-red-600 md:hover:via-red-700 md:hover:to-red-800 text-white shadow-red-500/30 md:hover:shadow-red-500/50'
                      : shouldHighlightOnMobile(tier)
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 md:hover:from-amber-500 md:hover:via-amber-600 md:hover:to-amber-700 text-slate-900 shadow-amber-400/30 md:hover:shadow-amber-400/50'
                      : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 md:hover:from-emerald-600 md:hover:via-emerald-700 md:hover:to-emerald-800 text-white shadow-emerald-500/30 md:hover:shadow-emerald-500/50'
                  }`}
                >
                  {tier.ctaText}
                </CTAButton>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <div className="swiper-pagination-custom flex justify-center mt-4 space-x-2"></div>

      <style jsx global>{`
        .swiper-button-prev-custom::after,
        .swiper-button-next-custom::after {
          display: none;
        }

        .swiper-pagination-custom {
          position: relative;
          margin-top: 1rem;
        }

        .swiper-pagination-bullet-active {
          background-color: #3b82f6 !important;
          transform: scale(1.2);
        }

        /* Ensure swiper slides have enough space for the badge */
        .swiper-slide {
          padding-top: 1.5rem; /* Space for the badge on mobile */
        }

        @media (min-width: 640px) {
          .swiper-slide {
            padding-top: 2rem; /* More space on small screens */
          }
        }

        @media (min-width: 768px) {
          .swiper-slide {
            padding-top: 2.5rem; /* Full space on medium screens and up */
          }
        }

        /* Disable hover effects on mobile screens */
        @media (max-width: 767px) {
          .swiper-button-prev-custom:hover,
          .swiper-button-next-custom:hover {
            background-color: rgba(37, 99, 235, 0.8) !important;
          }

          .pricing-card:hover {
            transform: none !important;
            box-shadow: none !important;
            border-color: inherit !important;
            background: inherit !important;
          }

          .pricing-button:hover {
            transform: none !important;
            box-shadow: none !important;
            background: inherit !important;
          }
        }

        @media (max-width: 480px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            width: 40px;
            height: 40px;
          }

          .swiper-button-prev-custom svg,
          .swiper-button-next-custom svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
}
