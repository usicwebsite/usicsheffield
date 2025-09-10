"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { logoutAdmin } from '@/lib/client-auth';

interface UseAdminTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onBeforeLogout?: () => void;
  onTimeoutWarning?: (remainingSeconds: number) => void;
}

interface UseAdminTimeoutReturn {
  isActive: boolean;
  timeRemaining: number;
  resetTimer: () => void;
  logout: () => Promise<void>;
  showWarning: boolean;
  remainingSeconds: number;
}

export function useAdminTimeout({
  timeoutMinutes = 15,
  warningMinutes = 2,
  onBeforeLogout,
  onTimeoutWarning
}: UseAdminTimeoutOptions = {}): UseAdminTimeoutReturn {
  const router = useRouter();
  const auth = getAuth();

  const [isActive, setIsActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60 * 1000);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const warningTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());

  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = warningMinutes * 60 * 1000;

  // Handle logout
  const logout = useCallback(async () => {
    try {
      if (onBeforeLogout) {
        onBeforeLogout();
      }

      // Clear all timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Sign out from Firebase
      await signOut(auth);

      // Call server logout
      await logoutAdmin();

      // Redirect to admin login
      router.push('/admin-login');
    } catch (error) {
      console.error('Error during admin logout:', error);
      // Force redirect even if logout fails
      router.push('/admin-login');
    }
  }, [auth, router, onBeforeLogout]);

  // Reset activity timer
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsActive(true);
    setShowWarning(false);
    setTimeRemaining(timeoutMs);

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setRemainingSeconds(warningMinutes * 60);

      // Start countdown interval
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (onTimeoutWarning) {
        onTimeoutWarning(warningMinutes * 60);
      }
    }, timeoutMs - warningMs);

    // Set final logout timeout
    timeoutRef.current = setTimeout(async () => {
      await logout();
    }, timeoutMs);
  }, [timeoutMs, warningMs, warningMinutes, onTimeoutWarning, logout]);

  // Activity event handler
  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Only reset if it's been more than 1 second since last activity
    // This prevents excessive resets from rapid events
    if (timeSinceLastActivity > 1000) {
      resetTimer();
    }
  }, [resetTimer]);

  // Set up activity listeners
  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'touchmove',
      'click'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, don't reset timer but track time
        setIsActive(false);
      } else {
        // Tab is visible again, reset timer
        resetTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Note: Removed beforeunload handler to prevent logout on page refresh
    // Only logout on inactivity timeout for better user experience

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [handleActivity, resetTimer, logout]);

  // Update time remaining every second when active
  useEffect(() => {
    if (!isActive) return;

    const updateInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, timeoutMs - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(updateInterval);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [isActive, timeoutMs]);

  return {
    isActive,
    timeRemaining,
    resetTimer,
    logout,
    showWarning,
    remainingSeconds
  };
}
