"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useGroupchatModal } from '@/hooks/useGroupchatModal';
import GroupchatModal from './GroupchatModal';

interface GroupchatModalContextType {
  isModalOpen: boolean;
  closeModal: () => void;
  hasBeenShown: boolean;
}

const GroupchatModalContext = createContext<GroupchatModalContextType | undefined>(undefined);

export function useGroupchatModalContext() {
  const context = useContext(GroupchatModalContext);
  if (context === undefined) {
    throw new Error('useGroupchatModalContext must be used within a GroupchatModalProvider');
  }
  return context;
}

interface GroupchatModalProviderProps {
  children: ReactNode;
}

export default function GroupchatModalProvider({ children }: GroupchatModalProviderProps) {
  const { isModalOpen, closeModal, hasBeenShown } = useGroupchatModal();

  const contextValue: GroupchatModalContextType = {
    isModalOpen,
    closeModal,
    hasBeenShown
  };

  return (
    <GroupchatModalContext.Provider value={contextValue}>
      {children}
      <GroupchatModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </GroupchatModalContext.Provider>
  );
}
