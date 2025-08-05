"use client";

import { createContext, useContext, ReactNode } from 'react';
import { db, auth, analytics } from '@/lib/firebase';

interface FirebaseContextType {
  db: typeof db;
  auth: typeof auth;
  analytics: typeof analytics;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const value = {
    db,
    auth,
    analytics,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
} 