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
                    {tier.price === "Free" && (
                      <div className="invisible text-xs text-gray-500 mt-1">
                        Hidden text for Free tier
                      </div>
                    )}
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
                "Sabir's Grill": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524588/sabir_s_grill_kkq0lm.png',
                "5 Akhis": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524587/5_akhis_tcuf21.jpg',
                "Karak Chai": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524585/karak_chaii_ezh817.jpg',
                "Big Daddy's": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524586/big_daddys_dmx0w8.jpg',
                "Mighty Bites": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524584/mighty_bites_bnri5a.jpg',
                "Insomnia Cookies": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524590/insomnia_cookies_hpszcz.png',
                "Ohannes": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524583/ohannes_v0kpk4.jpg',
                "Al Maghrib Faith Essentials": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524592/al_maghrib_fru8wz.png',
                "Shakebees": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524581/shakebees_bxjmq8.png',
                "Heavenly Desserts": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524585/heavenly_zoz7gu.jpg',
                "M.A.K Halal": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524589/makhalal_ppteqz.png',
                "Kebabish Original": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524582/kebabish_original_i9veds.png',
                "Calis": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524591/calis_pe34jj.png',
                "Cha Cha Chai": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524580/cha_cha_chai_tzm2g1.png',
                "Damascus Bakery": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524590/damascus_bakery_jtk4zl.png',
                "Noori Charms": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524579/noori_charms_ockjdr.jpg',
                "Frog": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524582/frog_hrclz7.png',
                "Regen Therapy": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524579/regen_therapy_o7z22q.jpg',
                "Unit": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524579/unit_tca78t.jpg'
              };
                return logoMap[name] || null;
              };

              // Map business names to their photo files
              const getBusinessPhoto = (name: string) => {
              const photoMap: { [key: string]: string } = {
                "Sabir's Grill": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524606/sabirs_grill_vlt4vx.jpg',
                "5 Akhis": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524618/5_akhis_bx8pol.jpg',
                "Karak Chai": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524611/karak_chaii_l4j8gf.jpg',
                "Big Daddy's": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524615/big_daddys_p9rtm8.jpg',
                "Mighty Bites": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524608/mighty_bites_szyljl.jpg',
                "Insomnia Cookies": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524619/insomnia_cookies_cpmkph.webp',
                "Ohannes": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524607/ohannes_uvvjkg.jpg',
                "Al Maghrib Faith Essentials": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524616/al_maghrib_lwfkcy.jpg',
                "Shakebees": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524605/shakebees_qrlqwt.jpg',
                "Heavenly Desserts": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524612/heavenly_desserts_hxgwcs.jpg',
                "M.A.K Halal": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524609/mak_halal_trmsvd.jpg',
                "Kebabish Original": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524610/kebabish_original_hwolla.jpg',
                "Calis": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524614/calis_so87d1.jpg',
                "Cha Cha Chai": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524613/cha_cha_chai_bzpehu.jpg',
                "Damascus Bakery": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524619/damascus_bakery_ejdf4x.webp',
                "Noori Charms": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524604/noori_charms_c9uv67.webp',
                "Frog": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524603/frog_cnblou.jpg',
                "Regen Therapy": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524605/regen_therapy_xfk2bh.jpg',
                "Unit": 'https://res.cloudinary.com/derjeh0m2/image/upload/v1758524618/unit_oymloz.webp'
              };
                return photoMap[name] || null;
              };

              // Map business names to their website URLs
              const getBusinessUrl = (name: string) => {
                const urlMap: { [key: string]: string } = {
                  "Sabir's Grill": 'https://www.sabirs.co.uk/',
                  "5 Akhis": 'https://www.fiveakhis.com/stores/7/five-akhis-sheffield?utm_source=google&utm_medium=local&utm_campaign=gbplisting',
                  "Karak Chai": 'https://karakchaii.co.uk/?utm_source=google&utm_medium=local&utm_campaign=gbplisting',
                  "Big Daddy's": 'https://wicker.bigdaddysfastfood.co.uk/',
                  "Mighty Bites": 'https://www.mightybites.co.uk/',
                  "Insomnia Cookies": 'https://insomniacookies.com/uk',
                  "Ohannes": 'https://insomniacookies.com/uk',
                  "Al Maghrib Faith Essentials": 'https://www.almaghrib.org/',
                  "Shakebees": 'https://www.shakebee.uk/',
                  "Heavenly Desserts": 'https://www.heavenlydesserts.co.uk/stores/sheffield',
                  "M.A.K Halal": 'https://www.makhalal.co.uk/',
                  "Kebabish Original": 'https://kosheffield.co.uk/',
                  "Calis": 'https://www.calis.uk/',
                  "Cha Cha Chai": 'https://www.lovemychai.co.uk/',
                  "Damascus Bakery": 'https://damascusbakery.co.uk/',
                  "Noori Charms": 'https://www.instagram.com/nooricharms?igsh=cmF2bXE2azJnZzQ5',
                  "Frog": 'https://www.instagram.com/frog_sheffield/?hl=en',
                  "Regen Therapy": 'https://www.instagram.com/re.gentherapy?igsh=MXkxNmh1M2YxNWVzeQ==',
                  "Unit": 'https://www.unitsheffield.com/'
                };
                return urlMap[name] || null;
              };
              
              const businessUrl = getBusinessUrl(businessName);
              
              return (
                <a
                  key={index}
                  href={businessUrl || '#'}
                  target={businessUrl ? '_blank' : undefined}
                  rel={businessUrl ? 'noopener noreferrer' : undefined}
                  className={`block bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-slate-900/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-600/40 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 relative group ${businessUrl ? 'cursor-pointer' : 'cursor-default'}`}
                >

                  {/* Business Image */}
                  <div className="relative h-48 overflow-hidden">
                    {getBusinessPhoto(businessName) ? (
                      <img 
                        src={getBusinessPhoto(businessName)!} 
                        alt={`${businessName} photo`}
                        className={`w-full h-full object-cover ${
                          businessName === 'Frog' ? 'object-[center_80%]' : ''
                        }`}
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
                      <div className="w-12 h-12 rounded-full shadow-lg overflow-hidden">
                        {getBusinessLogo(businessName) ? (
                          <img 
                            src={getBusinessLogo(businessName)!} 
                            alt={`${businessName} logo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${businessStyle.logoBg} rounded-full flex items-center justify-center`}>
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
                </a>
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