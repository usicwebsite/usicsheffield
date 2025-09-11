'use client';

import Image from 'next/image';
import { staticData } from '@/lib/static-data';
import ContactModal from '@/components/ContactModal';
import { useContactModal } from '@/hooks/useContactModal';

export default function SponsorsPage() {
  const { sponsors, contact } = staticData;
  const { isModalOpen, closeModal, handleContactClick } = useContactModal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero */}
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            {sponsors.title}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {sponsors.description}
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Sponsors Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-24">
          {sponsors.sponsors.map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 max-w-sm w-full"
            >
              <div className="relative h-32 mb-4">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{sponsor.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{sponsor.description}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                sponsor.tier === 'platinum' ? 'bg-purple-500/20 text-purple-300' :
                sponsor.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {sponsors.tiers[sponsor.tier as keyof typeof sponsors.tiers]?.name}
              </span>
            </a>
          ))}
        </div>

        {/* Partnership CTA */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">BECOME A PARTNER</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join our network of partners and connect with our community. Contact us to learn about partnership opportunities.
          </p>
          <button 
            onClick={() => handleContactClick(contact.email)}
            className="inline-flex items-center px-8 py-4 bg-black/40 hover:bg-black/60 rounded-full font-bold transition-all hover:scale-105"
          >
            Contact Us <span className="ml-2">→</span>
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
} 