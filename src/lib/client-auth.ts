/**
 * Client-side authentication utilities
 * These functions can run on the client side without accessing server-side environment variables
 */

/**
 * Handle session expiration by attempting to refresh the token
 * Returns true if token was successfully refreshed, false otherwise
 */
export async function handleSessionExpiration(): Promise<boolean> {
  try {
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });

    if (!refreshResponse.ok) {
      if (refreshResponse.status === 429) {
        console.warn('Rate limited on session refresh');
        return false;
      }
      return false;
    }

    const data = await refreshResponse.json();
    return data.success === true;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    return false;
  }
}

/**
 * Higher-order function to handle API calls with automatic session refresh
 */
export async function withSessionRefresh<T>(
  apiCall: () => Promise<Response>,
  onSessionExpired: () => Promise<void>
): Promise<T> {
  try {
    const response = await apiCall();

    if (response.status === 401) {
      // Try to refresh the token
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!refreshResponse.ok) {
        if (refreshResponse.status === 429) {
          console.warn('Rate limited on token refresh, redirecting to login');
          await onSessionExpired();
          throw new Error('Rate limited. Please try again later.');
        }
        // Session expired - call the provided callback
        await onSessionExpired();
        throw new Error('Session expired. You have been logged out.');
      }

      // Retry the original API call
      const retryResponse = await apiCall();
      
      if (!retryResponse.ok) {
        throw new Error(`API call failed after token refresh: ${retryResponse.status} ${retryResponse.statusText}`);
      }

      return await retryResponse.json();
    }

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('Session expired')) {
      throw error;
    }
    throw new Error(`API call failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Check if user is authenticated as admin
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success === true && data.isAdmin === true;
  } catch (error) {
    console.error('Failed to check admin auth:', error);
    return false;
  }
}

/**
 * Logout admin user
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Failed to logout:', error);
  }
} 