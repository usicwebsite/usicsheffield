'use client';

import { staticData } from '@/lib/static-data';

interface UniversityContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UniversityContactsModal({ isOpen, onClose }: UniversityContactsModalProps) {
  const { universityContacts } = staticData.resources;

  if (!isOpen) return null;

  const renderContactDetail = (detail: { label: string; value: string; type?: string }) => {
    const { value, type } = detail;
    
    if (type === 'email') {
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800 underline">
          {value}
        </a>
      );
    }
    
    if (type === 'phone') {
      return (
        <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-800 underline">
          {value}
        </a>
      );
    }
    
    if (type === 'url') {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
          {value}
        </a>
      );
    }
    
    return <span>{value}</span>;
  };

  return (
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
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>

          {/* Modal content */}
          <div className="space-y-6">
            {universityContacts.map((contact, index) => (
              <div key={index} className={index < universityContacts.length - 1 ? "border-b border-gray-200 pb-4" : ""}>
                <h4 className="text-xl font-bold text-[#18384D] mb-3">{contact.title}</h4>
                <div className="space-y-2 text-gray-700">
                  {contact.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start">
                      <span className="font-medium mr-2">{detail.label}:</span>
                      {renderContactDetail(detail)}
                    </div>
                  ))}
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
