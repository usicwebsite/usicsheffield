"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import GoogleLogin from '@/components/GoogleLogin';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        // User is already signed in, redirect to home page
        router.push('/');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLoginSuccess = () => {
    console.log('[LoginPage] Login successful, redirecting...');
    router.push('/');
  };

  const handleLoginError = (error: unknown) => {
    console.error('[LoginPage] Login error:', error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/1. USIC Full Logo.svg"
              alt="USIC Logo"
              width={120}
              height={120}
              className="w-auto h-20"
              style={{ filter: 'invert(1)' }}
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to USIC</h1>
          <p className="text-blue-200">Sign in to access the forum and community features</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 shadow-xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
              <p className="text-gray-300 text-sm">
                Join the USIC community to participate in discussions and access exclusive content
              </p>
            </div>

            {/* Google Login */}
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              className="w-full"
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">or</span>
              </div>
            </div>

            {/* Guest Access */}
            <div className="text-center">
                          <p className="text-gray-300 text-sm mb-4">
              Don&apos;t want to sign in? You can still browse our content
            </p>
              <button
                onClick={() => router.push('/')}
                className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-blue-300 hover:text-blue-200">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-300 hover:text-blue-200">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
