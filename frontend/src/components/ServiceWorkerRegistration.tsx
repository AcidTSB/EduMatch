'use client';

import { useEffect } from 'react';

/**
 * Component để đăng ký Service Worker cho Firebase Cloud Messaging
 * Chạy một lần khi app khởi động
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('[ServiceWorker] ✅ Registered successfully:', registration.scope);
          
          // Kiểm tra update
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[ServiceWorker] 📦 New service worker available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[ServiceWorker] ❌ Registration failed:', error);
        });
    } else {
      console.warn('[ServiceWorker] ⚠️ Service workers are not supported');
    }
  }, []);

  return null; // Component không render gì
}

