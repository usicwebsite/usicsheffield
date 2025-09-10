"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function ResourcesPage() {
  const [showContactsModal, setShowContactsModal] = useState(false);
  // Resource cards data
  const resourceCards = [
    {
      id: 1,
      title: "USIC Map",
      description: "Interactive map showing key locations for USIC members including prayer rooms, halal food spots, and important campus buildings.",
      imagePath: "/images/WEB/usicmap.png",
      category: "NAVIGATION",
      link: "https://www.google.com/maps/d/u/0/viewer?mid=1sf6ignGjx9yqlVM-XgAoRiVtWUjk2KE&hl=en&ll=53.381545854028566%2C-1.4872821811864867&z=16",
      isExternal: true,
      linkText: "OPEN MAP"
    },
    {
      id: 2,
      title: "Committee Members",
      description: "Meet the current USIC committee members and learn more about their roles.",
      imagePath: "/images/WEB/committee.jpeg",
      category: "COMMUNITY",
      link: "https://www.instagram.com/p/DORUV3lCDAg/?igsh=cWM0MGExNWkzcnZt",
      isExternal: true,
      linkText: "VIEW MEMBERS"
    },
    {
      id: 3,
      title: "University Contacts",
      description: "Important contact information for university services including chaplaincy, student union, and mental health support.",
      imagePath: "/images/WEB/usic-logo.png",
      category: "SUPPORT",
      isModal: true,
      linkText: "VIEW CONTACTS"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] text-white">
      {/* Hero section */}
      <div className="pt-16 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white px-4">RESOURCES</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Materials to aid your spiritual and academic journey
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="py-8 flex justify-center">
        <div className="w-16 h-1 bg-white/70"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {resourceCards.map((resource) => (
            <div key={resource.id} className="relative group overflow-hidden rounded-lg shadow-lg bg-[#0F1E2C] transition-all duration-300 hover:shadow-xl">
              {/* Resource image */}
              <div className="relative h-[300px] overflow-hidden">
                <Image 
                  src={resource.imagePath}
                  alt={resource.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Category tag */}
                <div className="absolute top-4 left-4 bg-white text-[#18384D] px-3 py-1 text-sm font-bold rounded">
                  {resource.category}
                </div>
              </div>
              
              {/* Resource content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">{resource.title}</h2>
                <p className="text-blue-100 mb-4">{resource.description}</p>
                {resource.isModal ? (
                  <button
                    onClick={() => setShowContactsModal(true)}
                    className="inline-block text-white border-b-2 border-white pb-1 transition-all duration-300 hover:text-blue-200 hover:border-blue-200"
                  >
                    {resource.linkText}
                  </button>
                ) : (
                  <a
                    href={resource.link}
                    target={resource.isExternal ? "_blank" : undefined}
                    rel={resource.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-block text-white border-b-2 border-white pb-1 transition-all duration-300 hover:text-blue-200 hover:border-blue-200"
                  >
                    {resource.linkText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* University Contacts Modal */}
      {showContactsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#18384D] text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="font-subheading text-2xl font-bold text-[#18384D]">
                    University Contacts
                  </h3>
                </div>
                <button
                  onClick={() => setShowContactsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                >
                  ×
                </button>
              </div>

              {/* Modal content */}
              <div className="space-y-6">
                {/* Contact Chaplaincy */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-xl font-bold text-[#18384D] mb-3">Contact Chaplaincy</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Location:</span>
                      <span>205 Brook Hill, S3 7HG</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Email:</span>
                      <a href="mailto:bnbr-life@sheffield.ac.uk" className="text-blue-600 hover:text-blue-800 underline">
                        bnbr-life@sheffield.ac.uk
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Sheffield SU */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-xl font-bold text-[#18384D] mb-3">Contact Sheffield SU</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Website:</span>
                      <a href="https://su.sheffield.ac.uk/welcome" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                        https://su.sheffield.ac.uk/welcome
                      </a>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Phone:</span>
                      <a href="tel:01142228500" className="text-blue-600 hover:text-blue-800 underline">
                        0114 222 8500
                      </a>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Email:</span>
                      <a href="mailto:studentsunion@sheffield.ac.uk" className="text-blue-600 hover:text-blue-800 underline">
                        studentsunion@sheffield.ac.uk
                      </a>
                    </div>
                  </div>
                </div>

                {/* Mental Health Support */}
                <div>
                  <h4 className="text-xl font-bold text-[#18384D] mb-3">Mental Health Support</h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Website:</span>
                      <a href="https://students.sheffield.ac.uk/mental-health" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                        https://students.sheffield.ac.uk/mental-health
                      </a>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Email:</span>
                      <a href="mailto:mentalhealthcounselling@sheffield.ac.uk" className="text-blue-600 hover:text-blue-800 underline">
                        mentalhealthcounselling@sheffield.ac.uk
                      </a>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium mr-2">Phone:</span>
                      <a href="tel:+441142224134" className="text-blue-600 hover:text-blue-800 underline">
                        +44 114 222 4134
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowContactsModal(false)}
                  className="bg-[#18384D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#234b64] transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 