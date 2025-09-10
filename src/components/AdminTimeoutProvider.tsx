"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminTimeout } from '@/hooks/useAdminTimeout';
import AdminTimeoutModal from './AdminTimeoutModal';

interface AdminTimeoutContextType {
  resetTimer: () => void;
  logout: () => Promise<void>;
  isActive: boolean;
  timeRemaining: number;
}

const AdminTimeoutContext = createContext<AdminTimeoutContextType | undefined>(undefined);

export function useAdminTimeoutContext() {
  const context = useContext(AdminTimeoutContext);
  if (context === undefined) {
    throw new Error('useAdminTimeoutContext must be used within an AdminTimeoutProvider');
  }
  return context;
}

interface AdminTimeoutProviderProps {
  children: ReactNode;
}

export default function AdminTimeoutProvider({ children }: AdminTimeoutProviderProps) {
  const {
    isActive,
    timeRemaining,
    resetTimer,
    logout,
    showWarning,
    remainingSeconds
  } = useAdminTimeout({
    timeoutMinutes: 15,
    warningMinutes: 2,
    onBeforeLogout: () => {
      console.log('[AdminTimeout] Admin session expired due to inactivity');
    },
    onTimeoutWarning: (remaining) => {
      console.log(`[AdminTimeout] Warning: ${remaining} seconds until logout`);
    }
  });

  const contextValue: AdminTimeoutContextType = {
    resetTimer,
    logout,
    isActive,
    timeRemaining
  };

  return (
    <AdminTimeoutContext.Provider value={contextValue}>
      {children}

      <AdminTimeoutModal
        isOpen={showWarning}
        remainingSeconds={remainingSeconds}
        onStayLoggedIn={resetTimer}
        onLogout={logout}
      />
    </AdminTimeoutContext.Provider>
  );
}
