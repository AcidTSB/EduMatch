import React from 'react';
import { ToastProps } from '@/types';

export function Toast({ id, title, message, type, duration = 5000 }: ToastProps) {
  return (
    <div className={`toast toast-${type}`}>
      {title && <div className="toast-title">{title}</div>}
      <div className="toast-message">{message}</div>
    </div>
  );
}