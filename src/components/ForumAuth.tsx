"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { UserCircle, LogOut } from "lucide-react";

export default function ForumAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-white">Join the Discussion</h3>
          <p className="text-gray-300 text-sm">
            Sign in to create posts and participate in the community
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt="Profile" 
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  // Fallback to UserCircle icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <UserCircle className="w-10 h-10 text-white" />
            )}
            {/* Hidden fallback icon for when image fails to load */}
            <UserCircle className="w-10 h-10 text-white hidden" />
          </div>
          <div>
            <p className="text-white font-medium">
              Welcome, {user.displayName || user.email || 'User'}!
            </p>
            <p className="text-gray-300 text-sm">
              You can now create posts and comment
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
} 