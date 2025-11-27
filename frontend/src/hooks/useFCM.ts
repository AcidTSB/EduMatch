import { useEffect, useRef } from 'react';
import { getFCMToken } from '@/lib/firebase';
import { registerFcm } from '@/services/chat.service';
import { useAuth } from '@/lib/auth';

/**
 * Hook để đăng ký FCM token khi user đăng nhập
 * Tự động gọi registerFcm để lưu token vào backend
 */
export function useFCM() {
  const { isAuthenticated, user } = useAuth();
  const hasRegisteredRef = useRef(false);

  useEffect(() => {
    // Chỉ đăng ký khi user đã đăng nhập và chưa đăng ký token
    if (!isAuthenticated || !user || hasRegisteredRef.current) return;

    const initializeFCM = async () => {
      try {
        console.log('[useFCM] 🚀 Initializing FCM for user:', user.id);
        
        // Đợi một chút để đảm bảo auth state đã được set đầy đủ
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Kiểm tra permission
        if (Notification.permission === 'denied') {
          console.warn('[useFCM] ⚠️ Notification permission denied');
          return;
        }

        // Request permission nếu chưa có
        if (Notification.permission === 'default') {
          console.log('[useFCM] 📱 Requesting notification permission...');
          const permission = await Notification.requestPermission();
          
          if (permission !== 'granted') {
            console.warn('[useFCM] ⚠️ Notification permission not granted:', permission);
            return;
          }
          console.log('[useFCM] ✅ Notification permission granted');
        }

        // Đăng ký service worker nếu chưa có
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
              console.log('[useFCM] 📝 Registering service worker...');
              await navigator.serviceWorker.register('/firebase-messaging-sw.js');
              console.log('[useFCM] ✅ Service worker registered');
              
              // Đợi service worker sẵn sàng
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (swError) {
            console.error('[useFCM] ❌ Service worker registration error:', swError);
            // Vẫn tiếp tục thử lấy token vì có thể service worker đã được đăng ký ở nơi khác
          }
        }

        // Get FCM token
        console.log('[useFCM] 🔑 Getting FCM token...');
        const token = await getFCMToken();
        
        if (token) {
          // Register token with backend
          try {
            console.log('[useFCM] 📤 Registering FCM token with backend...');
            await registerFcm(token);
            console.log('[useFCM] ✅ FCM token registered successfully with backend');
            hasRegisteredRef.current = true;
          } catch (error: any) {
            console.error('[useFCM] ❌ Error registering FCM token with backend:', error);
            // Không đánh dấu đã đăng ký để có thể thử lại
          }
        } else {
          console.warn('[useFCM] ⚠️ No FCM token obtained');
        }
      } catch (error) {
        console.error('[useFCM] ❌ Error initializing FCM:', error);
      }
    };

    // Chạy async function
    initializeFCM();
  }, [isAuthenticated, user?.id]);

  // Reset khi user đăng xuất
  useEffect(() => {
    if (!isAuthenticated) {
      hasRegisteredRef.current = false;
    }
  }, [isAuthenticated]);
}

