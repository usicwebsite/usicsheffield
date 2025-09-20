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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricing.partnerDiscounts.map((discount, index) => {
              const [businessName, discountText] = discount.split(' (');
              const cleanDiscountText = discountText?.replace(')', '') || '';
              
              // Define background colors and patterns for different business types
              const getBusinessStyle = (name: string) => {
                const lowerName = name.toLowerCase();
                if (lowerName.includes('grill') || lowerName.includes('kebab') || lowerName.includes('halal')) {
                  return {
                    bg: 'bg-gradient-to-br from-orange-100 to-red-200',
                    icon: '🍖',
                    logoBg: 'from-orange-500 to-red-600'
                  };
                } else if (lowerName.includes('chai') || lowerName.includes('coffee') || lowerName.includes('tea')) {
                  return {
                    bg: 'bg-gradient-to-br from-amber-100 to-yellow-200',
                    icon: '☕',
                    logoBg: 'from-amber-500 to-yellow-600'
                  };
                } else if (lowerName.includes('dessert') || lowerName.includes('cookie') || lowerName.includes('sweet')) {
                  return {
                    bg: 'bg-gradient-to-br from-pink-100 to-purple-200',
                    icon: '🍰',
                    logoBg: 'from-pink-500 to-purple-600'
                  };
                } else if (lowerName.includes('therapy') || lowerName.includes('health')) {
                  return {
                    bg: 'bg-gradient-to-br from-green-100 to-emerald-200',
                    icon: '🌿',
                    logoBg: 'from-green-500 to-emerald-600'
                  };
                } else {
                  return {
                    bg: 'bg-gradient-to-br from-blue-100 to-indigo-200',
                    icon: '🏪',
                    logoBg: 'from-blue-500 to-indigo-600'
                  };
                }
              };
              
              const businessStyle = getBusinessStyle(businessName);
              
              // Map business names to their logo files
              const getBusinessLogo = (name: string) => {
                const logoMap: { [key: string]: string } = {
                  "Sabir's Grill": '/images/sponsors/logos/sabir\'s grill.png',
                  "5 Akhis": '/images/sponsors/logos/5 akhis.jpeg',
                  "Karak Chai": '/images/sponsors/logos/karak chaii.jpeg',
                  "Big Daddy's": '/images/sponsors/logos/big daddys.jpg',
                  "Mighty Bites": '/images/sponsors/logos/mighty bites.jpg',
                  "Insomnia Cookies": '/images/sponsors/logos/insomnia cookies.png',
                  "Ohannes": '/images/sponsors/logos/ohannes.jpg',
                  "Al Maghrib Faith Essentials": '/images/sponsors/logos/al maghrib.png',
                  "Shakebees": '/images/sponsors/logos/shakebees.png',
                  "Heavenly Desserts": '/images/sponsors/logos/heavenly.jpeg',
                  "M.A.K Halal": '/images/sponsors/logos/makhalal.png',
                  "Kebabish Original": '/images/sponsors/logos/kebabish original.png',
                  "Calis": '/images/sponsors/logos/calis.png',
                  "Cha Cha Chai": '/images/sponsors/logos/cha cha chai.png',
                  "Damascus Bakery": '/images/sponsors/logos/damascus bakery.png',
                  "Noori Charms": '/images/sponsors/logos/noori charms.png',
                  "Frog": '/images/sponsors/logos/frog.png',
                  "Regen Therapy": '/images/sponsors/logos/regen therapy.png',
                  "Iqra Store": '/images/sponsors/iqrastore.jpg'
                };
                return logoMap[name] || null;
              };

              // Map business names to their photo files
              const getBusinessPhoto = (name: string) => {
                const photoMap: { [key: string]: string } = {
                  "Sabir's Grill": '/images/sponsors/pics/sabirs grill.jpeg',
                  "5 Akhis": '/images/sponsors/pics/5 akhis.jpeg',
                  "Karak Chai": '/images/sponsors/pics/karak chaii.jpeg',
                  "Big Daddy's": '/images/sponsors/pics/big daddys.jpeg',
                  "Mighty Bites": '/images/sponsors/pics/mighty bites.jpeg',
                  "Insomnia Cookies": '/images/sponsors/pics/insomnia cookies.webp',
                  "Ohannes": '/images/sponsors/pics/ohannes.jpg',
                  "Al Maghrib Faith Essentials": '/images/sponsors/pics/al maghrib.jpg',
                  "Shakebees": '/images/sponsors/pics/shakebees.jpeg',
                  "Heavenly Desserts": '/images/sponsors/pics/heavenly desserts.jpg',
                  "M.A.K Halal": '/images/sponsors/pics/mak halal.jpeg',
                  "Kebabish Original": '/images/sponsors/pics/kebabish original.jpeg',
                  "Calis": '/images/sponsors/pics/calis.jpg',
                  "Cha Cha Chai": '/images/sponsors/pics/cha cha chai.jpeg',
                  "Damascus Bakery": '/images/sponsors/pics/damascus bakery.webp',
                  "Frog": '/images/sponsors/pics/frog.jpeg',
                  "Iqra Store": '/images/sponsors/iqrastore.jpg'
                };
                return photoMap[name] || null;
              };
              
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-slate-900/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-600/40 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 relative group"
                >

                  {/* Business Image */}
                  <div className="relative h-48 overflow-hidden">
                    {getBusinessPhoto(businessName) ? (
                      <img 
                        src={getBusinessPhoto(businessName)!} 
                        alt={`${businessName} photo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${businessStyle.bg} flex items-center justify-center`}>
                        <div className="text-6xl opacity-60">
                          {businessStyle.icon}
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full"></div>
                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Overlay gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    
                    {/* Brand Logo */}
                    <div className="absolute bottom-3 left-3">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-2 border-white/70 overflow-hidden">
                        {getBusinessLogo(businessName) ? (
                          <img 
                            src={getBusinessLogo(businessName)!} 
                            alt={`${businessName} logo`}
                            className="w-8 h-8 object-contain rounded-full"
                          />
                        ) : (
                          <div className={`w-8 h-8 bg-gradient-to-br ${businessStyle.logoBg} rounded-full flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">
                              {businessName.split(' ').map(word => word.charAt(0)).join('').slice(0, 2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400 mb-1">
                        {cleanDiscountText}
                      </div>
                      <div className="text-sm text-gray-300 leading-tight">
                        {businessName}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
    </div>
  );
}