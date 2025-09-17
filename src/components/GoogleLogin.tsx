"use client";

import React, { useState } from 'react';

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

interface GoogleLoginProps {
  onSuccess?: (user: unknown) => void;
  onError?: (error: unknown) => void;
  className?: string;
}

export default function GoogleLogin({ onSuccess, onError, className = "" }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get Firebase auth instance
      const auth = getFirebaseAuth();
      if (!auth) {
        console.error('[DEBUG] ❌ Firebase auth not initialized');
        throw new Error('Firebase auth not initialized');
      }

      // Create Google provider
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      // Check if popup will be blocked
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      if (!testPopup || testPopup.closed) {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      } else {
        testPopup.close();
      }

      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the ID token
      const idToken = await user.getIdToken();

      // Send ID token to our backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }


      // Call success callback
      if (onSuccess) {
        onSuccess(data.user);
      }

      // Don't redirect here - let the parent component handle it

    } catch (error: unknown) {
      console.error('[DEBUG] ❌ Login error occurred:', error);
      console.error('[DEBUG] 🔍 Error type:', typeof error);
      console.error('[DEBUG] 🔍 Error constructor:', error?.constructor?.name);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error('[DEBUG] 🔍 Error message:', error.message);
        console.error('[DEBUG] 🔍 Error stack:', error.stack);
        console.error('[DEBUG] 🔍 Error name:', error.name);
      }
      
      // Check for Cross-Origin-Opener-Policy specific errors
      if (error instanceof Error && error.message.includes('Cross-Origin-Opener-Policy')) {
        console.error('[DEBUG] ❌ COOP Policy Error detected!');
      }
      
      // Handle specific Firebase errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('popup-closed-by-user')) {
          errorMessage = 'Login was cancelled.';
        } else if (error.message.includes('popup-blocked')) {
          errorMessage = 'Popup was blocked. Please allow popups for this site.';
        } else if (error.message.includes('unauthorized-domain')) {
          errorMessage = 'This domain is not authorized for Google login.';
        } else if (error.message.includes('Cross-Origin-Opener-Policy')) {
          errorMessage = 'Authentication popup blocked by security policy. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);

      // Call error callback
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
