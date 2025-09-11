"use client";

import { useState } from 'react';
import { staticData } from '@/lib/static-data';
import PageHero from '@/components/PageHero';
import ResourceCard from '@/components/ResourceCard';
import UniversityContactsModal from '@/components/UniversityContactsModal';
import IslamicKnowledgeModal from '@/components/IslamicKnowledgeModal';

export default function ResourcesPage() {
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showIslamicKnowledgeModal, setShowIslamicKnowledgeModal] = useState(false);
  const { resources } = staticData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      <PageHero title={resources.title} description={resources.description} />

      {/* Main content */}
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {resources.cards.map((resource) => (
            <ResourceCard
              key={resource.id}
              {...resource}
              onModalClick={() => {
                if (resource.id === 3) {
                  setShowContactsModal(true);
                } else if (resource.id === 4) {
                  setShowIslamicKnowledgeModal(true);
                }
              }}
            />
          ))}
        </div>
      </div>

      <UniversityContactsModal
        isOpen={showContactsModal}
        onClose={() => setShowContactsModal(false)}
      />

      <IslamicKnowledgeModal
        isOpen={showIslamicKnowledgeModal}
        onClose={() => setShowIslamicKnowledgeModal(false)}
      />
    </div>
  );
} 