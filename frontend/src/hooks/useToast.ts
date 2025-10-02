import { useState, useCallback } from 'react';
import { ToastProps } from '@/types';

interface ToastState {
  toasts: ToastProps[];
}

interface UseToastReturn {
  toasts: ToastProps[];
  toast: (toast: Omit<ToastProps, 'id'>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// Global toast state (in a real app, you might use Context or Zustand)
let toastCount = 0;
let toastListeners: ((toasts: ToastProps[]) => void)[] = [];
let toasts: ToastProps[] = [];

const addToast = (toast: Omit<ToastProps, 'id'>) => {
  const id = (++toastCount).toString();
  const newToast: ToastProps = {
    id,
    duration: 5000,
    ...toast,
  };
  
  toasts = [...toasts, newToast];
  toastListeners.forEach(listener => listener(toasts));
  
  // Auto-dismiss toast after duration
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, newToast.duration);
  }
};

const dismissToast = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id);
  toastListeners.forEach(listener => listener(toasts));
};

const dismissAllToasts = () => {
  toasts = [];
  toastListeners.forEach(listener => listener(toasts));
};

export const useToast = (): UseToastReturn => {
  const [toastState, setToastState] = useState<ToastProps[]>(toasts);
  
  useState(() => {
    const listener = (newToasts: ToastProps[]) => {
      setToastState(newToasts);
    };
    
    toastListeners.push(listener);
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  });
  
  const toast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    addToast(toast);
  }, []);
  
  const dismiss = useCallback((id: string) => {
    dismissToast(id);
  }, []);
  
  const dismissAll = useCallback(() => {
    dismissAllToasts();
  }, []);
  
  return {
    toasts: toastState,
    toast,
    dismiss,
    dismissAll,
  };
};