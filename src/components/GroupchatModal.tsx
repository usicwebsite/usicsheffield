"use client";

import React from 'react';

interface GroupchatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupchatModal({ isOpen, onClose }: GroupchatModalProps) {
  if (!isOpen) return null;

  const handleJoinGroupchat = () => {
    window.open('https://docs.google.com/forms/d/1UCennY5I_yQcKuDgKNBXOeggHDBl1IyFLkIg_dzl04g/edit', '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Join Our Community
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
          Join our WhatsApp groupchats for 2025/26 students, one for brothers and one for sisters. Feel free to ask any questions regarding your course 📚, accommodation 🏡, Sheffield 🏙, the University, and all things USIC ☪️ !
          </p>

          <div className="space-y-3">
            <button
              onClick={handleJoinGroupchat}
              className="w-full bg-[#18384D] hover:bg-[#0A1219] text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200"
            >
              Join WhatsApp Community
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors duration-200"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
