/**
 * Client-side authentication utilities
 * These functions can run on the client side without accessing server-side environment variables
 */

import { getAuth } from 'firebase/auth';
import { z } from 'zod';

/**
 * Check if current user is restricted
 */
export async function checkUserRestriction(): Promise<{ restricted: boolean; reason?: string }> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return { restricted: false };
    }

    // Force token refresh to get latest custom claims
    await user.getIdToken(true);
    const idTokenResult = await user.getIdTokenResult();
    const customClaims = idTokenResult.claims;

    if (customClaims.restricted === true) {
      return {
        restricted: true,
        reason: z.string().catch('Your account has been restricted by an administrator.').parse(customClaims.restrictionReason)
      };
    }

    return { restricted: false };
  } catch (error) {
    console.error('Failed to check user restriction:', error);

    return { restricted: false };
  }
}

/**
 * Force logout if user is restricted
 */
export async function forceLogoutIfRestricted(): Promise<boolean> {
  try {
    const restrictionStatus = await checkUserRestriction();

    if (restrictionStatus.restricted) {
      console.log('User is restricted, redirecting to restricted page');
      await logoutUser();

      // Redirect to restricted page
      if (typeof window !== 'undefined') {
        window.location.href = '/restricted';
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to check restriction status:', error);

    return false;
  }
}

/**
 * Logout regular user (not admin)
 */
export async function logoutUser(): Promise<void> {
  try {
    const auth = getAuth();
    await auth.signOut();
    // Clear any cached data
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.error('Failed to logout user:', error);
  }
}
