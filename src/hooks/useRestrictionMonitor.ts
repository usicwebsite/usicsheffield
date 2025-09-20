'use client';

import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { checkUserRestriction } from '@/lib/client-auth';

export function useRestrictionMonitor() {
  useEffect(() => {
    const auth = getAuth();

    // Check restriction status when user signs in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Check immediately when user signs in
          const restrictionStatus = await checkUserRestriction();

          if (restrictionStatus.restricted) {
            console.log('User is restricted, redirecting to restricted page');
            // Clear user session
            await auth.signOut();
            // Clear any cached data
            localStorage.clear();
            sessionStorage.clear();
            // Redirect to restricted page
            window.location.href = '/restricted';
            return;
          }

          // Set up periodic checks every 30 seconds for users who are not initially restricted
          const interval = setInterval(async () => {
            try {
              const status = await checkUserRestriction();
              if (status.restricted) {
                console.log('User became restricted, redirecting to restricted page');
                clearInterval(interval);
                await auth.signOut();
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/restricted';
              }
            } catch (error) {
              console.error('Error checking restriction status:', error);
            }
          }, 30000); // 30 seconds

          // Cleanup interval when user signs out
          return () => clearInterval(interval);
        } catch (error) {
          console.error('Error in restriction check:', error);
        }
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);
}
