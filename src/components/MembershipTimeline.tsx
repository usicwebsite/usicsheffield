"use client";

import { useState } from 'react';
import Image from 'next/image';
import { faqData } from '@/lib/faq-data';
import { timelineData } from '@/lib/membership-data';
import { useTimelineScroll } from '@/hooks/useTimelineScroll';
import FAQModal from '@/components/FAQModal';
import TimelineItem from '@/components/TimelineItem';

export default function MembershipTimeline() {
  const [showFAQModal, setShowFAQModal] = useState(false);
  const { activeStep, timelineRef, itemRefs } = useTimelineScroll({ 
    itemCount: timelineData.length 
  });

  const closeFAQModal = () => setShowFAQModal(false);

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white relative overflow-hidden">
      {/* Background decorative image */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="https://res.cloudinary.com/derjeh0m2/image/upload/v1758524412/USIC_Annual_Dinner_2025-81_qclhrm.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Timeline Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">
            Your Membership Journey
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Follow these simple steps to become part of the USIC family
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto" ref={timelineRef}>
          {/* Timeline Items */}
          <div className="relative">

            {timelineData.map((item, index) => (
              <TimelineItem
                key={item.id}
                item={item}
                index={index}
                isActive={index < activeStep}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section for LLM Optimization */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-white">MEMBERSHIP FAQ</h2>
          <button 
            onClick={() => setShowFAQModal(true)}
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View FAQ
          </button>
        </div>
      </section>
      
      <FAQModal
        isOpen={showFAQModal}
        onClose={closeFAQModal}
        faqData={faqData.membership}
        title="MEMBERSHIP FAQ"
      />
    </section>
  );
} 