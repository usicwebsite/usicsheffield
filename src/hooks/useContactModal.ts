'use client';

import { useState, useCallback } from 'react';

export function useContactModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleContactClick = useCallback((email: string) => {
    // Try to detect if user has an email client
    const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
    
    // For Apple devices, mailto usually works well
    if (isAppleDevice) {
      window.location.href = `mailto:${email}`;
      return;
    }

    // For other platforms, try mailto first, but have a fallback
    try {
      // Create a temporary link to test if mailto works
      const testLink = document.createElement('a');
      testLink.href = `mailto:${email}`;
      testLink.style.display = 'none';
      document.body.appendChild(testLink);
      
      // Try to click the link
      testLink.click();
      document.body.removeChild(testLink);
      
      // If we get here, mailto worked
      return;
    } catch {
      // If mailto fails, show the modal
      openModal();
    }
  }, [openModal]);

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleContactClick
  };
}
