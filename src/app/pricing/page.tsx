"use client";

import { staticData } from '@/lib/static-data';
import CTAButton from '@/components/ui/CTAButton';
import PricingCarousel from '@/components/PricingCarousel';

export default function PricingPage() {
  const { pricing } = staticData;

  return (
    <div className="flex flex-col bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero Section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">
            {pricing.title}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            {pricing.subtitle}
          </p>
        </div>
      </div>

      {/* Pricing Tiers Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Mobile Carousel */}
          <div className="block md:hidden">
            <PricingCarousel />
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricing.tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative flex flex-col h-full ${
                  tier.highlighted
                    ? 'bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-indigo-900/80 border-2 border-blue-400/70 shadow-2xl shadow-blue-500/20 scale-105'
                    : 'bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-slate-900/70 border-2 border-gray-600/40 shadow-xl shadow-gray-900/30'
                } backdrop-blur-md rounded-3xl p-10 transition-all duration-500 pricing-card-desktop ${
                  tier.highlighted
                    ? 'md:scale-105 md:hover:scale-110 md:hover:shadow-3xl md:hover:shadow-blue-500/30 md:hover:border-blue-300/80'
                    : 'md:hover:scale-105 md:hover:shadow-2xl md:hover:shadow-gray-800/40 md:hover:border-gray-500/60 md:hover:bg-gradient-to-br md:hover:from-gray-700/80 md:hover:via-gray-800/60 md:hover:to-slate-800/80'
                }`}
              >
                {/* Recommended Badge */}
                {tier.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-900 px-6 py-3 rounded-full text-sm font-bold shadow-2xl shadow-amber-500/30 border-2 border-amber-300/50">
                      RECOMMENDED
                    </div>
                  </div>
                )}

                <div className="text-center mb-8 flex-shrink-0">
                  <h3 className="font-heading text-3xl font-bold mb-3 text-white">
                    {tier.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 font-medium">
                    {tier.description}
                  </p>
                  <div className="mb-8">
                    <div className="text-6xl font-bold mb-2 text-white">
                      {tier.price}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {tier.period}
                    </div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${
                        tier.name === 'Non-Member'
                          ? 'bg-red-500/20 border-2 border-red-500/50'
                          : tier.highlighted
                          ? 'bg-amber-400/20 border-2 border-amber-400/60'
                          : 'bg-emerald-500/20 border-2 border-emerald-500/50'
                      } flex items-center justify-center mt-0.5 backdrop-blur-sm`}>
                        <div className={`w-3 h-3 rounded-full ${
                          tier.name === 'Non-Member'
                            ? 'bg-red-400'
                            : tier.highlighted
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
                    className={`w-full text-center font-bold px-6 py-4 rounded-lg shadow-lg md:hover:shadow-xl transition-all duration-300 md:transform md:hover:scale-105 pricing-button-desktop ${
                      tier.name === 'Non-Member'
                        ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 md:hover:from-red-600 md:hover:via-red-700 md:hover:to-red-800 text-white shadow-red-500/30 md:hover:shadow-red-500/50'
                        : tier.highlighted
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 md:hover:from-amber-500 md:hover:via-amber-600 md:hover:to-amber-700 text-slate-900 shadow-amber-400/30 md:hover:shadow-amber-400/50'
                        : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 md:hover:from-emerald-600 md:hover:via-emerald-700 md:hover:to-emerald-800 text-white shadow-emerald-500/30 md:hover:shadow-emerald-500/50'
                    }`}
                  >
                    {tier.ctaText}
                  </CTAButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Discounts Section */}

      <style jsx global>{`
        /* Disable hover effects on mobile screens */
        @media (max-width: 767px) {
          .pricing-card-desktop:hover {
            transform: none !important;
            box-shadow: none !important;
            border-color: inherit !important;
            background: inherit !important;
          }

          .pricing-button-desktop:hover {
            transform: none !important;
            box-shadow: none !important;
            background: inherit !important;
          }
        }
      `}</style>
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
              Member-Only Partner Discounts
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
              Exclusive savings at our partner businesses (available to 1 Year & Lifetime members only)
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {pricing.partnerDiscounts.map((discount, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400 mb-1">
                    {discount.split(' (')[1]?.replace(')', '') || ''}
                  </div>
                  <div className="text-xs text-gray-300 leading-tight">
                    {discount.split(' (')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}