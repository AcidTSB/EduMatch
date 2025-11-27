import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, Messaging, onMessage, MessagePayload } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAOJWrWL0UeUS2dEbWpflDH6VltNyu79hc",
  authDomain: "edumatch-82c53.firebaseapp.com",
  projectId: "edumatch-82c53",
  storageBucket: "edumatch-82c53.firebasestorage.app",
  messagingSenderId: "858205430303",
  appId: "1:858205430303:web:835f55c38d9f779557ab2a",
  measurementId: "G-SNF5HFKK1J"
};

// Initialize Firebase
let app: FirebaseApp | undefined;
if (typeof window !== 'undefined') {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
}

// Get messaging instance
let messaging: Messaging | null = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && app) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Firebase messaging initialization error:', error);
  }
}

// VAPID key - Lấy từ Firebase Console:
// Project Settings > Cloud Messaging > Web Push certificates
// Ưu tiên sử dụng environment variable (NEXT_PUBLIC_FIREBASE_VAPID_KEY) trong .env.local
// Hoặc hardcode trực tiếp ở đây (không khuyến nghị cho production)
const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BPHqm-WarLNLSBK7PwkqDp1gs6k-r1oKJWjBMbqfNq5ugST5CC60RAZnypSr1gWta0lXn31Q2kCVPGfBNA9JrxA";

/**
 * Lấy FCM token và đăng ký với backend
 */
export async function getFCMToken(): Promise<string | null> {
  if (!messaging) {
    console.warn('[Firebase] Messaging is not available');
    return null;
  }

  try {
    // Kiểm tra permission
    if (Notification.permission === 'denied') {
      console.warn('[Firebase] Notification permission denied');
      return null;
    }

    // Request permission nếu chưa có
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[Firebase] Notification permission not granted');
        return null;
      }
    }

    // Lấy token
    if (!vapidKey || vapidKey.trim().length === 0) {
      console.error('[Firebase] ❌ VAPID key is not configured. Please set NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env.local');
      console.error('[Firebase] 💡 See FCM_SETUP.md for instructions');
      return null;
    }
    
    const token = await getToken(messaging, { vapidKey });
    
    if (token) {
      console.log('[Firebase] ✅ FCM Token obtained:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('[Firebase] No FCM token available. Make sure VAPID key is correct.');
      return null;
    }
  } catch (error) {
    console.error('[Firebase] Error getting FCM token:', error);
    return null;
  }
}

/**
 * Lắng nghe foreground messages
 */
export function onMessageListener(): Promise<MessagePayload> {
  return new Promise((resolve, reject) => {
    if (!messaging) {
      reject(new Error('Messaging is not available'));
      return;
    }
    
    onMessage(messaging, (payload) => {
      console.log('[Firebase] Message received in foreground:', payload);
      resolve(payload);
    });
  });
}

export { messaging, app };

