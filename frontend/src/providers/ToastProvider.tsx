'use client';

import { ReactNode } from 'react';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/ui/Toast';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts } = useToast();

  return (
    <>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </>
  );
}