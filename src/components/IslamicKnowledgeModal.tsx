'use client';

import { staticData } from '@/lib/static-data';

interface IslamicKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IslamicKnowledgeModal({ isOpen, onClose }: IslamicKnowledgeModalProps) {
  const { islamicKnowledgeResources } = staticData.resources;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#18384D] text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-subheading text-2xl font-bold text-[#18384D]">
                Islamic Knowledge Resources
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>

          {/* Modal content */}
          <div className="space-y-6">
            <p className="text-gray-600 text-sm mb-6">
              Access trusted Islamic educational platforms and resources to deepen your understanding of Islam.
            </p>
            
            {islamicKnowledgeResources.map((resource, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#18384D] mb-2">{resource.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Visit Website
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Close button */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-[#18384D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#234b64] transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
