/**
 * Custom hook to validate and sync user display names with Google account names
 * This hook should be used in profile-related pages to ensure user names are always in sync
 */

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

interface NameValidationResult {
  isValidating: boolean;
  wasSynced: boolean;
  error: string | null;
}

export function useNameValidation(): NameValidationResult {
  const [isValidating, setIsValidating] = useState(false);
  const [wasSynced, setWasSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.warn('[Name Validation] Firebase auth not initialized');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User not logged in, reset state
        setIsValidating(false);
        setWasSynced(false);
        setError(null);
        return;
      }

      try {
        setIsValidating(true);
        setError(null);

        // Get Firebase ID token for API authentication
        const idToken = await user.getIdToken();

        // Call the sync API endpoint
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            userId: user.uid,
            action: 'sync_display_name',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to validate user name');
        }

        const data = await response.json();
        if (data.success) {
          setWasSynced(data.data.synced);
          if (data.data.synced) {
            console.log(`[Name Validation] Synced display name for user ${user.uid}: "${data.data.oldName}" → "${data.data.newName}"`);
          }
        } else {
          throw new Error(data.error || 'Failed to validate user name');
        }
      } catch (err) {
        console.error('[Name Validation] Error validating user name:', err);
        setError(err instanceof Error ? err.message : 'Failed to validate user name');
      } finally {
        setIsValidating(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    isValidating,
    wasSynced,
    error
  };
}
