// src/hooks/usePermissionDenied.ts
import { useState } from 'react';

interface PermissionDeniedState {
  isOpen: boolean;
  message: string;
}

export function usePermissionDenied() {
  const [state, setState] = useState<PermissionDeniedState>({
    isOpen: false,
    message: 'No tienes permisos para realizar esta acción'
  });

  const showPermissionDenied = (message?: string) => {
    setState({
      isOpen: true,
      message: message || 'No tienes permisos para realizar esta acción'
    });
  };

  const hidePermissionDenied = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    ...state,
    showPermissionDenied,
    hidePermissionDenied
  };
}
