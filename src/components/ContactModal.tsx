'use client';

import { staticData } from '@/lib/static-data';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { contact } = staticData;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#0A1219] to-[#18384D] rounded-2xl p-8 max-w-md w-full border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Contact USIC</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Email */}
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              📧 Email
            </h3>
            <div className="space-y-2">
              <a
                href={`mailto:${contact.email}`}
                className="block text-blue-300 hover:text-blue-200 transition-colors break-all"
              >
                {contact.email}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contact.email).then(() => {
                    alert('Email copied to clipboard!');
                  }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = contact.email;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('Email copied to clipboard!');
                  });
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                📋 Copy email address
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              🌐 Social Media
            </h3>
            <div className="space-y-3">
              <a
                href={contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-pink-300 hover:text-pink-200 transition-colors"
              >
                <span className="mr-3">📷</span>
                Instagram
              </a>
              <a
                href={contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
              >
                <span className="mr-3">📘</span>
                Facebook
              </a>
              <a
                href={contact.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-300 hover:text-green-200 transition-colors"
              >
                <span className="mr-3">💬</span>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              📍 Location
            </h3>
            <div className="text-gray-300 text-sm space-y-1">
              <p>{contact.location.address}</p>
              <p>{contact.location.room}</p>
              <p>{contact.location.campus}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-gray-400 text-sm text-center">
            We&apos;d love to hear from you! 💙
          </p>
        </div>
      </div>
    </div>
  );
}
