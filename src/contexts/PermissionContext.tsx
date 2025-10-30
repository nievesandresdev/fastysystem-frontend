// src/contexts/PermissionContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { usePermissionDenied } from '@/hooks/usePermissionDenied';
import { PermissionDeniedModal } from '@/components/General';

interface PermissionContextType {
  showPermissionDenied: (message?: string) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { isOpen, message, showPermissionDenied, hidePermissionDenied } = usePermissionDenied();

  return (
    <PermissionContext.Provider value={{ showPermissionDenied }}>
      {children}
      <PermissionDeniedModal
        isOpen={isOpen}
        onClose={hidePermissionDenied}
        message={message}
      />
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
}
