'use client';

import Image from 'next/image';

export default function SponsorsPage() {
  const sponsors = [
    {
      id: 0,
      name: "UNIT Sheffield",
      image: "/images/sponsors/unitlogo.png",
      url: "https://www.unitsheffield.com/",
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">OUR SPONSORS</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Each sponsor focuses on different aspects of community support and student services
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 relative">
        {/* Sponsors logos grid */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="flex justify-center">
            {sponsors.map((sponsor) => (
              <a 
                key={sponsor.id}
                href={sponsor.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-64 h-64 relative hover:scale-105 transition-transform duration-300"
              >
                <Image 
                  src={sponsor.image} 
                  alt={sponsor.name} 
                  fill
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        </div>


        
        {/* Become a partner section */}
        <div className="mt-24 max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 blur-3xl -z-10 bg-gradient-to-r from-gray-900/20 to-slate-900/20 rounded-full transform -translate-y-1/4"></div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center">BECOME A PARTNER</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join our network of partners and connect with our community. Contact us to learn about partnership opportunities.
          </p>
          <a 
            href="mailto:islam.circle@sheffield.ac.uk" 
            className="inline-flex items-center justify-center px-8 py-4 bg-black/40 hover:bg-black/60 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            Contact Us <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </div>
  );
} 