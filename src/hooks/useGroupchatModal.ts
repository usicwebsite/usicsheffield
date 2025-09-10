"use client";

import { useState, useEffect, useRef } from 'react';

interface UseGroupchatModalReturn {
  isModalOpen: boolean;
  closeModal: () => void;
  hasBeenShown: boolean;
}

const MODAL_SHOWN_KEY = 'groupchat_modal_shown';
const MODAL_COOLDOWN_DAYS = 7; // Don't show again for 7 days

export function useGroupchatModal(): UseGroupchatModalReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Check if modal has been shown recently
  const checkModalHistory = () => {
    if (typeof window === 'undefined') return false;

    try {
      const storedData = localStorage.getItem(MODAL_SHOWN_KEY);
      if (!storedData) return false;

      const { timestamp } = JSON.parse(storedData);
      const daysSinceShown = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

      return daysSinceShown < MODAL_COOLDOWN_DAYS;
    } catch (error) {
      console.warn('Error checking groupchat modal history:', error);
      return false;
    }
  };

  // Mark modal as shown
  const markModalAsShown = () => {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        timestamp: Date.now(),
        version: '1.0'
      };
      localStorage.setItem(MODAL_SHOWN_KEY, JSON.stringify(data));
      setHasBeenShown(true);
    } catch (error) {
      console.warn('Error storing groupchat modal history:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    markModalAsShown();
  };

  useEffect(() => {
    // Don't set up timer if modal has been shown recently
    if (checkModalHistory()) {
      setHasBeenShown(true);
      return;
    }

    // Set up 15-second timer
    timerRef.current = setTimeout(() => {
      // Double-check in case user navigated away and came back
      if (!checkModalHistory()) {
        setIsModalOpen(true);
      }
    }, 15000); // 15 seconds

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isModalOpen,
    closeModal,
    hasBeenShown
  };
}
