"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import ForumAuth from "./ForumAuth";

interface ForumSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onShowNewPostForm?: () => void;
}

export default function ForumSidebar({
  selectedCategory,
  onCategorySelect,
}: ForumSidebarProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

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

  const categories = [
    { id: "ALL", name: "All Posts" },
    { id: "GENERAL", name: "General" },
    { id: "FAITH", name: "Faith & Spirituality" },
    { id: "ACADEMIC", name: "Academic" },
    { id: "SOCIAL", name: "Social" },
    { id: "EVENTS", name: "Events" },
    { id: "ANNOUNCEMENTS", name: "Announcements" },
    { id: "QUESTIONS", name: "Questions" },
    { id: "DISCUSSION", name: "Discussion" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Authentication Section */}
      {!user && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <ForumAuth />
        </div>
      )}

      {/* Rules Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Forum Rules</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p>• Be respectful and kind to others</p>
          <p>• Keep discussions relevant to USIC</p>
          <p>• No spam or inappropriate content</p>
          <p>• Follow Islamic values and principles</p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <button
          onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
          className="w-full flex items-center justify-between text-lg font-bold text-white mb-4 lg:mb-4 lg:cursor-default hover:bg-white/5 rounded-md p-2 -m-2 transition-colors duration-200"
        >
          <span>Categories</span>
          <span className={`lg:hidden transition-transform duration-300 ease-in-out ${
            isCategoriesExpanded ? 'rotate-180' : 'rotate-0'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out lg:block ${
          isCategoriesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-96 lg:opacity-100'
        }`}>
          <div className="space-y-1 pt-2">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id === "ALL" ? null : category.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 transform ${
                  selectedCategory === category.id || 
                  (category.id === "ALL" && selectedCategory === null)
                    ? "bg-blue-600 text-white shadow-lg scale-[1.02]"
                    : "text-gray-300 hover:bg-white/10 hover:scale-[1.01]"
                } ${isCategoriesExpanded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 lg:translate-y-0 lg:opacity-100'}`}
                style={{
                  transitionDelay: isCategoriesExpanded ? `${index * 50}ms` : '0ms'
                }}
              >
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 