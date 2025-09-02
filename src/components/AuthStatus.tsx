"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UserCircle, LogIn, ChevronDown, LogOut, User } from "lucide-react";
import { signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export default function AuthStatus() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {/* Desktop: My Profile text with dropdown */}
        <div className="hidden md:block relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 text-white hover:text-blue-200 transition-colors duration-200"
          >
            <span className="text-sm font-medium">My Profile</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-white/10">
                  <p className="font-medium">Join USIC Forum</p>
                  <p className="text-xs text-gray-400">Sign in to participate</p>
                </div>
                
                <div className="py-2">
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Simple text links without icons */}
        <div className="md:hidden space-y-2">
          <button 
            onClick={() => window.location.href = '/login'}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#234b64] hover:text-white transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Desktop: Welcome message */}
      <span className="text-gray-300 text-sm hidden sm:block">
        Welcome, {user.displayName || user.email || 'User'}!
      </span>
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200"
        >
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
            <UserCircle className="w-10 h-10" />
          )}
          {/* Hidden fallback icon for when image fails to load */}
          <UserCircle className="w-10 h-10 hidden" />
          
          {/* Mobile: User name to the right of profile picture */}
          <span className="text-gray-300 text-sm sm:hidden">
            {user.displayName || user.email || 'User'}
          </span>
          
          <ChevronDown className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-50">
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-300 border-b border-white/10">
                <p className="font-medium">{user.displayName || user.email}</p>
                <p className="text-xs text-gray-400">Signed in</p>
              </div>
              
              <div className="py-2">
                <button 
                  onClick={() => window.location.href = '/my-profile'}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 