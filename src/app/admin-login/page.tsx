"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin
        const isAdmin = await checkAdminStatus(user.uid);
        if (isAdmin) {
          router.push('/admin-dashboard');
          return;
        }
      }
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [router]);
  
  const checkAdminStatus = async (uid: string): Promise<boolean> => {
    try {
      console.log('[AdminLogin] 🔍 Checking admin status for UID:', uid);
      console.log('[AdminLogin] 🔍 UID type:', typeof uid);
      console.log('[AdminLogin] 🔍 UID length:', uid?.length);

      const db = getFirestoreDb();
      if (!db) {
        console.error('[AdminLogin] ❌ Firestore not initialized');
        return false;
      }
      console.log('[AdminLogin] ✅ Firestore initialized successfully');

      console.log('[AdminLogin] 🔍 Looking for admin document at path: admins/' + uid);
      const adminDocRef = doc(db, 'admins', uid);
      console.log('[AdminLogin] 🔍 Admin document reference created');

      const adminDocSnap = await getDoc(adminDocRef);
      console.log('[AdminLogin] 🔍 Admin document snapshot received');
      console.log('[AdminLogin] 🔍 Document exists:', adminDocSnap.exists());
      console.log('[AdminLogin] 🔍 Document data:', adminDocSnap.data());

      if (adminDocSnap.exists()) {
        console.log('[AdminLogin] ✅ Admin document found - user is admin');
        return true;
      } else {
        console.log('[AdminLogin] ❌ Admin document not found - user is not admin');

        // Let's also check what documents exist in the admins collection
        console.log('[AdminLogin] 🔍 Checking all documents in admins collection...');
        try {
          const adminsCollection = collection(db, 'admins');
          const adminsSnapshot = await getDocs(adminsCollection);
          console.log('[AdminLogin] 🔍 Total documents in admins collection:', adminsSnapshot.size);

          if (adminsSnapshot.size > 0) {
            console.log('[AdminLogin] 🔍 Existing admin UIDs:');
            adminsSnapshot.forEach((doc) => {
              console.log('  - UID:', doc.id, 'Data:', doc.data());
            });
          } else {
            console.log('[AdminLogin] ❌ No documents found in admins collection');
          }
        } catch (collectionError) {
          console.error('[AdminLogin] ❌ Error listing admins collection:', collectionError);
        }

        return false;
      }
    } catch (error) {
      console.error('[AdminLogin] ❌ Error checking admin status:', error);
      console.error('[AdminLogin] ❌ Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AdminLogin] Form submitted with email:', email);
    setIsLoading(true);
    setError('');

    try {
      console.log('[AdminLogin] Attempting Firebase Auth sign-in...');

      // Sign in with Firebase Auth
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('[AdminLogin] ✅ Firebase Auth successful');
      console.log('[AdminLogin] 🔍 User UID from Firebase:', user.uid);
      console.log('[AdminLogin] 🔍 User email from Firebase:', user.email);
      console.log('[AdminLogin] 🔍 User display name:', user.displayName);

      // Check if user is admin in Firestore
      const isAdmin = await checkAdminStatus(user.uid);

      if (isAdmin) {
        console.log('[AdminLogin] Admin verification successful, redirecting to dashboard...');
        router.push('/admin-dashboard');
      } else {
        console.log('[AdminLogin] User is not an admin, signing out...');
        await auth.signOut();
        setError('Access denied. Admin privileges not found.');
      }
    } catch (error) {
      console.error('[AdminLogin] Login error:', error);
      if (error instanceof Error) {
        if (error.message.includes('auth/wrong-password') || error.message.includes('auth/user-not-found')) {
          setError('Invalid email or password');
        } else if (error.message.includes('auth/too-many-requests')) {
          setError('Too many failed attempts. Please try again later.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18384D] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative h-16 w-16 overflow-hidden">
              <Image
                src="/1. USIC Full Logo.svg"
                alt="USIC Logo"
                width={64}
                height={64}
                className="w-full h-full"
                style={{ filter: 'invert(1)' }}
              />
            </div>
          </div>
          <div className="font-bold text-3xl text-white mb-2">USIC Admin</div>
          <p className="text-gray-300 text-sm">Restricted access for administrators only</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-white text-lg font-medium mb-2">Sign in to Admin Dashboard</h2>
            <p className="text-gray-300 text-sm">Enter your admin credentials to access the admin panel</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !isInitialized}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : !isInitialized ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-300">
          <p>If you need access, please contact the system administrator</p>
        </div>
      </div>
    </div>
  );
} 